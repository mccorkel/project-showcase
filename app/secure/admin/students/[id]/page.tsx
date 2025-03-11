'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for student detail
const mockData = {
  student: {
    id: '101',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    cohort: 'Web Development - Fall 2023',
    status: 'active',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinDate: '2023-09-01T00:00:00Z',
    lastActive: '2023-10-15T10:30:00Z',
    bio: 'Full-stack developer with a passion for creating intuitive user experiences. Currently focused on mastering React and Node.js.',
    location: 'San Francisco, CA',
    socialLinks: {
      github: 'https://github.com/alexjohnson',
      linkedin: 'https://linkedin.com/in/alexjohnson',
      twitter: 'https://twitter.com/alexjohnson',
      portfolio: 'https://alexjohnson.dev'
    },
    skills: [
      { category: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
      { category: 'Backend', skills: ['Node.js', 'Express', 'MongoDB'] },
      { category: 'Tools', skills: ['Git', 'VS Code', 'Figma'] }
    ],
    showcasePublished: true,
    showcaseUrl: '/profile/alexjohnson',
    roles: ['student'],
    cognitoUserId: 'us-east-1:a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    securitySettings: {
      mfaEnabled: false,
      lastPasswordChange: '2023-09-01T00:00:00Z',
      loginAttempts: 0
    }
  },
  submissions: [
    {
      id: '1001',
      week: 1,
      title: 'HTML/CSS Portfolio',
      submittedAt: '2023-09-08T14:30:00Z',
      grade: 'A',
      passing: true,
      feedback: 'Excellent work! Your portfolio is well-structured and responsive.'
    },
    {
      id: '1002',
      week: 2,
      title: 'JavaScript Game',
      submittedAt: '2023-09-15T16:45:00Z',
      grade: 'A-',
      passing: true,
      feedback: 'Great game implementation. Consider adding more comments to your code.'
    },
    {
      id: '1003',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-09-22T11:20:00Z',
      grade: 'B+',
      passing: true,
      feedback: 'Good work on your React app. State management could be improved.'
    }
  ],
  activityLog: [
    {
      id: '5001',
      action: 'login',
      timestamp: '2023-10-15T10:30:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      id: '5002',
      action: 'submission_view',
      timestamp: '2023-10-15T10:35:00Z',
      details: 'Viewed submission #1003'
    },
    {
      id: '5003',
      action: 'profile_edit',
      timestamp: '2023-10-15T10:40:00Z',
      details: 'Updated profile information'
    },
    {
      id: '5004',
      action: 'showcase_edit',
      timestamp: '2023-10-15T10:45:00Z',
      details: 'Updated showcase settings'
    },
    {
      id: '5005',
      action: 'logout',
      timestamp: '2023-10-15T11:00:00Z'
    }
  ]
};

