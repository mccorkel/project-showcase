import React, { useState, useEffect } from 'react';
import { Card, Heading, Text, Flex, Divider, Button, SwitchField, TextField, SelectField, Alert } from '@aws-amplify/ui-react';

// Define the system settings interface
interface SystemSettings {
  general: {
    applicationName: string;
    supportEmail: string;
    maintenanceMode: boolean;
  };
  email: {
    enableNotifications: boolean;
    defaultTemplate: string;
    senderName: string;
  };
  authentication: {
    requireMfa: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  storage: {
    maxFileSize: number;
    previewExpiration: number;
    defaultStorageClass: string;
  };
  features: {
    enableAnalytics: boolean;
    enableTemplateCreation: boolean;
    enablePublicProfiles: boolean;
  };
}

const SystemSettingsPage = () => {
  // State for settings
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      applicationName: 'Student Project Showcase',
      supportEmail: 'support@example.com',
      maintenanceMode: false,
    },
    email: {
      enableNotifications: true,
      defaultTemplate: 'standard',
      senderName: 'Student Project Showcase',
    },
    authentication: {
      requireMfa: false,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
    },
    storage: {
      maxFileSize: 10,
      previewExpiration: 24,
      defaultStorageClass: 'standard',
    },
    features: {
      enableAnalytics: true,
      enableTemplateCreation: true,
      enablePublicProfiles: true,
    },
  });

  // State for UI
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // const response = await API.graphql(graphqlOperation(getSystemSettings));
        // setSettings(response.data.getSystemSettings);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we'll use the default settings
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSaveError('Failed to load settings. Please try again.');
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle form submission
  const handleSaveSettings = async () => {
    setIsLoading(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      // In a real implementation, this would be an API call
      // await API.graphql(graphqlOperation(updateSystemSettings, { input: settings }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError('Failed to save settings. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle reset to defaults
  const handleResetDefaults = () => {
    setSettings({
      general: {
        applicationName: 'Student Project Showcase',
        supportEmail: 'support@example.com',
        maintenanceMode: false,
      },
      email: {
        enableNotifications: true,
        defaultTemplate: 'standard',
        senderName: 'Student Project Showcase',
      },
      authentication: {
        requireMfa: false,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
      },
      storage: {
        maxFileSize: 10,
        previewExpiration: 24,
        defaultStorageClass: 'standard',
      },
      features: {
        enableAnalytics: true,
        enableTemplateCreation: true,
        enablePublicProfiles: true,
      },
    });
  };

  return (
    <Flex direction="column" gap="1rem">
      <Heading level={2}>System Settings</Heading>
      <Text>Configure system-wide settings for the Student Project Showcase application.</Text>
      
      {saveSuccess && (
        <Alert variation="success" heading="Settings Saved">
          Your settings have been successfully saved.
        </Alert>
      )}
      
      {saveError && (
        <Alert variation="error" heading="Error">
          {saveError}
        </Alert>
      )}
      
      <Card>
        <Heading level={3}>General Settings</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <TextField
            label="Application Name"
            value={settings.general.applicationName}
            onChange={(e) => setSettings({
              ...settings,
              general: {
                ...settings.general,
                applicationName: e.target.value
              }
            })}
            descriptiveText="The name of the application as displayed to users"
            isDisabled={isLoading}
          />
          <TextField
            label="Support Email"
            value={settings.general.supportEmail}
            onChange={(e) => setSettings({
              ...settings,
              general: {
                ...settings.general,
                supportEmail: e.target.value
              }
            })}
            descriptiveText="Email address for user support inquiries"
            isDisabled={isLoading}
          />
          <SwitchField
            label="Maintenance Mode"
            checked={settings.general.maintenanceMode}
            onChange={(e) => setSettings({
              ...settings,
              general: {
                ...settings.general,
                maintenanceMode: e.target.checked
              }
            })}
            labelPosition="end"
            descriptiveText="When enabled, only administrators can access the application"
            isDisabled={isLoading}
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Email Notification Settings</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <SwitchField
            label="Enable Email Notifications"
            checked={settings.email.enableNotifications}
            onChange={(e) => setSettings({
              ...settings,
              email: {
                ...settings.email,
                enableNotifications: e.target.checked
              }
            })}
            labelPosition="end"
            descriptiveText="Send email notifications for important events"
            isDisabled={isLoading}
          />
          <SelectField
            label="Default Email Template"
            value={settings.email.defaultTemplate}
            onChange={(e) => setSettings({
              ...settings,
              email: {
                ...settings.email,
                defaultTemplate: e.target.value
              }
            })}
            descriptiveText="Template used for system-generated emails"
            isDisabled={isLoading}
          >
            <option value="standard">Standard Template</option>
            <option value="minimal">Minimal Template</option>
            <option value="branded">Branded Template</option>
          </SelectField>
          <TextField
            label="Sender Name"
            value={settings.email.senderName}
            onChange={(e) => setSettings({
              ...settings,
              email: {
                ...settings.email,
                senderName: e.target.value
              }
            })}
            descriptiveText="Name displayed as the sender of system emails"
            isDisabled={isLoading}
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Authentication Settings</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <SwitchField
            label="Require MFA"
            checked={settings.authentication.requireMfa}
            onChange={(e) => setSettings({
              ...settings,
              authentication: {
                ...settings.authentication,
                requireMfa: e.target.checked
              }
            })}
            labelPosition="end"
            descriptiveText="Require multi-factor authentication for all users"
            isDisabled={isLoading}
          />
          <TextField
            label="Session Timeout (minutes)"
            type="number"
            value={settings.authentication.sessionTimeout.toString()}
            onChange={(e) => setSettings({
              ...settings,
              authentication: {
                ...settings.authentication,
                sessionTimeout: parseInt(e.target.value) || 0
              }
            })}
            descriptiveText="Time of inactivity before a user is automatically logged out"
            isDisabled={isLoading}
          />
          <TextField
            label="Maximum Failed Login Attempts"
            type="number"
            value={settings.authentication.maxLoginAttempts.toString()}
            onChange={(e) => setSettings({
              ...settings,
              authentication: {
                ...settings.authentication,
                maxLoginAttempts: parseInt(e.target.value) || 0
              }
            })}
            descriptiveText="Number of failed login attempts before account lockout"
            isDisabled={isLoading}
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
            value={settings.storage.maxFileSize.toString()}
            onChange={(e) => setSettings({
              ...settings,
              storage: {
                ...settings.storage,
                maxFileSize: parseInt(e.target.value) || 0
              }
            })}
            descriptiveText="Maximum size for uploaded files"
            isDisabled={isLoading}
          />
          <TextField
            label="Preview Expiration (hours)"
            type="number"
            value={settings.storage.previewExpiration.toString()}
            onChange={(e) => setSettings({
              ...settings,
              storage: {
                ...settings.storage,
                previewExpiration: parseInt(e.target.value) || 0
              }
            })}
            descriptiveText="Time before preview files are automatically deleted"
            isDisabled={isLoading}
          />
          <SelectField
            label="Default Storage Class"
            value={settings.storage.defaultStorageClass}
            onChange={(e) => setSettings({
              ...settings,
              storage: {
                ...settings.storage,
                defaultStorageClass: e.target.value
              }
            })}
            descriptiveText="S3 storage class for uploaded files"
            isDisabled={isLoading}
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
            checked={settings.features.enableAnalytics}
            onChange={(e) => setSettings({
              ...settings,
              features: {
                ...settings.features,
                enableAnalytics: e.target.checked
              }
            })}
            labelPosition="end"
            descriptiveText="Collect and display analytics data"
            isDisabled={isLoading}
          />
          <SwitchField
            label="Enable Template Creation"
            checked={settings.features.enableTemplateCreation}
            onChange={(e) => setSettings({
              ...settings,
              features: {
                ...settings.features,
                enableTemplateCreation: e.target.checked
              }
            })}
            labelPosition="end"
            descriptiveText="Allow users to create custom templates"
            isDisabled={isLoading}
          />
          <SwitchField
            label="Enable Public Profiles"
            checked={settings.features.enablePublicProfiles}
            onChange={(e) => setSettings({
              ...settings,
              features: {
                ...settings.features,
                enablePublicProfiles: e.target.checked
              }
            })}
            labelPosition="end"
            descriptiveText="Allow students to make their profiles public"
            isDisabled={isLoading}
          />
        </Flex>
      </Card>
      
      <Flex justifyContent="flex-end" gap="1rem">
        <Button 
          variation="link" 
          onClick={handleResetDefaults}
          isDisabled={isLoading}
        >
          Reset to Defaults
        </Button>
        <Button 
          variation="primary" 
          onClick={handleSaveSettings}
          isLoading={isLoading}
          loadingText="Saving..."
        >
          Save Settings
        </Button>
      </Flex>
    </Flex>
  );
};

export default SystemSettingsPage; 