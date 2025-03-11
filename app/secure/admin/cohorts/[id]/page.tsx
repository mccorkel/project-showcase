'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for cohort detail
const mockData = {
  cohort: {
    id: 'c1',
    name: 'Web Development - Fall 2023',
    status: 'active',
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2023-12-15T00:00:00Z',
    studentCount: 24,
    instructors: [
      { id: '301', name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: '302', name: 'John Doe', email: 'john.doe@example.com' }
    ],
    progress: '75%',
    currentWeek: 9,
    totalWeeks: 12,
    program: 'Web Development',
    description: 'A comprehensive web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and more.',
    location: 'Online',
    schedule: 'Monday-Friday, 9:00 AM - 5:00 PM',
    capacity: 30
  },
  students: [
    {
      id: '101',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      status: 'active',
      submissionsCompleted: 8,
      passingRate: '87%',
      lastActive: '2023-10-15T10:30:00Z'
    },
    {
      id: '102',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      status: 'active',
      submissionsCompleted: 9,
      passingRate: '100%',
      lastActive: '2023-10-16T14:20:00Z'
    },
    {
      id: '103',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      status: 'active',
      submissionsCompleted: 7,
      passingRate: '85%',
      lastActive: '2023-10-14T09:15:00Z'
    },
    {
      id: '104',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      status: 'active',
      submissionsCompleted: 9,
      passingRate: '95%',
      lastActive: '2023-10-16T11:45:00Z'
    }
  ],
  weeklyProgress: [
    { week: 1, completed: 24, passing: 24, rate: '100%' },
    { week: 2, completed: 24, passing: 22, rate: '92%' },
    { week: 3, completed: 24, passing: 21, rate: '88%' },
    { week: 4, completed: 24, passing: 20, rate: '83%' },
    { week: 5, completed: 24, passing: 22, rate: '92%' },
    { week: 6, completed: 24, passing: 23, rate: '96%' },
    { week: 7, completed: 24, passing: 21, rate: '88%' },
    { week: 8, completed: 24, passing: 20, rate: '83%' },
    { week: 9, completed: 20, passing: 18, rate: '90%' }
  ],
  availableInstructors: [
    { id: '303', name: 'Robert Johnson', email: 'robert.johnson@example.com' },
    { id: '305', name: 'Michael Wilson', email: 'michael.wilson@example.com' }
  ]
};

