'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for submissions management
const mockData = {
  instructor: {
    name: 'Jane Smith',
    assignedCohorts: ['Web Development - Fall 2023', 'Data Science - Spring 2023']
  },
  submissions: [
    {
      id: '1001',
      studentName: 'Alex Johnson',
      studentId: '101',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-14T15:30:00Z',
      status: 'pending',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '1002',
      studentName: 'Maria Garcia',
      studentId: '102',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-14T16:45:00Z',
      status: 'pending',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '1003',
      studentName: 'James Wilson',
      studentId: '103',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-15T09:20:00Z',
      status: 'pending',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '1004',
      studentName: 'Sarah Chen',
      studentId: '104',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-10-15T11:10:00Z',
      status: 'pending',
      cohort: 'Web Development - Fall 2023'
    },
    {
      id: '1005',
      studentName: 'David Kim',
      studentId: '201',
      week: 6,
      title: 'Machine Learning Model',
      submittedAt: '2023-10-13T14:25:00Z',
      status: 'graded',
      grade: 'A',
      cohort: 'Data Science - Spring 2023'
    },
    {
      id: '1006',
      studentName: 'Emily Brown',
      studentId: '202',
      week: 6,
      title: 'Machine Learning Model',
      submittedAt: '2023-10-13T16:40:00Z',
      status: 'graded',
      grade: 'B+',
      cohort: 'Data Science - Spring 2023'
    },
    {
      id: '1007',
      studentName: 'Michael Lee',
      studentId: '203',
      week: 6,
      title: 'Machine Learning Model',
      submittedAt: '2023-10-14T10:15:00Z',
      status: 'graded',
      grade: 'A-',
      cohort: 'Data Science - Spring 2023'
    }
  ]
};

export default function SubmissionsManagementPage() {
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  // Get unique weeks from submissions
  const weeks = Array.from(new Set(mockData.submissions.map(submission => submission.week))).sort((a, b) => a - b);
  
  // Filter submissions based on selected filters
  const filteredSubmissions = mockData.submissions.filter(submission => {
    const matchesCohort = selectedCohort === 'all' || submission.cohort === selectedCohort;
    const matchesWeek = selectedWeek === 'all' || submission.week === parseInt(selectedWeek);
    const matchesStatus = selectedStatus === 'all' || submission.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCohort && matchesWeek && matchesStatus && matchesSearch;
  });
  
  return (
    <ProtectedRoute requiredRoles={['instructor']}>
      <main className="submissions-management-page">
        <div className="page-header">
          <h1>Submission Management</h1>
          <p className="page-description">
            View and grade student submissions from your assigned cohorts.
          </p>
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
                {mockData.instructor.assignedCohorts.map((cohort, index) => (
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
                    <Link href={`/secure/instructor/students/${submission.studentId}`}>
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
                  <div className="col-actions">
                    {submission.status === 'pending' ? (
                      <Link href={`/secure/instructor/submissions/${submission.id}/grade`}>
                        <button className="grade-button">Grade</button>
                      </Link>
                    ) : (
                      <Link href={`/secure/instructor/submissions/${submission.id}/grade`}>
                        <button className="edit-button">Edit</button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bulk-actions">
          <h3>Bulk Actions</h3>
          <p className="placeholder-message">
            In the full implementation, this section would allow instructors to perform bulk actions on selected submissions.
          </p>
          <div className="action-buttons">
            <button className="bulk-action-button" disabled>Grade Selected</button>
            <button className="bulk-action-button" disabled>Export Selected</button>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
} 