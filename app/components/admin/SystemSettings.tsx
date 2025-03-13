'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  SwitchField,
  TextField,
  SelectField,
  TextAreaField,
  Divider,
  Tabs,
  Alert
} from '@aws-amplify/ui-react';
import { useAuth } from '@/contexts/AuthContext';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    defaultUserRole: string;
    allowPublicRegistration: boolean;
    maintenanceMode: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireMfa: boolean;
    enforceHttps: boolean;
  };
  email: {
    fromEmail: string;
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    enableEmailNotifications: boolean;
  };
  lms: {
    lmsIntegration: boolean;
    lmsUrl: string;
    lmsApiKey: string;
    syncFrequency: string;
  };
}

const SystemSettings: React.FC = () => {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'Project Showcase',
      siteDescription: 'A platform for students to showcase their projects',
      defaultUserRole: 'student',
      allowPublicRegistration: true,
      maintenanceMode: false,
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireMfa: false,
      enforceHttps: true,
    },
    email: {
      fromEmail: 'noreply@projectshowcase.example.com',
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'smtp-user',
      smtpPassword: '',
      enableEmailNotifications: true,
    },
    lms: {
      lmsIntegration: false,
      lmsUrl: '',
      lmsApiKey: '',
      syncFrequency: 'daily',
    },
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
  useEffect(() => {
    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await API.get('adminAPI', '/settings', {});
        // setSettings(response);
        
        // For demo purposes, we'll just simulate a delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleSettingChange = (
    category: keyof SystemSettings, 
    field: string, 
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // In a real app, this would be an API call
      // await API.post('adminAPI', '/settings', {
      //   body: settings
      // });
      
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleResetToDefaults = async () => {
    setIsResetting(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // In a real app, this would be an API call to reset settings
      // await API.post('adminAPI', '/settings/reset', {});
      
      // For demo purposes, we'll just simulate a delay and reset to default values
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings({
        general: {
          siteName: 'Project Showcase',
          siteDescription: 'A platform for students to showcase their projects',
          defaultUserRole: 'student',
          allowPublicRegistration: true,
          maintenanceMode: false,
        },
        security: {
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          requireMfa: false,
          enforceHttps: true,
        },
        email: {
          fromEmail: 'noreply@projectshowcase.example.com',
          smtpServer: 'smtp.example.com',
          smtpPort: 587,
          smtpUsername: 'smtp-user',
          smtpPassword: '',
          enableEmailNotifications: true,
        },
        lms: {
          lmsIntegration: false,
          lmsUrl: '',
          lmsApiKey: '',
          syncFrequency: 'daily',
        },
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error resetting settings:', error);
      setSaveError('Failed to reset settings. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };
  
  if (isLoading) {
    return <Flex justifyContent="center">Loading settings...</Flex>;
  }
  
  return (
    <Card>
      <Flex direction="column" gap="1.5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={3}>System Settings</Heading>
          <Button
            variation="primary"
            onClick={handleSaveSettings}
            isLoading={isSaving}
          >
            Save Settings
          </Button>
        </Flex>
        
        {saveSuccess && (
          <Alert variation="success">Settings saved successfully!</Alert>
        )}
        
        {saveError && (
          <Alert variation="error">{saveError}</Alert>
        )}
        
        <Text>
          Configure system-wide settings for the Project Showcase application.
        </Text>
        
        <Tabs
          spacing="equal"
          defaultValue="general"
        >
          <Tabs.Item title="General" value="general">
            <Flex direction="column" gap="1rem" padding="1rem">
              <TextField
                label="Site Name"
                value={settings.general.siteName}
                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
              />
              
              <TextAreaField
                label="Site Description"
                value={settings.general.siteDescription}
                onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                rows={3}
              />
              
              <SelectField
                label="Default User Role"
                value={settings.general.defaultUserRole}
                onChange={(e) => handleSettingChange('general', 'defaultUserRole', e.target.value)}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Administrator</option>
              </SelectField>
              
              <SwitchField
                label="Allow Public Registration"
                checked={settings.general.allowPublicRegistration}
                onChange={(e) => handleSettingChange('general', 'allowPublicRegistration', e.target.checked)}
              />
              
              <SwitchField
                label="Maintenance Mode"
                checked={settings.general.maintenanceMode}
                onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
              />
            </Flex>
          </Tabs.Item>
          
          <Tabs.Item title="Security" value="security">
            <Flex direction="column" gap="1rem" padding="1rem">
              <TextField
                label="Session Timeout (minutes)"
                type="number"
                value={settings.security.sessionTimeout.toString()}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value) || 0)}
              />
              
              <TextField
                label="Maximum Login Attempts"
                type="number"
                value={settings.security.maxLoginAttempts.toString()}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value) || 0)}
              />
              
              <TextField
                label="Minimum Password Length"
                type="number"
                value={settings.security.passwordMinLength.toString()}
                onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value) || 0)}
              />
              
              <SwitchField
                label="Require Multi-Factor Authentication"
                checked={settings.security.requireMfa}
                onChange={(e) => handleSettingChange('security', 'requireMfa', e.target.checked)}
              />
              
              <SwitchField
                label="Enforce HTTPS"
                checked={settings.security.enforceHttps}
                onChange={(e) => handleSettingChange('security', 'enforceHttps', e.target.checked)}
              />
            </Flex>
          </Tabs.Item>
          
          <Tabs.Item title="Email" value="email">
            <Flex direction="column" gap="1rem" padding="1rem">
              <TextField
                label="From Email Address"
                value={settings.email.fromEmail}
                onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
              />
              
              <TextField
                label="SMTP Server"
                value={settings.email.smtpServer}
                onChange={(e) => handleSettingChange('email', 'smtpServer', e.target.value)}
              />
              
              <TextField
                label="SMTP Port"
                type="number"
                value={settings.email.smtpPort.toString()}
                onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value) || 0)}
              />
              
              <TextField
                label="SMTP Username"
                value={settings.email.smtpUsername}
                onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
              />
              
              <TextField
                label="SMTP Password"
                type="password"
                value={settings.email.smtpPassword}
                onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
              />
              
              <SwitchField
                label="Enable Email Notifications"
                checked={settings.email.enableEmailNotifications}
                onChange={(e) => handleSettingChange('email', 'enableEmailNotifications', e.target.checked)}
              />
            </Flex>
          </Tabs.Item>
          
          <Tabs.Item title="LMS Integration" value="lms">
            <Flex direction="column" gap="1rem" padding="1rem">
              <SwitchField
                label="Enable LMS Integration"
                checked={settings.lms.lmsIntegration}
                onChange={(e) => handleSettingChange('lms', 'lmsIntegration', e.target.checked)}
              />
              
              <TextField
                label="LMS URL"
                value={settings.lms.lmsUrl}
                onChange={(e) => handleSettingChange('lms', 'lmsUrl', e.target.value)}
                isDisabled={!settings.lms.lmsIntegration}
              />
              
              <TextField
                label="LMS API Key"
                type="password"
                value={settings.lms.lmsApiKey}
                onChange={(e) => handleSettingChange('lms', 'lmsApiKey', e.target.value)}
                isDisabled={!settings.lms.lmsIntegration}
              />
              
              <SelectField
                label="Sync Frequency"
                value={settings.lms.syncFrequency}
                onChange={(e) => handleSettingChange('lms', 'syncFrequency', e.target.value)}
                isDisabled={!settings.lms.lmsIntegration}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual Only</option>
              </SelectField>
            </Flex>
          </Tabs.Item>
        </Tabs>
        
        <Divider />
        
        <Flex justifyContent="flex-end">
          <Button
            onClick={handleResetToDefaults}
            isLoading={isResetting}
          >
            Reset to Defaults
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default SystemSettings; 