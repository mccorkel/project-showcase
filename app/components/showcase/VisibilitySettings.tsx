import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Flex, 
  Divider, 
  Button, 
  useTheme,
  Text,
  View,
  SwitchField,
  RadioGroupField,
  Radio,
  TextField,
  Alert,
  Icon
} from '@aws-amplify/ui-react';

interface VisibilitySettingsProps {
  visibility: {
    isPublic: boolean;
    accessType: 'public' | 'link-only' | 'password' | 'scheduled';
    password?: string;
    scheduledDate?: string;
    customDomain?: string;
  };
  onChange: (visibility: any) => void;
}

const VisibilitySettings: React.FC<VisibilitySettingsProps> = ({ 
  visibility, 
  onChange 
}) => {
  const { tokens } = useTheme();
  
  const [isPublic, setIsPublic] = useState(visibility?.isPublic || false);
  const [accessType, setAccessType] = useState(visibility?.accessType || 'public');
  const [password, setPassword] = useState(visibility?.password || '');
  const [scheduledDate, setScheduledDate] = useState(visibility?.scheduledDate || '');
  const [customDomain, setCustomDomain] = useState(visibility?.customDomain || '');
  const [showPasswordWarning, setShowPasswordWarning] = useState(false);

  // Update local state when props change
  useEffect(() => {
    if (visibility) {
      setIsPublic(visibility.isPublic || false);
      setAccessType(visibility.accessType || 'public');
      setPassword(visibility.password || '');
      setScheduledDate(visibility.scheduledDate || '');
      setCustomDomain(visibility.customDomain || '');
    }
  }, [visibility]);

  // Update parent component when any visibility setting changes
  useEffect(() => {
    const updatedVisibility = {
      isPublic,
      accessType,
      ...(accessType === 'password' && { password }),
      ...(accessType === 'scheduled' && { scheduledDate }),
      customDomain: customDomain.trim() || undefined
    };
    
    onChange(updatedVisibility);
  }, [isPublic, accessType, password, scheduledDate, customDomain, onChange]);

  // Handle public toggle
  const handlePublicToggle = (isChecked: boolean) => {
    setIsPublic(isChecked);
    if (!isChecked) {
      // Reset access type if making private
      setAccessType('public');
    }
  };

  // Handle access type change
  const handleAccessTypeChange = (value: string) => {
    setAccessType(value as 'public' | 'link-only' | 'password' | 'scheduled');
    
    // Show password warning if password protection is selected
    if (value === 'password') {
      setShowPasswordWarning(true);
    } else {
      setShowPasswordWarning(false);
    }
  };

  // Handle password change
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    
    // Hide warning once password is entered
    if (value.length > 0) {
      setShowPasswordWarning(false);
    }
  };

  // Get current status text
  const getStatusText = (): string => {
    if (!isPublic) {
      return 'Your showcase is currently private and not visible to anyone.';
    }
    
    switch (accessType) {
      case 'public':
        return 'Your showcase is publicly visible to anyone.';
      case 'link-only':
        return 'Your showcase is only accessible to people with the direct link.';
      case 'password':
        return password 
          ? 'Your showcase is protected with a password.' 
          : 'Your showcase will be password protected once you set a password.';
      case 'scheduled':
        return scheduledDate 
          ? `Your showcase will become public on ${new Date(scheduledDate).toLocaleDateString()}.` 
          : 'Your showcase will be published on the date you select.';
      default:
        return 'Your showcase visibility settings need to be configured.';
    }
  };

  // Get icon based on current status
  const getStatusIcon = () => {
    if (!isPublic) {
      return <Icon ariaLabel="Lock" viewBox={{ width: 24, height: 24 }} paths={[{ d: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" }]} />;
    }
    
    switch (accessType) {
      case 'public':
        return <Icon ariaLabel="Unlock" viewBox={{ width: 24, height: 24 }} paths={[{ d: "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" }]} />;
      case 'link-only':
        return <Icon ariaLabel="Info" viewBox={{ width: 24, height: 24 }} paths={[{ d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" }]} />;
      case 'password':
        return <Icon ariaLabel="Lock" viewBox={{ width: 24, height: 24 }} paths={[{ d: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" }]} />;
      case 'scheduled':
        return <Icon ariaLabel="Calendar" viewBox={{ width: 24, height: 24 }} paths={[{ d: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" }]} />;
      default:
        return <Icon ariaLabel="Info" viewBox={{ width: 24, height: 24 }} paths={[{ d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" }]} />;
    }
  };

  return (
    <Card>
      <Heading level={3}>Showcase Visibility</Heading>
      <Text>Control who can view your showcase and how they access it.</Text>
      <Divider marginBlock={tokens.space.medium} />
      
      <Card variation="outlined" padding={tokens.space.medium} marginBottom={tokens.space.medium}>
        <Flex alignItems="center" gap={tokens.space.medium}>
          <View color={isPublic ? tokens.colors.green[60] : tokens.colors.neutral[60]}>
            {getStatusIcon()}
          </View>
          <Flex direction="column">
            <Text fontWeight="bold">
              {isPublic ? 'Your showcase is published' : 'Your showcase is private'}
            </Text>
            <Text>{getStatusText()}</Text>
          </Flex>
        </Flex>
      </Card>
      
      <SwitchField
        label="Make showcase public"
        labelPosition="start"
        isChecked={isPublic}
        onChange={(e) => handlePublicToggle(e.target.checked)}
        marginBottom={tokens.space.medium}
      />
      
      {isPublic && (
        <>
          <Card variation="outlined" padding={tokens.space.medium}>
            <Heading level={4}>Access Control</Heading>
            <Text>Choose how visitors can access your showcase.</Text>
            <Divider marginBlock={tokens.space.small} />
            
            <RadioGroupField
              legend="Access Type"
              name="accessType"
              value={accessType}
              onChange={(e) => handleAccessTypeChange(e.target.value)}
            >
              <Radio value="public">
                <Flex direction="column">
                  <Text fontWeight="bold">Public</Text>
                  <Text fontSize={tokens.fontSizes.small}>
                    Anyone can view your showcase. It will be indexed by search engines.
                  </Text>
                </Flex>
              </Radio>
              
              <Radio value="link-only">
                <Flex direction="column">
                  <Text fontWeight="bold">Link Only</Text>
                  <Text fontSize={tokens.fontSizes.small}>
                    Only people with the direct link can view your showcase. Not indexed by search engines.
                  </Text>
                </Flex>
              </Radio>
              
              <Radio value="password">
                <Flex direction="column">
                  <Text fontWeight="bold">Password Protected</Text>
                  <Text fontSize={tokens.fontSizes.small}>
                    Visitors need a password to view your showcase.
                  </Text>
                </Flex>
              </Radio>
              
              <Radio value="scheduled">
                <Flex direction="column">
                  <Text fontWeight="bold">Scheduled Publication</Text>
                  <Text fontSize={tokens.fontSizes.small}>
                    Your showcase will become public on a specific date.
                  </Text>
                </Flex>
              </Radio>
            </RadioGroupField>
            
            {accessType === 'password' && (
              <Flex direction="column" marginTop={tokens.space.medium}>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter a password for your showcase"
                />
                
                {showPasswordWarning && (
                  <Alert
                    variation="warning"
                    isDismissible={false}
                    marginTop={tokens.space.small}
                  >
                    Please set a password to protect your showcase.
                  </Alert>
                )}
              </Flex>
            )}
            
            {accessType === 'scheduled' && (
              <Flex direction="column" marginTop={tokens.space.medium}>
                <TextField
                  label="Publication Date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </Flex>
            )}
          </Card>
          
          <Card variation="outlined" padding={tokens.space.medium} marginTop={tokens.space.medium}>
            <Heading level={4}>Custom Domain (Optional)</Heading>
            <Text>Connect your showcase to a custom domain if you have one.</Text>
            <Divider marginBlock={tokens.space.small} />
            
            <TextField
              label="Custom Domain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="e.g., portfolio.yourdomain.com"
            />
            
            <Text fontSize={tokens.fontSizes.small} marginTop={tokens.space.small}>
              Note: You'll need to configure DNS settings with your domain provider to point to your showcase.
              Instructions will be provided after you save these settings.
            </Text>
          </Card>
          
          <Flex marginTop={tokens.space.large}>
            <Text fontSize={tokens.fontSizes.small} color={tokens.colors.neutral[60]}>
              Your showcase URL: {customDomain || 'https://showcase.example.com/your-username'}
            </Text>
          </Flex>
        </>
      )}
    </Card>
  );
};

export default VisibilitySettings; 