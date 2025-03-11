'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for admin dashboard
const mockData = {
  systemStats: {
    totalUsers: 342,
    activeUsers: 287,
    totalStudents: 312,
    totalInstructors: 18,
    totalAdmins: 12,
    totalCohorts: 14,
    activeCohorts: 8,
    totalSubmissions: 2456,
    pendingSubmissions: 87,
    totalShowcases: 198,
    publicShowcases: 156
  },
  recentActivity: [
    {
      id: '301',
      type: 'user_created',
      username: 'newstudent123',
      name: 'Robert Johnson',
      role: 'student',
      timestamp: '2023-10-15T11:30:00Z',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '302',
      type: 'user_role_changed',
      username: 'sarahteacher',
      name: 'Sarah Williams',
      role: 'instructor',
      previousRole: 'student',
      timestamp: '2023-10-15T10:45:00Z'
    },
    {
      id: '303',
      type: 'cohort_created',
      cohortName: 'Data Science - Winter 2024',
      createdBy: 'admin',
      timestamp: '2023-10-14T16:20:00Z'
    },
    {
      id: '304',
      type: 'template_created',
      templateName: 'Modern Developer Portfolio',
      createdBy: 'admin',
      timestamp: '2023-10-14T14:15:00Z'
    },
    {
      id: '305',
      type: 'system_setting_changed',
      settingName: 'Submission Deadline Extension',
      changedBy: 'admin',
      timestamp: '2023-10-13T09:30:00Z'
    }
  ],
  cohortStats: [
    {
      id: '1',
      name: 'Web Development - Fall 2023',
      startDate: '2023-09-01T00:00:00Z',
      endDate: '2023-12-15T00:00:00Z',
      studentCount: 24,
      instructorCount: 2,
      submissionStats: {
        total: 72,
        graded: 48,
        pending: 24,
        passingRate: '87%'
      },
      status: 'active'
    },
    {
      id: '2',
      name: 'Data Science - Spring 2023',
      startDate: '2023-01-15T00:00:00Z',
      endDate: '2023-05-30T00:00:00Z',
      studentCount: 18,
      instructorCount: 2,
      submissionStats: {
        total: 108,
        graded: 108,
        pending: 0,
        passingRate: '92%'
      },
      status: 'completed'
    },
    {
      id: '3',
      name: 'UX Design - Summer 2023',
      startDate: '2023-06-01T00:00:00Z',
      endDate: '2023-08-30T00:00:00Z',
      studentCount: 16,
      instructorCount: 1,
      submissionStats: {
        total: 80,
        graded: 80,
        pending: 0,
        passingRate: '94%'
      },
      status: 'completed'
    },
    {
      id: '4',
      name: 'Data Science - Winter 2024',
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-05-30T00:00:00Z',
      studentCount: 0,
      instructorCount: 0,
      submissionStats: {
        total: 0,
        graded: 0,
        pending: 0,
        passingRate: 'N/A'
      },
      status: 'upcoming'
    }
  ],
  systemAlerts: [
    {
      id: '1',
      type: 'warning',
      message: 'Storage usage approaching 80% of allocated capacity',
      timestamp: '2023-10-15T08:30:00Z'
    },
    {
      id: '2',
      type: 'info',
      message: 'System maintenance scheduled for October 20, 2023 at 2:00 AM UTC',
      timestamp: '2023-10-14T12:00:00Z'
    }
  ]
};

