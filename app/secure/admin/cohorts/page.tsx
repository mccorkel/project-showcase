'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for cohort management
const mockData = {
  cohorts: [
    {
      id: 'c1',
      name: 'Web Development - Fall 2023',
      status: 'active',
      startDate: '2023-09-01T00:00:00Z',
      endDate: '2023-12-15T00:00:00Z',
      studentCount: 24,
      instructors: ['Jane Smith', 'John Doe'],
      progress: '75%',
      currentWeek: 9,
      totalWeeks: 12
    },
    {
      id: 'c2',
      name: 'Web Development - Spring 2023',
      status: 'completed',
      startDate: '2023-01-15T00:00:00Z',
      endDate: '2023-05-30T00:00:00Z',
      studentCount: 18,
      instructors: ['Jane Smith', 'Robert Johnson'],
      progress: '100%',
      currentWeek: 12,
      totalWeeks: 12
    },
    {
      id: 'c3',
      name: 'Web Development - Summer 2023',
      status: 'completed',
      startDate: '2023-06-01T00:00:00Z',
      endDate: '2023-08-31T00:00:00Z',
      studentCount: 15,
      instructors: ['John Doe'],
      progress: '100%',
      currentWeek: 12,
      totalWeeks: 12
    },
    {
      id: 'c4',
      name: 'Data Science - Spring 2023',
      status: 'completed',
      startDate: '2023-01-15T00:00:00Z',
      endDate: '2023-05-30T00:00:00Z',
      studentCount: 18,
      instructors: ['Robert Johnson'],
      progress: '100%',
      currentWeek: 12,
      totalWeeks: 12
    },
    {
      id: 'c5',
      name: 'UX Design - Summer 2023',
      status: 'completed',
      startDate: '2023-06-01T00:00:00Z',
      endDate: '2023-08-31T00:00:00Z',
      studentCount: 15,
      instructors: ['Michael Wilson'],
      progress: '100%',
      currentWeek: 12,
      totalWeeks: 12
    },
    {
      id: 'c6',
      name: 'Data Science - Fall 2023',
      status: 'active',
      startDate: '2023-09-01T00:00:00Z',
      endDate: '2023-12-15T00:00:00Z',
      studentCount: 20,
      instructors: ['Robert Johnson'],
      progress: '75%',
      currentWeek: 9,
      totalWeeks: 12
    },
    {
      id: 'c7',
      name: 'UX Design - Fall 2023',
      status: 'active',
      startDate: '2023-09-01T00:00:00Z',
      endDate: '2023-12-15T00:00:00Z',
      studentCount: 16,
      instructors: ['Michael Wilson'],
      progress: '75%',
      currentWeek: 9,
      totalWeeks: 12
    },
    {
      id: 'c8',
      name: 'Web Development - Winter 2024',
      status: 'upcoming',
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-04-30T00:00:00Z',
      studentCount: 0,
      instructors: [],
      progress: '0%',
      currentWeek: 0,
      totalWeeks: 12
    }
  ],
  programs: [
    'Web Development',
    'Data Science',
    'UX Design'
  ]
};

export default function AdminCohortManagementPage() {
  const [selectedProgram, setSelectedProgram] = useState('all');
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
  
  // Filter cohorts based on selected filters
  const filteredCohorts = mockData.cohorts.filter(cohort => {
    const matchesProgram = selectedProgram === 'all' || cohort.name.includes(selectedProgram);
    const matchesStatus = selectedStatus === 'all' || cohort.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      cohort.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesProgram && matchesStatus && matchesSearch;
  });
  
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <main className="admin-cohort-management-page">
        <div className="page-header">
          <h1>Cohort Management</h1>
          <p className="page-description">
            View and manage all cohorts in the system.
          </p>
          <div className="header-actions">
            <button className="create-button">Create New Cohort</button>
            <button className="import-button">Import Cohorts</button>
          </div>
        </div>
        
        <div className="filters-section">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search cohorts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="program-select">Program:</label>
              <select 
                id="program-select"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Programs</option>
                {mockData.programs.map((program, index) => (
                  <option key={index} value={program}>{program}</option>
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
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="cohorts-grid">
          {filteredCohorts.length === 0 ? (
            <div className="empty-state">
              <p>No cohorts found matching your criteria.</p>
            </div>
          ) : (
            filteredCohorts.map(cohort => (
              <div key={cohort.id} className={`cohort-card status-${cohort.status}`}>
                <div className="cohort-header">
                  <h2 className="cohort-name">{cohort.name}</h2>
                  <span className={`status-badge status-${cohort.status}`}>
                    {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)}
                  </span>
                </div>
                
                <div className="cohort-details">
                  <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span className="value">{formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Students:</span>
                    <span className="value">{cohort.studentCount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Instructors:</span>
                    <span className="value">
                      {cohort.instructors.length > 0 ? cohort.instructors.join(', ') : 'None assigned'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Progress:</span>
                    <span className="value">{cohort.progress}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Current Week:</span>
                    <span className="value">{cohort.currentWeek} of {cohort.totalWeeks}</span>
                  </div>
                </div>
                
                <div className="cohort-actions">
                  <Link href={`/secure/admin/cohorts/${cohort.id}`}>
                    <button className="view-button">View Details</button>
                  </Link>
                  <button className="edit-button">Edit</button>
                  {cohort.status === 'upcoming' && (
                    <button className="assign-button">Assign Instructors</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="pagination">
          <button className="pagination-button" disabled>Previous</button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-button" disabled>Next</button>
        </div>
      </main>
    </ProtectedRoute>
  );
} 