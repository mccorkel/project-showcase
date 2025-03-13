'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

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
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  
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
  
  return (
    <main className="admin-dashboard-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <div className="time-range-selector">
          <label htmlFor="time-range">Time Range:</label>
          <select 
            id="time-range" 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
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
            <Link href="/secure/admin/users">
              <button className="action-button">Manage Users</button>
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
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {mockData.recentActivity.map(activity => (
            <div key={activity.id} className={`activity-item activity-${activity.type}`}>
              <div className="activity-icon">
                {activity.type === 'user_created' ? '👤' : 
                 activity.type === 'user_role_changed' ? '🔄' :
                 activity.type === 'cohort_created' ? '👥' :
                 activity.type === 'template_created' ? '📝' : '⚙️'}
              </div>
              <div className="activity-content">
                <h4>
                  {activity.type === 'user_created' ? `New ${activity.role}: ${activity.name}` : 
                   activity.type === 'user_role_changed' ? `Role changed: ${activity.name} (${activity.previousRole} → ${activity.role})` :
                   activity.type === 'cohort_created' ? `New cohort: ${activity.cohortName}` :
                   activity.type === 'template_created' ? `New template: ${activity.templateName}` :
                   `Setting changed: ${activity.settingName}`}
                </h4>
                <p className="activity-meta">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link href="/secure/admin/users/new">
            <button className="primary-button">Create User</button>
          </Link>
          <Link href="/secure/admin/templates">
            <button className="secondary-button">Manage Templates</button>
          </Link>
          <Link href="/secure/admin/analytics">
            <button className="secondary-button">View Analytics</button>
          </Link>
          <Link href="/secure/admin/system-settings">
            <button className="secondary-button">System Settings</button>
          </Link>
        </div>
      </div>
    </main>
  );
} 