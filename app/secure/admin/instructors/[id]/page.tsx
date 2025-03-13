'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

// Mock data for instructor detail
const mockData = {
  instructor: {
    id: '301',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'active',
    profileImage: 'https://randomuser.me/api/portraits/women/32.jpg',
    joinDate: '2022-01-15T00:00:00Z',
    lastActive: '2023-10-16T09:30:00Z',
    bio: 'Experienced web development instructor with 10+ years of industry experience. Passionate about teaching and mentoring the next generation of developers.',
    specialization: 'Web Development',
    skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'GraphQL', 'AWS'],
    assignedCohorts: [
      { id: 'c1', name: 'Web Development - Fall 2023', studentCount: 24, startDate: '2023-09-01T00:00:00Z', endDate: '2023-12-15T00:00:00Z' },
      { id: 'c2', name: 'Web Development - Spring 2023', studentCount: 18, startDate: '2023-01-15T00:00:00Z', endDate: '2023-05-30T00:00:00Z' }
    ],
    contactInfo: {
      phone: '(555) 123-4567',
      alternateEmail: 'jane.smith.instructor@example.com',
      address: '123 Main St, San Francisco, CA 94105'
    },
    roles: ['instructor'],
    cognitoUserId: 'us-east-1:b2c3d4e5-f6g7-8901-bcde-fg2345678901',
    securitySettings: {
      mfaEnabled: true,
      lastPasswordChange: '2023-05-10T00:00:00Z',
      loginAttempts: 0
    }
  },
  gradingStats: {
    totalGraded: 156,
    averageTurnaroundTime: '1.2 days',
    passingRate: '92%',
    feedbackQuality: 'High',
    studentSatisfaction: '4.8/5'
  },
  activityLog: [
    {
      id: '6001',
      action: 'login',
      timestamp: '2023-10-16T09:30:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      id: '6002',
      action: 'submission_graded',
      timestamp: '2023-10-16T10:15:00Z',
      details: 'Graded submission #1003 for Alex Johnson'
    },
    {
      id: '6003',
      action: 'submission_graded',
      timestamp: '2023-10-16T10:45:00Z',
      details: 'Graded submission #1004 for Sarah Chen'
    },
    {
      id: '6004',
      action: 'cohort_view',
      timestamp: '2023-10-16T11:30:00Z',
      details: 'Viewed cohort Web Development - Fall 2023'
    },
    {
      id: '6005',
      action: 'logout',
      timestamp: '2023-10-16T12:00:00Z'
    }
  ],
  availableCohorts: [
    { id: 'c1', name: 'Web Development - Fall 2023' },
    { id: 'c2', name: 'Web Development - Spring 2023' },
    { id: 'c3', name: 'Web Development - Summer 2023' },
    { id: 'c4', name: 'Data Science - Spring 2023' },
    { id: 'c5', name: 'UX Design - Summer 2023' }
  ]
};

