'use client';

import React, { useState } from 'react';
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
    id: '101',
    name: 'E-commerce Website',
    description: 'A full-featured e-commerce platform built with React and Node.js.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    thumbnailUrl: '/projects/ecommerce-thumbnail.jpg',
    isSelected: true,
    priority: 1
  },
  {
    id: '102',
    name: 'Weather App',
    description: 'A weather application that displays current conditions and forecasts.',
    technologies: ['JavaScript', 'HTML/CSS', 'Weather API'],
    thumbnailUrl: '/projects/weather-thumbnail.jpg',
    isSelected: true,
    priority: 2
  },
  {
    id: '103',
    name: 'Task Management Tool',
    description: 'A productivity application for managing tasks and projects.',
    technologies: ['React', 'Firebase', 'Material UI'],
    thumbnailUrl: '/projects/task-thumbnail.jpg',
    isSelected: false,
    priority: 3
  },
  {
    id: '104',
    name: 'Portfolio Website',
    description: 'A personal portfolio website showcasing my skills and projects.',
    technologies: ['HTML/CSS', 'JavaScript', 'Bootstrap'],
    thumbnailUrl: '/projects/portfolio-thumbnail.jpg',
    isSelected: true,
    priority: 4
  }
];

export default function ShowcaseManagementPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0].id);
  const [projects, setProjects] = useState(mockProjects);
  const [isPublic, setIsPublic] = useState(false);
  const [customization, setCustomization] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    fontFamily: 'modern',
    layoutPreference: 'grid'
  });
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  
  const handleToggleProject = (projectId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, isSelected: !project.isSelected }
        : project
    ));
  };
  
  const handlePriorityChange = (projectId: string, priority: number) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, priority }
        : project
    ));
  };
  
  const handleCustomizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomization({
      ...customization,
      [name]: value
    });
  };
  
  const handlePublish = () => {
    // In a real implementation, this would save the showcase configuration
    // and publish it to a public URL
    alert('Showcase published successfully!');
  };
  
  return (
    <main className="showcase-management-page">
      <div className="page-header">
        <h1>Showcase Management</h1>
        <div className="header-actions">
          <div className="visibility-toggle">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
              <span className="slider round"></span>
            </label>
            <span className="visibility-label">
              {isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="showcase-editor">
        <section className="template-selection">
          <h2>Choose a Template</h2>
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
                  <div className="selected-badge">✓</div>
                )}
              </div>
            ))}
          </div>
        </section>
        
        <section className="project-selection">
          <h2>Select Projects</h2>
          <p className="section-description">
            Choose the projects you want to display in your showcase and arrange them in order of priority.
          </p>
          
          <div className="projects-list">
            {projects
              .sort((a, b) => a.priority - b.priority)
              .map(project => (
                <div key={project.id} className="project-item">
                  <div className="project-selection-toggle">
                    <input 
                      type="checkbox" 
                      id={`project-${project.id}`}
                      checked={project.isSelected}
                      onChange={() => handleToggleProject(project.id)}
                    />
                    <label htmlFor={`project-${project.id}`}></label>
                  </div>
                  
                  <div className="project-thumbnail">
                    <div className="placeholder-image"></div>
                  </div>
                  
                  <div className="project-info">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="project-technologies">
                      {project.technologies.map(tech => (
                        <span key={tech} className="technology-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="project-priority">
                    <label htmlFor={`priority-${project.id}`}>Priority:</label>
                    <select 
                      id={`priority-${project.id}`}
                      value={project.priority}
                      onChange={(e) => handlePriorityChange(project.id, parseInt(e.target.value))}
                      disabled={!project.isSelected}
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
          </div>
        </section>
        
        <section className="customization-options">
          <h2>Customize Appearance</h2>
          <p className="section-description">
            Personalize your showcase with your preferred colors, fonts, and layout options.
          </p>
          
          <div className="customization-form">
            <div className="form-group">
              <label htmlFor="primaryColor">Primary Color</label>
              <input 
                type="color" 
                id="primaryColor" 
                name="primaryColor"
                value={customization.primaryColor}
                onChange={handleCustomizationChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="secondaryColor">Secondary Color</label>
              <input 
                type="color" 
                id="secondaryColor" 
                name="secondaryColor"
                value={customization.secondaryColor}
                onChange={handleCustomizationChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fontFamily">Font Family</label>
              <select 
                id="fontFamily" 
                name="fontFamily"
                value={customization.fontFamily}
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
  );
} 