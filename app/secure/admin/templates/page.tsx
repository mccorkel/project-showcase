'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

// Mock data for template management
const mockData = {
  templates: [
    {
      id: 't1',
      name: 'Modern Portfolio',
      description: 'A clean, modern portfolio template with a minimalist design.',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Modern+Portfolio',
      created_at: '2023-05-15T10:30:00Z',
      updated_at: '2023-06-20T14:45:00Z',
      is_active: true,
      default_theme: 'light',
      features: ['Responsive', 'Dark/Light Mode', 'Project Gallery', 'Skills Section'],
      usage_count: 42
    },
    {
      id: 't2',
      name: 'Developer Showcase',
      description: 'A developer-focused template with code snippets and project highlights.',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Developer+Showcase',
      created_at: '2023-04-10T09:15:00Z',
      updated_at: '2023-07-05T11:20:00Z',
      is_active: true,
      default_theme: 'dark',
      features: ['Code Snippet Display', 'GitHub Integration', 'Tech Stack Visualization', 'Project Timeline'],
      usage_count: 38
    },
    {
      id: 't3',
      name: 'Creative Portfolio',
      description: 'A visually rich template for designers and creative professionals.',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Creative+Portfolio',
      created_at: '2023-03-22T13:40:00Z',
      updated_at: '2023-06-18T16:30:00Z',
      is_active: true,
      default_theme: 'light',
      features: ['Image Gallery', 'Animation Effects', 'Video Embedding', 'Case Studies'],
      usage_count: 27
    },
    {
      id: 't4',
      name: 'Data Science Portfolio',
      description: 'Specialized template for data scientists to showcase projects and visualizations.',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Data+Science+Portfolio',
      created_at: '2023-06-05T08:50:00Z',
      updated_at: '2023-07-12T10:15:00Z',
      is_active: true,
      default_theme: 'auto',
      features: ['Data Visualization', 'Jupyter Notebook Integration', 'Research Papers', 'Interactive Charts'],
      usage_count: 19
    },
    {
      id: 't5',
      name: 'Minimal Resume',
      description: 'A simple, text-focused template that resembles a traditional resume.',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Minimal+Resume',
      created_at: '2023-02-18T11:25:00Z',
      updated_at: '2023-04-30T09:40:00Z',
      is_active: false,
      default_theme: 'light',
      features: ['Print-Friendly', 'Skills Rating', 'Experience Timeline', 'PDF Download'],
      usage_count: 8
    }
  ]
};

export default function AdminTemplateManagementPage() {
  const [activeFilter, setActiveFilter] = useState('all');
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
  
  // Filter templates based on selected filter and search query
  const filteredTemplates = mockData.templates.filter(template => {
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && template.is_active) || 
      (activeFilter === 'inactive' && !template.is_active);
    
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  return (
    <main className="admin-template-management-page">
      <div className="page-header">
        <h1>Template Management</h1>
        <p className="page-description">
          Manage showcase templates available to students.
        </p>
        <div className="header-actions">
          <Link href="/secure/admin/templates/new">
            <button className="create-button">Create New Template</button>
          </Link>
          <button className="import-button">Import Template</button>
        </div>
      </div>
      
      <div className="filters-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Templates
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'active' ? 'active' : ''}`}
            onClick={() => setActiveFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setActiveFilter('inactive')}
          >
            Inactive
          </button>
        </div>
      </div>
      
      <div className="templates-grid">
        {filteredTemplates.length === 0 ? (
          <div className="empty-state">
            <p>No templates found matching your criteria.</p>
          </div>
        ) : (
          filteredTemplates.map(template => (
            <div key={template.id} className={`template-card ${template.is_active ? 'active' : 'inactive'}`}>
              <div className="template-thumbnail">
                <img src={template.thumbnail_url} alt={template.name} />
                {!template.is_active && (
                  <div className="inactive-overlay">
                    <span>Inactive</span>
                  </div>
                )}
              </div>
              
              <div className="template-content">
                <h2 className="template-name">{template.name}</h2>
                <p className="template-description">{template.description}</p>
                
                <div className="template-meta">
                  <div className="meta-item">
                    <span className="label">Created:</span> {formatDate(template.created_at)}
                  </div>
                  <div className="meta-item">
                    <span className="label">Updated:</span> {formatDate(template.updated_at)}
                  </div>
                  <div className="meta-item">
                    <span className="label">Theme:</span> {template.default_theme.charAt(0).toUpperCase() + template.default_theme.slice(1)}
                  </div>
                  <div className="meta-item">
                    <span className="label">Usage:</span> {template.usage_count} students
                  </div>
                </div>
                
                <div className="template-features">
                  {template.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
              
              <div className="template-actions">
                <Link href={`/secure/admin/templates/${template.id}`}>
                  <button className="view-button">View Details</button>
                </Link>
                <Link href={`/secure/admin/templates/${template.id}/edit`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button 
                  className={template.is_active ? "deactivate-button" : "activate-button"}
                >
                  {template.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="template-stats">
        <div className="stat-card">
          <h3>Total Templates</h3>
          <div className="stat-value">{mockData.templates.length}</div>
        </div>
        <div className="stat-card">
          <h3>Active Templates</h3>
          <div className="stat-value">{mockData.templates.filter(t => t.is_active).length}</div>
        </div>
        <div className="stat-card">
          <h3>Inactive Templates</h3>
          <div className="stat-value">{mockData.templates.filter(t => !t.is_active).length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Usage</h3>
          <div className="stat-value">{mockData.templates.reduce((sum, t) => sum + t.usage_count, 0)}</div>
        </div>
      </div>
    </main>
  );
} 