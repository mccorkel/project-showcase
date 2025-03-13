'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Heading,
  Text,
  Button,
  Flex,
  TextAreaField,
  TextField,
  SelectField,
  Divider,
  Badge,
  Loader,
  Alert,
  Grid,
  View
} from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock data for a submission
const generateMockSubmission = (submissionId: string) => {
  return {
    id: submissionId,
    title: 'Project Showcase Application',
    description: 'A full-stack application for showcasing student projects with user authentication, project management, and feedback systems.',
    studentId: 'student-123',
    studentName: 'Jane Smith',
    cohortId: 'cohort-456',
    cohortName: 'Web Development - Spring 2023',
    moduleId: 'module-789',
    moduleName: 'Full-Stack Development',
    submittedAt: '2023-04-15T14:30:00Z',
    status: 'submitted',
    grade: null,
    feedback: null,
    submissionUrl: 'https://github.com/example/project-showcase',
    demoUrl: 'https://project-showcase-demo.example.com',
    files: [
      { name: 'README.md', url: 'https://example.com/files/readme.md', type: 'text/markdown' },
      { name: 'architecture.png', url: 'https://example.com/files/architecture.png', type: 'image/png' },
      { name: 'presentation.pdf', url: 'https://example.com/files/presentation.pdf', type: 'application/pdf' }
    ],
    rubric: [
      { 
        id: 'criterion-1', 
        name: 'Code Quality', 
        description: 'Code is well-structured, documented, and follows best practices',
        maxPoints: 25,
        points: null
      },
      { 
        id: 'criterion-2', 
        name: 'Functionality', 
        description: 'Application works as expected with all features implemented',
        maxPoints: 30,
        points: null
      },
      { 
        id: 'criterion-3', 
        name: 'UI/UX Design', 
        description: 'Interface is intuitive, responsive, and visually appealing',
        maxPoints: 20,
        points: null
      },
      { 
        id: 'criterion-4', 
        name: 'Documentation', 
        description: 'Project is well-documented with clear instructions',
        maxPoints: 15,
        points: null
      },
      { 
        id: 'criterion-5', 
        name: 'Presentation', 
        description: 'Project was presented clearly and professionally',
        maxPoints: 10,
        points: null
      }
    ]
  };
};

interface FeedbackSubmissionProps {
  submissionId: string;
}

