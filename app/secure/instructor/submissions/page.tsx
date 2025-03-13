'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

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
      status: 'graded',
      cohort: 'Web Development - Fall 2023',
      grade: 92,
      feedback: 'Great work! Your component structure is excellent.'
    },
    {
      id: '1004',
      studentName: 'Sarah Lee',
      studentId: '104',
      week: 2,
      title: 'CSS Layout Challenge',
      submittedAt: '2023-10-10T14:15:00Z',
      status: 'graded',
      cohort: 'Web Development - Fall 2023',
      grade: 88,
      feedback: 'Good work on the responsive design. Consider using more CSS variables for consistency.'
    },
    {
      id: '1005',
      studentName: 'David Chen',
      studentId: '105',
      week: 2,
      title: 'CSS Layout Challenge',
      submittedAt: '2023-10-09T11:30:00Z',
      status: 'graded',
      cohort: 'Web Development - Fall 2023',
      grade: 95,
      feedback: 'Excellent work! Your layout is clean and your code is well-organized.'
    },
    {
      id: '1006',
      studentName: 'Emily Rodriguez',
      studentId: '201',
      week: 4,
      title: 'Data Visualization Project',
      submittedAt: '2023-10-16T10:45:00Z',
      status: 'pending',
      cohort: 'Data Science - Spring 2023'
    },
    {
      id: '1007',
      studentName: 'Michael Kim',
      studentId: '202',
      week: 4,
      title: 'Data Visualization Project',
      submittedAt: '2023-10-16T13:20:00Z',
      status: 'pending',
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
    <main className="submissions-management-page">
      <div className="page-header">
        <h1>Submissions Management</h1>
        <div className="header-actions">
          <Link href="/secure/instructor/submissions/bulk-grade">
            <button className="bulk-grade-button">Bulk Grading</button>
          </Link>
          <Link href="/secure/instructor/dashboard">
            <button className="secondary-button">Back to Dashboard</button>
          </Link>
        </div>
      </div>
      
      <div className="filters-section">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by student name or submission title" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Cohort:</label>
            <select 
              value={selectedCohort} 
              onChange={(e) => setSelectedCohort(e.target.value)}
            >
              <option value="all">All Cohorts</option>
              {mockData.instructor.assignedCohorts.map((cohort, index) => (
                <option key={index} value={cohort}>{cohort}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Week:</label>
            <select 
              value={selectedWeek} 
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option value="all">All Weeks</option>
              {weeks.map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
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
          <div className="col-week">Week</div>
          <div className="col-title">Submission</div>
          <div className="col-date">Submitted</div>
          <div className="col-cohort">Cohort</div>
          <div className="col-status">Status</div>
          <div className="col-grade">Grade</div>
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
                <div className="col-week">Week {submission.week}</div>
                <div className="col-title">{submission.title}</div>
                <div className="col-date">{formatDateTime(submission.submittedAt)}</div>
                <div className="col-cohort">{submission.cohort}</div>
                <div className="col-status">
                  <span className={`status-badge status-${submission.status}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
                <div className="col-grade">
                  {submission.status === 'graded' ? `${submission.grade}/100` : '-'}
                </div>
                <div className="col-actions">
                  <Link href={`/secure/instructor/submissions/${submission.id}`}>
                    <button className="view-button">View</button>
                  </Link>
                  
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
  );
} 