export default function AdminStudentDetailPage({ params }: { params: { id: string } }) {
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
    <ProtectedRoute requiredRoles={['admin']}>
      <main className="admin-student-detail-page">
        <div className="page-header">
          <Link href="/secure/admin/students" className="back-link">
            ← Back to Students
          </Link>
          <div className="header-content">
            <div className="student-profile-image">
              <img src={mockData.student.profileImage} alt={mockData.student.name} />
            </div>
            <div className="student-info">
              <h1>{mockData.student.name}</h1>
              <p className="student-email">{mockData.student.email}</p>
              <p className="student-cohort">{mockData.student.cohort}</p>
              <div className="student-meta">
                <span className="meta-item">
                  <span className="label">Status:</span>
                  <span className={`status-badge status-${mockData.student.status}`}>
                    {mockData.student.status.charAt(0).toUpperCase() + mockData.student.status.slice(1)}
                  </span>
                </span>
                <span className="meta-item">
                  <span className="label">Joined:</span> {formatDate(mockData.student.joinDate)}
                </span>
                <span className="meta-item">
                  <span className="label">Last Active:</span> {formatDateTime(mockData.student.lastActive)}
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Student'}
              </button>
              <button className="view-showcase-button">
                <a href={mockData.student.showcaseUrl} target="_blank" rel="noopener noreferrer">
                  View Showcase
                </a>
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
            className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button 
            className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
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
                        defaultValue={mockData.student.name}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email-input">Email:</label>
                      <input 
                        id="email-input"
                        type="email"
                        defaultValue={mockData.student.email}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cohort-select">Cohort:</label>
                      <select 
                        id="cohort-select"
                        defaultValue={mockData.student.cohort}
                        className="form-select"
                      >
                        <option value="Web Development - Fall 2023">Web Development - Fall 2023</option>
                        <option value="Data Science - Spring 2023">Data Science - Spring 2023</option>
                        <option value="UX Design - Summer 2023">UX Design - Summer 2023</option>
                        <option value="Web Development - Spring 2023">Web Development - Spring 2023</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="status-select">Status:</label>
                      <select 
                        id="status-select"
                        defaultValue={mockData.student.status}
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
                        defaultValue={mockData.student.bio}
                        rows={4}
                        className="form-textarea"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="location-input">Location:</label>
                      <input 
                        id="location-input"
                        type="text"
                        defaultValue={mockData.student.location}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h2>Social Links</h2>
                    {Object.entries(mockData.student.socialLinks).map(([platform, url]) => (
                      <div key={platform} className="form-group">
                        <label htmlFor={`${platform}-input`}>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
                        <input 
                          id={`${platform}-input`}
                          type="url"
                          defaultValue={url}
                          className="form-input"
                        />
                      </div>
                    ))}
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
                    <p>{mockData.student.bio}</p>
                    <p><strong>Location:</strong> {mockData.student.location}</p>
                  </section>
                  
                  <section className="profile-section">
                    <h2>Social Links</h2>
                    <div className="social-links">
                      {Object.entries(mockData.student.socialLinks).map(([platform, url]) => (
                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="social-link">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      ))}
                    </div>
                  </section>
                  
                  <section className="profile-section">
                    <h2>Skills</h2>
                    <div className="skills-categories">
                      {mockData.student.skills.map((category, index) => (
                        <div key={index} className="skill-category">
                          <h3>{category.category}</h3>
                          <div className="skills-list">
                            {category.skills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'account' && (
            <div className="account-tab">
              <section className="account-section">
                <h2>Account Information</h2>
                <div className="info-group">
                  <p><strong>Cognito User ID:</strong> {mockData.student.cognitoUserId}</p>
                  <p><strong>Roles:</strong> {mockData.student.roles.join(', ')}</p>
                </div>
              </section>
              
              <section className="account-section">
                <h2>Security Settings</h2>
                <div className="info-group">
                  <p><strong>MFA Enabled:</strong> {mockData.student.securitySettings.mfaEnabled ? 'Yes' : 'No'}</p>
                  <p><strong>Last Password Change:</strong> {formatDate(mockData.student.securitySettings.lastPasswordChange)}</p>
                  <p><strong>Login Attempts:</strong> {mockData.student.securitySettings.loginAttempts}</p>
                </div>
                <div className="action-buttons">
                  <button className="action-button">Reset Password</button>
                  <button className="action-button">Enable MFA</button>
                  <button className="action-button">Unlock Account</button>
                </div>
              </section>
              
              <section className="account-section">
                <h2>Role Management</h2>
                <div className="role-checkboxes">
                  <label className="role-checkbox">
                    <input 
                      type="checkbox" 
                      checked={mockData.student.roles.includes('student')} 
                      readOnly
                    />
                    <span>Student</span>
                  </label>
                  <label className="role-checkbox">
                    <input 
                      type="checkbox" 
                      checked={mockData.student.roles.includes('instructor')} 
                      readOnly
                    />
                    <span>Instructor</span>
                  </label>
                  <label className="role-checkbox">
                    <input 
                      type="checkbox" 
                      checked={mockData.student.roles.includes('admin')} 
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
          
          {activeTab === 'submissions' && (
            <div className="submissions-tab">
              <div className="submissions-header">
                <h2>Submissions</h2>
                <Link href="/secure/admin/submissions">
                  <button className="view-all-button">View All Submissions</button>
                </Link>
              </div>
              
              <div className="submissions-list">
                {mockData.submissions.map(submission => (
                  <div key={submission.id} className="submission-card">
                    <div className="submission-header">
                      <h3>Week {submission.week}: {submission.title}</h3>
                      <div className="submission-grade">
                        <span className={`grade grade-${submission.grade.charAt(0).toLowerCase()}`}>
                          {submission.grade}
                        </span>
                      </div>
                    </div>
                    <div className="submission-meta">
                      <p>Submitted: {formatDateTime(submission.submittedAt)}</p>
                      <p>Status: {submission.passing ? 'Passing' : 'Not Passing'}</p>
                    </div>
                    <div className="submission-feedback">
                      <h4>Feedback</h4>
                      <p>{submission.feedback}</p>
                    </div>
                    <div className="submission-actions">
                      <Link href={`/secure/admin/submissions/${submission.id}`}>
                        <button className="view-button">View Details</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
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
    </ProtectedRoute>
  );
} 