const FeedbackSubmission: React.FC<FeedbackSubmissionProps> = ({ submissionId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [rubricScores, setRubricScores] = useState<Record<string, number | null>>({});
  const [totalScore, setTotalScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(0);
  const [grade, setGrade] = useState<string>('');
  const [status, setStatus] = useState<string>('graded');
  
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockSubmission = generateMockSubmission(submissionId);
        setSubmission(mockSubmission);
        
        // Initialize rubric scores
        const initialScores: Record<string, number | null> = {};
        let initialMaxScore = 0;
        
        mockSubmission.rubric.forEach((criterion: any) => {
          initialScores[criterion.id] = criterion.points;
          initialMaxScore += criterion.maxPoints;
        });
        
        setRubricScores(initialScores);
        setMaxScore(initialMaxScore);
        
        // Set initial feedback if available
        if (mockSubmission.feedback) {
          setFeedback(mockSubmission.feedback);
        }
        
        // Set initial grade if available
        if (mockSubmission.grade) {
          setGrade(mockSubmission.grade.toString());
        }
        
        // Set initial status
        if (mockSubmission.status) {
          setStatus(mockSubmission.status);
        }
      } catch (err) {
        console.error('Error fetching submission:', err);
        setError('Failed to load submission. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmission();
  }, [submissionId]);
  
  // Calculate total score whenever rubric scores change
  useEffect(() => {
    if (!submission) return;
    
    let total = 0;
    let allScored = true;
    
    submission.rubric.forEach((criterion: any) => {
      const score = rubricScores[criterion.id];
      if (score !== null && score !== undefined) {
        total += score;
      } else {
        allScored = false;
      }
    });
    
    setTotalScore(total);
    
    // Auto-calculate grade based on percentage
    if (allScored && maxScore > 0) {
      const percentage = (total / maxScore) * 100;
      let calculatedGrade = '';
      
      if (percentage >= 90) calculatedGrade = 'A';
      else if (percentage >= 80) calculatedGrade = 'B';
      else if (percentage >= 70) calculatedGrade = 'C';
      else if (percentage >= 60) calculatedGrade = 'D';
      else calculatedGrade = 'F';
      
      setGrade(calculatedGrade);
    }
  }, [rubricScores, submission, maxScore]);
  
  const handleRubricScoreChange = (criterionId: string, value: string) => {
    const score = value === '' ? null : parseInt(value, 10);
    setRubricScores(prev => ({
      ...prev,
      [criterionId]: score
    }));
  };
  
  const handleSubmitFeedback = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Validate that all rubric criteria have scores
      const hasAllScores = submission.rubric.every((criterion: any) => 
        rubricScores[criterion.id] !== null && rubricScores[criterion.id] !== undefined
      );
      
      if (!hasAllScores) {
        setError('Please provide scores for all rubric criteria.');
        setIsLoading(false);
        return;
      }
      
      if (!feedback.trim()) {
        setError('Please provide feedback comments.');
        setIsLoading(false);
        return;
      }
      
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Update submission with feedback and grades
      const updatedSubmission = {
        ...submission,
        feedback,
        grade,
        status,
        rubric: submission.rubric.map((criterion: any) => ({
          ...criterion,
          points: rubricScores[criterion.id]
        }))
      };
      
      setSubmission(updatedSubmission);
      setSuccess('Feedback submitted successfully!');
      
      // In a real app, we might redirect after a delay
      setTimeout(() => {
        router.push(`/secure/instructor/submissions`);
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variation="info">Submitted</Badge>;
      case 'graded':
        return <Badge variation="success">Graded</Badge>;
      case 'needs_revision':
        return <Badge variation="warning">Needs Revision</Badge>;
      case 'resubmitted':
        return <Badge variation="info">Resubmitted</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  if (isLoading && !submission) {
    return (
      <Card>
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }
  
  if (error && !submission) {
    return (
      <Card>
        <Alert variation="error">{error}</Alert>
        <Button onClick={() => router.push('/secure/instructor/submissions')} marginTop="1rem">
          Back to Submissions
        </Button>
      </Card>
    );
  }
  
  if (!submission) {
    return (
      <Card>
        <Heading level={3}>Submission Not Found</Heading>
        <Text>The requested submission could not be found or you don't have permission to view it.</Text>
        <Button onClick={() => router.push('/secure/instructor/submissions')} marginTop="1rem">
          Back to Submissions
        </Button>
      </Card>
    );
  }
  
  return (
    <Card>
      <Flex direction="column" gap="1.5rem">
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="flex-start">
          <div>
            <Heading level={3}>{submission.title}</Heading>
            <Flex gap="0.5rem" marginTop="0.5rem">
              {getStatusBadge(submission.status)}
              <Text fontSize="0.875rem">
                Submitted on {formatDate(submission.submittedAt)}
              </Text>
            </Flex>
          </div>
          <Link href="/secure/instructor/submissions" legacyBehavior>
            <Button>Back to Submissions</Button>
          </Link>
        </Flex>
        
        {/* Student and Submission Info */}
        <Grid templateColumns={{ base: '1fr', medium: '1fr 1fr' }} gap="1rem">
          <Card variation="outlined">
            <Heading level={5}>Student Information</Heading>
            <Divider marginTop="0.5rem" marginBottom="0.5rem" />
            <Flex direction="column" gap="0.5rem">
              <Flex>
                <Text fontWeight="bold" width="100px">Name:</Text>
                <Text>{submission.studentName}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" width="100px">Cohort:</Text>
                <Text>{submission.cohortName}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" width="100px">Module:</Text>
                <Text>{submission.moduleName}</Text>
              </Flex>
            </Flex>
          </Card>
          
          <Card variation="outlined">
            <Heading level={5}>Submission Links</Heading>
            <Divider marginTop="0.5rem" marginBottom="0.5rem" />
            <Flex direction="column" gap="0.5rem">
              {submission.submissionUrl && (
                <Flex>
                  <Text fontWeight="bold" width="100px">Repository:</Text>
                  <Link href={submission.submissionUrl} target="_blank" legacyBehavior>
                    <a className="text-blue-600 hover:underline">{submission.submissionUrl}</a>
                  </Link>
                </Flex>
              )}
              {submission.demoUrl && (
                <Flex>
                  <Text fontWeight="bold" width="100px">Demo:</Text>
                  <Link href={submission.demoUrl} target="_blank" legacyBehavior>
                    <a className="text-blue-600 hover:underline">{submission.demoUrl}</a>
                  </Link>
                </Flex>
              )}
            </Flex>
          </Card>
        </Grid>
        
        {/* Submission Description */}
        <Card>
          <Heading level={5}>Project Description</Heading>
          <Divider marginTop="0.5rem" marginBottom="0.5rem" />
          <Text>{submission.description}</Text>
        </Card>
        
        {/* Attached Files */}
        {submission.files && submission.files.length > 0 && (
          <Card>
            <Heading level={5}>Attached Files</Heading>
            <Divider marginTop="0.5rem" marginBottom="0.5rem" />
            <Flex direction="column" gap="0.5rem">
              {submission.files.map((file: any, index: number) => (
                <Flex key={index} alignItems="center" gap="0.5rem">
                  <Link href={file.url} target="_blank" legacyBehavior>
                    <Button size="small" variation="link">
                      {file.name}
                    </Button>
                  </Link>
                  <Badge size="small">{file.type}</Badge>
                </Flex>
              ))}
            </Flex>
          </Card>
        )}
        
        {/* Rubric Grading */}
        <Card>
          <Heading level={5}>Grading Rubric</Heading>
          <Divider marginTop="0.5rem" marginBottom="0.5rem" />
          
          {error && <Alert variation="error">{error}</Alert>}
          
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th" width="30%">Criterion</TableCell>
                <TableCell as="th" width="40%">Description</TableCell>
                <TableCell as="th" width="15%">Max Points</TableCell>
                <TableCell as="th" width="15%">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submission.rubric.map((criterion: any) => (
                <TableRow key={criterion.id}>
                  <TableCell>{criterion.name}</TableCell>
                  <TableCell>{criterion.description}</TableCell>
                  <TableCell>{criterion.maxPoints}</TableCell>
                  <TableCell>
                    <TextField
                      label="Score"
                      labelHidden
                      type="number"
                      value={rubricScores[criterion.id]?.toString() || ''}
                      onChange={(e) => handleRubricScoreChange(criterion.id, e.target.value)}
                      min={0}
                      max={criterion.maxPoints}
                      width="80px"
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} textAlign="right">
                  <Text fontWeight="bold">Total:</Text>
                </TableCell>
                <TableCell>
                  <Text fontWeight="bold">{maxScore}</Text>
                </TableCell>
                <TableCell>
                  <Text fontWeight="bold">{totalScore}</Text>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
        
        {/* Feedback Form */}
        <Card>
          <Heading level={5}>Feedback</Heading>
          <Divider marginTop="0.5rem" marginBottom="0.5rem" />
          
          <Grid templateColumns={{ base: '1fr', medium: '1fr 1fr' }} gap="1rem" marginBottom="1rem">
            <SelectField
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="graded">Graded</option>
              <option value="needs_revision">Needs Revision</option>
            </SelectField>
            
            <TextField
              label="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="A, B, C, D, or F"
            />
          </Grid>
          
          <TextAreaField
            label="Feedback Comments"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            placeholder="Provide detailed feedback on the submission..."
          />
          
          {success && <Alert variation="success">{success}</Alert>}
          
          <Flex justifyContent="flex-end" marginTop="1rem">
            <Button
              variation="primary"
              onClick={handleSubmitFeedback}
              isLoading={isLoading}
              loadingText="Submitting..."
            >
              Submit Feedback
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
};

// Add custom Table components
const Table: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <table className="min-w-full divide-y divide-gray-200">{children}</table>;
};

const TableHead: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <thead className="bg-gray-50">{children}</thead>;
};

const TableBody: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
};

const TableRow: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <tr>{children}</tr>;
};

const TableCell: React.FC<{
  children: React.ReactNode;
  as?: 'td' | 'th';
  colSpan?: number;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
}> = ({ children, as = 'td', colSpan, width, textAlign = 'left' }) => {
  const Tag = as;
  return (
    <Tag 
      colSpan={colSpan} 
      style={{ 
        width: width,
        textAlign: textAlign,
        padding: '0.75rem'
      }}
    >
      {children}
    </Tag>
  );
};

export default FeedbackSubmission; 