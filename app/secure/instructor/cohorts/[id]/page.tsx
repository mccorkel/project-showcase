'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for cohort detail
const mockData = {
  cohort: {
    id: '1',
    name: 'Web Development - Fall 2023',
    startDate: '2023-09-01',
    endDate: '2023-12-15',
    instructors: ['Jane Smith', 'John Doe'],
    studentCount: 24,
    progress: '75%',
    currentWeek: 9,
    totalWeeks: 12
  },
  students: [
    {
      id: '101',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      submissionsCompleted: 8,
      submissionsPending: 1,
      passingRate: '87%',
      lastActive: '2023-10-15T10:30:00Z'
    },
    {
      id: '102',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      submissionsCompleted: 9,
      submissionsPending: 0,
      passingRate: '100%',
      lastActive: '2023-10-16T14:20:00Z'
    },
    {
      id: '103',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      submissionsCompleted: 7,
      submissionsPending: 2,
      passingRate: '85%',
      lastActive: '2023-10-14T09:15:00Z'
    },
    {
      id: '104',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      submissionsCompleted: 9,
      submissionsPending: 0,
      passingRate: '95%',
      lastActive: '2023-10-16T11:45:00Z'
    }
  ],
  weeklySubmissions: [
    { week: 1, completed: 24, passing: 24, rate: '100%' },
    { week: 2, completed: 24, passing: 22, rate: '92%' },
    { week: 3, completed: 24, passing: 21, rate: '88%' },
    { week: 4, completed: 24, passing: 20, rate: '83%' },
    { week: 5, completed: 24, passing: 22, rate: '92%' },
    { week: 6, completed: 24, passing: 23, rate: '96%' },
    { week: 7, completed: 24, passing: 21, rate: '88%' },
    { week: 8, completed: 24, passing: 20, rate: '83%' },
    { week: 9, completed: 20, passing: 18, rate: '90%' }
  ]
};

export default function CohortDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('students');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format datetime for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return (
    <ProtectedRoute requiredRoles={['instructor']}>
      <main className="cohort-detail-page">
        <div className="page-header">
          <div>
            <Link href="/secure/instructor/cohorts" className="back-link">
              ← Back to Cohorts
            </Link>
            <h1>{mockData.cohort.name}</h1>
            <div className="cohort-meta">
              <p>
                <span className="label">Duration:</span> 
                {formatDate(mockData.cohort.startDate)} - {formatDate(mockData.cohort.endDate)}
              </p>
              <p>
                <span className="label">Progress:</span> 
                Week {mockData.cohort.currentWeek} of {mockData.cohort.totalWeeks} ({mockData.cohort.progress})
              </p>
              <p>
                <span className="label">Students:</span> 
                {mockData.cohort.studentCount}
              </p>
              <p>
                <span className="label">Instructors:</span> 
                {mockData.cohort.instructors.join(', ')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
          <button 
            className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'students' && (
            <div className="students-tab">
              <div className="actions-bar">
                <input type="text" placeholder="Search students..." className="search-input" />
                <div className="filter-options">
                  <select className="filter-select">
                    <option value="all">All Students</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select className="sort-select">
                    <option value="name">Sort by Name</option>
                    <option value="submissions">Sort by Submissions</option>
                    <option value="passing">Sort by Passing Rate</option>
                    <option value="activity">Sort by Last Activity</option>
                  </select>
                </div>
              </div>
              
              <div className="students-list">
                <div className="list-header">
                  <div className="col-name">Name</div>
                  <div className="col-email">Email</div>
                  <div className="col-submissions">Submissions</div>
                  <div className="col-passing">Passing Rate</div>
                  <div className="col-activity">Last Active</div>
                  <div className="col-actions">Actions</div>
                </div>
                
                {mockData.students.map(student => (
                  <div key={student.id} className="student-row">
                    <div className="col-name">{student.name}</div>
                    <div className="col-email">{student.email}</div>
                    <div className="col-submissions">
                      {student.submissionsCompleted} completed
                      {student.submissionsPending > 0 && (
                        <span className="pending-badge">
                          {student.submissionsPending} pending
                        </span>
                      )}
                    </div>
                    <div className="col-passing">{student.passingRate}</div>
                    <div className="col-activity">{formatDateTime(student.lastActive)}</div>
                    <div className="col-actions">
                      <Link href={`/secure/instructor/students/${student.id}`}>
                        <button className="view-button">View</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'progress' && (
            <div className="progress-tab">
              <h2>Weekly Progress</h2>
              <div className="progress-chart">
                <div className="chart-header">
                  <div className="col-week">Week</div>
                  <div className="col-completed">Completed</div>
                  <div className="col-passing">Passing</div>
                  <div className="col-rate">Pass Rate</div>
                </div>
                
                {mockData.weeklySubmissions.map(week => (
                  <div key={week.week} className="progress-row">
                    <div className="col-week">Week {week.week}</div>
                    <div className="col-completed">{week.completed}/{mockData.cohort.studentCount}</div>
                    <div className="col-passing">{week.passing}</div>
                    <div className="col-rate">{week.rate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'submissions' && (
            <div className="submissions-tab">
              <h2>Recent Submissions</h2>
              <p className="placeholder-message">
                This is a placeholder for the submissions tab. In the full implementation, this would display a list of recent submissions for this cohort.
              </p>
              <div className="cta-button-container">
                <Link href="/secure/instructor/submissions">
                  <button className="cta-button">View All Submissions</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
} 