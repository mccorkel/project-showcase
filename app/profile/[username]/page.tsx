'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    // Simulate loading profile data
    const loadProfile = async () => {
      // In a real implementation, you would fetch the profile data from your API
      // For this placeholder, we'll simulate a delay and then set some state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate profile existence and visibility
      setProfileExists(true);
      setIsPublic(true);
      setIsLoading(false);
    };

    loadProfile();
  }, [username]);

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="loading">Loading profile...</div>
      </main>
    );
  }

  if (!profileExists) {
    return (
      <main className="profile-page">
        <div className="not-found">
          <h1>Profile Not Found</h1>
          <p>The profile for {username} does not exist.</p>
          <Link href="/">Return to Home</Link>
        </div>
      </main>
    );
  }

  if (!isPublic) {
    return (
      <main className="profile-page">
        <div className="private-profile">
          <h1>Private Profile</h1>
          <p>This profile is set to private by the user.</p>
          <Link href="/">Return to Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-header">
        <div className="profile-image-placeholder"></div>
        <h1>{username}'s Portfolio</h1>
        <p className="profile-title">Student Developer</p>
      </div>

      <section className="about-section">
        <h2>About Me</h2>
        <p>This is a placeholder for the user's bio. In the actual implementation, this would display the user's personal information, background, and interests.</p>
      </section>

      <section className="projects-section">
        <h2>Projects</h2>
        <div className="projects-grid">
          <div className="project-card">
            <h3>Project 1</h3>
            <p>Project description would go here.</p>
          </div>
          <div className="project-card">
            <h3>Project 2</h3>
            <p>Project description would go here.</p>
          </div>
          <div className="project-card">
            <h3>Project 3</h3>
            <p>Project description would go here.</p>
          </div>
        </div>
      </section>

      <section className="skills-section">
        <h2>Skills</h2>
        <div className="skills-list">
          <span className="skill-tag">React</span>
          <span className="skill-tag">JavaScript</span>
          <span className="skill-tag">HTML/CSS</span>
          <span className="skill-tag">Node.js</span>
          <span className="skill-tag">AWS</span>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact</h2>
        <p>For more information, please contact me at: placeholder@example.com</p>
      </section>
    </main>
  );
} 