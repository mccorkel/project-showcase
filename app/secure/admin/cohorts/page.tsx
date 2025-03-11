'use client';

import { Heading, View, Text, Card, Flex, Divider } from '@aws-amplify/ui-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CohortManagement from '@/src/components/admin/CohortManagement';
import { useAuth } from '@/contexts/AuthContext';

const AdminCohortManagementPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="2rem">
          <Text>Loading...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      {user?.role !== 'admin' ? (
        <Card variation="elevated">
          <Flex justifyContent="center" padding="2rem">
            <Text>Access Denied. You must be an administrator to view this page.</Text>
          </Flex>
        </Card>
      ) : (
        <View padding="1rem">
          <Flex direction="column" gap="1.5rem">
            <Card variation="elevated">
              <Flex direction="column" padding="1.5rem" gap="1rem">
                <Heading level={2}>Cohort Management</Heading>
                <Text>Create, edit, and manage cohorts for the Student Project Showcase platform.</Text>
                <Divider />
                <Text>
                  As an administrator, you can create new cohorts, assign instructors, update cohort details, 
                  and manage the status of each cohort. Use the filters to quickly find specific cohorts.
                </Text>
              </Flex>
            </Card>
            
            <CohortManagement />
          </Flex>
        </View>
      )}
    </ProtectedRoute>
  );
};

export default AdminCohortManagementPage; 