'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';
import { generateClient } from 'aws-amplify/api';
import { Loader } from '@aws-amplify/ui-react';
import { getStudentProfile } from '@/graphql/operations/userProfile';
import { getSubmissions } from '@/graphql/operations/submissions';
import { getCohort } from '@/graphql/operations/cohorts';
import { getUserProfile } from '@/graphql/operations/userProfile';

const client = generateClient();

// Define the interface for the page props
interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  // Use async/await to handle the Promise
  const [id, setId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [student, setStudent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [cohort, setCohort] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    submissionRate: '0%',
    passingRate: '0%',
    averageGrade: 'N/A',
    showcaseViews: 0,
    showcaseReferrers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Resolve the params Promise when the component mounts
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch (error) {
        console.error('Error resolving params:', error);
      }
    };
    
    resolveParams();
  }, [params]);
  
  // Fetch student data when id is resolved
  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);
  
  // Fetch student profile, user data, and submissions
  const fetchStudentData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    
    try {
      // Fetch student profile
      const profileResult = await client.graphql({
        query: getStudentProfile,
        variables: {
          userId: id
        }
      });
      
      if ('data' in profileResult && 
          profileResult.data && 
          typeof profileResult.data === 'object' && 
          profileResult.data !== null && 
          'getStudentProfile' in profileResult.data) {
        
        const studentProfile = profileResult.data.getStudentProfile;
        setStudent(studentProfile);
        
        // Fetch user data
        if (studentProfile) {
          const userResult = await client.graphql({
            query: getUserProfile,
            variables: {
              userId: studentProfile.userId
            }
          });
          
          if ('data' in userResult && 
              userResult.data && 
              typeof userResult.data === 'object' && 
              userResult.data !== null && 
              'getUser' in userResult.data) {
            setUser(userResult.data.getUser);
          }
          
          // Fetch cohort data if cohortId exists
          if (studentProfile.cohortId) {
            const cohortResult = await client.graphql({
              query: getCohort,
              variables: {
                id: studentProfile.cohortId
              }
            });
            
            if ('data' in cohortResult && 
                cohortResult.data && 
                typeof cohortResult.data === 'object' && 
                cohortResult.data !== null && 
                'getCohort' in cohortResult.data) {
              setCohort(cohortResult.data.getCohort);
            }
          }
          
          // Fetch submissions
          const submissionsResult = await client.graphql({
            query: getSubmissions,
            variables: {
              studentProfileId: studentProfile.id,
              limit: 100
            }
          });
          
          if ('data' in submissionsResult && 
              submissionsResult.data && 
              typeof submissionsResult.data === 'object' && 
              submissionsResult.data !== null && 
              'listSubmissions' in submissionsResult.data) {
            
            const submissionItems = submissionsResult.data.listSubmissions.items;
            setSubmissions(submissionItems);
            
            // Calculate analytics
            calculateAnalytics(submissionItems);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate analytics based on submissions
  const calculateAnalytics = (submissionItems: any[]) => {
    if (!submissionItems || submissionItems.length === 0) {
      return;
    }
    
    // Calculate submission rate (assuming 1 submission per week)
    const totalWeeks = Math.max(...submissionItems.map(s => s.week || 0));
    const submissionRate = totalWeeks > 0 
      ? Math.round((submissionItems.length / totalWeeks) * 100) + '%'
      : '100%';
    
    // Calculate passing rate
    const gradedSubmissions = submissionItems.filter(s => s.gradedAt);
    const passingSubmissions = gradedSubmissions.filter(s => s.passing);
    const passingRate = gradedSubmissions.length > 0 
      ? Math.round((passingSubmissions.length / gradedSubmissions.length) * 100) + '%'
      : 'N/A';
    
    // Calculate average grade
    const gradeMap: Record<string, number> = {
      'A+': 4.3, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    
    const gradesWithValues = gradedSubmissions
      .filter(s => s.grade && s.grade in gradeMap)
      .map(s => gradeMap[s.grade]);
    
    let averageGrade = 'N/A';
    
    if (gradesWithValues.length > 0) {
      const sum = gradesWithValues.reduce((acc, val) => acc + val, 0);
      const avg = sum / gradesWithValues.length;
      
      // Convert numeric average back to letter grade
      if (avg >= 4.3) averageGrade = 'A+';
      else if (avg >= 4.0) averageGrade = 'A';
      else if (avg >= 3.7) averageGrade = 'A-';
      else if (avg >= 3.3) averageGrade = 'B+';
      else if (avg >= 3.0) averageGrade = 'B';
      else if (avg >= 2.7) averageGrade = 'B-';
      else if (avg >= 2.3) averageGrade = 'C+';
      else if (avg >= 2.0) averageGrade = 'C';
      else if (avg >= 1.7) averageGrade = 'C-';
      else if (avg >= 1.3) averageGrade = 'D+';
      else if (avg >= 1.0) averageGrade = 'D';
      else if (avg >= 0.7) averageGrade = 'D-';
      else averageGrade = 'F';
    }
    
    // For showcase views and referrers, we would need to fetch analytics data
    // For now, we'll use placeholder values
    setAnalytics({
      submissionRate,
      passingRate,
      averageGrade,
      showcaseViews: 0,
      showcaseReferrers: []
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format datetime for display
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="large" />
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="error-state">
        <h1>Student Not Found</h1>
        <p>The student profile you are looking for does not exist or you do not have permission to view it.</p>
        <Link href="/secure/instructor/students" className="back-link">
          ← Back to Students
        </Link>
      </div>
    );
  }
  
  // Parse social links from JSON if available
  const socialLinks = student.socialLinks 
    ? (typeof student.socialLinks === 'string' 
        ? JSON.parse(student.socialLinks) 
        : student.socialLinks)
    : {};
  
  // Parse skills from JSON if available
  const skills = student.skills 
    ? (typeof student.skills === 'string'
        ? JSON.parse(student.skills)
        : student.skills)
    : [];
  
  return (
    <main className="student-detail-page">
      <div className="page-header">
        <Link href="/secure/instructor/students" className="back-link">
          ← Back to Students
        </Link>
        <div className="student-header">
          <div className="student-profile-image">
            <img 
              src={student.profileImageUrl || 'https://via.placeholder.com/150'} 
              alt={`${student.firstName} ${student.lastName}`} 
            />
          </div>
          <div className="student-info">
            <h1>{student.firstName} {student.lastName}</h1>
            <p className="student-email">{student.contactEmail || user?.email || 'No email available'}</p>
            <p className="student-cohort">{cohort?.name || 'No cohort assigned'}</p>
            <div className="student-meta">
              <span className="meta-item">
                <span className="label">Joined:</span> {user?.lastLogin ? formatDate(user.lastLogin) : 'N/A'}
              </span>
              <span className="meta-item">
                <span className="label">Last Active:</span> {user?.lastLogin ? formatDateTime(user.lastLogin) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          Submissions
        </button>
        <button 
          className={`tab-button ${activeTab === 'showcase' ? 'active' : ''}`}
          onClick={() => setActiveTab('showcase')}
        >
          Showcase
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <section className="bio-section">
              <h2>About</h2>
              <p>{student.bio || 'No bio available'}</p>
              <p><strong>Location:</strong> {student.location || 'Not specified'}</p>
              {student.title && <p><strong>Title:</strong> {student.title}</p>}
              {student.experienceYears && <p><strong>Experience:</strong> {student.experienceYears} years</p>}
            </section>
            
            {Object.keys(socialLinks).length > 0 && (
            <section className="social-links-section">
              <h2>Social Links</h2>
              <div className="social-links">
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="social-link">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                ))}
              </div>
            </section>
            )}
            
            {skills.length > 0 && (
            <section className="skills-section">
              <h2>Skills</h2>
              <div className="skills-categories">
                  {skills.map((category: any, index: number) => (
                  <div key={index} className="skill-category">
                    <h3>{category.category}</h3>
                    <div className="skills-list">
                        {category.skills.map((skill: string, skillIndex: number) => (
                        <span key={skillIndex} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}
          </div>
        )}
        
        {activeTab === 'submissions' && (
          <div className="submissions-tab">
            <div className="submissions-header">
              <h2>Submissions</h2>
              <div className="submissions-stats">
                <div className="stat">
                  <span className="stat-value">{submissions.length}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{analytics.submissionRate}</span>
                  <span className="stat-label">Submission Rate</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{analytics.passingRate}</span>
                  <span className="stat-label">Passing Rate</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{analytics.averageGrade}</span>
                  <span className="stat-label">Average Grade</span>
                </div>
              </div>
            </div>
            
            {submissions.length === 0 ? (
              <div className="empty-state">
                <p>No submissions found for this student.</p>
              </div>
            ) : (
            <div className="submissions-list">
                {submissions
                  .sort((a, b) => (b.week || 0) - (a.week || 0))
                  .map(submission => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                        <h3>{submission.title || `Week ${submission.week} Submission`}</h3>
                        <div className="submission-meta">
                          {submission.week && <span className="week">Week {submission.week}</span>}
                          <span className="date">Submitted: {formatDateTime(submission.submittedAt)}</span>
                          {submission.gradedAt && (
                            <span className="grade">
                              Grade: <strong>{submission.grade || 'Not graded'}</strong>
                            </span>
                          )}
                          <span className={`status ${submission.passing ? 'passing' : 'not-passing'}`}>
                            {submission.passing ? 'Passing' : 'Not Passing'}
                      </span>
                    </div>
                  </div>
                      
                      <div className="submission-content">
                        {submission.description && (
                          <div className="description">
                            <p>{submission.description}</p>
                          </div>
                        )}
                        
                        {submission.technologies && submission.technologies.length > 0 && (
                          <div className="technologies">
                            <h4>Technologies:</h4>
                            <div className="tech-tags">
                              {submission.technologies.map((tech: string, index: number) => (
                                <span key={index} className="tech-tag">{tech}</span>
                              ))}
                            </div>
                  </div>
                        )}
                        
                  <div className="submission-links">
                          {submission.demoLink && (
                            <a href={submission.demoLink} target="_blank" rel="noopener noreferrer" className="link">
                              Demo
                            </a>
                          )}
                          {submission.repoLink && (
                            <a href={submission.repoLink} target="_blank" rel="noopener noreferrer" className="link">
                              Repository
                            </a>
                          )}
                          {submission.deployedUrl && (
                            <a href={submission.deployedUrl} target="_blank" rel="noopener noreferrer" className="link">
                              Deployed Site
                            </a>
                          )}
                  </div>
                  </div>
                      
                  <div className="submission-actions">
                    <Link href={`/secure/instructor/submissions/${submission.id}/grade`}>
                          <button className="grade-button">
                            {submission.gradedAt ? 'Update Grade' : 'Grade'}
                          </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
        
        {activeTab === 'showcase' && (
          <div className="showcase-tab">
              <h2>Student Showcase</h2>
            
              <div className="showcase-status">
              <h3>Showcase Status</h3>
              <div className="status-indicator">
                <span className={`status-badge ${student.id ? 'status-active' : 'status-inactive'}`}>
                  {student.id ? 'Published' : 'Not Published'}
                </span>
              </div>
              
              {student.id ? (
                <div className="showcase-actions">
                  <Link href={`/profile/${student.id}`} target="_blank" className="primary-button">
                    View Showcase
                  </Link>
                </div>
              ) : (
                <p className="no-showcase-message">
                  This student has not published their showcase yet.
                </p>
              )}
            </div>
            
            <div className="selected-projects">
              <h3>Selected Projects</h3>
              
              {submissions.filter(s => s.showcaseIncluded).length === 0 ? (
                <p className="no-projects-message">
                  No projects have been selected for the showcase.
                </p>
              ) : (
                <div className="project-list">
                  {submissions
                    .filter(s => s.showcaseIncluded)
                    .sort((a, b) => (a.showcasePriority || 0) - (b.showcasePriority || 0))
                    .map(project => (
                      <div key={project.id} className="project-card">
                        <div className="project-image">
                          {project.featuredImageUrl ? (
                            <img src={project.featuredImageUrl} alt={project.title} />
                          ) : (
                            <div className="placeholder-image">No Image</div>
                          )}
                </div>
                        <div className="project-info">
                          <h4>{project.title}</h4>
                          <p>{project.description}</p>
                          <div className="project-meta">
                            <span className="priority">Priority: {project.showcasePriority || 'Not set'}</span>
                  </div>
                </div>
              </div>
                    ))}
              </div>
            )}
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <h2>Showcase Analytics</h2>
            
            <div className="analytics-overview">
                <div className="analytics-card">
                <h3>Views</h3>
                <div className="analytics-value">{analytics.showcaseViews}</div>
                <p className="analytics-description">Total showcase views</p>
              </div>
              
              <div className="analytics-card">
                <h3>Top Referrers</h3>
                {analytics.showcaseReferrers.length === 0 ? (
                  <p className="no-data-message">No referrer data available</p>
                ) : (
              <div className="referrers-list">
                    {analytics.showcaseReferrers.map((referrer: any, index: number) => (
                  <div key={index} className="referrer-item">
                        <span className="referrer-source">{referrer.source}</span>
                        <span className="referrer-count">{referrer.count}</span>
                        <div className="referrer-bar-container">
                          <div className="referrer-bar" style={{ width: `${(referrer.count / analytics.showcaseViews) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="analytics-message">
              <p>
                Note: Detailed analytics will be available once the student's showcase has been published and received views.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 