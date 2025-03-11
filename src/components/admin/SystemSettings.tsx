import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Card,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  View,
  Badge,
  Alert,
  Divider,
  Loader,
  TextField,
  SelectField,
  SwitchField,
  TextAreaField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@aws-amplify/ui-react';

// Mock data for system settings
const generateMockSettings = () => {
  return {
    general: {
      siteName: 'Student Project Showcase',
      siteDescription: 'A platform for students to showcase their projects and portfolios',
      contactEmail: 'admin@projectshowcase.edu',
      supportEmail: 'support@projectshowcase.edu',
      maxProjectsPerStudent: 10,
      defaultProjectVisibility: 'private',
      allowPublicProfiles: true,
      enableSocialSharing: true,
      maintenanceMode: false,
      maintenanceMessage: 'The system is currently undergoing scheduled maintenance. Please check back later.',
    },
    showcase: {
      featuredProjectsCount: 6,
      projectsPerPage: 12,
      allowComments: true,
      moderateComments: true,
      allowRatings: true,
      showViewCount: true,
      defaultSortOrder: 'newest',
      allowedFileTypes: 'jpg,jpeg,png,gif,pdf,zip,doc,docx,ppt,pptx',
      maxFileSize: 10, // MB
      enableTemplates: true,
    },
    users: {
      allowSelfRegistration: true,
      requireEmailVerification: true,
      passwordMinLength: 8,
      passwordRequireSpecialChar: true,
      passwordRequireNumber: true,
      passwordRequireUppercase: true,
      sessionTimeout: 60, // minutes
      maxLoginAttempts: 5,
      lockoutDuration: 30, // minutes
    },
    notifications: {
      enableEmailNotifications: true,
      enableInAppNotifications: true,
      notifyOnComments: true,
      notifyOnRatings: true,
      notifyOnFeedback: true,
      emailDigestFrequency: 'daily',
      adminEmailNotifications: true,
    },
    analytics: {
      enableAnalytics: true,
      trackPageViews: true,
      trackUserActions: true,
      anonymizeIPs: true,
      retentionPeriod: 365, // days
      enableExport: true,
    },
    security: {
      enableTwoFactorAuth: false,
      requireTwoFactorForAdmins: false,
      allowedLoginIPs: '',
      enableCaptcha: true,
      enableCSRFProtection: true,
      contentSecurityPolicy: 'default',
      enableSSL: true,
    }
  };
};

interface SystemSettingsProps {
  // In a real implementation, we might pass in props like onSettingsSaved
}

