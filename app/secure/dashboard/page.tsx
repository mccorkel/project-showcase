'use client';

import React from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <h1>Student Dashboard</h1>
      
      <section className="dashboard-summary">
        <div className="summary-card">
          <h3>Profile Completion</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: '75%' }}></div>
          </div>
          <p>75% Complete</p>
          <Link href="/secure/profile">
            <button className="action-button">Complete Profile</button>
          </Link>
        </div>
        
        <div className="summary-card">
          <h3>Submissions</h3>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">3</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-number">2</span>
              <span className="stat-label">Graded</span>
            </div>
            <div className="stat">
              <span className="stat-number">1</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <Link href="/secure/submissions">
            <button className="action-button">View Submissions</button>
          </Link>
        </div>
        
        <div className="summary-card">
          <h3>Showcase</h3>
          <p>Your showcase is <span className="status-badge">Not Published</span></p>
          <Link href="/secure/showcase">
            <button className="action-button">Manage Showcase</button>
          </Link>
        </div>
      </section>
      
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <h4>Submission Graded</h4>
              <p>Your Week 3 submission has been graded.</p>
              <span className="activity-time">2 days ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🚀</div>
            <div className="activity-content">
              <h4>New Submission</h4>
              <p>You submitted your Week 4 project.</p>
              <span className="activity-time">5 days ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <h4>Profile Updated</h4>
              <p>You updated your profile information.</p>
              <span className="activity-time">1 week ago</span>
            </div>
          </div>
        </div>
      </section>
      
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link href="/secure/submissions/new">
            <button className="primary-button">Create New Submission</button>
          </Link>
          <Link href="/secure/showcase/preview">
            <button className="secondary-button">Preview Showcase</button>
          </Link>
          <Link href="/secure/profile">
            <button className="secondary-button">Edit Profile</button>
          </Link>
        </div>
      </section>
    </main>
  );
} 