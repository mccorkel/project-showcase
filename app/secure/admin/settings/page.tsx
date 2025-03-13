'use client';

import React from 'react';
import { Heading, View, Text, Card, Flex, Divider, Button } from '@aws-amplify/ui-react';
import SystemSettings from '@/components/admin/SystemSettings';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { UserRole } from '@/utils/security/fieldAccessControl';

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

  if (user?.role !== 'admin') {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="2rem">
          <Text>Access Denied. You must be an administrator to view this page.</Text>
          <Link href="/secure/dashboard">
            <Button variation="primary" marginTop="1rem">Return to Dashboard</Button>
          </Link>
        </Flex>
      </Card>
    );
  }

  return (
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
            <Link href="/secure/admin/dashboard" className="back-link">
              ← Back to Dashboard
            </Link>
          </Flex>
        </Card>
        
        <SystemSettings />
      </Flex>
    </View>
  );
};

export default AdminSystemSettingsPage; 