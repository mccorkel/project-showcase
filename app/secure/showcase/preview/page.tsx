'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function ShowcasePreviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewExpiry, setPreviewExpiry] = useState<Date | null>(null);
  
  useEffect(() => {
    // Simulate loading preview data
    const loadPreview = async () => {
      // In a real implementation, this would generate a preview and get the URL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set a mock preview URL and expiry time (24 hours from now)
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);
      
      setPreviewUrl('/preview-placeholder');
      setPreviewExpiry(expiryDate);
      setIsLoading(false);
    };
    
    loadPreview();
  }, []);
  
  const formatExpiryTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const handlePublish = () => {
    // In a real implementation, this would publish the showcase
    alert('Showcase published successfully!');
  };
  
  const handleRegeneratePreview = () => {
    setIsLoading(true);
    // Simulate regenerating the preview
    setTimeout(() => {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);
      
      setPreviewExpiry(expiryDate);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <ProtectedRoute>
      <main className="showcase-preview-page">
        <div className="page-header">
          <h1>Showcase Preview</h1>
          <div className="header-actions">
            <button 
              className="primary-button"
              onClick={handlePublish}
            >
              Publish Showcase
            </button>
            <Link href="/secure/showcase">
              <button className="secondary-button">Edit Showcase</button>
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="preview-loading">
            <div className="loading-spinner"></div>
            <p>Generating preview...</p>
            <p className="loading-description">
              This may take a few moments as we prepare your showcase preview.
            </p>
          </div>
        ) : (
          <>
            <div className="preview-info">
              <div className="preview-expiry">
                <span className="expiry-label">Preview expires:</span>
                <span className="expiry-time">
                  {previewExpiry ? formatExpiryTime(previewExpiry) : 'N/A'}
                </span>
                <button 
                  className="regenerate-button"
                  onClick={handleRegeneratePreview}
                >
                  Regenerate Preview
                </button>
              </div>
              <div className="preview-url">
                <span className="url-label">Preview URL:</span>
                <span className="url-value">{previewUrl}</span>
                <button 
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText(previewUrl)}
                >
                  Copy URL
                </button>
              </div>
            </div>
            
            <div className="preview-frame-container">
              <div className="preview-toolbar">
                <div className="preview-controls">
                  <button className="control-button">Desktop</button>
                  <button className="control-button">Tablet</button>
                  <button className="control-button">Mobile</button>
                </div>
                <button className="refresh-button">Refresh</button>
              </div>
              
              <div className="preview-frame">
                <div className="preview-placeholder">
                  <h2>Showcase Preview</h2>
                  <p>This is a placeholder for your showcase preview.</p>
                  <p>In the actual implementation, an iframe would be displayed here showing your showcase.</p>
                  
                  <div className="preview-content">
                    <div className="preview-header">
                      <div className="preview-profile-image"></div>
                      <div className="preview-profile-info">
                        <h3>John Doe</h3>
                        <p>Full Stack Developer</p>
                      </div>
                    </div>
                    
                    <div className="preview-section">
                      <h4>About Me</h4>
                      <p>A passionate developer with experience in web and mobile applications.</p>
                    </div>
                    
                    <div className="preview-section">
                      <h4>Projects</h4>
                      <div className="preview-projects">
                        <div className="preview-project">
                          <h5>JavaScript Game</h5>
                          <p>An interactive browser game built with vanilla JavaScript.</p>
                        </div>
                        <div className="preview-project">
                          <h5>HTML/CSS Portfolio</h5>
                          <p>A responsive portfolio website built with HTML and CSS.</p>
                        </div>
                        <div className="preview-project">
                          <h5>React Application</h5>
                          <p>A full-featured React application with state management.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="preview-section">
                      <h4>Skills</h4>
                      <div className="preview-skills">
                        <span className="preview-skill">JavaScript</span>
                        <span className="preview-skill">React</span>
                        <span className="preview-skill">Node.js</span>
                        <span className="preview-skill">HTML/CSS</span>
                        <span className="preview-skill">AWS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="page-actions">
          <button 
            className="primary-button"
            onClick={handlePublish}
          >
            Publish Showcase
          </button>
          <Link href="/secure/showcase">
            <button className="secondary-button">Edit Showcase</button>
          </Link>
          <Link href="/secure/dashboard">
            <button className="tertiary-button">Back to Dashboard</button>
          </Link>
        </div>
      </main>
    </ProtectedRoute>
  );
} 