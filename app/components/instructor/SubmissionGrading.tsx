import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Loader, 
  Divider,
  TextField,
  TextAreaField,
  SwitchField,
  Badge,
  Alert,
  Link as AmplifyLink,
  View
} from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock data for demonstration purposes
const generateMockSubmission = (submissionId: string) => {
  return {
    id: submissionId,
    studentId: 'student-123',
    studentName: 'Alex Johnson',
    studentEmail: 'alex.johnson@example.com',
    cohortId: 'cohort-1',
    cohortName: 'Web Development - Spring 2025',
    moduleId: 'module-4',
    moduleName: 'Advanced React Patterns',
    title: 'E-commerce Product Page',
    description: 'A responsive product page with shopping cart functionality built with React and styled-components.',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'submitted', // submitted, graded, returned
    repoLink: 'https://github.com/alexjohnson/ecommerce-product-page',
    demoLink: 'https://ecommerce-product-page-demo.netlify.app',
    deployedUrl: 'https://ecommerce-product-page.netlify.app',
    grade: null,
    passingStatus: null,
    feedback: '',
    gradedBy: null,
    gradedAt: null,
    rubric: [
      {
        id: 'functionality',
        name: 'Functionality',
        description: 'All required features are implemented and working correctly.',
        maxPoints: 30,
        points: null
      },
      {
        id: 'code-quality',
        name: 'Code Quality',
        description: 'Code is well-organized, follows best practices, and is properly documented.',
        maxPoints: 25,
        points: null
      },
      {
        id: 'ui-design',
        name: 'UI Design',
        description: 'Interface is intuitive, responsive, and visually appealing.',
        maxPoints: 20,
        points: null
      },
      {
        id: 'best-practices',
        name: 'Best Practices',
        description: 'Project follows React best practices and patterns.',
        maxPoints: 15,
        points: null
      },
      {
        id: 'extra-credit',
        name: 'Extra Credit',
        description: 'Additional features or improvements beyond requirements.',
        maxPoints: 10,
        points: null
      }
    ]
  };
};

interface SubmissionGradingProps {
  submissionId: string;
}

