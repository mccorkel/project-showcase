'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import SystemAnalytics from '../../../../src/components/analytics/SystemAnalytics';

export default function AdminAnalyticsPage() {
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
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={2}>System Analytics</Heading>
          <Link href="/secure/admin/dashboard">
            <Button variation="link">Back to Admin Dashboard</Button>
          </Link>
        </Flex>
        
        <Text>
          View comprehensive analytics data for the entire system. Monitor user growth, showcase engagement,
          geographic distribution, and system performance metrics.
        </Text>
        
        <SystemAnalytics />
      </Flex>
    </ProtectedRoute>
  );
} 