const SystemSettings: React.FC<SystemSettingsProps> = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const mockSettings = generateMockSettings();
      
      setSettings(mockSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load system settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      setSuccess('Settings saved successfully');
      setUnsavedChanges(false);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (category: string, setting: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [setting]: value
      }
    }));
    setUnsavedChanges(true);
  };
  
  const handleResetToDefaults = async () => {
    if (window.confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        const defaultSettings = generateMockSettings();
        
        setSettings(defaultSettings);
        setSuccess('Settings reset to defaults successfully');
        setUnsavedChanges(false);
        
        // Clear success message after a delay
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err) {
        console.error('Error resetting settings:', err);
        setError('Failed to reset settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const renderGeneralSettings = () => {
    return (
      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
        gap="1rem"
      >
        <TextField
          label="Site Name"
          value={settings.general.siteName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('general', 'siteName', e.target.value)
          }
        />
        
        <TextField
          label="Contact Email"
          type="email"
          value={settings.general.contactEmail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('general', 'contactEmail', e.target.value)
          }
        />
        
        <TextField
          label="Support Email"
          type="email"
          value={settings.general.supportEmail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('general', 'supportEmail', e.target.value)
          }
        />
        
        <TextField
          label="Max Projects Per Student"
          type="number"
          value={settings.general.maxProjectsPerStudent}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('general', 'maxProjectsPerStudent', parseInt(e.target.value))
          }
        />
        
        <SelectField
          label="Default Project Visibility"
          value={settings.general.defaultProjectVisibility}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => 
            handleInputChange('general', 'defaultProjectVisibility', e.target.value)
          }
        >
          <option value="private">Private</option>
          <option value="cohort">Cohort Only</option>
          <option value="public">Public</option>
        </SelectField>
        
        <View>
          <SwitchField
            label="Allow Public Profiles"
            isChecked={settings.general.allowPublicProfiles}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('general', 'allowPublicProfiles', e.target.checked)
            }
          />
          
          <SwitchField
            label="Enable Social Sharing"
            isChecked={settings.general.enableSocialSharing}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('general', 'enableSocialSharing', e.target.checked)
            }
          />
          
          <SwitchField
            label="Maintenance Mode"
            isChecked={settings.general.maintenanceMode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('general', 'maintenanceMode', e.target.checked)
            }
          />
        </View>
        
        <TextAreaField
          label="Site Description"
          value={settings.general.siteDescription}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
            handleInputChange('general', 'siteDescription', e.target.value)
          }
          rows={3}
        />
        
        <TextAreaField
          label="Maintenance Message"
          value={settings.general.maintenanceMessage}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
            handleInputChange('general', 'maintenanceMessage', e.target.value)
          }
          rows={3}
        />
      </Grid>
    );
  };
  
  const renderShowcaseSettings = () => {
    return (
      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
        gap="1rem"
      >
        <TextField
          label="Featured Projects Count"
          type="number"
          value={settings.showcase.featuredProjectsCount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('showcase', 'featuredProjectsCount', parseInt(e.target.value))
          }
        />
        
        <TextField
          label="Projects Per Page"
          type="number"
          value={settings.showcase.projectsPerPage}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('showcase', 'projectsPerPage', parseInt(e.target.value))
          }
        />
        
        <SelectField
          label="Default Sort Order"
          value={settings.showcase.defaultSortOrder}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => 
            handleInputChange('showcase', 'defaultSortOrder', e.target.value)
          }
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
        </SelectField>
        
        <TextField
          label="Max File Size (MB)"
          type="number"
          value={settings.showcase.maxFileSize}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('showcase', 'maxFileSize', parseInt(e.target.value))
          }
        />
        
        <TextAreaField
          label="Allowed File Types"
          value={settings.showcase.allowedFileTypes}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
            handleInputChange('showcase', 'allowedFileTypes', e.target.value)
          }
          placeholder="Comma-separated list of file extensions"
        />
        
        <View>
          <SwitchField
            label="Allow Comments"
            isChecked={settings.showcase.allowComments}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('showcase', 'allowComments', e.target.checked)
            }
          />
          
          <SwitchField
            label="Moderate Comments"
            isChecked={settings.showcase.moderateComments}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('showcase', 'moderateComments', e.target.checked)
            }
          />
          
          <SwitchField
            label="Allow Ratings"
            isChecked={settings.showcase.allowRatings}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('showcase', 'allowRatings', e.target.checked)
            }
          />
          
          <SwitchField
            label="Show View Count"
            isChecked={settings.showcase.showViewCount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('showcase', 'showViewCount', e.target.checked)
            }
          />
          
          <SwitchField
            label="Enable Templates"
            isChecked={settings.showcase.enableTemplates}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('showcase', 'enableTemplates', e.target.checked)
            }
          />
        </View>
      </Grid>
    );
  };
  
  const renderUserSettings = () => {
    return (
      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
        gap="1rem"
      >
        <TextField
          label="Password Minimum Length"
          type="number"
          value={settings.users.passwordMinLength}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('users', 'passwordMinLength', parseInt(e.target.value))
          }
        />
        
        <TextField
          label="Session Timeout (minutes)"
          type="number"
          value={settings.users.sessionTimeout}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('users', 'sessionTimeout', parseInt(e.target.value))
          }
        />
        
        <TextField
          label="Max Login Attempts"
          type="number"
          value={settings.users.maxLoginAttempts}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('users', 'maxLoginAttempts', parseInt(e.target.value))
          }
        />
        
        <TextField
          label="Lockout Duration (minutes)"
          type="number"
          value={settings.users.lockoutDuration}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('users', 'lockoutDuration', parseInt(e.target.value))
          }
        />
        
        <View>
          <SwitchField
            label="Allow Self Registration"
            isChecked={settings.users.allowSelfRegistration}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('users', 'allowSelfRegistration', e.target.checked)
            }
          />
          
          <SwitchField
            label="Require Email Verification"
            isChecked={settings.users.requireEmailVerification}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('users', 'requireEmailVerification', e.target.checked)
            }
          />
          
          <SwitchField
            label="Password Requires Special Character"
            isChecked={settings.users.passwordRequireSpecialChar}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('users', 'passwordRequireSpecialChar', e.target.checked)
            }
          />
          
          <SwitchField
            label="Password Requires Number"
            isChecked={settings.users.passwordRequireNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('users', 'passwordRequireNumber', e.target.checked)
            }
          />
          
          <SwitchField
            label="Password Requires Uppercase"
            isChecked={settings.users.passwordRequireUppercase}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('users', 'passwordRequireUppercase', e.target.checked)
            }
          />
        </View>
      </Grid>
    );
  };
  
  const renderNotificationSettings = () => {
    return (
      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
        gap="1rem"
      >
        <SelectField
          label="Email Digest Frequency"
          value={settings.notifications.emailDigestFrequency}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => 
            handleInputChange('notifications', 'emailDigestFrequency', e.target.value)
          }
        >
          <option value="never">Never</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </SelectField>
        
        <View>
          <SwitchField
            label="Enable Email Notifications"
            isChecked={settings.notifications.enableEmailNotifications}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('notifications', 'enableEmailNotifications', e.target.checked)
            }
          />
          
          <SwitchField
            label="Enable In-App Notifications"
            isChecked={settings.notifications.enableInAppNotifications}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('notifications', 'enableInAppNotifications', e.target.checked)
            }
          />
          
          <SwitchField
            label="Notify On Comments"
            isChecked={settings.notifications.notifyOnComments}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('notifications', 'notifyOnComments', e.target.checked)
            }
          />
          
          <SwitchField
            label="Notify On Ratings"
            isChecked={settings.notifications.notifyOnRatings}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('notifications', 'notifyOnRatings', e.target.checked)
            }
          />
          
          <SwitchField
            label="Notify On Feedback"
            isChecked={settings.notifications.notifyOnFeedback}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('notifications', 'notifyOnFeedback', e.target.checked)
            }
          />
          
          <SwitchField
            label="Admin Email Notifications"
            isChecked={settings.notifications.adminEmailNotifications}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('notifications', 'adminEmailNotifications', e.target.checked)
            }
          />
        </View>
      </Grid>
    );
  };
  
  const renderAnalyticsSettings = () => {
    return (
      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
        gap="1rem"
      >
        <TextField
          label="Data Retention Period (days)"
          type="number"
          value={settings.analytics.retentionPeriod}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            handleInputChange('analytics', 'retentionPeriod', parseInt(e.target.value))
          }
        />
        
        <View>
          <SwitchField
            label="Enable Analytics"
            isChecked={settings.analytics.enableAnalytics}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('analytics', 'enableAnalytics', e.target.checked)
            }
          />
          
          <SwitchField
            label="Track Page Views"
            isChecked={settings.analytics.trackPageViews}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('analytics', 'trackPageViews', e.target.checked)
            }
          />
          
          <SwitchField
            label="Track User Actions"
            isChecked={settings.analytics.trackUserActions}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('analytics', 'trackUserActions', e.target.checked)
            }
          />
          
          <SwitchField
            label="Anonymize IPs"
            isChecked={settings.analytics.anonymizeIPs}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('analytics', 'anonymizeIPs', e.target.checked)
            }
          />
          
          <SwitchField
            label="Enable Export"
            isChecked={settings.analytics.enableExport}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('analytics', 'enableExport', e.target.checked)
            }
          />
        </View>
      </Grid>
    );
  };
  
  const renderSecuritySettings = () => {
    return (
      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
        gap="1rem"
      >
        <TextAreaField
          label="Allowed Login IPs"
          value={settings.security.allowedLoginIPs}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
            handleInputChange('security', 'allowedLoginIPs', e.target.value)
          }
          placeholder="Leave blank to allow all IPs, or enter comma-separated list"
        />
        
        <SelectField
          label="Content Security Policy"
          value={settings.security.contentSecurityPolicy}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => 
            handleInputChange('security', 'contentSecurityPolicy', e.target.value)
          }
        >
          <option value="default">Default</option>
          <option value="strict">Strict</option>
          <option value="custom">Custom</option>
        </SelectField>
        
        <View>
          <SwitchField
            label="Enable Two-Factor Authentication"
            isChecked={settings.security.enableTwoFactorAuth}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('security', 'enableTwoFactorAuth', e.target.checked)
            }
          />
          
          <SwitchField
            label="Require Two-Factor for Admins"
            isChecked={settings.security.requireTwoFactorForAdmins}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('security', 'requireTwoFactorForAdmins', e.target.checked)
            }
          />
          
          <SwitchField
            label="Enable CAPTCHA"
            isChecked={settings.security.enableCaptcha}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('security', 'enableCaptcha', e.target.checked)
            }
          />
          
          <SwitchField
            label="Enable CSRF Protection"
            isChecked={settings.security.enableCSRFProtection}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('security', 'enableCSRFProtection', e.target.checked)
            }
          />
          
          <SwitchField
            label="Enable SSL"
            isChecked={settings.security.enableSSL}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('security', 'enableSSL', e.target.checked)
            }
          />
        </View>
      </Grid>
    );
  };
  
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'showcase':
        return renderShowcaseSettings();
      case 'users':
        return renderUserSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'analytics':
        return renderAnalyticsSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };
  
  if (isLoading && !settings) {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }
  
  return (
    <Card variation="elevated">
      <Flex direction="column" gap="1.5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={3}>System Settings</Heading>
          
          <Flex gap="1rem">
            <Button
              variation="link"
              onClick={handleResetToDefaults}
              isDisabled={isLoading}
            >
              Reset to Defaults
            </Button>
            
            <Button
              variation="primary"
              onClick={handleSaveSettings}
              isDisabled={isLoading || !unsavedChanges}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Flex>
        </Flex>
        
        {error && <Alert variation="error">{error}</Alert>}
        {success && <Alert variation="success">{success}</Alert>}
        {unsavedChanges && (
          <Alert variation="warning">
            You have unsaved changes. Click "Save Settings" to apply them.
          </Alert>
        )}
        
        <Flex direction="column" gap="1rem">
          <Flex 
            className="settings-tabs"
            gap="0.5rem"
            wrap="wrap"
          >
            <Button
              variation={activeTab === 'general' ? 'primary' : 'default'}
              onClick={() => setActiveTab('general')}
            >
              General
            </Button>
            
            <Button
              variation={activeTab === 'showcase' ? 'primary' : 'default'}
              onClick={() => setActiveTab('showcase')}
            >
              Showcase
            </Button>
            
            <Button
              variation={activeTab === 'users' ? 'primary' : 'default'}
              onClick={() => setActiveTab('users')}
            >
              Users
            </Button>
            
            <Button
              variation={activeTab === 'notifications' ? 'primary' : 'default'}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </Button>
            
            <Button
              variation={activeTab === 'analytics' ? 'primary' : 'default'}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </Button>
            
            <Button
              variation={activeTab === 'security' ? 'primary' : 'default'}
              onClick={() => setActiveTab('security')}
            >
              Security
            </Button>
          </Flex>
          
          <Divider />
          
          <Card>
            <Flex direction="column" gap="1.5rem" padding="1rem">
              {settings && renderActiveTabContent()}
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Card>
  );
};

export default SystemSettings; 