const SubmissionGrading: React.FC<SubmissionGradingProps> = ({ submissionId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submission, setSubmission] = useState<any>(null);
  const [rubricScores, setRubricScores] = useState<{[key: string]: number | null}>({});
  const [feedback, setFeedback] = useState('');
  const [isPassing, setIsPassing] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [gradePercentage, setGradePercentage] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, we would fetch data from an API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockSubmission = generateMockSubmission(submissionId);
        setSubmission(mockSubmission);
        
        // Initialize rubric scores
        const initialScores: {[key: string]: number | null} = {};
        let initialMaxPoints = 0;
        
        mockSubmission.rubric.forEach((item: any) => {
          initialScores[item.id] = item.points;
          initialMaxPoints += item.maxPoints;
        });
        
        setRubricScores(initialScores);
        setFeedback(mockSubmission.feedback || '');
        setIsPassing(mockSubmission.passingStatus === true);
        setMaxPoints(initialMaxPoints);
        
      } catch (error) {
        console.error('Error fetching submission:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmission();
  }, [submissionId]);
  
  useEffect(() => {
    if (!submission) return;
    
    // Calculate total points and grade percentage
    let total = 0;
    let allScoresEntered = true;
    
    submission.rubric.forEach((item: any) => {
      const score = rubricScores[item.id];
      if (score !== null && score !== undefined) {
        total += score;
      } else {
        allScoresEntered = false;
      }
    });
    
    setTotalPoints(total);
    
    if (maxPoints > 0) {
      setGradePercentage(Math.round((total / maxPoints) * 100));
    }
    
  }, [rubricScores, submission, maxPoints]);
  
  const handleRubricScoreChange = (itemId: string, value: string) => {
    const numValue = value === '' ? null : Math.min(
      submission.rubric.find((item: any) => item.id === itemId).maxPoints,
      parseInt(value, 10) || 0
    );
    
    setRubricScores({
      ...rubricScores,
      [itemId]: numValue
    });
  };
  
  const handleSaveGrade = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      // Validate that all rubric items have scores
      const hasAllScores = submission.rubric.every((item: any) => 
        rubricScores[item.id] !== null && rubricScores[item.id] !== undefined
      );
      
      if (!hasAllScores) {
        setSaveError('Please provide scores for all rubric items before saving.');
        return;
      }
      
      // In a real implementation, we would save to an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Update the submission with the new grades
      const updatedSubmission = {
        ...submission,
        grade: gradePercentage,
        passingStatus: isPassing,
        feedback,
        status: 'graded',
        gradedBy: 'instructor-123', // In a real app, this would be the current user's ID
        gradedAt: new Date().toISOString(),
        rubric: submission.rubric.map((item: any) => ({
          ...item,
          points: rubricScores[item.id]
        }))
      };
      
      setSubmission(updatedSubmission);
      setSaveSuccess(true);
      
      // In a real app, we might redirect after a successful save
      // router.push(`/secure/instructor/submissions?cohortId=${submission.cohortId}`);
      
    } catch (error) {
      console.error('Error saving grade:', error);
      setSaveError('An error occurred while saving the grade. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variation="info">Submitted</Badge>;
      case 'graded':
        return <Badge variation="success">Graded</Badge>;
      case 'returned':
        return <Badge variation="warning">Returned for Revision</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Flex justifyContent="center" padding="2rem">
        <Loader size="large" />
      </Flex>
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
            <Heading level={3}>Grade Submission: {submission.title}</Heading>
            <Flex gap="0.5rem" marginTop="0.5rem">
              {getStatusBadge(submission.status)}
              <Text fontSize="0.875rem">
                Submitted on {formatDate(submission.submittedAt)}
              </Text>
              {submission.status === 'graded' && (
                <Text fontSize="0.875rem">
                  Graded on {formatDate(submission.gradedAt)}
                </Text>
              )}
            </Flex>
          </div>
          <Flex gap="0.5rem">
            <Button onClick={() => router.push('/secure/instructor/submissions')}>
              Back to Submissions
            </Button>
          </Flex>
        </Flex>
        
        {/* Student and Submission Info */}
        <Card variation="outlined">
          <Flex direction="column" gap="1rem">
            <Heading level={4}>Submission Details</Heading>
            <Divider />
            
            <Flex direction={{ base: 'column', medium: 'row' }} gap="1rem">
              <Flex direction="column" gap="0.5rem" flex="1">
                <Text fontWeight="bold">Student</Text>
                <Link href={`/secure/instructor/students/${submission.studentId}`} legacyBehavior>
                  <AmplifyLink>{submission.studentName}</AmplifyLink>
                </Link>
                <Text>{submission.studentEmail}</Text>
              </Flex>
              
              <Flex direction="column" gap="0.5rem" flex="1">
                <Text fontWeight="bold">Cohort</Text>
                <Link href={`/secure/instructor/cohorts/${submission.cohortId}`} legacyBehavior>
                  <AmplifyLink>{submission.cohortName}</AmplifyLink>
                </Link>
                <Text>{submission.moduleName}</Text>
              </Flex>
              
              <Flex direction="column" gap="0.5rem" flex="1">
                <Text fontWeight="bold">Due Date</Text>
                <Text>{formatDate(submission.dueDate)}</Text>
                <Text color={new Date(submission.submittedAt) > new Date(submission.dueDate) ? 'red' : 'inherit'}>
                  {new Date(submission.submittedAt) > new Date(submission.dueDate) ? 'Late Submission' : 'On Time'}
                </Text>
              </Flex>
            </Flex>
            
            <Divider />
            
            <Flex direction="column" gap="0.5rem">
              <Text fontWeight="bold">Description</Text>
              <Text>{submission.description}</Text>
            </Flex>
            
            <Flex direction={{ base: 'column', medium: 'row' }} gap="1rem">
              <Flex direction="column" gap="0.5rem" flex="1">
                <Text fontWeight="bold">Repository Link</Text>
                <AmplifyLink href={submission.repoLink} isExternal={true}>
                  {submission.repoLink}
                </AmplifyLink>
              </Flex>
              
              <Flex direction="column" gap="0.5rem" flex="1">
                <Text fontWeight="bold">Demo Link</Text>
                <AmplifyLink href={submission.demoLink} isExternal={true}>
                  {submission.demoLink}
                </AmplifyLink>
              </Flex>
              
              <Flex direction="column" gap="0.5rem" flex="1">
                <Text fontWeight="bold">Deployed URL</Text>
                <AmplifyLink href={submission.deployedUrl} isExternal={true}>
                  {submission.deployedUrl}
                </AmplifyLink>
              </Flex>
            </Flex>
          </Flex>
        </Card>
        
        {/* Grading Rubric */}
        <Card variation="outlined">
          <Flex direction="column" gap="1rem">
            <Heading level={4}>Grading Rubric</Heading>
            <Divider />
            
            {submission.rubric.map((item: any) => (
              <Flex key={item.id} direction={{ base: 'column', medium: 'row' }} gap="1rem" alignItems="flex-start">
                <Flex direction="column" gap="0.25rem" flex="1">
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text fontSize="0.875rem">{item.description}</Text>
                  <Text fontSize="0.875rem">Max Points: {item.maxPoints}</Text>
                </Flex>
                
                <TextField
                  label="Points"
                  type="number"
                  value={rubricScores[item.id]?.toString() || ''}
                  onChange={(e) => handleRubricScoreChange(item.id, e.target.value)}
                  min="0"
                  max={item.maxPoints.toString()}
                  width="100px"
                  isDisabled={submission.status === 'graded'}
                />
              </Flex>
            ))}
            
            <Divider />
            
            <Flex justifyContent="space-between" alignItems="center">
              <Flex direction="column" gap="0.25rem">
                <Text fontWeight="bold">Total Points</Text>
                <Text>{totalPoints} / {maxPoints}</Text>
              </Flex>
              
              <Flex direction="column" gap="0.25rem" alignItems="flex-end">
                <Text fontWeight="bold">Grade Percentage</Text>
                <Text fontSize="1.25rem" fontWeight="bold">
                  {gradePercentage}%
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
        
        {/* Feedback and Passing Status */}
        <Card variation="outlined">
          <Flex direction="column" gap="1rem">
            <Heading level={4}>Feedback and Status</Heading>
            <Divider />
            
            <TextAreaField
              label="Feedback for Student"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              isDisabled={submission.status === 'graded'}
            />
            
            <SwitchField
              label="Mark as Passing"
              isChecked={isPassing}
              onChange={(e) => setIsPassing(e.target.checked)}
              isDisabled={submission.status === 'graded'}
            />
            
            {saveSuccess && (
              <Alert variation="success" heading="Grade Saved">
                The grade has been successfully saved and is now visible to the student.
              </Alert>
            )}
            
            {saveError && (
              <Alert variation="error" heading="Error Saving Grade">
                {saveError}
              </Alert>
            )}
            
            <Flex justifyContent="flex-end" gap="1rem">
              <Button 
                onClick={() => router.push('/secure/instructor/submissions')}
                variation="link"
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleSaveGrade}
                variation="primary"
                isLoading={isSaving}
                isDisabled={submission.status === 'graded'}
              >
                {submission.status === 'graded' ? 'Already Graded' : 'Save Grade'}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
};

export default SubmissionGrading; 