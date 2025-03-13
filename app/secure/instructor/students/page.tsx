'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

// Mock data for student list
const mockData = {
  instructor: {
    name: 'Jane Smith',
    assignedCohorts: ['Web Development - Fall 2023', 'Data Science - Spring 2023']
  },
  students: [
    {
      id: '101',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      cohort: 'Web Development - Fall 2023',
      submissionsCompleted: 8,
      submissionsPending: 1,
      passingRate: '87%',
      lastActive: '2023-10-15T10:30:00Z',
      showcasePublished: true
    },
    {
      id: '102',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      cohort: 'Web Development - Fall 2023',
      submissionsCompleted: 9,
      submissionsPending: 0,
      passingRate: '100%',
      lastActive: '2023-10-16T14:20:00Z',
      showcasePublished: true
    },
    {
      id: '103',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      cohort: 'Web Development - Fall 2023',
      submissionsCompleted: 7,
      submissionsPending: 2,
      passingRate: '85%',
      lastActive: '2023-10-14T09:15:00Z',
      showcasePublished: false
    },
    {
      id: '104',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      cohort: 'Web Development - Fall 2023',
      submissionsCompleted: 9,
      submissionsPending: 0,
      passingRate: '95%',
      lastActive: '2023-10-16T11:45:00Z',
      showcasePublished: true
    },
    {
      id: '201',
      name: 'David Kim',
      email: 'david.kim@example.com',
      cohort: 'Data Science - Spring 2023',
      submissionsCompleted: 18,
      submissionsPending: 0,
      passingRate: '94%',
      lastActive: '2023-10-15T16:30:00Z',
      showcasePublished: true
    },
    {
      id: '202',
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      cohort: 'Data Science - Spring 2023',
      submissionsCompleted: 18,
      submissionsPending: 0,
      passingRate: '89%',
      lastActive: '2023-10-14T13:45:00Z',
      showcasePublished: true
    }
  ]
};

export default function StudentListPage() {
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Format date for display
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
  
  // Filter students based on selected cohort and search query
  const filteredStudents = mockData.students.filter(student => {
    const matchesCohort = selectedCohort === 'all' || student.cohort === selectedCohort;
    const matchesSearch = searchQuery === '' || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCohort && matchesSearch;
  });
  
  return (
    <main className="instructor-student-list-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <Link href="/secure/instructor/dashboard">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>
      
      <div className="filters-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="cohort-filter">
          <label htmlFor="cohort-select">Filter by Cohort:</label>
          <select 
            id="cohort-select"
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="cohort-select"
          >
            <option value="all">All Cohorts</option>
            {mockData.instructor.assignedCohorts.map((cohort, index) => (
              <option key={index} value={cohort}>{cohort}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="students-table">
        <div className="table-header">
          <div className="col-name">Name</div>
          <div className="col-email">Email</div>
          <div className="col-cohort">Cohort</div>
          <div className="col-submissions">Submissions</div>
          <div className="col-passing">Passing Rate</div>
          <div className="col-showcase">Showcase</div>
          <div className="col-activity">Last Active</div>
          <div className="col-actions">Actions</div>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>No students found matching your criteria.</p>
          </div>
        ) : (
          <div className="table-body">
            {filteredStudents.map(student => (
              <div key={student.id} className="table-row">
                <div className="col-name">{student.name}</div>
                <div className="col-email">{student.email}</div>
                <div className="col-cohort">{student.cohort}</div>
                <div className="col-submissions">
                  {student.submissionsCompleted} completed
                  {student.submissionsPending > 0 && (
                    <span className="pending-badge">
                      {student.submissionsPending} pending
                    </span>
                  )}
                </div>
                <div className="col-passing">{student.passingRate}</div>
                <div className="col-showcase">
                  {student.showcasePublished ? (
                    <span className="status-published">Published</span>
                  ) : (
                    <span className="status-unpublished">Not Published</span>
                  )}
                </div>
                <div className="col-activity">{formatDateTime(student.lastActive)}</div>
                <div className="col-actions">
                  <Link href={`/secure/instructor/students/${student.id}`}>
                    <button className="view-button">View</button>
                  </Link>
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
    </main>
  );
} 