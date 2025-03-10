'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function NewSubmissionPage() {
  const [formData, setFormData] = useState({
    week: '',
    title: '',
    description: '',
    demoLink: '',
    repoLink: '',
    deployedUrl: '',
    brainliftLink: '',
    socialPost: '',
    notes: '',
    technologies: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would save the submission to your API
    alert('Submission saved as draft!');
  };

  const handleSubmitForGrading = () => {
    // In a real implementation, this would submit the submission for grading
    alert('Submission submitted for grading!');
  };

  return (
    <ProtectedRoute>
      <main className="new-submission-page">
        <div className="page-header">
          <h1>Create New Submission</h1>
        </div>
        
        <form className="submission-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Project Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="week">Week</label>
                <select
                  id="week"
                  name="week"
                  value={formData.week}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Week</option>
                  <option value="1">Week 1</option>
                  <option value="2">Week 2</option>
                  <option value="3">Week 3</option>
                  <option value="4">Week 4</option>
                  <option value="5">Week 5</option>
                  <option value="6">Week 6</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="title">Project Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., React Weather App"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your project, its features, and what you learned"
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2>Project Links</h2>
            
            <div className="form-group">
              <label htmlFor="demoLink">Demo Link</label>
              <input
                type="url"
                id="demoLink"
                name="demoLink"
                value={formData.demoLink}
                onChange={handleChange}
                placeholder="URL to your project demo (e.g., YouTube, Loom)"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="repoLink">Repository Link</label>
              <input
                type="url"
                id="repoLink"
                name="repoLink"
                value={formData.repoLink}
                onChange={handleChange}
                placeholder="URL to your GitHub repository"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="deployedUrl">Deployed URL</label>
              <input
                type="url"
                id="deployedUrl"
                name="deployedUrl"
                value={formData.deployedUrl}
                onChange={handleChange}
                placeholder="URL to your deployed application (if applicable)"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="brainliftLink">BrainLift Link</label>
              <input
                type="url"
                id="brainliftLink"
                name="brainliftLink"
                value={formData.brainliftLink}
                onChange={handleChange}
                placeholder="URL to your project planning document"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="socialPost">Social Media Post</label>
              <input
                type="url"
                id="socialPost"
                name="socialPost"
                value={formData.socialPost}
                onChange={handleChange}
                placeholder="URL to your social media post about this project"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2>Additional Information</h2>
            
            <div className="form-group">
              <label htmlFor="technologies">Technologies Used</label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB (comma separated)"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes for Instructor</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional notes or context for your instructor"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="primary-button">Save as Draft</button>
            <button 
              type="button" 
              className="secondary-button"
              onClick={handleSubmitForGrading}
            >
              Submit for Grading
            </button>
            <Link href="/secure/submissions">
              <button type="button" className="tertiary-button">Cancel</button>
            </Link>
          </div>
        </form>
      </main>
    </ProtectedRoute>
  );
} 