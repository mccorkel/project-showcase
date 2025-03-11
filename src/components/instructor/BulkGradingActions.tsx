import React, { useState, useEffect } from 'react';
import {
  Card,
  Heading,
  Text,
  Button,
  CheckboxField,
  SelectField,
  TextAreaField,
  Flex,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Alert,
  Divider,
  Loader,
  View
} from '@aws-amplify/ui-react';

interface Submission {
  id: string;
  studentName: string;
  title: string;
  submittedAt: string;
  status: string;
  week: number;
  cohort: string;
}

interface BulkGradingActionsProps {
  cohortId?: string;
  week?: number;
  onGradingComplete?: () => void;
}

// Mock function to fetch submissions
const fetchSubmissions = async (cohortId?: string, week?: number) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock submissions
  const statuses = ['pending', 'graded', 'needs_revision'];
  const submissions: Submission[] = [];
  
  for (let i = 1; i <= 10; i++) {
    submissions.push({
      id: `submission-${i}`,
      studentName: `Student ${i}`,
      title: `Project ${week || 1}: ${['React App', 'API Integration', 'Database Design', 'Authentication System'][Math.floor(Math.random() * 4)]}`,
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      week: week || 1,
      cohort: cohortId ? `Cohort ${cohortId}` : 'Web Development - Fall 2023'
    });
  }
  
  return submissions;
};

export default function BulkGradingActions({ cohortId, week, onGradingComplete }: BulkGradingActionsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkGrade, setBulkGrade] = useState('');
  const [bulkFeedback, setBulkFeedback] = useState('');
  const [bulkStatus, setBulkStatus] = useState('graded');
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchSubmissions(cohortId, week);
        setSubmissions(data);
      } catch (err) {
        setError('Failed to load submissions. Please try again.');
        console.error('Error loading submissions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubmissions();
  }, [cohortId, week]);
  
  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      const filteredSubmissions = filterSubmissions(submissions);
      setSelectedSubmissions(filteredSubmissions.map(s => s.id));
    } else if (selectedSubmissions.length === submissions.length) {
      setSelectedSubmissions([]);
    }
  }, [selectAll]);
  
  // Update selectAll state when individual selections change
  useEffect(() => {
    const filteredSubmissions = filterSubmissions(submissions);
    if (selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedSubmissions, submissions, filterStatus]);
  
  const filterSubmissions = (subs: Submission[]) => {
    if (filterStatus === 'all') return subs;
    return subs.filter(s => s.status === filterStatus);
  };
  
  const handleSelectSubmission = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(prev => [...prev, id]);
    } else {
      setSelectedSubmissions(prev => prev.filter(subId => subId !== id));
    }
  };
  
  const handleBulkGrading = async () => {
    if (selectedSubmissions.length === 0) {
      setError('Please select at least one submission to grade.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // Simulate API call to apply bulk grading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(`Successfully graded ${selectedSubmissions.length} submissions.`);
      
      // Update local state to reflect changes
      setSubmissions(prev => 
        prev.map(sub => 
          selectedSubmissions.includes(sub.id) 
            ? { ...sub, status: bulkStatus } 
            : sub
        )
      );
      
      // Clear selections after successful grading
      setSelectedSubmissions([]);
      setSelectAll(false);
      
      if (onGradingComplete) {
        onGradingComplete();
      }
    } catch (err) {
      setError('Failed to apply bulk grading. Please try again.');
      console.error('Error applying bulk grading:', err);
    } finally {
      setIsSubmitting(false);
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
  
  const getStatusBadgeVariation = (status: string) => {
    switch (status) {
      case 'graded': return 'success';
      case 'pending': return 'warning';
      case 'needs_revision': return 'error';
      default: return 'info';
    }
  };
  
  if (isLoading) {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }
  
  if (error && submissions.length === 0) {
    return (
      <Card variation="elevated">
        <Alert variation="error">{error}</Alert>
      </Card>
    );
  }
  
  const filteredSubmissions = filterSubmissions(submissions);
  
  return (
    <Card variation="elevated">
      <Heading level={3}>Bulk Grading Actions</Heading>
      
      <Flex direction="column" gap="1.5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Text>
            <strong>Total Submissions:</strong> {submissions.length}
          </Text>
          
          <SelectField
            label="Filter by Status"
            labelHidden
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setSelectedSubmissions([]);
              setSelectAll(false);
            }}
            width="200px"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="graded">Graded</option>
            <option value="needs_revision">Needs Revision</option>
          </SelectField>
        </Flex>
        
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">
                <CheckboxField
                  label="Select All"
                  labelHidden
                  name="selectAll"
                  checked={selectAll}
                  onChange={(e) => setSelectAll(e.target.checked)}
                  disabled={filteredSubmissions.length === 0}
                />
              </TableCell>
              <TableCell as="th">Student</TableCell>
              <TableCell as="th">Submission</TableCell>
              <TableCell as="th">Date</TableCell>
              <TableCell as="th">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Text textAlign="center">No submissions match the current filter.</Text>
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map(submission => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <CheckboxField
                      label={`Select ${submission.studentName}`}
                      labelHidden
                      name={`select-${submission.id}`}
                      checked={selectedSubmissions.includes(submission.id)}
                      onChange={(e) => handleSelectSubmission(submission.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>{submission.studentName}</TableCell>
                  <TableCell>{submission.title}</TableCell>
                  <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                  <TableCell>
                    <Badge variation={getStatusBadgeVariation(submission.status)}>
                      {submission.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {selectedSubmissions.length > 0 && (
          <View>
            <Divider marginBottom="1rem" />
            
            <Heading level={5}>Apply to {selectedSubmissions.length} selected submissions:</Heading>
            
            <Flex direction="column" gap="1rem" marginTop="1rem">
              <SelectField
                label="Grade"
                value={bulkGrade}
                onChange={(e) => setBulkGrade(e.target.value)}
              >
                <option value="">Select a grade (optional)</option>
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
              </SelectField>
              
              <SelectField
                label="Status"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
              >
                <option value="graded">Graded</option>
                <option value="needs_revision">Needs Revision</option>
                <option value="pending">Pending</option>
              </SelectField>
              
              <TextAreaField
                label="Feedback (will be applied to all selected submissions)"
                value={bulkFeedback}
                onChange={(e) => setBulkFeedback(e.target.value)}
                placeholder="Enter feedback to apply to all selected submissions..."
                rows={4}
              />
              
              {error && <Alert variation="error">{error}</Alert>}
              {success && <Alert variation="success">{success}</Alert>}
              
              <Flex justifyContent="space-between">
                <Button
                  variation="primary"
                  onClick={handleBulkGrading}
                  isLoading={isSubmitting}
                  loadingText="Applying..."
                >
                  Apply to Selected
                </Button>
                <Button
                  variation="link"
                  onClick={() => {
                    setSelectedSubmissions([]);
                    setSelectAll(false);
                    setBulkGrade('');
                    setBulkFeedback('');
                    setBulkStatus('graded');
                    setError(null);
                    setSuccess(null);
                  }}
                  isDisabled={isSubmitting}
                >
                  Clear Selection
                </Button>
              </Flex>
            </Flex>
          </View>
        )}
      </Flex>
    </Card>
  );
} 