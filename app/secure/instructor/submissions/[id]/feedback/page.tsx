'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Loader
} from '@aws-amplify/ui-react';
import Link from 'next/link';
import FeedbackSubmission from '../../../../../src/components/instructor/FeedbackSubmission';

interface FeedbackSubmissionPageProps {
  params: {
    id: string;
  };
}

export default function FeedbackSubmissionPage({ params }: FeedbackSubmissionPageProps) {
  const { id } = params;
  const { user, isLoading: authLoading } = useAuth();
  
  if (authLoading) {
    return (
      <ProtectedRoute>
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </ProtectedRoute>
    );
  }
  
  // Check if user has instructor role
  const isInstructor = user?.roles?.includes('instructor');
  
  if (!isInstructor) {
    return (
      <ProtectedRoute>
        <Card>
          <Heading level={2}>Access Denied</Heading>
          <Text>
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </Text>
          <Link href="/secure/dashboard">
            <Button variation="primary" marginTop="1rem">Return to Dashboard</Button>
          </Link>
        </Card>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <Flex direction="column" gap="1rem" padding="1rem">
        <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
          <Heading level={2}>Provide Feedback</Heading>
          <Link href={`/secure/instructor/submissions/${id}`}>
            <Button variation="link">Back to Submission</Button>
          </Link>
        </Flex>
        
        <FeedbackSubmission 
          submissionId={id} 
          onFeedbackSent={() => {
            // In a real app, we might want to redirect or show a success message
            console.log('Feedback sent successfully');
          }}
        />
      </Flex>
    </ProtectedRoute>
  );
} 