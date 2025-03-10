'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for submissions
const mockSubmissions = [
  {
    id: '1',
    week: 1,
    title: 'HTML/CSS Portfolio',
    status: 'graded',
    grade: 'A',
    passing: true,
    submittedAt: '2023-09-10T14:30:00Z',
    gradedAt: '2023-09-12T10:15:00Z'
  },
  {
    id: '2',
    week: 2,
    title: 'JavaScript Game',
    status: 'graded',
    grade: 'B+',
    passing: true,
    submittedAt: '2023-09-17T16:45:00Z',
    gradedAt: '2023-09-19T11:30:00Z'
  },
  {
    id: '3',
    week: 3,
    title: 'React Application',
    status: 'submitted',
    grade: null,
    passing: null,
    submittedAt: '2023-09-24T18:20:00Z',
    gradedAt: null
  },
  {
    id: '4',
    week: 4,
    title: 'Backend API',
    status: 'draft',
    grade: null,
    passing: null,
    submittedAt: null,
    gradedAt: null
  }
];

export default function SubmissionsListPage() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('week');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter submissions based on status
  const filteredSubmissions = mockSubmissions.filter(submission => {
    if (filter === 'all') return true;
    return submission.status === filter;
  });

  // Sort submissions based on selected criteria
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    let aValue, bValue;
    
    if (sortBy === 'week') {
      aValue = a.week;
      bValue = b.week;
    } else if (sortBy === 'submittedAt') {
      aValue = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      bValue = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
    } else if (sortBy === 'gradedAt') {
      aValue = a.gradedAt ? new Date(a.gradedAt).getTime() : 0;
      bValue = b.gradedAt ? new Date(b.gradedAt).getTime() : 0;
    } else {
      aValue = a[sortBy as keyof typeof a];
      bValue = b[sortBy as keyof typeof b];
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ProtectedRoute>
      <main className="submissions-page">
        <div className="page-header">
          <h1>My Submissions</h1>
          <Link href="/secure/submissions/new">
            <button className="primary-button">Create New Submission</button>
          </Link>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select 
              id="status-filter" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-by">Sort By:</label>
            <select 
              id="sort-by" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="week">Week</option>
              <option value="submittedAt">Submission Date</option>
              <option value="gradedAt">Graded Date</option>
              <option value="status">Status</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-order">Order:</label>
            <select 
              id="sort-order" 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        <div className="submissions-list">
          <div className="submissions-header">
            <div className="submission-cell">Week</div>
            <div className="submission-cell">Title</div>
            <div className="submission-cell">Status</div>
            <div className="submission-cell">Grade</div>
            <div className="submission-cell">Submitted</div>
            <div className="submission-cell">Actions</div>
          </div>
          
          {sortedSubmissions.length === 0 ? (
            <div className="no-submissions">
              <p>No submissions found matching the selected filters.</p>
            </div>
          ) : (
            sortedSubmissions.map(submission => (
              <div key={submission.id} className={`submission-row status-${submission.status}`}>
                <div className="submission-cell">Week {submission.week}</div>
                <div className="submission-cell">{submission.title}</div>
                <div className="submission-cell">
                  <span className={`status-badge ${submission.status}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
                <div className="submission-cell">{submission.grade || 'N/A'}</div>
                <div className="submission-cell">{formatDate(submission.submittedAt)}</div>
                <div className="submission-cell">
                  <Link href={`/secure/submissions/${submission.id}`}>
                    <button className="action-button">View</button>
                  </Link>
                  {submission.status === 'draft' && (
                    <Link href={`/secure/submissions/${submission.id}`}>
                      <button className="action-button">Edit</button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
} 