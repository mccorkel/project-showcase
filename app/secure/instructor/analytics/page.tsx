'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Loader, 
  SelectField,
  View
} from '@aws-amplify/ui-react';
import CohortAnalytics from '../../../../src/components/analytics/CohortAnalytics';

export default function InstructorAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  useEffect(() => {
    // When user is loaded, fetch the instructor's cohorts
    if (user) {
      // In a real app, we would fetch the cohorts from the API
      // For now, we'll simulate this with a timeout
      const fetchCohorts = async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // For demo purposes, we'll create mock cohorts
          const mockCohorts = [
            { id: 'cohort-1', name: 'Web Development - Spring 2025' },
            { id: 'cohort-2', name: 'Data Science - Fall 2024' },
            { id: 'cohort-3', name: 'Mobile Development - Summer 2024' }
          ];
          
          setCohorts(mockCohorts);
          setSelectedCohortId(mockCohorts[0].id); // Select the first cohort by default
        } catch (error) {
          console.error('Error fetching cohorts:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCohorts();
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
  
  if (cohorts.length === 0) {
    return (
      <ProtectedRoute>
        <Card>
          <Heading level={2}>No Cohorts Found</Heading>
          <Text>
            You don't have any assigned cohorts. Please contact an administrator if you believe this is an error.
          </Text>
        </Card>
      </ProtectedRoute>
    );
  }
  
  const selectedCohort = cohorts.find(cohort => cohort.id === selectedCohortId);
  
  return (
    <ProtectedRoute>
      <Flex direction="column" gap="1rem" padding="1rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={2}>Instructor Analytics</Heading>
          <Link href="/secure/instructor/dashboard">
            <Button variation="link">Back to Dashboard</Button>
          </Link>
        </Flex>
        
        <Text>
          View analytics data for your cohorts. See how students are performing, which showcases are most popular,
          and track overall engagement metrics.
        </Text>
        
        <Flex justifyContent="space-between" alignItems="flex-end" marginTop="1rem">
          <SelectField
            label="Select Cohort"
            value={selectedCohortId}
            onChange={(e) => setSelectedCohortId(e.target.value)}
          >
            {cohorts.map(cohort => (
              <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
            ))}
          </SelectField>
        </Flex>
        
        {/* Custom tab navigation */}
        <Flex gap="1rem" marginTop="1rem">
          <Button 
            backgroundColor={activeTab === 'overview' ? '#0972d3' : undefined}
            color={activeTab === 'overview' ? 'white' : undefined}
            onClick={() => setActiveTab('overview')}
          >
            Cohort Overview
          </Button>
          <Button 
            backgroundColor={activeTab === 'comparison' ? '#0972d3' : undefined}
            color={activeTab === 'comparison' ? 'white' : undefined}
            onClick={() => setActiveTab('comparison')}
          >
            Student Comparison
          </Button>
          <Button 
            backgroundColor={activeTab === 'engagement' ? '#0972d3' : undefined}
            color={activeTab === 'engagement' ? 'white' : undefined}
            onClick={() => setActiveTab('engagement')}
          >
            Engagement Metrics
          </Button>
        </Flex>
        
        {/* Tab content */}
        <View marginTop="1rem">
          {activeTab === 'overview' && selectedCohort && (
            <CohortAnalytics 
              cohortId={selectedCohort.id} 
              cohortName={selectedCohort.name}
            />
          )}
          
          {activeTab === 'comparison' && (
            <Card>
              <Heading level={4}>Student Comparison</Heading>
              <Text>
                Compare student showcase performance across various metrics.
              </Text>
              <Flex justifyContent="center" padding="2rem">
                <Text>Student comparison visualization would appear here</Text>
              </Flex>
            </Card>
          )}
          
          {activeTab === 'engagement' && (
            <Card>
              <Heading level={4}>Engagement Metrics</Heading>
              <Text>
                Detailed engagement metrics for the cohort.
              </Text>
              <Flex justifyContent="center" padding="2rem">
                <Text>Engagement metrics visualization would appear here</Text>
              </Flex>
            </Card>
          )}
        </View>
      </Flex>
    </ProtectedRoute>
  );
} 