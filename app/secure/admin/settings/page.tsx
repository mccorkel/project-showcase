'use client';

import { Heading, View, Text, Card, Flex, Divider } from '@aws-amplify/ui-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SystemSettings from '@/src/components/admin/SystemSettings';
import { useAuth } from '@/contexts/AuthContext';

const AdminSystemSettingsPage = () => {
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
                <Heading level={2}>System Settings</Heading>
                <Text>Configure system-wide settings for the Student Project Showcase platform.</Text>
                <Divider />
                <Text>
                  As an administrator, you can customize various aspects of the platform including general settings,
                  showcase features, user management, notifications, analytics, and security settings.
                  Changes made here will affect the entire platform.
                </Text>
              </Flex>
            </Card>
            
            <SystemSettings />
          </Flex>
        </View>
      )}
    </ProtectedRoute>
  );
};

export default AdminSystemSettingsPage; 