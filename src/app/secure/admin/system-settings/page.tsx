import React from 'react';
import { Card, Heading, Text, Flex, Divider, Button, SwitchField, TextField, SelectField } from '@aws-amplify/ui-react';

const SystemSettingsPage = () => {
  return (
    <Flex direction="column" gap="1rem">
      <Heading level={2}>System Settings</Heading>
      <Text>Configure system-wide settings for the Student Project Showcase application.</Text>
      
      <Card>
        <Heading level={3}>General Settings</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <TextField
            label="Application Name"
            defaultValue="Student Project Showcase"
            descriptiveText="The name of the application as displayed to users"
          />
          <TextField
            label="Support Email"
            defaultValue="support@example.com"
            descriptiveText="Email address for user support inquiries"
          />
          <SwitchField
            label="Maintenance Mode"
            defaultChecked={false}
            labelPosition="end"
            descriptiveText="When enabled, only administrators can access the application"
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Email Notification Settings</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <SwitchField
            label="Enable Email Notifications"
            defaultChecked={true}
            labelPosition="end"
            descriptiveText="Send email notifications for important events"
          />
          <SelectField
            label="Default Email Template"
            descriptiveText="Template used for system-generated emails"
          >
            <option value="standard">Standard Template</option>
            <option value="minimal">Minimal Template</option>
            <option value="branded">Branded Template</option>
          </SelectField>
          <TextField
            label="Sender Name"
            defaultValue="Student Project Showcase"
            descriptiveText="Name displayed as the sender of system emails"
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Authentication Settings</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <SwitchField
            label="Require MFA"
            defaultChecked={false}
            labelPosition="end"
            descriptiveText="Require multi-factor authentication for all users"
          />
          <TextField
            label="Session Timeout (minutes)"
            type="number"
            defaultValue="60"
            descriptiveText="Time of inactivity before a user is automatically logged out"
          />
          <TextField
            label="Maximum Failed Login Attempts"
            type="number"
            defaultValue="5"
            descriptiveText="Number of failed login attempts before account lockout"
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Storage Configuration</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <TextField
            label="Maximum File Size (MB)"
            type="number"
            defaultValue="10"
            descriptiveText="Maximum size for uploaded files"
          />
          <TextField
            label="Preview Expiration (hours)"
            type="number"
            defaultValue="24"
            descriptiveText="Time before preview files are automatically deleted"
          />
          <SelectField
            label="Default Storage Class"
            descriptiveText="S3 storage class for uploaded files"
          >
            <option value="standard">Standard</option>
            <option value="intelligent-tiering">Intelligent Tiering</option>
            <option value="standard-ia">Standard-IA</option>
          </SelectField>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Feature Toggles</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <SwitchField
            label="Enable Analytics"
            defaultChecked={true}
            labelPosition="end"
            descriptiveText="Collect and display analytics data"
          />
          <SwitchField
            label="Enable Template Creation"
            defaultChecked={true}
            labelPosition="end"
            descriptiveText="Allow users to create custom templates"
          />
          <SwitchField
            label="Enable Public Profiles"
            defaultChecked={true}
            labelPosition="end"
            descriptiveText="Allow students to make their profiles public"
          />
        </Flex>
      </Card>
      
      <Flex justifyContent="flex-end" gap="1rem">
        <Button variation="link">Reset to Defaults</Button>
        <Button variation="primary">Save Settings</Button>
      </Flex>
    </Flex>
  );
};

export default SystemSettingsPage; 