export default function AdminDashboardPage() {
  const [cohortFilter, setCohortFilter] = useState('all');
  
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
  
  // Format date without time
  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <main className="admin-dashboard-page">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <Link href="/secure/admin/system-settings">
              <button className="settings-button">System Settings</button>
            </Link>
          </div>
        </div>
        
        <div className="system-alerts">
          {mockData.systemAlerts.map(alert => (
            <div key={alert.id} className={`alert alert-${alert.type}`}>
              <div className="alert-icon">
                {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
              </div>
              <div className="alert-content">
                <p>{alert.message}</p>
                <span className="alert-timestamp">{formatDate(alert.timestamp)}</span>
              </div>
              <button className="alert-dismiss">×</button>
            </div>
          ))}
        </div>
        
        <div className="stats-overview">
          <div className="stats-card">
            <h3>Users</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.totalUsers}</span>
                <span className="stat-label">Total Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.totalStudents}</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.totalInstructors}</span>
                <span className="stat-label">Instructors</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.totalAdmins}</span>
                <span className="stat-label">Admins</span>
              </div>
            </div>
            <div className="stats-actions">
              <Link href="/secure/admin/students">
                <button className="action-button">Manage Students</button>
              </Link>
              <Link href="/secure/admin/instructors">
                <button className="action-button">Manage Instructors</button>
              </Link>
            </div>
          </div>
          
          <div className="stats-card">
            <h3>Cohorts</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.totalCohorts}</span>
                <span className="stat-label">Total Cohorts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.activeCohorts}</span>
                <span className="stat-label">Active Cohorts</span>
              </div>
            </div>
            <div className="stats-actions">
              <Link href="/secure/admin/cohorts">
                <button className="action-button">Manage Cohorts</button>
              </Link>
            </div>
          </div>
          
          <div className="stats-card">
            <h3>Submissions</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.totalSubmissions}</span>
                <span className="stat-label">Total Submissions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.pendingSubmissions}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
            <div className="stats-actions">
              <Link href="/secure/admin/submissions">
                <button className="action-button">View Submissions</button>
              </Link>
            </div>
          </div>
          
          <div className="stats-card">
            <h3>Showcases</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.totalShowcases}</span>
                <span className="stat-label">Total Showcases</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{mockData.systemStats.publicShowcases}</span>
                <span className="stat-label">Public</span>
              </div>
            </div>
            <div className="stats-actions">
              <Link href="/secure/admin/templates">
                <button className="action-button">Manage Templates</button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="dashboard-sections">
          <section className="cohorts-section">
            <div className="section-header">
              <h2>Cohorts</h2>
              <div className="section-actions">
                <Link href="/secure/admin/cohorts/new">
                  <button className="primary-button">Create Cohort</button>
                </Link>
                <Link href="/secure/admin/cohorts">
                  <button className="secondary-button">View All</button>
                </Link>
              </div>
            </div>
            
            <div className="cohort-filter">
              <button 
                className={`filter-button ${cohortFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCohortFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-button ${cohortFilter === 'active' ? 'active' : ''}`}
                onClick={() => setCohortFilter('active')}
              >
                Active
              </button>
              <button 
                className={`filter-button ${cohortFilter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setCohortFilter('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={`filter-button ${cohortFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setCohortFilter('completed')}
              >
                Completed
              </button>
            </div>
            
            <div className="cohorts-grid">
              {mockData.cohortStats
                .filter(cohort => cohortFilter === 'all' || cohort.status === cohortFilter)
                .map(cohort => (
                  <div key={cohort.id} className={`cohort-card status-${cohort.status}`}>
                    <div className="cohort-header">
                      <h3>{cohort.name}</h3>
                      <span className={`status-badge ${cohort.status}`}>
                        {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)}
                      </span>
                    </div>
                    <div className="cohort-dates">
                      <div className="date-range">
                        <span className="date-label">Start:</span>
                        <span className="date-value">{formatDateOnly(cohort.startDate)}</span>
                      </div>
                      <div className="date-range">
                        <span className="date-label">End:</span>
                        <span className="date-value">{formatDateOnly(cohort.endDate)}</span>
                      </div>
                    </div>
                    <div className="cohort-stats">
                      <div className="cohort-stat">
                        <span className="stat-value">{cohort.studentCount}</span>
                        <span className="stat-label">Students</span>
                      </div>
                      <div className="cohort-stat">
                        <span className="stat-value">{cohort.instructorCount}</span>
                        <span className="stat-label">Instructors</span>
                      </div>
                      <div className="cohort-stat">
                        <span className="stat-value">{cohort.submissionStats.total}</span>
                        <span className="stat-label">Submissions</span>
                      </div>
                      <div className="cohort-stat">
                        <span className="stat-value">{cohort.submissionStats.passingRate}</span>
                        <span className="stat-label">Pass Rate</span>
                      </div>
                    </div>
                    <div className="cohort-actions">
                      <Link href={`/secure/admin/cohorts/${cohort.id}`}>
                        <button className="view-button">View Details</button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </section>
          
          <section className="activity-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <Link href="/secure/admin/audit-logs">
                <button className="view-all-button">View Audit Logs</button>
              </Link>
            </div>
            
            <div className="activity-list">
              {mockData.recentActivity.map(activity => (
                <div key={activity.id} className={`activity-item ${activity.type}`}>
                  <div className="activity-icon">
                    {activity.type === 'user_created' && '👤'}
                    {activity.type === 'user_role_changed' && '🔄'}
                    {activity.type === 'cohort_created' && '👥'}
                    {activity.type === 'template_created' && '📝'}
                    {activity.type === 'system_setting_changed' && '⚙️'}
                  </div>
                  <div className="activity-content">
                    <h4>
                      {activity.type === 'user_created' && `New user created: ${activity.name}`}
                      {activity.type === 'user_role_changed' && `Role changed: ${activity.name} (${activity.previousRole} → ${activity.role})`}
                      {activity.type === 'cohort_created' && `New cohort created: ${activity.cohortName}`}
                      {activity.type === 'template_created' && `New template created: ${activity.templateName}`}
                      {activity.type === 'system_setting_changed' && `Setting changed: ${activity.settingName}`}
                    </h4>
                    <p className="activity-meta">
                      {formatDate(activity.timestamp)}
                      {activity.cohort && ` • ${activity.cohort}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link href="/secure/admin/students/new">
              <div className="action-card">
                <div className="action-icon">👤</div>
                <div className="action-label">Add Student</div>
              </div>
            </Link>
            <Link href="/secure/admin/instructors/new">
              <div className="action-card">
                <div className="action-icon">👨‍🏫</div>
                <div className="action-label">Add Instructor</div>
              </div>
            </Link>
            <Link href="/secure/admin/cohorts/new">
              <div className="action-card">
                <div className="action-icon">👥</div>
                <div className="action-label">Create Cohort</div>
              </div>
            </Link>
            <Link href="/secure/admin/templates/new">
              <div className="action-card">
                <div className="action-icon">📝</div>
                <div className="action-label">Create Template</div>
              </div>
            </Link>
            <Link href="/secure/admin/lms-integration">
              <div className="action-card">
                <div className="action-icon">🔄</div>
                <div className="action-label">LMS Integration</div>
              </div>
            </Link>
            <Link href="/secure/admin/analytics">
              <div className="action-card">
                <div className="action-icon">📊</div>
                <div className="action-label">System Analytics</div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
} 