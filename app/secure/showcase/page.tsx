'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for templates
const mockTemplates = [
  {
    id: '1',
    name: 'Modern Portfolio',
    description: 'A clean, modern design with emphasis on projects and skills.',
    thumbnailUrl: '/templates/modern-thumbnail.jpg',
    isActive: true
  },
  {
    id: '2',
    name: 'Creative Developer',
    description: 'A vibrant, creative design that showcases your personality.',
    thumbnailUrl: '/templates/creative-thumbnail.jpg',
    isActive: true
  },
  {
    id: '3',
    name: 'Minimal Resume',
    description: 'A minimalist design focused on professional experience.',
    thumbnailUrl: '/templates/minimal-thumbnail.jpg',
    isActive: true
  }
];

// Mock data for projects
const mockProjects = [
  {
    id: '1',
    title: 'HTML/CSS Portfolio',
    description: 'A responsive portfolio website built with HTML and CSS.',
    isIncluded: true,
    priority: 2
  },
  {
    id: '2',
    title: 'JavaScript Game',
    description: 'An interactive browser game built with vanilla JavaScript.',
    isIncluded: true,
    priority: 1
  },
  {
    id: '3',
    title: 'React Application',
    description: 'A full-featured React application with state management.',
    isIncluded: true,
    priority: 3
  },
  {
    id: '4',
    title: 'Backend API',
    description: 'A RESTful API built with Node.js and Express.',
    isIncluded: false,
    priority: 0
  }
];

export default function ShowcaseManagementPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('1');
  const [isPublic, setIsPublic] = useState(false);
  const [projects, setProjects] = useState(mockProjects);
  const [customization, setCustomization] = useState({
    themeColor: '#0070f3',
    accentColor: '#ff4081',
    fontPreference: 'modern',
    layoutPreference: 'grid'
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleToggleProject = (projectId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return { ...project, isIncluded: !project.isIncluded };
      }
      return project;
    }));
  };

  const handlePriorityChange = (projectId: string, priority: number) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return { ...project, priority };
      }
      return project;
    }));
  };

  const handleCustomizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePublish = () => {
    // In a real implementation, this would publish the showcase
    alert('Showcase published successfully!');
  };

  return (
    <ProtectedRoute>
      <main className="showcase-management-page">
        <div className="page-header">
          <h1>Showcase Management</h1>
          <div className="header-actions">
            <Link href="/secure/showcase/preview">
              <button className="secondary-button">Preview Showcase</button>
            </Link>
            <button 
              className="primary-button"
              onClick={handlePublish}
              disabled={!isPublic}
            >
              Publish Showcase
            </button>
          </div>
        </div>
        
        <div className="visibility-toggle">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={() => setIsPublic(!isPublic)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            Make Profile Public
            <span className="toggle-status">
              {isPublic ? 'Public' : 'Private'}
            </span>
          </span>
          <p className="toggle-description">
            {isPublic 
              ? 'Your showcase is visible to the public. Anyone with the link can view it.' 
              : 'Your showcase is private. Only you can view it.'}
          </p>
        </div>
        
        <div className="showcase-sections">
          <section className="template-section">
            <h2>Select Template</h2>
            <div className="templates-grid">
              {mockTemplates.map(template => (
                <div 
                  key={template.id}
                  className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="template-thumbnail">
                    <div className="placeholder-image"></div>
                  </div>
                  <div className="template-info">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="selected-badge">Selected</div>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          <section className="projects-section">
            <h2>Select Projects</h2>
            <p className="section-description">
              Choose which projects to include in your showcase and set their display order.
            </p>
            <div className="projects-list">
              {projects.map(project => (
                <div key={project.id} className="project-item">
                  <div className="project-toggle">
                    <input 
                      type="checkbox" 
                      id={`project-${project.id}`}
                      checked={project.isIncluded}
                      onChange={() => handleToggleProject(project.id)}
                    />
                    <label htmlFor={`project-${project.id}`}>
                      {project.title}
                    </label>
                  </div>
                  <div className="project-description">
                    {project.description}
                  </div>
                  <div className="project-priority">
                    <label htmlFor={`priority-${project.id}`}>Priority:</label>
                    <select 
                      id={`priority-${project.id}`}
                      value={project.priority}
                      onChange={(e) => handlePriorityChange(project.id, parseInt(e.target.value))}
                      disabled={!project.isIncluded}
                    >
                      <option value="0">Not Featured</option>
                      <option value="1">High</option>
                      <option value="2">Medium</option>
                      <option value="3">Low</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="customization-section">
            <h2>Customize Appearance</h2>
            <div className="customization-options">
              <div className="form-group">
                <label htmlFor="themeColor">Theme Color</label>
                <input 
                  type="color" 
                  id="themeColor" 
                  name="themeColor"
                  value={customization.themeColor}
                  onChange={handleCustomizationChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="accentColor">Accent Color</label>
                <input 
                  type="color" 
                  id="accentColor" 
                  name="accentColor"
                  value={customization.accentColor}
                  onChange={handleCustomizationChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fontPreference">Font Style</label>
                <select 
                  id="fontPreference" 
                  name="fontPreference"
                  value={customization.fontPreference}
                  onChange={handleCustomizationChange}
                >
                  <option value="modern">Modern Sans-Serif</option>
                  <option value="classic">Classic Serif</option>
                  <option value="minimal">Minimal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="layoutPreference">Layout Style</label>
                <select 
                  id="layoutPreference" 
                  name="layoutPreference"
                  value={customization.layoutPreference}
                  onChange={handleCustomizationChange}
                >
                  <option value="grid">Grid Layout</option>
                  <option value="list">List Layout</option>
                  <option value="cards">Card Layout</option>
                  <option value="masonry">Masonry Layout</option>
                </select>
              </div>
            </div>
          </section>
        </div>
        
        <div className="page-actions">
          <button className="primary-button" onClick={handlePublish} disabled={!isPublic}>
            Publish Showcase
          </button>
          <Link href="/secure/showcase/preview">
            <button className="secondary-button">Preview Showcase</button>
          </Link>
          <Link href="/secure/dashboard">
            <button className="tertiary-button">Back to Dashboard</button>
          </Link>
        </div>
      </main>
    </ProtectedRoute>
  );
} 