export default async function AdminInstructorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
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
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real implementation, this would save the changes to the server
    alert('Changes saved successfully');
  };
  
  return (
    <main className="admin-instructor-detail-page">
      <div className="page-header">
        <Link href="/secure/admin/instructors" className="back-link">
          ← Back to Instructors
        </Link>
        <div className="header-content">
          <div className="instructor-profile-image">
            <img src={mockData.instructor.profileImage} alt={mockData.instructor.name} />
          </div>
          <div className="instructor-info">
            <h1>{mockData.instructor.name}</h1>
            <p className="instructor-email">{mockData.instructor.email}</p>
            <p className="instructor-specialization">{mockData.instructor.specialization}</p>
            <div className="instructor-meta">
              <span className="meta-item">
                <span className="label">Status:</span>
                <span className={`status-badge status-${mockData.instructor.status}`}>
                  {mockData.instructor.status.charAt(0).toUpperCase() + mockData.instructor.status.slice(1)}
                </span>
              </span>
              <span className="meta-item">
                <span className="label">Joined:</span> {formatDate(mockData.instructor.joinDate)}
              </span>
              <span className="meta-item">
                <span className="label">Last Active:</span> {formatDateTime(mockData.instructor.lastActive)}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Instructor'}
            </button>
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
          className={`tab-button ${activeTab === 'cohorts' ? 'active' : ''}`}
          onClick={() => setActiveTab('cohorts')}
        >
          Assigned Cohorts
        </button>
        <button 
          className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button 
          className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
        <button 
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity Log
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            {isEditing ? (
              <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h2>Basic Information</h2>
                  <div className="form-group">
                    <label htmlFor="name-input">Name:</label>
                    <input 
                      id="name-input"
                      type="text"
                      defaultValue={mockData.instructor.name}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email-input">Email:</label>
                    <input 
                      id="email-input"
                      type="email"
                      defaultValue={mockData.instructor.email}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialization-input">Specialization:</label>
                    <input 
                      id="specialization-input"
                      type="text"
                      defaultValue={mockData.instructor.specialization}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status-select">Status:</label>
                    <select 
                      id="status-select"
                      defaultValue={mockData.instructor.status}
                      className="form-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio-textarea">Bio:</label>
                    <textarea 
                      id="bio-textarea"
                      defaultValue={mockData.instructor.bio}
                      rows={4}
                      className="form-textarea"
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-section">
                  <h2>Contact Information</h2>
                  <div className="form-group">
                    <label htmlFor="phone-input">Phone:</label>
                    <input 
                      id="phone-input"
                      type="tel"
                      defaultValue={mockData.instructor.contactInfo.phone}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="alt-email-input">Alternate Email:</label>
                    <input 
                      id="alt-email-input"
                      type="email"
                      defaultValue={mockData.instructor.contactInfo.alternateEmail}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address-input">Address:</label>
                    <input 
                      id="address-input"
                      type="text"
                      defaultValue={mockData.instructor.contactInfo.address}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-section">
                  <h2>Skills</h2>
                  <div className="form-group">
                    <label htmlFor="skills-input">Skills (comma-separated):</label>
                    <input 
                      id="skills-input"
                      type="text"
                      defaultValue={mockData.instructor.skills.join(', ')}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-button">Save Changes</button>
                  <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <section className="profile-section">
                  <h2>About</h2>
                  <p>{mockData.instructor.bio}</p>
                </section>
                
                <section className="profile-section">
                  <h2>Contact Information</h2>
                  <div className="info-group">
                    <p><strong>Phone:</strong> {mockData.instructor.contactInfo.phone}</p>
                    <p><strong>Alternate Email:</strong> {mockData.instructor.contactInfo.alternateEmail}</p>
                    <p><strong>Address:</strong> {mockData.instructor.contactInfo.address}</p>
                  </div>
                </section>
                
                <section className="profile-section">
                  <h2>Skills</h2>
                  <div className="skills-list">
                    {mockData.instructor.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'cohorts' && (
          <div className="cohorts-tab">
            <div className="cohorts-header">
              <h2>Assigned Cohorts</h2>
              <button className="assign-cohort-button">Assign New Cohort</button>
            </div>
            
            {mockData.instructor.assignedCohorts.length === 0 ? (
              <div className="empty-state">
                <p>This instructor is not assigned to any cohorts.</p>
              </div>
            ) : (
              <div className="cohorts-list">
                {mockData.instructor.assignedCohorts.map(cohort => (
                  <div key={cohort.id} className="cohort-card">
                    <div className="cohort-info">
                      <h3>{cohort.name}</h3>
                      <div className="cohort-meta">
                        <span className="meta-item">
                          <span className="label">Students:</span> {cohort.studentCount}
                        </span>
                        <span className="meta-item">
                          <span className="label">Duration:</span> {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className="cohort-actions">
                      <Link href={`/secure/admin/cohorts/${cohort.id}`}>
                        <button className="view-button">View Cohort</button>
                      </Link>
                      <button className="remove-button">Remove Assignment</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="available-cohorts-section">
              <h3>Available Cohorts</h3>
              <div className="available-cohorts-list">
                {mockData.availableCohorts
                  .filter(cohort => !mockData.instructor.assignedCohorts.some(assigned => assigned.id === cohort.id))
                  .map(cohort => (
                    <div key={cohort.id} className="available-cohort-item">
                      <span>{cohort.name}</span>
                      <button className="assign-button">Assign</button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className="performance-tab">
            <h2>Performance Metrics</h2>
            
            <div className="metrics-cards">
              <div className="metric-card">
                <h3>Total Submissions Graded</h3>
                <div className="metric-value">{mockData.gradingStats.totalGraded}</div>
              </div>
              <div className="metric-card">
                <h3>Average Turnaround Time</h3>
                <div className="metric-value">{mockData.gradingStats.averageTurnaroundTime}</div>
              </div>
              <div className="metric-card">
                <h3>Student Pass Rate</h3>
                <div className="metric-value">{mockData.gradingStats.passingRate}</div>
              </div>
              <div className="metric-card">
                <h3>Feedback Quality</h3>
                <div className="metric-value">{mockData.gradingStats.feedbackQuality}</div>
              </div>
              <div className="metric-card">
                <h3>Student Satisfaction</h3>
                <div className="metric-value">{mockData.gradingStats.studentSatisfaction}</div>
              </div>
            </div>
            
            <div className="chart-placeholder">
              <p className="placeholder-message">
                In the full implementation, this section would include charts and graphs showing the instructor's performance metrics over time.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'account' && (
          <div className="account-tab">
            <section className="account-section">
              <h2>Account Information</h2>
              <div className="info-group">
                <p><strong>Cognito User ID:</strong> {mockData.instructor.cognitoUserId}</p>
                <p><strong>Roles:</strong> {mockData.instructor.roles.join(', ')}</p>
              </div>
            </section>
            
            <section className="account-section">
              <h2>Security Settings</h2>
              <div className="info-group">
                <p><strong>MFA Enabled:</strong> {mockData.instructor.securitySettings.mfaEnabled ? 'Yes' : 'No'}</p>
                <p><strong>Last Password Change:</strong> {formatDate(mockData.instructor.securitySettings.lastPasswordChange)}</p>
                <p><strong>Login Attempts:</strong> {mockData.instructor.securitySettings.loginAttempts}</p>
              </div>
              <div className="action-buttons">
                <button className="action-button">Reset Password</button>
                {mockData.instructor.securitySettings.mfaEnabled ? (
                  <button className="action-button">Disable MFA</button>
                ) : (
                  <button className="action-button">Enable MFA</button>
                )}
                <button className="action-button">Unlock Account</button>
              </div>
            </section>
            
            <section className="account-section">
              <h2>Role Management</h2>
              <div className="role-checkboxes">
                <label className="role-checkbox">
                  <input 
                    type="checkbox" 
                    checked={mockData.instructor.roles.includes('student')} 
                    readOnly
                  />
                  <span>Student</span>
                </label>
                <label className="role-checkbox">
                  <input 
                    type="checkbox" 
                    checked={mockData.instructor.roles.includes('instructor')} 
                    readOnly
                  />
                  <span>Instructor</span>
                </label>
                <label className="role-checkbox">
                  <input 
                    type="checkbox" 
                    checked={mockData.instructor.roles.includes('admin')} 
                    readOnly
                  />
                  <span>Administrator</span>
                </label>
              </div>
              <div className="action-buttons">
                <button className="action-button">Manage Roles</button>
              </div>
            </section>
            
            <section className="account-section">
              <h2>Danger Zone</h2>
              <div className="danger-actions">
                <button className="danger-button">Suspend Account</button>
                <button className="danger-button">Delete Account</button>
              </div>
            </section>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="activity-tab">
            <h2>Activity Log</h2>
            <div className="activity-list">
              {mockData.activityLog.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-time">
                    {formatDateTime(activity.timestamp)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-type">
                      {activity.action.replace('_', ' ').toUpperCase()}
                    </div>
                    {activity.details && (
                      <div className="activity-details">
                        {activity.details}
                      </div>
                    )}
                    {activity.ipAddress && (
                      <div className="activity-ip">
                        IP: {activity.ipAddress}
                      </div>
                    )}
                    {activity.userAgent && (
                      <div className="activity-user-agent">
                        {activity.userAgent}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 