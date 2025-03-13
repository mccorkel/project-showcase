"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Loader
} from '@aws-amplify/ui-react';
import CohortManagement from '@/components/instructor/CohortManagement';
import { UserRole } from '@/utils/security/fieldAccessControl';

export default function InstructorCohortsPage() {
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
        <Flex direction="column" padding="1rem" gap="1rem">
          <Heading level={2}>Access Denied</Heading>
          <Text>
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </Text>
          <Link href="/secure/dashboard">
            <Button variation="primary">Return to Dashboard</Button>
          </Link>
        </Flex>
      </Card>
    );
  }
  
  return (
    <Flex direction="column" gap="1rem" padding="1rem">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={2}>Cohort Management</Heading>
        <Link href="/secure/instructor/dashboard">
          <Button variation="link">Back to Dashboard</Button>
        </Link>
      </Flex>
      
      <Text>
        Manage your assigned cohorts, view student progress, and track cohort performance.
        You can create new cohorts, edit existing ones, and view detailed information about each cohort.
      </Text>
      
      <CohortManagement />
    </Flex>
  );
} 