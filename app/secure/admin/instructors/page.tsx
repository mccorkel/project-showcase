'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for instructor management
const mockData = {
  instructors: [
    {
      id: '301',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      status: 'active',
      joinDate: '2022-01-15T00:00:00Z',
      lastActive: '2023-10-16T09:30:00Z',
      assignedCohorts: ['Web Development - Fall 2023', 'Web Development - Spring 2023'],
      specialization: 'Web Development',
      totalStudents: 42
    },
    {
      id: '302',
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'active',
      joinDate: '2022-01-15T00:00:00Z',
      lastActive: '2023-10-15T14:45:00Z',
      assignedCohorts: ['Web Development - Fall 2023'],
      specialization: 'Frontend Development',
      totalStudents: 24
    },
    {
      id: '303',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      status: 'active',
      joinDate: '2022-06-01T00:00:00Z',
      lastActive: '2023-10-16T11:20:00Z',
      assignedCohorts: ['Data Science - Spring 2023'],
      specialization: 'Data Science',
      totalStudents: 18
    },
    {
      id: '304',
      name: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      status: 'inactive',
      joinDate: '2022-06-01T00:00:00Z',
      lastActive: '2023-09-30T16:15:00Z',
      assignedCohorts: [],
      specialization: 'UX Design',
      totalStudents: 0
    },
    {
      id: '305',
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      status: 'active',
      joinDate: '2023-01-10T00:00:00Z',
      lastActive: '2023-10-15T10:05:00Z',
      assignedCohorts: ['UX Design - Summer 2023'],
      specialization: 'UX/UI Design',
      totalStudents: 15
    }
  ],
  specializations: [
    'Web Development',
    'Frontend Development',
    'Backend Development',
    'Data Science',
    'UX/UI Design',
    'Mobile Development'
  ]
};

export default function AdminInstructorManagementPage() {
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
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
  
  // Filter instructors based on selected filters
  const filteredInstructors = mockData.instructors.filter(instructor => {
    const matchesSpecialization = selectedSpecialization === 'all' || instructor.specialization === selectedSpecialization;
    const matchesStatus = selectedStatus === 'all' || instructor.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSpecialization && matchesStatus && matchesSearch;
  });
  
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <main className="admin-instructor-management-page">
        <div className="page-header">
          <h1>Instructor Management</h1>
          <p className="page-description">
            View and manage all instructors in the system.
          </p>
          <div className="header-actions">
            <button className="create-button">Create New Instructor</button>
            <button className="import-button">Import Instructors</button>
          </div>
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
          
          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="specialization-select">Specialization:</label>
              <select 
                id="specialization-select"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Specializations</option>
                {mockData.specializations.map((specialization, index) => (
                  <option key={index} value={specialization}>{specialization}</option>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="instructors-table">
          <div className="table-header">
            <div className="col-name">Name</div>
            <div className="col-email">Email</div>
            <div className="col-specialization">Specialization</div>
            <div className="col-status">Status</div>
            <div className="col-cohorts">Assigned Cohorts</div>
            <div className="col-students">Students</div>
            <div className="col-joined">Joined</div>
            <div className="col-activity">Last Active</div>
            <div className="col-actions">Actions</div>
          </div>
          
          {filteredInstructors.length === 0 ? (
            <div className="empty-state">
              <p>No instructors found matching your criteria.</p>
            </div>
          ) : (
            <div className="table-body">
              {filteredInstructors.map(instructor => (
                <div key={instructor.id} className="table-row">
                  <div className="col-name">{instructor.name}</div>
                  <div className="col-email">{instructor.email}</div>
                  <div className="col-specialization">{instructor.specialization}</div>
                  <div className="col-status">
                    <span className={`status-badge status-${instructor.status}`}>
                      {instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-cohorts">
                    {instructor.assignedCohorts.length > 0 ? (
                      <span>{instructor.assignedCohorts.length} cohort(s)</span>
                    ) : (
                      <span className="no-cohorts">None</span>
                    )}
                  </div>
                  <div className="col-students">{instructor.totalStudents}</div>
                  <div className="col-joined">{formatDate(instructor.joinDate)}</div>
                  <div className="col-activity">{formatDateTime(instructor.lastActive)}</div>
                  <div className="col-actions">
                    <Link href={`/secure/admin/instructors/${instructor.id}`}>
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
    </ProtectedRoute>
  );
} 