'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for analytics
const mockAnalytics = {
  totalViews: 1247,
  uniqueVisitors: 856,
  averageTimeOnPage: '2m 34s',
  bounceRate: '32%',
  lastUpdated: '2023-10-15T14:30:00Z',
  viewsByDay: [
    { date: '2023-10-08', views: 42, uniqueVisitors: 31 },
    { date: '2023-10-09', views: 58, uniqueVisitors: 45 },
    { date: '2023-10-10', views: 75, uniqueVisitors: 62 },
    { date: '2023-10-11', views: 91, uniqueVisitors: 73 },
    { date: '2023-10-12', views: 120, uniqueVisitors: 95 },
    { date: '2023-10-13', views: 145, uniqueVisitors: 110 },
    { date: '2023-10-14', views: 168, uniqueVisitors: 125 },
    { date: '2023-10-15', views: 152, uniqueVisitors: 118 },
  ],
  projectViews: [
    { projectId: '1', title: 'JavaScript Game', views: 423, percentage: 34 },
    { projectId: '2', title: 'React Application', views: 356, percentage: 29 },
    { projectId: '3', title: 'HTML/CSS Portfolio', views: 289, percentage: 23 },
    { projectId: '4', title: 'Backend API', views: 179, percentage: 14 },
  ],
  referrers: [
    { source: 'Direct', count: 412, percentage: 33 },
    { source: 'LinkedIn', count: 325, percentage: 26 },
    { source: 'GitHub', count: 245, percentage: 20 },
    { source: 'Twitter', count: 156, percentage: 12 },
    { source: 'Other', count: 109, percentage: 9 },
  ],
  locations: [
    { country: 'United States', count: 523, percentage: 42 },
    { country: 'India', count: 198, percentage: 16 },
    { country: 'United Kingdom', count: 145, percentage: 12 },
    { country: 'Canada', count: 112, percentage: 9 },
    { country: 'Germany', count: 89, percentage: 7 },
    { country: 'Other', count: 180, percentage: 14 },
  ],
  devices: [
    { type: 'Desktop', count: 745, percentage: 60 },
    { type: 'Mobile', count: 412, percentage: 33 },
    { type: 'Tablet', count: 90, percentage: 7 },
  ]
};

export default function PersonalAnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format last updated time
  const formatLastUpdated = (dateString: string) => {
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
  
  return (
    <ProtectedRoute>
      <main className="analytics-page">
        <div className="page-header">
          <h1>Personal Analytics</h1>
          <div className="date-range-selector">
            <label htmlFor="date-range">Time Period:</label>
            <select 
              id="date-range" 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="alltime">All Time</option>
            </select>
          </div>
        </div>
        
        <div className="last-updated">
          Last updated: {formatLastUpdated(mockAnalytics.lastUpdated)}
        </div>
        
        <div className="analytics-summary">
          <div className="summary-card">
            <h3>Total Views</h3>
            <div className="summary-value">{mockAnalytics.totalViews}</div>
          </div>
          <div className="summary-card">
            <h3>Unique Visitors</h3>
            <div className="summary-value">{mockAnalytics.uniqueVisitors}</div>
          </div>
          <div className="summary-card">
            <h3>Avg. Time on Page</h3>
            <div className="summary-value">{mockAnalytics.averageTimeOnPage}</div>
          </div>
          <div className="summary-card">
            <h3>Bounce Rate</h3>
            <div className="summary-value">{mockAnalytics.bounceRate}</div>
          </div>
        </div>
        
        <div className="analytics-sections">
          <section className="analytics-section">
            <h2>Views Over Time</h2>
            <div className="chart-container">
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {mockAnalytics.viewsByDay.map((day) => (
                    <div key={day.date} className="chart-bar-group">
                      <div 
                        className="chart-bar views-bar" 
                        style={{ height: `${day.views / 2}px` }}
                        title={`Views: ${day.views}`}
                      ></div>
                      <div 
                        className="chart-bar visitors-bar" 
                        style={{ height: `${day.uniqueVisitors / 2}px` }}
                        title={`Unique Visitors: ${day.uniqueVisitors}`}
                      ></div>
                      <div className="chart-label">{formatDate(day.date)}</div>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color views-color"></div>
                    <div className="legend-label">Total Views</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color visitors-color"></div>
                    <div className="legend-label">Unique Visitors</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="analytics-section">
            <h2>Popular Projects</h2>
            <div className="projects-analytics">
              {mockAnalytics.projectViews.map((project) => (
                <div key={project.projectId} className="project-analytics-item">
                  <div className="project-title">{project.title}</div>
                  <div className="project-views">{project.views} views</div>
                  <div className="project-percentage-bar">
                    <div 
                      className="percentage-fill"
                      style={{ width: `${project.percentage}%` }}
                    ></div>
                  </div>
                  <div className="project-percentage">{project.percentage}%</div>
                </div>
              ))}
            </div>
          </section>
          
          <div className="analytics-row">
            <section className="analytics-section half-width">
              <h2>Traffic Sources</h2>
              <div className="pie-chart-placeholder">
                <div className="pie-chart-legend">
                  {mockAnalytics.referrers.map((referrer, index) => (
                    <div key={referrer.source} className="pie-legend-item">
                      <div 
                        className="pie-color" 
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                      ></div>
                      <div className="pie-label">{referrer.source}</div>
                      <div className="pie-value">{referrer.count} ({referrer.percentage}%)</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            <section className="analytics-section half-width">
              <h2>Visitor Locations</h2>
              <div className="table-container">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Visitors</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAnalytics.locations.map((location) => (
                      <tr key={location.country}>
                        <td>{location.country}</td>
                        <td>{location.count}</td>
                        <td>{location.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          
          <section className="analytics-section">
            <h2>Device Types</h2>
            <div className="devices-chart">
              {mockAnalytics.devices.map((device) => (
                <div key={device.type} className="device-bar-container">
                  <div className="device-label">{device.type}</div>
                  <div className="device-bar-wrapper">
                    <div 
                      className="device-bar"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                    <div className="device-percentage">{device.percentage}%</div>
                  </div>
                  <div className="device-count">{device.count} visitors</div>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="analytics-actions">
          <button className="primary-button">Export Report</button>
          <Link href="/secure/dashboard">
            <button className="secondary-button">Back to Dashboard</button>
          </Link>
        </div>
      </main>
    </ProtectedRoute>
  );
} 