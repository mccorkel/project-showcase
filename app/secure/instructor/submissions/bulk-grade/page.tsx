'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Loader,
  SelectField
} from '@aws-amplify/ui-react';
import Link from 'next/link';
import BulkGradingActions from '@/components/instructor/BulkGradingActions';

export default function BulkGradingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedCohort, setSelectedCohort] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  
  // Mock cohorts data
  const cohorts = [
    { id: 'cohort-1', name: 'Web Development - Fall 2023' },
    { id: 'cohort-2', name: 'Data Science - Spring 2023' },
    { id: 'cohort-3', name: 'UX Design - Summer 2023' }
  ];
  
  // Generate weeks 1-12
  const weeks = Array.from({ length: 12 }, (_, i) => ({ 
    id: (i + 1).toString(), 
    name: `Week ${i + 1}` 
  }));
  
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
      <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
        <Heading level={2}>Bulk Grading</Heading>
        <Link href="/secure/instructor/submissions">
          <Button variation="link">Back to Submissions</Button>
        </Link>
      </Flex>
      
      <Card>
        <Heading level={4}>Filter Submissions</Heading>
        <Flex direction={{ base: 'column', medium: 'row' }} gap="1rem" marginTop="1rem">
          <SelectField
            label="Cohort"
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            flex={1}
          >
            <option value="">All Cohorts</option>
            {cohorts.map(cohort => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </SelectField>
          
          <SelectField
            label="Week"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            flex={1}
          >
            <option value="">All Weeks</option>
            {weeks.map(week => (
              <option key={week.id} value={week.id}>
                {week.name}
              </option>
            ))}
          </SelectField>
        </Flex>
      </Card>
      
      <BulkGradingActions 
        cohortId={selectedCohort || undefined} 
        week={selectedWeek ? parseInt(selectedWeek) : undefined}
        onGradingComplete={() => {
          // In a real app, we might want to refresh data or show a success message
          console.log('Bulk grading completed');
        }}
      />
    </Flex>
  );
} 