'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Heading, Text, Button, Flex, Loader } from '@aws-amplify/ui-react';
import AnalyticsDashboard from '../../../src/components/analytics/AnalyticsDashboard';

export default function PersonalAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [showcaseId, setShowcaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  
  useEffect(() => {
    // When user is loaded, fetch the student profile and showcase ID
    if (user) {
      // In a real app, we would fetch the student profile and showcase ID from the API
      // For now, we'll simulate this with a timeout
      const fetchData = async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // For demo purposes, we'll create a mock student profile
          const mockStudentProfile = {
            id: user.username,
            username: user.username,
            firstName: 'Demo',
            lastName: 'Student'
          };
          
          setStudentProfile(mockStudentProfile);
          setShowcaseId(mockStudentProfile.id);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user]);
  
  if (authLoading || isLoading) {
    return (
      <ProtectedRoute>
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </ProtectedRoute>
    );
  }
  
  if (!showcaseId) {
    return (
      <ProtectedRoute>
        <Card>
          <Heading level={2}>No Showcase Found</Heading>
          <Text>
            You need to create a showcase before you can view analytics.
          </Text>
          <Flex marginTop="1rem">
            <Link href="/secure/showcase">
              <Button>Create Showcase</Button>
            </Link>
          </Flex>
        </Card>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <Flex direction="column" gap="1rem" padding="1rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={2}>Personal Analytics</Heading>
          <Link href="/secure/dashboard">
            <Button variation="link">Back to Dashboard</Button>
          </Link>
        </Flex>
        
        <Text>
          View analytics data for your published showcase. See how many people have viewed your
          showcase, which projects are most popular, and where your visitors are coming from.
        </Text>
        
        <AnalyticsDashboard 
          showcaseId={showcaseId} 
          username={studentProfile?.username || ''}
        />
      </Flex>
    </ProtectedRoute>
  );
} 