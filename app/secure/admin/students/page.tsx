'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

// Mock data for student management
const mockData = {
  students: [
    {
      id: '101',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      cohort: 'Web Development - Fall 2023',
      status: 'active',
      joinDate: '2023-09-01T00:00:00Z',
      lastActive: '2023-10-15T10:30:00Z',
      submissionsCompleted: 8,
      passingRate: '87%',
      showcasePublished: true
    },
    {
      id: '102',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      cohort: 'Web Development - Fall 2023',
      status: 'active',
      joinDate: '2023-09-01T00:00:00Z',
      lastActive: '2023-10-16T14:20:00Z',
      submissionsCompleted: 9,
      passingRate: '100%',
      showcasePublished: true
    },
    {
      id: '103',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      cohort: 'Web Development - Fall 2023',
      status: 'active',
      joinDate: '2023-09-01T00:00:00Z',
      lastActive: '2023-10-14T09:15:00Z',
      submissionsCompleted: 7,
      passingRate: '85%',
      showcasePublished: false
    },
    {
      id: '104',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      cohort: 'Web Development - Fall 2023',
      status: 'active',
      joinDate: '2023-09-01T00:00:00Z',
      lastActive: '2023-10-16T11:45:00Z',
      submissionsCompleted: 9,
      passingRate: '95%',
      showcasePublished: true
    },
    {
      id: '201',
      name: 'David Kim',
      email: 'david.kim@example.com',
      cohort: 'Data Science - Spring 2023',
      status: 'active',
      joinDate: '2023-01-15T00:00:00Z',
      lastActive: '2023-10-15T16:30:00Z',
      submissionsCompleted: 18,
      passingRate: '94%',
      showcasePublished: true
    },
    {
      id: '202',
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      cohort: 'Data Science - Spring 2023',
      status: 'inactive',
      joinDate: '2023-01-15T00:00:00Z',
      lastActive: '2023-10-14T13:45:00Z',
      submissionsCompleted: 18,
      passingRate: '89%',
      showcasePublished: true
    },
    {
      id: '203',
      name: 'Michael Lee',
      email: 'michael.lee@example.com',
      cohort: 'Data Science - Spring 2023',
      status: 'active',
      joinDate: '2023-01-15T00:00:00Z',
      lastActive: '2023-10-14T10:15:00Z',
      submissionsCompleted: 18,
      passingRate: '94%',
      showcasePublished: true
    }
  ],
  cohorts: [
    'All Cohorts',
    'Web Development - Fall 2023',
    'Data Science - Fall 2023',
    'UX Design - Fall 2023',
    'Web Development - Summer 2023',
    'Web Development - Spring 2023'
  ]
};

export default function AdminStudentManagementPage() {
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
  
  // Filter students based on selected criteria
  const filteredStudents = mockData.students.filter(student => {
    // Filter by cohort
    if (selectedCohort !== 'all' && student.cohort !== selectedCohort) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus !== 'all' && student.status !== selectedStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !student.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <main className="admin-student-management-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <div className="header-actions">
          <Link href="/secure/admin/dashboard">
            <button className="secondary-button">Back to Dashboard</button>
          </Link>
        </div>
      </div>
      
      <div className="filters-section">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by name or email" 
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
              {mockData.cohorts.slice(1).map(cohort => (
                <option key={cohort} value={cohort}>{cohort}</option>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="students-table">
        <div className="table-header">
          <div className="col-name">Name</div>
          <div className="col-email">Email</div>
          <div className="col-cohort">Cohort</div>
          <div className="col-status">Status</div>
          <div className="col-joined">Joined</div>
          <div className="col-activity">Last Active</div>
          <div className="col-submissions">Submissions</div>
          <div className="col-showcase">Showcase</div>
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
                <div className="col-status">
                  <span className={`status-badge status-${student.status}`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </div>
                <div className="col-joined">{formatDate(student.joinDate)}</div>
                <div className="col-activity">{formatDateTime(student.lastActive)}</div>
                <div className="col-submissions">
                  {student.submissionsCompleted} ({student.passingRate})
                </div>
                <div className="col-showcase">
                  {student.showcasePublished ? (
                    <span className="status-published">Published</span>
                  ) : (
                    <span className="status-unpublished">Not Published</span>
                  )}
                </div>
                <div className="col-actions">
                  <Link href={`/secure/admin/students/${student.id}`}>
                    <button className="view-button">View</button>
                  </Link>
                  <button className="edit-button">Edit</button>
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
          <button className="bulk-action-button" disabled>Assign to Cohort</button>
          <button className="bulk-action-button" disabled>Change Status</button>
          <button className="bulk-action-button" disabled>Export Selected</button>
        </div>
      </div>
    </main>
  );
}
