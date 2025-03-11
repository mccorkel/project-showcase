'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for LMS integration
const mockData = {
  integrations: [
    {
      id: 'lms1',
      name: 'Canvas LMS',
      status: 'active',
      last_sync: '2023-10-15T08:30:00Z',
      api_endpoint: 'https://canvas.instructure.com/api/v1',
      api_key: '••••••••••••••••••••••••••••••',
      sync_frequency: 'daily',
      sync_schedule: '02:00 AM',
      entities_synced: ['students', 'instructors', 'courses', 'assignments', 'submissions'],
      sync_stats: {
        students: 120,
        instructors: 8,
        courses: 12,
        assignments: 86,
        submissions: 1240
      }
    },
    {
      id: 'lms2',
      name: 'Moodle',
      status: 'inactive',
      last_sync: '2023-09-30T10:15:00Z',
      api_endpoint: 'https://moodle.example.com/webservice/rest/server.php',
      api_key: '••••••••••••••••••••••••••••••',
      sync_frequency: 'manual',
      sync_schedule: null,
      entities_synced: ['students', 'instructors', 'courses'],
      sync_stats: {
        students: 45,
        instructors: 3,
        courses: 5,
        assignments: 0,
        submissions: 0
      }
    }
  ],
  sync_history: [
    {
      id: 'sync1',
      integration_id: 'lms1',
      integration_name: 'Canvas LMS',
      started_at: '2023-10-15T02:00:00Z',
      completed_at: '2023-10-15T02:15:23Z',
      status: 'success',
      entities_synced: {
        students: 120,
        instructors: 8,
        courses: 12,
        assignments: 86,
        submissions: 42
      },
      errors: []
    },
    {
      id: 'sync2',
      integration_id: 'lms1',
      integration_name: 'Canvas LMS',
      started_at: '2023-10-14T02:00:00Z',
      completed_at: '2023-10-14T02:14:45Z',
      status: 'success',
      entities_synced: {
        students: 120,
        instructors: 8,
        courses: 12,
        assignments: 86,
        submissions: 38
      },
      errors: []
    },
    {
      id: 'sync3',
      integration_id: 'lms1',
      integration_name: 'Canvas LMS',
      started_at: '2023-10-13T02:00:00Z',
      completed_at: '2023-10-13T02:18:12Z',
      status: 'partial',
      entities_synced: {
        students: 118,
        instructors: 8,
        courses: 12,
        assignments: 84,
        submissions: 35
      },
      errors: [
        'Failed to sync 2 student records due to missing email addresses',
        'Failed to sync 2 assignments due to API timeout'
      ]
    },
    {
      id: 'sync4',
      integration_id: 'lms2',
      integration_name: 'Moodle',
      started_at: '2023-09-30T10:00:00Z',
      completed_at: '2023-09-30T10:15:00Z',
      status: 'success',
      entities_synced: {
        students: 45,
        instructors: 3,
        courses: 5,
        assignments: 0,
        submissions: 0
      },
      errors: []
    }
  ],
  available_lms: [
    {
      id: 'canvas',
      name: 'Canvas LMS',
      logo: 'https://via.placeholder.com/100x50?text=Canvas',
      description: 'Integrate with Canvas LMS to sync students, instructors, courses, assignments, and submissions.'
    },
    {
      id: 'moodle',
      name: 'Moodle',
      logo: 'https://via.placeholder.com/100x50?text=Moodle',
      description: 'Integrate with Moodle to sync students, instructors, and courses.'
    },
    {
      id: 'blackboard',
      name: 'Blackboard Learn',
      logo: 'https://via.placeholder.com/100x50?text=Blackboard',
      description: 'Integrate with Blackboard Learn to sync students, instructors, courses, and assignments.'
    },
    {
      id: 'brightspace',
      name: 'D2L Brightspace',
      logo: 'https://via.placeholder.com/100x50?text=Brightspace',
      description: 'Integrate with D2L Brightspace to sync students, instructors, courses, and assignments.'
    }
  ]
};

