'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for existing templates
const mockTemplates = [
  {
    id: '1',
    name: 'Modern Portfolio',
    description: 'A clean, modern design with emphasis on projects and skills.',
    thumbnailUrl: '/templates/modern-thumbnail.jpg',
    isActive: true,
    createdBy: 'System',
    createdAt: '2023-08-15T10:30:00Z',
    isSystem: true
  },
  {
    id: '2',
    name: 'Creative Developer',
    description: 'A vibrant, creative design that showcases your personality.',
    thumbnailUrl: '/templates/creative-thumbnail.jpg',
    isActive: true,
    createdBy: 'System',
    createdAt: '2023-08-15T10:30:00Z',
    isSystem: true
  },
  {
    id: '3',
    name: 'Minimal Resume',
    description: 'A minimalist design focused on professional experience.',
    thumbnailUrl: '/templates/minimal-thumbnail.jpg',
    isActive: true,
    createdBy: 'System',
    createdAt: '2023-08-15T10:30:00Z',
    isSystem: true
  },
  {
    id: '4',
    name: 'My Custom Template',
    description: 'A custom template created for my personal use.',
    thumbnailUrl: '/templates/custom-thumbnail.jpg',
    isActive: true,
    createdBy: 'John Doe',
    createdAt: '2023-10-05T14:45:00Z',
    isSystem: false
  }
];

export default function TemplateCreationPage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{profile.first_name}} {{profile.last_name}}'s Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <div class="profile-header">
      <img src="{{profile.profile_image_url}}" alt="Profile Image" class="profile-image">
      <h1>{{profile.first_name}} {{profile.last_name}}</h1>
      <p class="title">{{profile.title}}</p>
    </div>
  </header>
  
  <main>
    <section id="about">
      <h2>About Me</h2>
      <p>{{profile.bio}}</p>
    </section>
    
    <section id="projects">
      <h2>Projects</h2>
      <div class="projects-grid">
        {% for project in projects %}
        <div class="project-card">
          <h3>{{project.title}}</h3>
          <p>{{project.summary}}</p>
          <div class="project-links">
            <a href="{{project.github_url}}" target="_blank">GitHub</a>
            <a href="{{project.deployed_url}}" target="_blank">Live Demo</a>
          </div>
        </div>
        {% endfor %}
      </div>
    </section>
    
    <section id="skills">
      <h2>Skills</h2>
      <div class="skills-container">
        {% for skill_category in profile.skills %}
        <div class="skill-category">
          <h3>{{skill_category.category}}</h3>
          <ul class="skills-list">
            {% for skill in skill_category.skills %}
            <li>{{skill}}</li>
            {% endfor %}
          </ul>
        </div>
        {% endfor %}
      </div>
    </section>
  </main>
  
  <footer>
    <p>&copy; {{current_year}} {{profile.first_name}} {{profile.last_name}}</p>
    <div class="social-links">
      {% if profile.social_links.github %}
      <a href="{{profile.social_links.github}}" target="_blank">GitHub</a>
      {% endif %}
      {% if profile.social_links.linkedin %}
      <a href="{{profile.social_links.linkedin}}" target="_blank">LinkedIn</a>
      {% endif %}
      {% if profile.social_links.twitter %}
      <a href="{{profile.social_links.twitter}}" target="_blank">Twitter</a>
      {% endif %}
    </div>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`,
    cssContent: `/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

a {
  color: #0070f3;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Header styles */
header {
  background-color: #fff;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-header {
  max-width: 800px;
  margin: 0 auto;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.2rem;
  color: #666;
}

/* Main content styles */
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

section {
  margin-bottom: 3rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #0070f3;
  padding-bottom: 0.5rem;
}

/* Projects section */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.project-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.project-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* Skills section */
.skills-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-category h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.skills-list {
  list-style-type: none;
}

.skills-list li {
  background-color: #e9ecef;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  margin: 0.25rem;
}

/* Footer styles */
footer {
  background-color: #333;
  color: #fff;
  padding: 2rem;
  text-align: center;
}

footer a {
  color: #fff;
  margin: 0 0.5rem;
}

.social-links {
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .projects-grid,
  .skills-container {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}`,
    jsContent: `// Add any JavaScript functionality here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Portfolio template loaded');
  
  // Example: Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
});`
  });
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would save the template to your API
    alert('Template created successfully!');
  };
  
  const handlePreviewTemplate = () => {
    // In a real implementation, this would generate a preview of the template
    alert('Template preview functionality would be implemented here.');
  };
  
  return (
    <ProtectedRoute>
      <main className="templates-page">
        <div className="page-header">
          <h1>Template Management</h1>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Templates
          </button>
          <button 
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Template
          </button>
        </div>
        
        {activeTab === 'browse' && (
          <div className="browse-templates">
            <div className="templates-grid">
              {mockTemplates.map(template => (
                <div 
                  key={template.id}
                  className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="template-thumbnail">
                    <div className="placeholder-image"></div>
                    {template.isSystem && (
                      <div className="system-badge">System</div>
                    )}
                  </div>
                  <div className="template-info">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <div className="template-meta">
                      <span>Created by: {template.createdBy}</span>
                      <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="template-actions">
                      <button className="action-button">Use Template</button>
                      {!template.isSystem && (
                        <button className="action-button">Edit</button>
                      )}
                      <button className="action-button">Preview</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'create' && (
          <div className="create-template">
            <form className="template-form" onSubmit={handleCreateTemplate}>
              <div className="form-section">
                <h2>Template Information</h2>
                <div className="form-group">
                  <label htmlFor="name">Template Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newTemplate.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Modern Developer Portfolio"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTemplate.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe your template"
                    required
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h2>HTML Template</h2>
                <p className="section-description">
                  Use double curly braces for variables (e.g., {'{{profile.first_name}}'}) and 
                  block tags for loops and conditionals (e.g., {'{% for project in projects %}'}).
                </p>
                <div className="form-group">
                  <label htmlFor="htmlContent">HTML Content</label>
                  <textarea
                    id="htmlContent"
                    name="htmlContent"
                    value={newTemplate.htmlContent}
                    onChange={handleInputChange}
                    rows={15}
                    className="code-editor"
                    required
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h2>CSS Styles</h2>
                <div className="form-group">
                  <label htmlFor="cssContent">CSS Content</label>
                  <textarea
                    id="cssContent"
                    name="cssContent"
                    value={newTemplate.cssContent}
                    onChange={handleInputChange}
                    rows={15}
                    className="code-editor"
                    required
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h2>JavaScript (Optional)</h2>
                <div className="form-group">
                  <label htmlFor="jsContent">JavaScript Content</label>
                  <textarea
                    id="jsContent"
                    name="jsContent"
                    value={newTemplate.jsContent}
                    onChange={handleInputChange}
                    rows={10}
                    className="code-editor"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="primary-button">Create Template</button>
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={handlePreviewTemplate}
                >
                  Preview Template
                </button>
                <Link href="/secure/dashboard">
                  <button type="button" className="tertiary-button">Cancel</button>
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
} 