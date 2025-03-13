'use client';

import React from 'react';
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
import CohortDetail from '@/components/instructor/CohortDetail';

interface CohortDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CohortDetailPage({ params }: CohortDetailPageProps) {
  const { id } = await params;
  const { user, isLoading: authLoading } = useAuth();
  
  if (authLoading) {
    return (
      <Flex justifyContent="center" padding="2rem">
        <Loader size="large" />
      </Flex>
    );
  }
  
  // Check if user has instructor role
  const isInstructor = user?.roles?.includes('instructor');
  
  if (!isInstructor) {
    return (
      <Card>
        <Heading level={2}>Access Denied</Heading>
        <Text>
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </Text>
        <Link href="/secure/dashboard">
          <Button variation="primary" marginTop="1rem">Return to Dashboard</Button>
        </Link>
      </Card>
    );
  }
  
  return (
    <Flex direction="column" gap="1rem" padding="1rem">
      <CohortDetail cohortId={id} />
    </Flex>
  );
} 