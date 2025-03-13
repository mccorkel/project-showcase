'use client';

import React from 'react';
import { Card, Heading, Text, Button, Flex } from '@aws-amplify/ui-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

interface CohortDetailProps {
  cohortId: string;
}

const CohortDetail: React.FC<CohortDetailProps> = ({ cohortId }) => {
  return (
    <ProtectedRoute>
      <Card variation="elevated">
        <Flex direction="column" gap="1rem">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading level={2}>Cohort Details</Heading>
            <Link href="/secure/admin/cohorts">
              <Button variation="link">Back to Cohorts</Button>
            </Link>
          </Flex>
          
          <Text>Viewing details for cohort ID: {cohortId}</Text>
          
          <Text>This is a placeholder for the cohort detail page.</Text>
        </Flex>
      </Card>
    </ProtectedRoute>
  );
};

export default CohortDetail; 