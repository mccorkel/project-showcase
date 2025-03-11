import React, { useState, useEffect } from 'react';
import {
  Card,
  Heading,
  Text,
  Button,
  TextAreaField,
  SelectField,
  Flex,
  Badge,
  Alert,
  Divider,
  Loader
} from '@aws-amplify/ui-react';

interface FeedbackSubmissionProps {
  submissionId: string;
  studentId?: string;
  onFeedbackSent?: () => void;
}

interface FeedbackTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
}

// Mock feedback templates
const mockFeedbackTemplates: FeedbackTemplate[] = [
  {
    id: 'template1',
    title: 'Excellent Work',
    content: 'Your submission demonstrates excellent understanding of the concepts and exceptional implementation. The code is well-structured, documented, and follows best practices.',
    category: 'positive'
  },
  {
    id: 'template2',
    title: 'Good Progress',
    content: 'You\'ve made good progress with this submission. The implementation shows understanding of core concepts, though there are some areas that could be improved.',
    category: 'positive'
  },
  {
    id: 'template3',
    title: 'Needs Improvement - Code Structure',
    content: 'Your submission needs improvement in code structure. Consider organizing your code into smaller, more focused components/functions and following the single responsibility principle.',
    category: 'constructive'
  },
  {
    id: 'template4',
    title: 'Needs Improvement - Documentation',
    content: 'Your submission needs more thorough documentation. Please add comments to explain complex logic and ensure functions have proper JSDoc comments.',
    category: 'constructive'
  },
  {
    id: 'template5',
    title: 'Needs Improvement - Testing',
    content: 'Your submission lacks sufficient testing. Please add unit tests to cover the main functionality and edge cases.',
    category: 'constructive'
  }
];

// Mock function to fetch submission details
const fetchSubmissionDetails = async (submissionId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: submissionId,
    studentName: 'Alex Johnson',
    title: 'React Application',
    submittedAt: '2023-10-14T15:30:00Z',
    status: 'graded'
  };
};

export default function FeedbackSubmission({ submissionId, studentId, onFeedbackSent }: FeedbackSubmissionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [feedbackType, setFeedbackType] = useState('assignment');
  
  useEffect(() => {
    const loadSubmission = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchSubmissionDetails(submissionId);
        setSubmission(data);
      } catch (err) {
        setError('Failed to load submission details. Please try again.');
        console.error('Error loading submission:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubmission();
  }, [submissionId]);
  
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = mockFeedbackTemplates.find(t => t.id === templateId);
      if (template) {
        setFeedbackText(prevText => {
          // If there's already text, append the template
          if (prevText.trim()) {
            return `${prevText}\n\n${template.content}`;
          }
          return template.content;
        });
      }
    }
  };
  
  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      setError('Please enter feedback before sending.');
      return;
    }
    
    try {
      setIsSending(true);
      setError(null);
      setSuccess(null);
      
      // Simulate API call to send feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Feedback sent successfully!');
      if (onFeedbackSent) {
        onFeedbackSent();
      }
      
      // Clear the form after successful submission
      setFeedbackText('');
      setSelectedTemplate('');
    } catch (err) {
      setError('Failed to send feedback. Please try again.');
      console.error('Error sending feedback:', err);
    } finally {
      setIsSending(false);
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
  
  if (error && !submission) {
    return (
      <Card variation="elevated">
        <Alert variation="error">{error}</Alert>
      </Card>
    );
  }
  
  return (
    <Card variation="elevated">
      <Heading level={3}>Send Feedback</Heading>
      
      {submission && (
        <Flex direction="column" gap="0.5rem" marginBottom="1rem">
          <Text>
            <strong>Student:</strong> {submission.studentName}
          </Text>
          <Text>
            <strong>Submission:</strong> {submission.title}
          </Text>
          <Text>
            <strong>Status:</strong> <Badge variation={submission.status === 'graded' ? 'success' : 'info'}>{submission.status}</Badge>
          </Text>
        </Flex>
      )}
      
      <Divider marginBottom="1rem" />
      
      <Flex direction="column" gap="1rem">
        <SelectField
          label="Feedback Type"
          value={feedbackType}
          onChange={(e) => setFeedbackType(e.target.value)}
        >
          <option value="assignment">Assignment Feedback</option>
          <option value="progress">Progress Feedback</option>
          <option value="general">General Feedback</option>
        </SelectField>
        
        <SelectField
          label="Use Template"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <option value="">Select a template (optional)</option>
          <optgroup label="Positive Feedback">
            {mockFeedbackTemplates
              .filter(t => t.category === 'positive')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
          </optgroup>
          <optgroup label="Constructive Feedback">
            {mockFeedbackTemplates
              .filter(t => t.category === 'constructive')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
          </optgroup>
        </SelectField>
        
        <TextAreaField
          label="Feedback"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Enter your feedback for the student..."
          rows={8}
          required
        />
        
        {error && <Alert variation="error">{error}</Alert>}
        {success && <Alert variation="success">{success}</Alert>}
        
        <Flex justifyContent="space-between">
          <Button
            variation="primary"
            onClick={handleSendFeedback}
            isLoading={isSending}
            loadingText="Sending..."
          >
            Send Feedback
          </Button>
          <Button
            variation="link"
            onClick={() => {
              setFeedbackText('');
              setSelectedTemplate('');
              setError(null);
              setSuccess(null);
            }}
            isDisabled={isSending}
          >
            Clear
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
} 