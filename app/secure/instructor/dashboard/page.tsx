'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for instructor dashboard
const mockData = {
  instructor: {
    name: 'Jane Smith',
    title: 'Senior Instructor',
    assignedCohorts: ['Web Development - Fall 2023', 'Data Science - Spring 2023']
  },
  pendingSubmissions: [
    {
      id: '101',
      studentName: 'Alex Johnson',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-14T15:30:00Z',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '102',
      studentName: 'Maria Garcia',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-14T16:45:00Z',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '103',
      studentName: 'James Wilson',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-15T09:20:00Z',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '104',
      studentName: 'Sarah Chen',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-15T11:10:00Z',
      cohort: 'Web Development - Fall 2023'
    }
  ],
  recentActivity: [
    {
      id: '201',
      type: 'submission_graded',
      studentName: 'David Kim',
      week: 2,
      title: 'JavaScript Game',
      timestamp: '2023-10-15T10:30:00Z',
      grade: 'A',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '202',
      type: 'submission_graded',
      studentName: 'Emily Brown',
      week: 2,
      title: 'JavaScript Game',
      timestamp: '2023-10-15T10:15:00Z',
      grade: 'B+',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '203',
      type: 'feedback_provided',
      studentName: 'Michael Lee',
      week: 2,
      title: 'JavaScript Game',
      timestamp: '2023-10-14T16:20:00Z',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '204',
      type: 'submission_graded',
      studentName: 'Sophia Martinez',
      week: 2,
      title: 'JavaScript Game',
      timestamp: '2023-10-14T15:45:00Z',
      grade: 'A-',
      cohort: 'Web Development - Fall 2023'
    }
  ],
  cohortStats: [
    {
      cohortName: 'Web Development - Fall 2023',
      studentCount: 24,
      submissionStats: {
        total: 72,
        graded: 48,
        pending: 24,
        passingRate: '87%'
      }
    },
    {
      cohortName: 'Data Science - Spring 2023',
      studentCount: 18,
      submissionStats: {
        total: 108,
        graded: 108,
        pending: 0,
        passingRate: '92%'
      }
    }
  ]
};

export default function InstructorDashboardPage() {
  const [selectedCohort, setSelectedCohort] = useState('all');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Filter submissions by selected cohort
  const filteredSubmissions = selectedCohort === 'all'
    ? mockData.pendingSubmissions
    : mockData.pendingSubmissions.filter(submission => submission.cohort === selectedCohort);
  
  // Filter activity by selected cohort
  const filteredActivity = selectedCohort === 'all'
    ? mockData.recentActivity
    : mockData.recentActivity.filter(activity => activity.cohort === selectedCohort);
  
  return (
    <ProtectedRoute requiredRoles={['instructor']}>
      <main className="instructor-dashboard-page">
        <div className="page-header">
          <div className="instructor-info">
            <h1>Instructor Dashboard</h1>
            <p className="instructor-name">Welcome, {mockData.instructor.name}</p>
            <p className="instructor-title">{mockData.instructor.title}</p>
          </div>
          
          <div className="cohort-selector">
            <label htmlFor="cohort-filter">Filter by Cohort:</label>
            <select 
              id="cohort-filter" 
              value={selectedCohort} 
              onChange={(e) => setSelectedCohort(e.target.value)}
            >
              <option value="all">All Cohorts</option>
              {mockData.instructor.assignedCohorts.map((cohort, index) => (
                <option key={index} value={cohort}>{cohort}</option>
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
            
            {filteredSubmissions.length === 0 ? (
              <div className="empty-state">
                <p>No pending submissions for the selected cohort.</p>
              </div>
            ) : (
              <div className="submissions-list">
                {filteredSubmissions.map(submission => (
                  <div key={submission.id} className="submission-card">
                    <div className="submission-info">
                      <h3>{submission.title}</h3>
                      <p className="student-name">{submission.studentName}</p>
                      <p className="submission-meta">
                        Week {submission.week} • Submitted {formatDate(submission.submittedAt)}
                      </p>
                      <p className="cohort-name">{submission.cohort}</p>
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
            <div className="cohort-stats-grid">
              {mockData.cohortStats
                .filter(stat => selectedCohort === 'all' || stat.cohortName === selectedCohort)
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
                    <Link href={`/secure/instructor/cohorts/${encodeURIComponent(cohort.cohortName)}`}>
                      <button className="view-cohort-button">View Cohort</button>
                    </Link>
                  </div>
                ))}
            </div>
          </section>
          
          <section className="recent-activity-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            
            {filteredActivity.length === 0 ? (
              <div className="empty-state">
                <p>No recent activity for the selected cohort.</p>
              </div>
            ) : (
              <div className="activity-list">
                {filteredActivity.map(activity => (
                  <div key={activity.id} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'submission_graded' ? '📝' : '💬'}
                    </div>
                    <div className="activity-content">
                      <h4>
                        {activity.type === 'submission_graded' 
                          ? `Graded: ${activity.studentName}'s Week ${activity.week} submission` 
                          : `Feedback: ${activity.studentName}'s Week ${activity.week} submission`}
                      </h4>
                      <p>{activity.title}</p>
                      {activity.grade && <p className="grade">Grade: {activity.grade}</p>}
                      <p className="activity-meta">
                        {formatDate(activity.timestamp)} • {activity.cohort}
                      </p>
                    </div>
                    <div className="activity-actions">
                      <Link href={`/secure/instructor/submissions/${activity.id}`}>
                        <button className="view-button">View</button>
                      </Link>
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
    </ProtectedRoute>
  );
} 