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
import RoleAssignment from '@/components/admin/RoleAssignment';
import { UserRole } from '@/utils/security/fieldAccessControl';

export default function RoleAssignmentPage() {
  const { user, isLoading: authLoading } = useAuth();
  
  if (authLoading) {
    return (
      <Flex justifyContent="center" padding="2rem">
        <Loader size="large" />
      </Flex>
    );
  }
  
  return (
    <Flex direction="column" gap="1rem" padding="1rem">
      <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
        <Heading level={2}>Role Assignment</Heading>
        <Link href="/secure/admin/dashboard">
          <Button variation="link">Back to Dashboard</Button>
        </Link>
      </Flex>
      
      <Text>
        This page allows you to assign roles to users in the system. Roles determine what actions users can perform and what pages they can access.
      </Text>
      
      <RoleAssignment />
    </Flex>
  );
} 