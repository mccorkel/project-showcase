'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock data for submission grading
const mockData = {
  submission: {
    id: '1001',
    student: {
      id: '101',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      cohort: 'Web Development - Fall 2023'
    },
    week: 3,
    title: 'React Application',
    description: 'A React application that demonstrates state management, component composition, and API integration.',
    submittedAt: '2023-10-14T15:30:00Z',
    status: 'pending',
    demoLink: 'https://example.com/demo1',
    repoLink: 'https://github.com/alexjohnson/react-app',
    deployedUrl: 'https://alexjohnson-react-app.netlify.app',
    notes: 'I focused on creating a clean UI and implementing proper error handling for API calls. I also added unit tests for the main components.',
    requirements: [
      { id: 'req1', text: 'Implement at least 5 React components', completed: true },
      { id: 'req2', text: 'Use React hooks for state management', completed: true },
      { id: 'req3', text: 'Integrate with an external API', completed: true },
      { id: 'req4', text: 'Implement proper error handling', completed: true },
      { id: 'req5', text: 'Include unit tests', completed: true },
      { id: 'req6', text: 'Deploy to a hosting service', completed: true }
    ]
  }
};

export default function GradeSubmissionPage({ params }: { params: { id: string } }) {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isPassing, setIsPassing] = useState(true);
  const [requirementStatus, setRequirementStatus] = useState(
    mockData.submission.requirements.map(req => ({ id: req.id, completed: req.completed }))
  );
  
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
  
  // Handle requirement status change
  const handleRequirementChange = (reqId: string, completed: boolean) => {
    setRequirementStatus(prevStatus => 
      prevStatus.map(req => 
        req.id === reqId ? { ...req, completed } : req
      )
    );
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would send the grading data to the server
    alert(`Submission graded with grade: ${grade}, passing: ${isPassing}`);
  };
  
  return (
    <ProtectedRoute requiredRoles={['instructor']}>
      <main className="grade-submission-page">
        <div className="page-header">
          <Link href="/secure/instructor/submissions" className="back-link">
            ← Back to Submissions
          </Link>
          <h1>Grade Submission</h1>
          <div className="submission-meta">
            <p className="student-name">
              Student: <Link href={`/secure/instructor/students/${mockData.submission.student.id}`}>
                {mockData.submission.student.name}
              </Link>
            </p>
            <p className="submission-title">
              Week {mockData.submission.week}: {mockData.submission.title}
            </p>
            <p className="submission-date">
              Submitted: {formatDateTime(mockData.submission.submittedAt)}
            </p>
          </div>
        </div>
        
        <div className="submission-content">
          <section className="submission-details">
            <h2>Submission Details</h2>
            <div className="detail-group">
              <h3>Description</h3>
              <p>{mockData.submission.description}</p>
            </div>
            
            <div className="detail-group">
              <h3>Student Notes</h3>
              <p>{mockData.submission.notes}</p>
            </div>
            
            <div className="detail-group">
              <h3>Links</h3>
              <div className="links-list">
                <a href={mockData.submission.demoLink} target="_blank" rel="noopener noreferrer" className="link-button">
                  View Demo
                </a>
                <a href={mockData.submission.repoLink} target="_blank" rel="noopener noreferrer" className="link-button">
                  View Repository
                </a>
                <a href={mockData.submission.deployedUrl} target="_blank" rel="noopener noreferrer" className="link-button">
                  View Deployed Application
                </a>
              </div>
            </div>
          </section>
          
          <section className="requirements-checklist">
            <h2>Requirements Checklist</h2>
            <div className="requirements-list">
              {mockData.submission.requirements.map((req, index) => (
                <div key={req.id} className="requirement-item">
                  <label className="requirement-label">
                    <input 
                      type="checkbox" 
                      checked={requirementStatus.find(r => r.id === req.id)?.completed || false}
                      onChange={(e) => handleRequirementChange(req.id, e.target.checked)}
                    />
                    <span className="requirement-text">{req.text}</span>
                  </label>
                </div>
              ))}
            </div>
          </section>
          
          <form className="grading-form" onSubmit={handleSubmit}>
            <h2>Grading</h2>
            
            <div className="form-group">
              <label htmlFor="grade-select">Grade:</label>
              <select 
                id="grade-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                className="grade-select"
              >
                <option value="">Select a grade</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="passing-checkbox" className="checkbox-label">
                <input 
                  type="checkbox" 
                  id="passing-checkbox"
                  checked={isPassing}
                  onChange={(e) => setIsPassing(e.target.checked)}
                />
                <span>Mark as Passing</span>
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="feedback-textarea">Feedback:</label>
              <textarea 
                id="feedback-textarea"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows={6}
                placeholder="Provide detailed feedback for the student..."
                className="feedback-textarea"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">Submit Grade</button>
              <button type="button" className="save-draft-button">Save as Draft</button>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
} 