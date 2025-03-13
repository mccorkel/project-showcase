'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '@/contexts/AuthContext';
import { getInstructorProfile } from '@/graphql/operations/instructorProfile';
import { getCohortsByInstructor, getCohort } from '@/graphql/operations/cohorts';
import { getSubmissionsByCohort, getAllSubmissions } from '@/graphql/operations/submissions';
import { getStudentProfilesByCohort } from '@/graphql/operations/userProfile';
import { Loader } from '@aws-amplify/ui-react';

const client = generateClient();

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [instructorProfile, setInstructorProfile] = useState<any>(null);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [cohortStats, setCohortStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch instructor profile and cohorts when the component mounts
  useEffect(() => {
    if (user?.id) {
      fetchInstructorData();
    }
  }, [user]);
  
  // Fetch submissions when cohorts are loaded or selected cohort changes
  useEffect(() => {
    if (cohorts.length > 0) {
      fetchSubmissionsData();
    }
  }, [cohorts, selectedCohort]);
  
  // Fetch instructor profile and assigned cohorts
  const fetchInstructorData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch instructor profile
      const profileResult = await client.graphql({
        query: getInstructorProfile,
        variables: {
          userId: user?.id
        }
      });
      
      if ('data' in profileResult && profileResult.data.getInstructorProfile) {
        setInstructorProfile(profileResult.data.getInstructorProfile);
        
        // Fetch cohorts assigned to this instructor
        const cohortsResult = await client.graphql({
          query: getCohortsByInstructor,
          variables: {
            instructorId: user?.id,
            limit: 100
          }
        });
        
        if ('data' in cohortsResult && cohortsResult.data.listCohorts) {
          setCohorts(cohortsResult.data.listCohorts.items);
        }
      }
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch submissions and student data
  const fetchSubmissionsData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch pending submissions
      let submissionsResult;
      
      if (selectedCohort === 'all') {
        // Fetch all submissions with status "submitted"
        const allPendingSubmissions = [];
        let nextToken = null;
        
        do {
          const result = await client.graphql({
            query: getAllSubmissions,
            variables: {
              limit: 100,
              nextToken
            }
          });
          
          if ('data' in result && result.data.listSubmissions) {
            // Filter for submitted status
            const pendingItems = result.data.listSubmissions.items.filter(
              (item: any) => item.status?.toLowerCase() === 'submitted'
            );
            
            allPendingSubmissions.push(...pendingItems);
            nextToken = result.data.listSubmissions.nextToken;
          } else {
            nextToken = null;
          }
        } while (nextToken);
        
        submissionsResult = { items: allPendingSubmissions };
      } else {
        // Fetch submissions for the selected cohort with status "submitted"
        const result = await client.graphql({
          query: getSubmissionsByCohort,
          variables: {
            cohortId: selectedCohort,
            status: 'submitted',
            limit: 100
          }
        });
        
        if ('data' in result && result.data.listSubmissions) {
          submissionsResult = result.data.listSubmissions;
        }
      }
      
      // Process submissions and fetch student names
      if (submissionsResult && submissionsResult.items) {
        // Create a map of student profile IDs to fetch student names
        const studentProfileIds = new Set<string>();
        
        // Ensure we only add string IDs to the set
        submissionsResult.items.forEach((submission: any) => {
          if (typeof submission.studentProfileId === 'string') {
            studentProfileIds.add(submission.studentProfileId);
          }
        });
        
        // Fetch student profiles for these IDs
        const studentProfiles: Record<string, any> = {};
        
        for (const profileId of studentProfileIds) {
          try {
            const profileResult = await client.graphql({
              query: `
                query GetStudentProfile($id: ID!) {
                  getStudentProfile(id: $id) {
                    id
                    firstName
                    lastName
                  }
                }
              `,
              variables: {
                id: profileId
              }
            });
            
            if ('data' in profileResult && 
                profileResult.data && 
                typeof profileResult.data === 'object' && 
                profileResult.data !== null && 
                'getStudentProfile' in profileResult.data) {
              const typedData = profileResult.data as { getStudentProfile: any };
              studentProfiles[profileId] = typedData.getStudentProfile;
            }
          } catch (error) {
            console.error(`Error fetching student profile ${profileId}:`, error);
          }
        }
        
        // Map submissions with student names
        const processedSubmissions = submissionsResult.items.map((submission: any) => {
          const studentProfileId = submission.studentProfileId;
          const studentProfile = typeof studentProfileId === 'string' ? studentProfiles[studentProfileId] : undefined;
          const studentName = studentProfile 
            ? `${studentProfile.firstName} ${studentProfile.lastName}`
            : 'Unknown Student';
          
          return {
            ...submission,
            studentName
          };
        });
        
        // Sort by submission date (newest first)
        processedSubmissions.sort((a: any, b: any) => {
          return new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
        });
        
        // Take only the first 4 for the dashboard
        setPendingSubmissions(processedSubmissions.slice(0, 4));
        
        // Generate cohort statistics
        generateCohortStats();
      }
    } catch (error) {
      console.error('Error fetching submissions data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate cohort statistics
  const generateCohortStats = async () => {
    try {
      const stats = [];
      
      for (const cohort of cohorts) {
        // Fetch all submissions for this cohort
        const submissionsResult = await client.graphql({
          query: getSubmissionsByCohort,
          variables: {
            cohortId: cohort.id,
            limit: 1000
          }
        });
        
        // Fetch all students in this cohort
        const studentsResult = await client.graphql({
          query: getStudentProfilesByCohort,
          variables: {
            cohortId: cohort.id,
            limit: 1000
          }
        });
        
        if ('data' in submissionsResult && 
            submissionsResult.data.listSubmissions && 
            'data' in studentsResult && 
            studentsResult.data.listStudentProfiles) {
          
          const submissions = submissionsResult.data.listSubmissions.items;
          const students = studentsResult.data.listStudentProfiles.items;
          
          // Calculate statistics
          const totalSubmissions = submissions.length;
          const gradedSubmissions = submissions.filter((s: any) => s.gradedAt).length;
          const pendingSubmissions = submissions.filter(
            (s: any) => s.status?.toLowerCase() === 'submitted' && !s.gradedAt
          ).length;
          
          // Calculate passing rate
          const gradedAndPassingSubmissions = submissions.filter(
            (s: any) => s.gradedAt && s.passing
          ).length;
          
          const passingRate = gradedSubmissions > 0 
            ? Math.round((gradedAndPassingSubmissions / gradedSubmissions) * 100) + '%'
            : 'N/A';
          
          stats.push({
            cohortName: cohort.name,
            cohortId: cohort.id,
            studentCount: students.length,
      submissionStats: {
              total: totalSubmissions,
              graded: gradedSubmissions,
              pending: pendingSubmissions,
              passingRate
            }
          });
        }
      }
      
      setCohortStats(stats);
      
      // Generate recent activity based on graded submissions
      generateRecentActivity();
    } catch (error) {
      console.error('Error generating cohort stats:', error);
    }
  };
  
  // Generate recent activity
  const generateRecentActivity = async () => {
    try {
      // Fetch recently graded submissions
      let submissionsResult;
      
      if (selectedCohort === 'all') {
        // Fetch all graded submissions
        const result = await client.graphql({
          query: getAllSubmissions,
          variables: {
            limit: 100
          }
        });
        
        if ('data' in result && result.data.listSubmissions) {
          submissionsResult = result.data.listSubmissions;
        }
      } else {
        // Fetch graded submissions for the selected cohort
        const result = await client.graphql({
          query: getSubmissionsByCohort,
          variables: {
            cohortId: selectedCohort,
            limit: 100
          }
        });
        
        if ('data' in result && result.data.listSubmissions) {
          submissionsResult = result.data.listSubmissions;
        }
      }
      
      if (submissionsResult && submissionsResult.items) {
        // Filter for recently graded submissions
        const gradedSubmissions = submissionsResult.items.filter(
          (s: any) => s.gradedAt
        );
        
        // Sort by graded date (newest first)
        gradedSubmissions.sort((a: any, b: any) => {
          return new Date(b.gradedAt || 0).getTime() - new Date(a.gradedAt || 0).getTime();
        });
        
        // Create a map of student profile IDs to fetch student names
        const studentProfileIds = new Set<string>();
        
        // Ensure we only add string IDs to the set
        gradedSubmissions.forEach((submission: any) => {
          if (typeof submission.studentProfileId === 'string') {
            studentProfileIds.add(submission.studentProfileId);
          }
        });
        
        // Fetch student profiles for these IDs
        const studentProfiles: Record<string, any> = {};
        
        for (const profileId of studentProfileIds) {
          try {
            const profileResult = await client.graphql({
              query: `
                query GetStudentProfile($id: ID!) {
                  getStudentProfile(id: $id) {
                    id
                    firstName
                    lastName
                    cohortId
                  }
                }
              `,
              variables: {
                id: profileId
              }
            });
            
            if ('data' in profileResult && 
                profileResult.data && 
                typeof profileResult.data === 'object' && 
                profileResult.data !== null && 
                'getStudentProfile' in profileResult.data) {
              const typedData = profileResult.data as { getStudentProfile: any };
              studentProfiles[profileId] = typedData.getStudentProfile;
            }
          } catch (error) {
            console.error(`Error fetching student profile ${profileId}:`, error);
          }
        }
        
        // Map submissions with student names and create activity items
        const activities = gradedSubmissions.slice(0, 4).map((submission: any) => {
          const studentProfileId = submission.studentProfileId;
          const studentProfile = typeof studentProfileId === 'string' ? studentProfiles[studentProfileId] : undefined;
          const studentName = studentProfile 
            ? `${studentProfile.firstName} ${studentProfile.lastName}`
            : 'Unknown Student';
          
          // Find cohort name
          const cohort = cohorts.find((c: any) => c.id === (studentProfile?.cohortId || submission.cohortId));
          
          return {
            id: submission.id,
            type: 'submission_graded',
            studentName,
            week: submission.week,
            title: submission.title,
            timestamp: submission.gradedAt,
            grade: submission.grade,
            cohort: cohort?.name || 'Unknown Cohort'
          };
        });
        
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Error generating recent activity:', error);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  if (isLoading && !instructorProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="large" />
      </div>
    );
  }
  
  return (
    <main className="instructor-dashboard-page">
      <div className="page-header">
        <div className="instructor-info">
          <h1>Instructor Dashboard</h1>
          <p className="instructor-name">
            Welcome, {instructorProfile?.firstName} {instructorProfile?.lastName}
          </p>
          <p className="instructor-title">{instructorProfile?.title}</p>
        </div>
        
        <div className="cohort-selector">
          <label htmlFor="cohort-filter">Filter by Cohort:</label>
          <select 
            id="cohort-filter" 
            value={selectedCohort} 
            onChange={(e) => setSelectedCohort(e.target.value)}
          >
            <option value="all">All Cohorts</option>
            {cohorts.map((cohort: any) => (
              <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <section className="pending-submissions-section">
          <div className="section-header">
            <h2>Pending Submissions</h2>
            <Link href="/secure/instructor/submissions">
              <button className="view-all-button">View All</button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="large" />
            </div>
          ) : pendingSubmissions.length === 0 ? (
            <div className="empty-state">
              <p>No pending submissions for the selected cohort.</p>
            </div>
          ) : (
            <div className="submissions-list">
              {pendingSubmissions.map((submission: any) => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-info">
                    <h3>{submission.title}</h3>
                    <p className="student-name">{submission.studentName}</p>
                    <p className="submission-meta">
                      Week {submission.week} • Submitted {formatDate(submission.submittedAt)}
                    </p>
                    <p className="cohort-name">
                      {cohorts.find((c: any) => c.id === submission.cohortId)?.name || 'Unknown Cohort'}
                    </p>
                  </div>
                  <div className="submission-actions">
                    <Link href={`/secure/instructor/submissions/${submission.id}/grade`}>
                      <button className="grade-button">Grade</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        <section className="cohort-stats-section">
          <h2>Cohort Statistics</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="large" />
            </div>
          ) : (
          <div className="cohort-stats-grid">
              {cohortStats
                .filter(stat => selectedCohort === 'all' || stat.cohortId === selectedCohort)
              .map((cohort, index) => (
                <div key={index} className="cohort-stat-card">
                  <h3>{cohort.cohortName}</h3>
                  <div className="stat-row">
                    <div className="stat">
                      <span className="stat-value">{cohort.studentCount}</span>
                      <span className="stat-label">Students</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{cohort.submissionStats.total}</span>
                      <span className="stat-label">Submissions</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{cohort.submissionStats.pending}</span>
                      <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{cohort.submissionStats.passingRate}</span>
                      <span className="stat-label">Passing Rate</span>
                    </div>
                  </div>
                    <Link href={`/secure/instructor/cohorts/${encodeURIComponent(cohort.cohortId)}`}>
                    <button className="view-cohort-button">View Cohort</button>
                  </Link>
                </div>
              ))}
          </div>
          )}
        </section>
        
        <section className="recent-activity-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="large" />
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="empty-state">
              <p>No recent activity for the selected cohort.</p>
            </div>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity: any) => (
                <div key={activity.id} className="activity-card">
                  <div className="activity-icon">
                    {activity.type === 'submission_graded' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {activity.type === 'feedback_provided' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    )}
                  </div>
                  <div className="activity-info">
                    <h3>
                      {activity.type === 'submission_graded' && 'Submission Graded'}
                      {activity.type === 'feedback_provided' && 'Feedback Provided'}
                    </h3>
                    <p className="activity-details">
                      <span className="student-name">{activity.studentName}</span>
                      <span className="activity-title">{activity.title}</span>
                      <span className="activity-meta">Week {activity.week}</span>
                      {activity.grade && <span className="activity-grade">Grade: {activity.grade}</span>}
                    </p>
                    <p className="activity-time">{formatDate(activity.timestamp)}</p>
                    <p className="cohort-name">{activity.cohort}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      
      <div className="dashboard-actions">
        <Link href="/secure/instructor/students">
          <button className="action-button">View All Students</button>
        </Link>
        <Link href="/secure/instructor/submissions">
          <button className="action-button">Manage Submissions</button>
        </Link>
        <Link href="/secure/instructor/analytics">
          <button className="action-button">View Analytics</button>
        </Link>
      </div>
    </main>
  );
} 