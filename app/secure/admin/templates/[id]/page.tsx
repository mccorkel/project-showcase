'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for template detail
const mockData = {
  template: {
    id: 't1',
    name: 'Modern Portfolio',
    description: 'A clean, modern portfolio template with a minimalist design. Perfect for showcasing projects with a focus on visual presentation.',
    thumbnail_url: 'https://via.placeholder.com/800x400?text=Modern+Portfolio',
    created_at: '2023-05-15T10:30:00Z',
    updated_at: '2023-06-20T14:45:00Z',
    is_active: true,
    default_theme: 'light',
    features: ['Responsive', 'Dark/Light Mode', 'Project Gallery', 'Skills Section', 'Contact Form', 'Social Media Integration'],
    template_files: {
      html: 's3://template-bucket/modern-portfolio/index.html',
      css: 's3://template-bucket/modern-portfolio/style.css',
      js: 's3://template-bucket/modern-portfolio/script.js'
    },
    customization_options: {
      colors: [
        {
          id: 'default',
          name: 'Default',
          primary: '#4a6cf7',
          secondary: '#f3f4fe',
          accent: '#ff6b6b',
          background: '#ffffff',
          text: '#212529'
        },
        {
          id: 'ocean',
          name: 'Ocean',
          primary: '#0077b6',
          secondary: '#caf0f8',
          accent: '#fb8500',
          background: '#f8f9fa',
          text: '#212529'
        },
        {
          id: 'forest',
          name: 'Forest',
          primary: '#2d6a4f',
          secondary: '#d8f3dc',
          accent: '#e76f51',
          background: '#f8f9fa',
          text: '#212529'
        }
      ],
      fonts: [
        {
          id: 'default',
          name: 'Default',
          heading: 'Poppins, sans-serif',
          body: 'Inter, sans-serif'
        },
        {
          id: 'classic',
          name: 'Classic',
          heading: 'Playfair Display, serif',
          body: 'Source Sans Pro, sans-serif'
        },
        {
          id: 'modern',
          name: 'Modern',
          heading: 'Montserrat, sans-serif',
          body: 'Open Sans, sans-serif'
        }
      ],
      layouts: [
        {
          id: 'standard',
          name: 'Standard',
          description: 'Traditional layout with header, sections, and footer'
        },
        {
          id: 'cards',
          name: 'Cards',
          description: 'Card-based layout for project showcasing'
        },
        {
          id: 'minimal',
          name: 'Minimal',
          description: 'Simplified layout with minimal decoration'
        }
      ]
    },
    usage_stats: {
      total_usage: 42,
      active_showcases: 38,
      average_rating: 4.7,
      student_feedback: [
        {
          student_name: 'Alex Johnson',
          rating: 5,
          comment: 'Love the clean design and easy customization options!'
        },
        {
          student_name: 'Maria Garcia',
          rating: 4,
          comment: 'Great template, would like more color options though.'
        },
        {
          student_name: 'James Wilson',
          rating: 5,
          comment: 'Perfect for showcasing my web development projects.'
        }
      ]
    },
    version_history: [
      {
        version: '1.2',
        released_at: '2023-06-20T14:45:00Z',
        changes: ['Added dark mode support', 'Improved mobile responsiveness', 'Fixed contact form validation']
      },
      {
        version: '1.1',
        released_at: '2023-05-30T09:20:00Z',
        changes: ['Added two new color schemes', 'Improved project gallery layout', 'Fixed footer alignment issues']
      },
      {
        version: '1.0',
        released_at: '2023-05-15T10:30:00Z',
        changes: ['Initial release']
      }
    ]
  }
};