export default function AdminCohortDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
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
      <main className="admin-cohort-detail-page">
        <div className="page-header">
          <Link href="/secure/admin/cohorts" className="back-link">
            ← Back to Cohorts
          </Link>
          <div className="header-content">
            <div className="cohort-info">
              <h1>{mockData.cohort.name}</h1>
              <div className="cohort-meta">
                <span className={`status-badge status-${mockData.cohort.status}`}>
                  {mockData.cohort.status.charAt(0).toUpperCase() + mockData.cohort.status.slice(1)}
                </span>
                <span className="meta-item">
                  <span className="label">Program:</span> {mockData.cohort.program}
                </span>
                <span className="meta-item">
                  <span className="label">Duration:</span> {formatDate(mockData.cohort.startDate)} - {formatDate(mockData.cohort.endDate)}
                </span>
                <span className="meta-item">
                  <span className="label">Progress:</span> {mockData.cohort.progress} (Week {mockData.cohort.currentWeek} of {mockData.cohort.totalWeeks})
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Cohort'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`tab-button ${activeTab === 'instructors' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructors')}
          >
            Instructors
          </button>
          <button 
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {isEditing ? (
                <form className="edit-form" onSubmit={handleSubmit}>
                  <div className="form-section">
                    <h2>Basic Information</h2>
                    <div className="form-group">
                      <label htmlFor="name-input">Cohort Name:</label>
                      <input 
                        id="name-input"
                        type="text"
                        defaultValue={mockData.cohort.name}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="program-input">Program:</label>
                      <input 
                        id="program-input"
                        type="text"
                        defaultValue={mockData.cohort.program}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description-textarea">Description:</label>
                      <textarea 
                        id="description-textarea"
                        defaultValue={mockData.cohort.description}
                        rows={4}
                        className="form-textarea"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="status-select">Status:</label>
                      <select 
                        id="status-select"
                        defaultValue={mockData.cohort.status}
                        className="form-select"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h2>Schedule</h2>
                    <div className="form-group">
                      <label htmlFor="start-date-input">Start Date:</label>
                      <input 
                        id="start-date-input"
                        type="date"
                        defaultValue={mockData.cohort.startDate.split('T')[0]}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="end-date-input">End Date:</label>
                      <input 
                        id="end-date-input"
                        type="date"
                        defaultValue={mockData.cohort.endDate.split('T')[0]}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="schedule-input">Schedule:</label>
                      <input 
                        id="schedule-input"
                        type="text"
                        defaultValue={mockData.cohort.schedule}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="location-input">Location:</label>
                      <input 
                        id="location-input"
                        type="text"
                        defaultValue={mockData.cohort.location}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="capacity-input">Capacity:</label>
                      <input 
                        id="capacity-input"
                        type="number"
                        defaultValue={mockData.cohort.capacity}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="current-week-input">Current Week:</label>
                      <input 
                        id="current-week-input"
                        type="number"
                        defaultValue={mockData.cohort.currentWeek}
                        min={0}
                        max={mockData.cohort.totalWeeks}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="total-weeks-input">Total Weeks:</label>
                      <input 
                        id="total-weeks-input"
                        type="number"
                        defaultValue={mockData.cohort.totalWeeks}
                        min={1}
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
                  <section className="overview-section">
                    <h2>Cohort Details</h2>
                    <div className="info-group">
                      <p><strong>Description:</strong> {mockData.cohort.description}</p>
                      <p><strong>Location:</strong> {mockData.cohort.location}</p>
                      <p><strong>Schedule:</strong> {mockData.cohort.schedule}</p>
                      <p><strong>Capacity:</strong> {mockData.cohort.capacity} students</p>
                      <p><strong>Current Enrollment:</strong> {mockData.cohort.studentCount} students</p>
                    </div>
                  </section>
                  
                  <section className="overview-section">
                    <h2>Quick Stats</h2>
                    <div className="stats-cards">
                      <div className="stat-card">
                        <h3>Students</h3>
                        <div className="stat-value">{mockData.cohort.studentCount}</div>
                        <div className="stat-subtext">{mockData.cohort.studentCount}/{mockData.cohort.capacity} enrolled</div>
                      </div>
                      <div className="stat-card">
                        <h3>Instructors</h3>
                        <div className="stat-value">{mockData.cohort.instructors.length}</div>
                      </div>
                      <div className="stat-card">
                        <h3>Current Week</h3>
                        <div className="stat-value">{mockData.cohort.currentWeek}/{mockData.cohort.totalWeeks}</div>
                        <div className="stat-subtext">{mockData.cohort.progress} complete</div>
                      </div>
                      <div className="stat-card">
                        <h3>Average Pass Rate</h3>
                        <div className="stat-value">
                          {mockData.weeklyProgress.reduce((sum, week) => sum + parseInt(week.rate), 0) / mockData.weeklyProgress.length}%
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'students' && (
            <div className="students-tab">
              <div className="students-header">
                <h2>Enrolled Students</h2>
                <div className="header-actions">
                  <button className="add-student-button">Add Student</button>
                  <button className="import-students-button">Import Students</button>
                </div>
              </div>
              
              {mockData.students.length === 0 ? (
                <div className="empty-state">
                  <p>No students enrolled in this cohort.</p>
                </div>
              ) : (
                <div className="students-table">
                  <div className="table-header">
                    <div className="col-name">Name</div>
                    <div className="col-email">Email</div>
                    <div className="col-status">Status</div>
                    <div className="col-submissions">Submissions</div>
                    <div className="col-passing">Passing Rate</div>
                    <div className="col-activity">Last Active</div>
                    <div className="col-actions">Actions</div>
                  </div>
                  
                  <div className="table-body">
                    {mockData.students.map(student => (
                      <div key={student.id} className="table-row">
                        <div className="col-name">{student.name}</div>
                        <div className="col-email">{student.email}</div>
                        <div className="col-status">
                          <span className={`status-badge status-${student.status}`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </div>
                        <div className="col-submissions">{student.submissionsCompleted}</div>
                        <div className="col-passing">{student.passingRate}</div>
                        <div className="col-activity">{formatDateTime(student.lastActive)}</div>
                        <div className="col-actions">
                          <Link href={`/secure/admin/students/${student.id}`}>
                            <button className="view-button">View</button>
                          </Link>
                          <button className="remove-button">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'instructors' && (
            <div className="instructors-tab">
              <div className="instructors-header">
                <h2>Assigned Instructors</h2>
                <button className="assign-instructor-button">Assign Instructor</button>
              </div>
              
              {mockData.cohort.instructors.length === 0 ? (
                <div className="empty-state">
                  <p>No instructors assigned to this cohort.</p>
                </div>
              ) : (
                <div className="instructors-list">
                  {mockData.cohort.instructors.map(instructor => (
                    <div key={instructor.id} className="instructor-card">
                      <div className="instructor-info">
                        <h3>{instructor.name}</h3>
                        <p className="instructor-email">{instructor.email}</p>
                      </div>
                      <div className="instructor-actions">
                        <Link href={`/secure/admin/instructors/${instructor.id}`}>
                          <button className="view-button">View Profile</button>
                        </Link>
                        <button className="remove-button">Remove from Cohort</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="available-instructors-section">
                <h3>Available Instructors</h3>
                <div className="available-instructors-list">
                  {mockData.availableInstructors.map(instructor => (
                    <div key={instructor.id} className="available-instructor-item">
                      <div className="instructor-info">
                        <span className="instructor-name">{instructor.name}</span>
                        <span className="instructor-email">{instructor.email}</span>
                      </div>
                      <button className="assign-button">Assign</button>
                    </div>
                  ))}
                </div>
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
                
                {mockData.weeklyProgress.map(week => (
                  <div key={week.week} className="progress-row">
                    <div className="col-week">Week {week.week}</div>
                    <div className="col-completed">{week.completed}/{mockData.cohort.studentCount}</div>
                    <div className="col-passing">{week.passing}</div>
                    <div className="col-rate">{week.rate}</div>
                  </div>
                ))}
              </div>
              
              <div className="chart-placeholder">
                <p className="placeholder-message">
                  In the full implementation, this section would include interactive charts visualizing the cohort's progress over time.
                </p>
              </div>
              
              <div className="submissions-section">
                <h3>Recent Submissions</h3>
                <p className="placeholder-message">
                  This is a placeholder for the submissions section. In the full implementation, this would display a list of recent submissions for this cohort.
                </p>
                <div className="cta-button-container">
                  <Link href="/secure/admin/submissions">
                    <button className="cta-button">View All Submissions</button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
} 