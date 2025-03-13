'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

// Mock data for student detail
const mockData = {
  student: {
    id: '101',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    cohort: 'Web Development - Fall 2023',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinDate: '2023-09-01T00:00:00Z',
    lastActive: '2023-10-15T10:30:00Z',
    bio: 'Full-stack developer with a passion for creating intuitive user experiences. Currently focused on mastering React and Node.js.',
    location: 'San Francisco, CA',
    socialLinks: {
      github: 'https://github.com/alexjohnson',
      linkedin: 'https://linkedin.com/in/alexjohnson',
      twitter: 'https://twitter.com/alexjohnson',
      portfolio: 'https://alexjohnson.dev'
    },
    skills: [
      { category: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
      { category: 'Backend', skills: ['Node.js', 'Express', 'MongoDB'] },
      { category: 'Tools', skills: ['Git', 'VS Code', 'Figma'] }
    ],
    showcasePublished: true,
    showcaseUrl: '/profile/alexjohnson'
  },
  submissions: [
    {
      id: '1001',
      week: 1,
      title: 'HTML/CSS Portfolio',
      submittedAt: '2023-09-08T14:30:00Z',
      grade: 'A',
      passing: true,
      feedback: 'Excellent work! Your portfolio is well-structured and responsive.',
      demoLink: 'https://example.com/demo1',
      repoLink: 'https://github.com/alexjohnson/portfolio'
    },
    {
      id: '1002',
      week: 2,
      title: 'JavaScript Game',
      submittedAt: '2023-09-15T16:45:00Z',
      grade: 'A-',
      passing: true,
      feedback: 'Great game implementation. Consider adding more comments to your code.',
      demoLink: 'https://example.com/demo2',
      repoLink: 'https://github.com/alexjohnson/js-game'
    },
    {
      id: '1003',
      week: 3,
      title: 'React Application',
      submittedAt: '2023-09-22T11:20:00Z',
      grade: 'B+',
      passing: true,
      feedback: 'Good work on your React app. State management could be improved.',
      demoLink: 'https://example.com/demo3',
      repoLink: 'https://github.com/alexjohnson/react-app'
    },
    {
      id: '1004',
      week: 4,
      title: 'API Integration',
      submittedAt: '2023-09-29T13:15:00Z',
      grade: 'A',
      passing: true,
      feedback: 'Excellent API integration. Your error handling is particularly good.',
      demoLink: 'https://example.com/demo4',
      repoLink: 'https://github.com/alexjohnson/api-project'
    },
    {
      id: '1005',
      week: 5,
      title: 'Database Project',
      submittedAt: '2023-10-06T15:40:00Z',
      grade: 'A-',
      passing: true,
      feedback: 'Great database design. Your queries are efficient.',
      demoLink: 'https://example.com/demo5',
      repoLink: 'https://github.com/alexjohnson/db-project'
    },
    {
      id: '1006',
      week: 6,
      title: 'Full Stack Application',
      submittedAt: '2023-10-13T10:25:00Z',
      grade: 'B',
      passing: true,
      feedback: 'Good full stack implementation. Frontend and backend integration works well.',
      demoLink: 'https://example.com/demo6',
      repoLink: 'https://github.com/alexjohnson/fullstack-app'
    }
  ],
  analytics: {
    submissionRate: '100%',
    passingRate: '100%',
    averageGrade: 'A-',
    showcaseViews: 45,
    showcaseReferrers: [
      { source: 'LinkedIn', count: 20 },
      { source: 'GitHub', count: 15 },
      { source: 'Direct', count: 10 }
    ]
  }
};

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [activeTab, setActiveTab] = useState('profile');
  
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
  
  return (
    <main className="student-detail-page">
      <div className="page-header">
        <Link href="/secure/instructor/students" className="back-link">
          ← Back to Students
        </Link>
        <div className="student-header">
          <div className="student-profile-image">
            <img src={mockData.student.profileImage} alt={mockData.student.name} />
          </div>
          <div className="student-info">
            <h1>{mockData.student.name}</h1>
            <p className="student-email">{mockData.student.email}</p>
            <p className="student-cohort">{mockData.student.cohort}</p>
            <div className="student-meta">
              <span className="meta-item">
                <span className="label">Joined:</span> {formatDate(mockData.student.joinDate)}
              </span>
              <span className="meta-item">
                <span className="label">Last Active:</span> {formatDateTime(mockData.student.lastActive)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          Submissions
        </button>
        <button 
          className={`tab-button ${activeTab === 'showcase' ? 'active' : ''}`}
          onClick={() => setActiveTab('showcase')}
        >
          Showcase
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <section className="bio-section">
              <h2>About</h2>
              <p>{mockData.student.bio}</p>
              <p><strong>Location:</strong> {mockData.student.location}</p>
            </section>
            
            <section className="social-links-section">
              <h2>Social Links</h2>
              <div className="social-links">
                {Object.entries(mockData.student.socialLinks).map(([platform, url]) => (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="social-link">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                ))}
              </div>
            </section>
            
            <section className="skills-section">
              <h2>Skills</h2>
              <div className="skills-categories">
                {mockData.student.skills.map((category, index) => (
                  <div key={index} className="skill-category">
                    <h3>{category.category}</h3>
                    <div className="skills-list">
                      {category.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        
        {activeTab === 'submissions' && (
          <div className="submissions-tab">
            <div className="submissions-header">
              <h2>Submissions</h2>
              <div className="submissions-stats">
                <div className="stat">
                  <span className="stat-value">{mockData.submissions.length}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{mockData.analytics.submissionRate}</span>
                  <span className="stat-label">Submission Rate</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{mockData.analytics.passingRate}</span>
                  <span className="stat-label">Passing Rate</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{mockData.analytics.averageGrade}</span>
                  <span className="stat-label">Average Grade</span>
                </div>
              </div>
            </div>
            
            <div className="submissions-list">
              {mockData.submissions.map(submission => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                    <h3>Week {submission.week}: {submission.title}</h3>
                    <div className="submission-grade">
                      <span className={`grade grade-${submission.grade.charAt(0).toLowerCase()}`}>
                        {submission.grade}
                      </span>
                    </div>
                  </div>
                  <div className="submission-meta">
                    <p>Submitted: {formatDateTime(submission.submittedAt)}</p>
                    <p>Status: {submission.passing ? 'Passing' : 'Not Passing'}</p>
                  </div>
                  <div className="submission-links">
                    <a href={submission.demoLink} target="_blank" rel="noopener noreferrer" className="link-button">
                      View Demo
                    </a>
                    <a href={submission.repoLink} target="_blank" rel="noopener noreferrer" className="link-button">
                      View Repository
                    </a>
                  </div>
                  <div className="submission-feedback">
                    <h4>Feedback</h4>
                    <p>{submission.feedback}</p>
                  </div>
                  <div className="submission-actions">
                    <Link href={`/secure/instructor/submissions/${submission.id}/grade`}>
                      <button className="edit-grade-button">Edit Grade</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'showcase' && (
          <div className="showcase-tab">
            <div className="showcase-header">
              <h2>Student Showcase</h2>
              <div className="showcase-status">
                {mockData.student.showcasePublished ? (
                  <span className="status-published">Published</span>
                ) : (
                  <span className="status-unpublished">Not Published</span>
                )}
              </div>
            </div>
            
            {mockData.student.showcasePublished ? (
              <div className="showcase-content">
                <p>
                  This student has published their showcase. You can view it at the link below.
                </p>
                <div className="showcase-actions">
                  <a href={mockData.student.showcaseUrl} target="_blank" rel="noopener noreferrer" className="primary-button">
                    View Public Showcase
                  </a>
                </div>
                <div className="showcase-preview">
                  <h3>Showcase Preview</h3>
                  <div className="preview-placeholder">
                    <p>Showcase preview would be displayed here in the full implementation.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="showcase-content">
                <p>
                  This student has not yet published their showcase.
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <h2>Student Analytics</h2>
            
            <div className="analytics-section">
              <h3>Showcase Performance</h3>
              <div className="analytics-cards">
                <div className="analytics-card">
                  <h4>Total Views</h4>
                  <div className="analytics-value">{mockData.analytics.showcaseViews}</div>
                </div>
              </div>
              
              <h3>Traffic Sources</h3>
              <div className="referrers-list">
                {mockData.analytics.showcaseReferrers.map((referrer, index) => (
                  <div key={index} className="referrer-item">
                    <div className="referrer-source">{referrer.source}</div>
                    <div className="referrer-count">{referrer.count} views</div>
                    <div className="referrer-bar" style={{ width: `${(referrer.count / mockData.analytics.showcaseViews) * 100}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="analytics-section">
              <h3>Academic Performance</h3>
              <p className="placeholder-message">
                In the full implementation, this section would display charts and graphs showing the student's academic performance over time.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 