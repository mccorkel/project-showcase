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
import UserManagement from '@/components/admin/UserManagement';

export default function UserManagementPage() {
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
  
  // Check if user has admin role
  const isAdmin = user?.roles?.includes('admin');
  
  if (!isAdmin) {
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
          <Heading level={2}>User Management</Heading>
          <Link href="/secure/admin/dashboard">
            <Button variation="link">Back to Dashboard</Button>
          </Link>
        </Flex>
        
        <Text>
          This page allows you to manage user accounts, assign roles, and control access to the system.
          You can create new users, edit existing ones, and manage their permissions.
        </Text>
        
        <UserManagement />
      </Flex>
    </ProtectedRoute>
  );
} 