export default function AdminTemplateDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format datetime for display
  const formatDateTime = (dateString: string) => {
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
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real implementation, this would save the changes to the server
    alert('Changes saved successfully');
  };
  
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <main className="admin-template-detail-page">
        <div className="page-header">
          <Link href="/secure/admin/templates" className="back-link">
            ← Back to Templates
          </Link>
          <div className="header-content">
            <div className="template-info">
              <h1>{mockData.template.name}</h1>
              <div className="template-meta">
                <span className={`status-badge status-${mockData.template.is_active ? 'active' : 'inactive'}`}>
                  {mockData.template.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="meta-item">
                  <span className="label">Created:</span> {formatDate(mockData.template.created_at)}
                </span>
                <span className="meta-item">
                  <span className="label">Last Updated:</span> {formatDate(mockData.template.updated_at)}
                </span>
                <span className="meta-item">
                  <span className="label">Version:</span> {mockData.template.version_history[0].version}
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Template'}
              </button>
              <button className="preview-button">Preview Template</button>
              <button 
                className={mockData.template.is_active ? "deactivate-button" : "activate-button"}
              >
                {mockData.template.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="template-thumbnail-large">
          <img src={mockData.template.thumbnail_url} alt={mockData.template.name} />
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'customization' ? 'active' : ''}`}
            onClick={() => setActiveTab('customization')}
          >
            Customization Options
          </button>
          <button 
            className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            Template Code
          </button>
          <button 
            className={`tab-button ${activeTab === 'usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            Usage Statistics
          </button>
          <button 
            className={`tab-button ${activeTab === 'versions' ? 'active' : ''}`}
            onClick={() => setActiveTab('versions')}
          >
            Version History
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {isEditing ? (
                <form className="edit-form" onSubmit={handleSubmit}>
                  <div className="form-section">
                    <h2>Basic Information</h2>
                    <div className="form-group">
                      <label htmlFor="name-input">Template Name:</label>
                      <input 
                        id="name-input"
                        type="text"
                        defaultValue={mockData.template.name}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description-textarea">Description:</label>
                      <textarea 
                        id="description-textarea"
                        defaultValue={mockData.template.description}
                        rows={4}
                        className="form-textarea"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="thumbnail-input">Thumbnail URL:</label>
                      <input 
                        id="thumbnail-input"
                        type="text"
                        defaultValue={mockData.template.thumbnail_url}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status-select">Status:</label>
                      <select 
                        id="status-select"
                        defaultValue={mockData.template.is_active ? 'active' : 'inactive'}
                        className="form-select"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="theme-select">Default Theme:</label>
                      <select 
                        id="theme-select"
                        defaultValue={mockData.template.default_theme}
                        className="form-select"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System Preference)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h2>Features</h2>
                    <div className="form-group">
                      <label htmlFor="features-input">Features (comma-separated):</label>
                      <input 
                        id="features-input"
                        type="text"
                        defaultValue={mockData.template.features.join(', ')}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="save-button">Save Changes</button>
                    <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <section className="overview-section">
                    <h2>Description</h2>
                    <p>{mockData.template.description}</p>
                  </section>
                  
                  <section className="overview-section">
                    <h2>Features</h2>
                    <div className="features-list">
                      {mockData.template.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </section>
                  
                  <section className="overview-section">
                    <h2>Template Files</h2>
                    <div className="file-list">
                      <div className="file-item">
                        <span className="file-name">HTML Template</span>
                        <span className="file-path">{mockData.template.template_files.html}</span>
                        <button className="view-file-button">View</button>
                      </div>
                      <div className="file-item">
                        <span className="file-name">CSS Stylesheet</span>
                        <span className="file-path">{mockData.template.template_files.css}</span>
                        <button className="view-file-button">View</button>
                      </div>
                      <div className="file-item">
                        <span className="file-name">JavaScript</span>
                        <span className="file-path">{mockData.template.template_files.js}</span>
                        <button className="view-file-button">View</button>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'customization' && (
            <div className="customization-tab">
              <section className="customization-section">
                <h2>Color Schemes</h2>
                <div className="color-schemes">
                  {mockData.template.customization_options.colors.map(scheme => (
                    <div key={scheme.id} className="color-scheme-card">
                      <h3>{scheme.name}</h3>
                      <div className="color-swatches">
                        <div className="color-swatch" style={{ backgroundColor: scheme.primary }}>
                          <span className="color-label">Primary</span>
                          <span className="color-value">{scheme.primary}</span>
                        </div>
                        <div className="color-swatch" style={{ backgroundColor: scheme.secondary }}>
                          <span className="color-label">Secondary</span>
                          <span className="color-value">{scheme.secondary}</span>
                        </div>
                        <div className="color-swatch" style={{ backgroundColor: scheme.accent }}>
                          <span className="color-label">Accent</span>
                          <span className="color-value">{scheme.accent}</span>
                        </div>
                        <div className="color-swatch" style={{ backgroundColor: scheme.background }}>
                          <span className="color-label">Background</span>
                          <span className="color-value">{scheme.background}</span>
                        </div>
                        <div className="color-swatch" style={{ backgroundColor: scheme.text, color: scheme.background }}>
                          <span className="color-label">Text</span>
                          <span className="color-value">{scheme.text}</span>
                        </div>
                      </div>
                      <div className="scheme-actions">
                        <button className="edit-scheme-button">Edit</button>
                        {scheme.id !== 'default' && (
                          <button className="delete-scheme-button">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="add-scheme-card">
                    <button className="add-scheme-button">+ Add Color Scheme</button>
                  </div>
                </div>
              </section>
              
              <section className="customization-section">
                <h2>Font Options</h2>
                <div className="font-options">
                  {mockData.template.customization_options.fonts.map(font => (
                    <div key={font.id} className="font-option-card">
                      <h3>{font.name}</h3>
                      <div className="font-samples">
                        <div className="font-sample heading-sample" style={{ fontFamily: font.heading }}>
                          <span className="font-label">Heading</span>
                          <span className="font-value">{font.heading}</span>
                          <span className="sample-text">The quick brown fox jumps over the lazy dog</span>
                        </div>
                        <div className="font-sample body-sample" style={{ fontFamily: font.body }}>
                          <span className="font-label">Body</span>
                          <span className="font-value">{font.body}</span>
                          <span className="sample-text">The quick brown fox jumps over the lazy dog</span>
                        </div>
                      </div>
                      <div className="font-actions">
                        <button className="edit-font-button">Edit</button>
                        {font.id !== 'default' && (
                          <button className="delete-font-button">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="add-font-card">
                    <button className="add-font-button">+ Add Font Option</button>
                  </div>
                </div>
              </section>
              
              <section className="customization-section">
                <h2>Layout Options</h2>
                <div className="layout-options">
                  {mockData.template.customization_options.layouts.map(layout => (
                    <div key={layout.id} className="layout-option-card">
                      <h3>{layout.name}</h3>
                      <p>{layout.description}</p>
                      <div className="layout-preview">
                        <div className="layout-placeholder">
                          Layout preview placeholder
                        </div>
                      </div>
                      <div className="layout-actions">
                        <button className="edit-layout-button">Edit</button>
                        {layout.id !== 'standard' && (
                          <button className="delete-layout-button">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="add-layout-card">
                    <button className="add-layout-button">+ Add Layout Option</button>
                  </div>
                </div>
              </section>
            </div>
          )}
          
          {activeTab === 'code' && (
            <div className="code-tab">
              <div className="code-editor-placeholder">
                <p className="placeholder-message">
                  In the full implementation, this tab would contain code editors for HTML, CSS, and JavaScript files.
                </p>
                <div className="code-actions">
                  <button className="save-code-button" disabled>Save Changes</button>
                  <button className="validate-code-button" disabled>Validate</button>
                  <button className="reset-code-button" disabled>Reset to Default</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'usage' && (
            <div className="usage-tab">
              <section className="usage-stats-section">
                <h2>Usage Statistics</h2>
                <div className="stats-cards">
                  <div className="stat-card">
                    <h3>Total Usage</h3>
                    <div className="stat-value">{mockData.template.usage_stats.total_usage}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Active Showcases</h3>
                    <div className="stat-value">{mockData.template.usage_stats.active_showcases}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Average Rating</h3>
                    <div className="stat-value">{mockData.template.usage_stats.average_rating}/5</div>
                  </div>
                </div>
              </section>
              
              <section className="student-feedback-section">
                <h2>Student Feedback</h2>
                <div className="feedback-list">
                  {mockData.template.usage_stats.student_feedback.map((feedback, index) => (
                    <div key={index} className="feedback-item">
                      <div className="feedback-header">
                        <span className="student-name">{feedback.student_name}</span>
                        <span className="rating">
                          {'★'.repeat(feedback.rating)}
                          {'☆'.repeat(5 - feedback.rating)}
                        </span>
                      </div>
                      <p className="feedback-comment">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="usage-chart-section">
                <h2>Usage Over Time</h2>
                <div className="chart-placeholder">
                  <p className="placeholder-message">
                    In the full implementation, this section would display charts showing template usage over time.
                  </p>
                </div>
              </section>
            </div>
          )}
          
          {activeTab === 'versions' && (
            <div className="versions-tab">
              <div className="versions-header">
                <h2>Version History</h2>
                <button className="create-version-button">Create New Version</button>
              </div>
              
              <div className="version-timeline">
                {mockData.template.version_history.map((version, index) => (
                  <div key={index} className={`version-item ${index === 0 ? 'current' : ''}`}>
                    <div className="version-marker"></div>
                    <div className="version-content">
                      <div className="version-header">
                        <h3>Version {version.version}</h3>
                        <span className="version-date">{formatDateTime(version.released_at)}</span>
                        {index === 0 && <span className="current-badge">Current</span>}
                      </div>
                      <div className="version-changes">
                        <h4>Changes:</h4>
                        <ul>
                          {version.changes.map((change, changeIndex) => (
                            <li key={changeIndex}>{change}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="version-actions">
                        <button className="view-version-button">View</button>
                        {index !== 0 && (
                          <button className="restore-version-button">Restore</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
} 