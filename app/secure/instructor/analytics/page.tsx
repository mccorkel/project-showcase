'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for cohort analytics
const mockData = {
  instructor: {
    name: 'Jane Smith',
    assignedCohorts: ['Web Development - Fall 2023', 'Data Science - Spring 2023']
  },
  cohortAnalytics: [
    {
      cohortName: 'Web Development - Fall 2023',
      studentCount: 24,
      submissionStats: {
        total: 144,
        completed: 120,
        pending: 24,
        passingRate: '87%'
      },
      weeklyProgress: [
        { week: 1, completed: 24, passing: 24, rate: '100%' },
        { week: 2, completed: 24, passing: 22, rate: '92%' },
        { week: 3, completed: 24, passing: 21, rate: '88%' },
        { week: 4, completed: 24, passing: 20, rate: '83%' },
        { week: 5, completed: 24, passing: 22, rate: '92%' },
        { week: 6, completed: 0, passing: 0, rate: '0%' }
      ],
      showcaseStats: {
        published: 18,
        unpublished: 6,
        publishedRate: '75%',
        totalViews: 1240,
        averageViewsPerShowcase: 69
      },
      topPerformers: [
        { id: '102', name: 'Maria Garcia', passingRate: '100%', showcaseViews: 145 },
        { id: '104', name: 'Sarah Chen', passingRate: '95%', showcaseViews: 120 },
        { id: '101', name: 'Alex Johnson', passingRate: '87%', showcaseViews: 98 }
      ]
    },
    {
      cohortName: 'Data Science - Spring 2023',
      studentCount: 18,
      submissionStats: {
        total: 108,
        completed: 108,
        pending: 0,
        passingRate: '92%'
      },
      weeklyProgress: [
        { week: 1, completed: 18, passing: 18, rate: '100%' },
        { week: 2, completed: 18, passing: 17, rate: '94%' },
        { week: 3, completed: 18, passing: 16, rate: '89%' },
        { week: 4, completed: 18, passing: 17, rate: '94%' },
        { week: 5, completed: 18, passing: 16, rate: '89%' },
        { week: 6, completed: 18, passing: 17, rate: '94%' }
      ],
      showcaseStats: {
        published: 15,
        unpublished: 3,
        publishedRate: '83%',
        totalViews: 980,
        averageViewsPerShowcase: 65
      },
      topPerformers: [
        { id: '201', name: 'David Kim', passingRate: '94%', showcaseViews: 112 },
        { id: '202', name: 'Emily Brown', passingRate: '89%', showcaseViews: 98 },
        { id: '203', name: 'Michael Lee', passingRate: '94%', showcaseViews: 87 }
      ]
    }
  ]
};

export default function CohortAnalyticsPage() {
  const [selectedCohort, setSelectedCohort] = useState(mockData.cohortAnalytics[0].cohortName);
  
  // Get the selected cohort data
  const cohortData = mockData.cohortAnalytics.find(cohort => cohort.cohortName === selectedCohort);
  
  return (
    <ProtectedRoute requiredRoles={['instructor']}>
      <main className="cohort-analytics-page">
        <div className="page-header">
          <h1>Cohort Analytics</h1>
          <p className="page-description">
            View analytics and performance metrics for your assigned cohorts.
          </p>
        </div>
        
        <div className="cohort-selector">
          <label htmlFor="cohort-select">Select Cohort:</label>
          <select 
            id="cohort-select"
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="cohort-select"
          >
            {mockData.cohortAnalytics.map((cohort, index) => (
              <option key={index} value={cohort.cohortName}>{cohort.cohortName}</option>
            ))}
          </select>
        </div>
        
        {cohortData && (
          <div className="analytics-content">
            <section className="overview-section">
              <h2>Cohort Overview</h2>
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>Students</h3>
                  <div className="card-value">{cohortData.studentCount}</div>
                </div>
                <div className="overview-card">
                  <h3>Submissions</h3>
                  <div className="card-value">{cohortData.submissionStats.total}</div>
                  <div className="card-subtext">
                    {cohortData.submissionStats.completed} completed, {cohortData.submissionStats.pending} pending
                  </div>
                </div>
                <div className="overview-card">
                  <h3>Passing Rate</h3>
                  <div className="card-value">{cohortData.submissionStats.passingRate}</div>
                </div>
                <div className="overview-card">
                  <h3>Showcases Published</h3>
                  <div className="card-value">{cohortData.showcaseStats.publishedRate}</div>
                  <div className="card-subtext">
                    {cohortData.showcaseStats.published} of {cohortData.studentCount} students
                  </div>
                </div>
              </div>
            </section>
            
            <section className="weekly-progress-section">
              <h2>Weekly Progress</h2>
              <div className="progress-chart">
                <div className="chart-header">
                  <div className="col-week">Week</div>
                  <div className="col-completed">Completed</div>
                  <div className="col-passing">Passing</div>
                  <div className="col-rate">Pass Rate</div>
                </div>
                
                {cohortData.weeklyProgress.map((week, index) => (
                  <div key={index} className="progress-row">
                    <div className="col-week">Week {week.week}</div>
                    <div className="col-completed">{week.completed}/{cohortData.studentCount}</div>
                    <div className="col-passing">{week.passing}</div>
                    <div className="col-rate">{week.rate}</div>
                  </div>
                ))}
              </div>
              
              <div className="chart-placeholder">
                <p className="placeholder-message">
                  In the full implementation, this section would include interactive charts visualizing weekly progress.
                </p>
              </div>
            </section>
            
            <section className="showcase-analytics-section">
              <h2>Showcase Analytics</h2>
              <div className="showcase-stats">
                <div className="stat-card">
                  <h3>Total Views</h3>
                  <div className="stat-value">{cohortData.showcaseStats.totalViews}</div>
                </div>
                <div className="stat-card">
                  <h3>Average Views</h3>
                  <div className="stat-value">{cohortData.showcaseStats.averageViewsPerShowcase}</div>
                  <div className="stat-subtext">per showcase</div>
                </div>
              </div>
              
              <div className="chart-placeholder">
                <p className="placeholder-message">
                  In the full implementation, this section would include charts showing showcase engagement over time.
                </p>
              </div>
            </section>
            
            <section className="top-performers-section">
              <h2>Top Performers</h2>
              <div className="performers-list">
                {cohortData.topPerformers.map((student, index) => (
                  <div key={student.id} className="performer-card">
                    <div className="performer-rank">{index + 1}</div>
                    <div className="performer-info">
                      <h3 className="performer-name">
                        <Link href={`/secure/instructor/students/${student.id}`}>
                          {student.name}
                        </Link>
                      </h3>
                      <div className="performer-stats">
                        <div className="stat">
                          <span className="stat-label">Passing Rate:</span>
                          <span className="stat-value">{student.passingRate}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Showcase Views:</span>
                          <span className="stat-value">{student.showcaseViews}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <div className="actions-section">
              <Link href={`/secure/instructor/cohorts/${encodeURIComponent(selectedCohort)}`}>
                <button className="view-cohort-button">View Cohort Details</button>
              </Link>
              <button className="export-button">Export Analytics</button>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
} 