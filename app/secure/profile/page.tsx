'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function ProfileManagementPage() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    title: 'Full Stack Developer',
    bio: 'A passionate developer with experience in web and mobile applications.',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    portfolio: 'https://johndoe.dev'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would save the profile data to your API
    alert('Profile saved successfully!');
  };

  return (
    <ProtectedRoute>
      <main className="profile-management-page">
        <h1>Profile Management</h1>
        
        <div className="profile-container">
          <div className="profile-image-section">
            <div className="profile-image-placeholder">
              <span>Profile Image</span>
            </div>
            <button className="upload-button">Upload New Image</button>
          </div>
          
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="title">Professional Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2>Contact Information</h2>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2>Social Links</h2>
              
              <div className="form-group">
                <label htmlFor="github">GitHub</label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="portfolio">Portfolio</label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="primary-button">Save Profile</button>
              <Link href="/secure/dashboard">
                <button type="button" className="secondary-button">Cancel</button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
} 