'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

// Mock data for submissions management
const mockData = {
  submissions: [
    {
      id: '1001',
      studentName: 'Alex Johnson',
      studentId: '101',
      cohort: 'Web Development - Fall 2023',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-14T15:30:00Z',
      status: 'pending',
      instructorName: null
    },
    {
      id: '1002',
      studentName: 'Maria Garcia',
      studentId: '102',
      cohort: 'Web Development - Fall 2023',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-14T16:45:00Z',
      status: 'pending',
      instructorName: null
    },
    {
      id: '1003',
      studentName: 'James Wilson',
      studentId: '103',
      cohort: 'Web Development - Fall 2023',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-15T09:20:00Z',
      status: 'pending',
      instructorName: null
    },
    {
      id: '1004',
      studentName: 'Sarah Chen',
      studentId: '104',
      cohort: 'Web Development - Fall 2023',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-15T11:10:00Z',
      status: 'pending',
      instructorName: null
    },
    {
      id: '1005',
      studentName: 'David Kim',
      studentId: '201',
      cohort: 'Data Science - Spring 2023',
      week: 6,
      title: 'Machine Learning Model',
      submittedAt: '2023-10-13T14:25:00Z',
      status: 'graded',
      grade: 'A',
      instructorName: 'Robert Johnson'
    },
    {
      id: '1006',
      studentName: 'Emily Brown',
      studentId: '202',
      cohort: 'Data Science - Spring 2023',
      week: 6,
      title: 'Machine Learning Model',
      submittedAt: '2023-10-13T16:40:00Z',
      status: 'graded',
      grade: 'B+',
      instructorName: 'Robert Johnson'
    },
    {
      id: '1007',
      studentName: 'Michael Lee',
      studentId: '203',
      cohort: 'Data Science - Spring 2023',
      week: 6,
      title: 'Machine Learning Model',
      submittedAt: '2023-10-14T10:15:00Z',
      status: 'graded',
      grade: 'A-',
      instructorName: 'Robert Johnson'
    },
    {
      id: '1008',
      studentName: 'Lisa Wang',
      studentId: '204',
      cohort: 'UX Design - Summer 2023',
      week: 4,
      title: 'User Interface Design',
      submittedAt: '2023-07-20T13:30:00Z',
      status: 'graded',
      grade: 'A',
      instructorName: 'Michael Wilson'
    }
  ],
  cohorts: [
    'Web Development - Fall 2023',
    'Data Science - Spring 2023',
    'UX Design - Summer 2023',
    'Web Development - Spring 2023'
  ],
  instructors: [
    'Jane Smith',
    'John Doe',
    'Robert Johnson',
    'Michael Wilson'
  ]
};

export default function AdminSubmissionsManagementPage() {
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  // Get unique weeks from submissions
  const weeks = Array.from(new Set(mockData.submissions.map(submission => submission.week))).sort((a, b) => a - b);
  
  // Filter submissions based on selected filters
  const filteredSubmissions = mockData.submissions.filter(submission => {
    const matchesCohort = selectedCohort === 'all' || submission.cohort === selectedCohort;
    const matchesStatus = selectedStatus === 'all' || submission.status === selectedStatus;
    const matchesWeek = selectedWeek === 'all' || submission.week === parseInt(selectedWeek);
    const matchesSearch = searchQuery === '' || 
      submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCohort && matchesStatus && matchesWeek && matchesSearch;
  });
  
  return (
    <main className="admin-submissions-management-page">
      <div className="page-header">
        <h1>All Submissions</h1>
        <p className="page-description">
          View and manage all student submissions across all cohorts.
        </p>
        <Link href="/secure/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="filters-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by student name or title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-options">
          <div className="filter-group">
            <label htmlFor="cohort-select">Cohort:</label>
            <select 
              id="cohort-select"
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Cohorts</option>
              {mockData.cohorts.map((cohort, index) => (
                <option key={index} value={cohort}>{cohort}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="week-select">Week:</label>
            <select 
              id="week-select"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Weeks</option>
              {weeks.map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="status-select">Status:</label>
            <select 
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="submissions-table">
        <div className="table-header">
          <div className="col-student">Student</div>
          <div className="col-cohort">Cohort</div>
          <div className="col-week">Week</div>
          <div className="col-title">Title</div>
          <div className="col-submitted">Submitted</div>
          <div className="col-status">Status</div>
          <div className="col-instructor">Instructor</div>
          <div className="col-actions">Actions</div>
        </div>
        
        {filteredSubmissions.length === 0 ? (
          <div className="empty-state">
            <p>No submissions found matching your criteria.</p>
          </div>
        ) : (
          <div className="table-body">
            {filteredSubmissions.map(submission => (
              <div key={submission.id} className="table-row">
                <div className="col-student">
                  <Link href={`/secure/admin/students/${submission.studentId}`}>
                    {submission.studentName}
                  </Link>
                </div>
                <div className="col-cohort">{submission.cohort}</div>
                <div className="col-week">Week {submission.week}</div>
                <div className="col-title">{submission.title}</div>
                <div className="col-submitted">{formatDateTime(submission.submittedAt)}</div>
                <div className="col-status">
                  {submission.status === 'pending' ? (
                    <span className="status-pending">Pending</span>
                  ) : (
                    <span className="status-graded">
                      Graded ({submission.grade})
                    </span>
                  )}
                </div>
                <div className="col-instructor">
                  {submission.instructorName || 'Not assigned'}
                </div>
                <div className="col-actions">
                  <Link href={`/secure/admin/submissions/${submission.id}`}>
                    <button className="view-button">View</button>
                  </Link>
                  {submission.status === 'pending' ? (
                    <button className="assign-button">Assign</button>
                  ) : (
                    <button className="edit-button">Edit</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="pagination">
        <button className="pagination-button" disabled>Previous</button>
        <span className="pagination-info">Page 1 of 1</span>
        <button className="pagination-button" disabled>Next</button>
      </div>
      
      <div className="bulk-actions">
        <h3>Bulk Actions</h3>
        <div className="action-buttons">
          <button className="bulk-action-button" disabled>Assign to Instructor</button>
          <button className="bulk-action-button" disabled>Export Selected</button>
        </div>
      </div>
      
      <div className="stats-section">
        <h3>Submission Statistics</h3>
        <div className="stats-cards">
          <div className="stat-card">
            <h4>Total Submissions</h4>
            <div className="stat-value">{mockData.submissions.length}</div>
          </div>
          <div className="stat-card">
            <h4>Pending</h4>
            <div className="stat-value">
              {mockData.submissions.filter(s => s.status === 'pending').length}
            </div>
          </div>
          <div className="stat-card">
            <h4>Graded</h4>
            <div className="stat-value">
              {mockData.submissions.filter(s => s.status === 'graded').length}
            </div>
          </div>
          <div className="stat-card">
            <h4>Average Grade</h4>
            <div className="stat-value">
              {/* Calculate average grade for display */}
              A-
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 