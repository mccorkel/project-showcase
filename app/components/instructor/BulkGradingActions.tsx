'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Heading,
  Text,
  Button,
  Flex,
  CheckboxField,
  Badge,
  Alert,
  Divider,
  Loader,
  SelectField,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';

// Mock data for submissions
const generateMockSubmissions = () => {
  const submissions = [];
  
  for (let i = 1; i <= 15; i++) {
    submissions.push({
      id: `submission-${i}`,
      title: `Project ${i}`,
      studentName: `Student ${i}`,
      studentId: `student-${i}`,
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      status: i % 5 === 0 ? 'graded' : 'pending',
      grade: i % 5 === 0 ? Math.floor(Math.random() * 30) + 70 : null
    });
  }
  
  return submissions;
};

interface BulkGradingActionsProps {
  cohortId?: string;
  moduleId?: string;
  week?: number;
  onGradingComplete?: () => void;
}

const BulkGradingActions: React.FC<BulkGradingActionsProps> = ({ 
  cohortId, 
  moduleId,
  week,
  onGradingComplete 
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('grade');
  const [bulkGrade, setBulkGrade] = useState<string>('');
  const [bulkFeedback, setBulkFeedback] = useState<string>('');
  const [bulkStatus, setBulkStatus] = useState<string>('graded');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockSubmissions = generateMockSubmissions();
        setSubmissions(mockSubmissions);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [cohortId, moduleId]);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(submissions.filter(s => s.status === 'pending').map(s => s.id));
    } else {
      setSelectedSubmissions([]);
    }
  };
  
  const handleSelectSubmission = (submissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(prev => [...prev, submissionId]);
    } else {
      setSelectedSubmissions(prev => prev.filter(id => id !== submissionId));
    }
  };
  
  const handleApplyBulkAction = async () => {
    if (selectedSubmissions.length === 0) {
      setError('Please select at least one submission.');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(null);
      
      // Validate inputs based on action
      if (bulkAction === 'grade' && !bulkGrade) {
        setError('Please enter a grade.');
        setIsProcessing(false);
        return;
      }
      
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Update submissions in state
      const updatedSubmissions = submissions.map(submission => {
        if (selectedSubmissions.includes(submission.id)) {
          const updates: any = { status: bulkStatus };
          
          if (bulkAction === 'grade') {
            updates.grade = bulkGrade;
          }
          
          if (bulkFeedback) {
            updates.feedback = bulkFeedback;
          }
          
          return { ...submission, ...updates };
        }
        
        return submission;
      });
      
      setSubmissions(updatedSubmissions);
      setSelectedSubmissions([]);
      setSuccess(`Successfully applied ${bulkAction} to ${selectedSubmissions.length} submissions.`);
    } catch (err) {
      console.error('Error applying bulk action:', err);
      setError('Failed to apply bulk action. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variation="warning">Pending</Badge>;
      case 'graded':
        return <Badge variation="success">Graded</Badge>;
      case 'needs_revision':
        return <Badge variation="error">Needs Revision</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }
  
  return (
    <Card>
      <Flex direction="column" gap="1.5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={3}>Bulk Grading Actions</Heading>
          <Button onClick={() => router.push('/secure/instructor/submissions')}>
            Back to Submissions
          </Button>
        </Flex>
        
        <Text>
          Select multiple submissions to apply grading actions in bulk.
          {cohortId && ' Filtering by cohort.'}
          {moduleId && ' Filtering by module.'}
        </Text>
        
        {error && <Alert variation="error">{error}</Alert>}
        {success && <Alert variation="success">{success}</Alert>}
        
        {/* Bulk Action Controls */}
        <Card variation="outlined">
          <Heading level={5}>Bulk Actions</Heading>
          <Divider marginTop="0.5rem" marginBottom="1rem" />
          
          <Flex direction="column" gap="1rem">
            <SelectField
              label="Action"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="grade">Assign Grade</option>
              <option value="status">Change Status</option>
              <option value="feedback">Add Feedback</option>
            </SelectField>
            
            {bulkAction === 'grade' && (
              <TextField
                label="Grade"
                value={bulkGrade}
                onChange={(e) => setBulkGrade(e.target.value)}
                placeholder="Enter grade (e.g., A, B, 85, etc.)"
              />
            )}
            
            {bulkAction === 'status' || bulkAction === 'grade' ? (
              <SelectField
                label="Status"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
              >
                <option value="graded">Graded</option>
                <option value="needs_revision">Needs Revision</option>
              </SelectField>
            ) : null}
            
            {bulkAction === 'feedback' && (
              <TextField
                label="Feedback"
                value={bulkFeedback}
                onChange={(e) => setBulkFeedback(e.target.value)}
                placeholder="Enter common feedback for selected submissions"
              />
            )}
            
            <Flex justifyContent="space-between" alignItems="center">
              <Text>
                {selectedSubmissions.length} submissions selected
              </Text>
              
              <Button
                variation="primary"
                onClick={handleApplyBulkAction}
                isLoading={isProcessing}
                loadingText="Applying..."
                isDisabled={selectedSubmissions.length === 0}
              >
                Apply to Selected
              </Button>
            </Flex>
          </Flex>
        </Card>
        
        {/* Submissions Table */}
        <Card>
          <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
            <Heading level={5}>Submissions</Heading>
            
            <CheckboxField
              name="selectAllPending"
              label="Select All Pending"
              checked={
                submissions.filter(s => s.status === 'pending').length > 0 &&
                submissions.filter(s => s.status === 'pending').every(s => selectedSubmissions.includes(s.id))
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </Flex>
          
          <Table highlightOnHover={true}>
            <TableHead>
              <TableRow>
                <TableCell as="th" width="50px">Select</TableCell>
                <TableCell as="th">Title</TableCell>
                <TableCell as="th">Student</TableCell>
                <TableCell as="th">Submitted</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Grade</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Text textAlign="center">No submissions found.</Text>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <CheckboxField
                        name={`submission-${submission.id}`}
                        label=""
                        labelHidden={true}
                        checked={selectedSubmissions.includes(submission.id)}
                        onChange={(e) => handleSelectSubmission(submission.id, e.target.checked)}
                        isDisabled={submission.status !== 'pending'}
                      />
                    </TableCell>
                    <TableCell>{submission.title}</TableCell>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>{submission.grade || 'Not graded'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => router.push(`/secure/instructor/submissions/${submission.id}/grade`)}
                      >
                        {submission.status === 'pending' ? 'Grade' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </Flex>
    </Card>
  );
};

export default BulkGradingActions; 