export default function AdminLMSIntegrationPage() {
  const [activeTab, setActiveTab] = useState('integrations');
  const [selectedIntegration, setSelectedIntegration] = useState(mockData.integrations[0]?.id || '');
  
  // Format datetime for display
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Never';
    
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
  
  // Get the selected integration
  const integration = mockData.integrations.find(i => i.id === selectedIntegration);
  
  // Filter sync history for the selected integration
  const filteredSyncHistory = selectedIntegration 
    ? mockData.sync_history.filter(sync => sync.integration_id === selectedIntegration)
    : mockData.sync_history;
  
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <main className="admin-lms-integration-page">
        <div className="page-header">
          <h1>LMS Integration</h1>
          <p className="page-description">
            Configure and manage integrations with external Learning Management Systems.
          </p>
          <div className="header-actions">
            <button className="add-integration-button">Add New Integration</button>
          </div>
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            Integrations
          </button>
          <button 
            className={`tab-button ${activeTab === 'sync-history' ? 'active' : ''}`}
            onClick={() => setActiveTab('sync-history')}
          >
            Sync History
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'integrations' && (
            <div className="integrations-tab">
              <div className="integrations-list">
                {mockData.integrations.length === 0 ? (
                  <div className="empty-state">
                    <p>No LMS integrations configured.</p>
                    <button className="add-integration-button">Add New Integration</button>
                  </div>
                ) : (
                  mockData.integrations.map(integration => (
                    <div 
                      key={integration.id} 
                      className={`integration-card ${integration.status} ${selectedIntegration === integration.id ? 'selected' : ''}`}
                      onClick={() => setSelectedIntegration(integration.id)}
                    >
                      <div className="integration-header">
                        <h2>{integration.name}</h2>
                        <span className={`status-badge status-${integration.status}`}>
                          {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                        </span>
                      </div>
                      <div className="integration-details">
                        <div className="detail-item">
                          <span className="label">Last Sync:</span>
                          <span className="value">{formatDateTime(integration.last_sync)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Sync Frequency:</span>
                          <span className="value">{integration.sync_frequency.charAt(0).toUpperCase() + integration.sync_frequency.slice(1)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Entities Synced:</span>
                          <span className="value">{integration.entities_synced.length}</span>
                        </div>
                      </div>
                      <div className="integration-actions">
                        <button className="edit-button">Edit</button>
                        <button className="sync-now-button">Sync Now</button>
                        {integration.status === 'active' ? (
                          <button className="deactivate-button">Deactivate</button>
                        ) : (
                          <button className="activate-button">Activate</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {integration && (
                <div className="integration-details-panel">
                  <h2>Integration Details</h2>
                  
                  <div className="details-section">
                    <h3>Configuration</h3>
                    <div className="detail-group">
                      <div className="detail-item">
                        <span className="label">API Endpoint:</span>
                        <span className="value">{integration.api_endpoint}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">API Key:</span>
                        <span className="value">{integration.api_key}</span>
                        <button className="show-key-button">Show</button>
                      </div>
                      <div className="detail-item">
                        <span className="label">Sync Frequency:</span>
                        <span className="value">{integration.sync_frequency.charAt(0).toUpperCase() + integration.sync_frequency.slice(1)}</span>
                      </div>
                      {integration.sync_schedule && (
                        <div className="detail-item">
                          <span className="label">Sync Schedule:</span>
                          <span className="value">{integration.sync_schedule}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="details-section">
                    <h3>Entities Synced</h3>
                    <div className="entities-list">
                      {integration.entities_synced.map(entity => (
                        <div key={entity} className="entity-item">
                          <span className="entity-name">{entity.charAt(0).toUpperCase() + entity.slice(1)}</span>
                          <span className="entity-count">{integration.sync_stats[entity as keyof typeof integration.sync_stats]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="details-section">
                    <h3>Recent Syncs</h3>
                    <div className="recent-syncs">
                      {filteredSyncHistory.slice(0, 3).map(sync => (
                        <div key={sync.id} className={`sync-item status-${sync.status}`}>
                          <div className="sync-header">
                            <span className="sync-date">{formatDateTime(sync.started_at)}</span>
                            <span className={`sync-status status-${sync.status}`}>
                              {sync.status.charAt(0).toUpperCase() + sync.status.slice(1)}
                            </span>
                          </div>
                          <div className="sync-details">
                            <span className="sync-duration">
                              Duration: {
                                Math.round((new Date(sync.completed_at).getTime() - new Date(sync.started_at).getTime()) / 1000 / 60)
                              } minutes
                            </span>
                            <span className="entities-synced">
                              {Object.values(sync.entities_synced).reduce((a, b) => a + b, 0)} entities synced
                            </span>
                          </div>
                          {sync.errors.length > 0 && (
                            <div className="sync-errors">
                              <span className="error-count">{sync.errors.length} errors</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="details-actions">
                    <button className="edit-button">Edit Integration</button>
                    <button className="sync-now-button">Sync Now</button>
                    <button className="view-logs-button">View Logs</button>
                    <button className="delete-button">Delete Integration</button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'sync-history' && (
            <div className="sync-history-tab">
              <div className="filter-options">
                <div className="filter-group">
                  <label htmlFor="integration-select">Integration:</label>
                  <select 
                    id="integration-select"
                    value={selectedIntegration}
                    onChange={(e) => setSelectedIntegration(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Integrations</option>
                    {mockData.integrations.map(integration => (
                      <option key={integration.id} value={integration.id}>{integration.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="sync-history-list">
                <div className="list-header">
                  <div className="col-integration">Integration</div>
                  <div className="col-started">Started</div>
                  <div className="col-completed">Completed</div>
                  <div className="col-duration">Duration</div>
                  <div className="col-status">Status</div>
                  <div className="col-entities">Entities Synced</div>
                  <div className="col-actions">Actions</div>
                </div>
                
                <div className="list-body">
                  {filteredSyncHistory.map(sync => (
                    <div key={sync.id} className={`list-row status-${sync.status}`}>
                      <div className="col-integration">{sync.integration_name}</div>
                      <div className="col-started">{formatDateTime(sync.started_at)}</div>
                      <div className="col-completed">{formatDateTime(sync.completed_at)}</div>
                      <div className="col-duration">
                        {Math.round((new Date(sync.completed_at).getTime() - new Date(sync.started_at).getTime()) / 1000 / 60)} min
                      </div>
                      <div className="col-status">
                        <span className={`status-badge status-${sync.status}`}>
                          {sync.status.charAt(0).toUpperCase() + sync.status.slice(1)}
                        </span>
                      </div>
                      <div className="col-entities">
                        {Object.values(sync.entities_synced).reduce((a, b) => a + b, 0)}
                      </div>
                      <div className="col-actions">
                        <button className="view-details-button">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="settings-section">
                <h2>Global Settings</h2>
                <form className="settings-form">
                  <div className="form-group">
                    <label htmlFor="default-sync-frequency">Default Sync Frequency:</label>
                    <select id="default-sync-frequency" className="form-select">
                      <option value="hourly">Hourly</option>
                      <option value="daily" selected>Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="default-sync-time">Default Sync Time:</label>
                    <input type="time" id="default-sync-time" defaultValue="02:00" className="form-input" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="sync-timeout">Sync Timeout (minutes):</label>
                    <input type="number" id="sync-timeout" defaultValue="30" min="5" max="120" className="form-input" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="error-notification-email">Error Notification Email:</label>
                    <input type="email" id="error-notification-email" defaultValue="admin@example.com" className="form-input" />
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label>
                      <input type="checkbox" defaultChecked /> 
                      Send email notifications for failed syncs
                    </label>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label>
                      <input type="checkbox" defaultChecked /> 
                      Auto-retry failed syncs (up to 3 times)
                    </label>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="save-button">Save Settings</button>
                    <button type="button" className="reset-button">Reset to Defaults</button>
                  </div>
                </form>
              </div>
              
              <div className="settings-section">
                <h2>Available LMS Integrations</h2>
                <div className="available-lms-list">
                  {mockData.available_lms.map(lms => (
                    <div key={lms.id} className="lms-card">
                      <div className="lms-logo">
                        <img src={lms.logo} alt={lms.name} />
                      </div>
                      <div className="lms-info">
                        <h3>{lms.name}</h3>
                        <p>{lms.description}</p>
                      </div>
                      <div className="lms-actions">
                        <button className="setup-button">Set Up</button>
                        <button className="docs-button">Documentation</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
} 