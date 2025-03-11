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
  Loader,
  Alert,
  Badge,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  SwitchField,
  SelectField,
  Link,
  TextField
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getShowcase, 
  getPublicationHistory,
  updateShowcaseVisibility,
  rollbackToVersion
} from '../../graphql/operations/showcase';

const client = generateClient();

interface PublishedShowcaseManagerProps {
  onBack?: () => void;
}

const PublishedShowcaseManager: React.FC<PublishedShowcaseManagerProps> = ({ onBack }) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [showcase, setShowcase] = useState<any>(null);
  const [publicationHistory, setPublicationHistory] = useState<any[]>([]);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [visibilitySettings, setVisibilitySettings] = useState({
    isPublic: false,
    accessType: 'public',
    password: '',
    scheduledDate: '',
    customDomain: ''
  });
  
  const [viewStats, setViewStats] = useState({
    total: 0,
    today: 0,
    week: 0,
    month: 0
  });
  
  const [referrers, setReferrers] = useState<{source: string, count: number}[]>([]);
  const [locations, setLocations] = useState<{country: string, count: number}[]>([]);

  // Fetch showcase data when component mounts
  useEffect(() => {
    if (studentProfile?.id) {
      fetchShowcaseData();
    } else {
      setIsLoading(false);
      setError('User profile not found. Please try again later.');
    }
  }, [studentProfile]);

  // Fetch showcase data from API
  const fetchShowcaseData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch showcase data
      const showcaseResult = await client.graphql({
        query: getShowcase,
        variables: {
          studentProfileId: studentProfile.id
        }
      });
      
      if ('data' in showcaseResult && showcaseResult.data.getShowcaseByStudentProfileId) {
        const showcaseData = showcaseResult.data.getShowcaseByStudentProfileId;
        setShowcase(showcaseData);
        
        // Set state from showcase data
        setPublishedUrl(showcaseData.publishedUrl || null);
        
        if (showcaseData.visibility) {
          setVisibilitySettings({
            isPublic: showcaseData.visibility.isPublic || false,
            accessType: showcaseData.visibility.accessType || 'public',
            password: showcaseData.visibility.password || '',
            scheduledDate: showcaseData.visibility.scheduledDate || '',
            customDomain: showcaseData.visibility.customDomain || ''
          });
        }
        
        // Set mock analytics data (in a real app, this would come from the API)
        setViewStats({
          total: 1250,
          today: 42,
          week: 187,
          month: 523
        });
        
        setReferrers([
          { source: 'Direct', count: 523 },
          { source: 'Google', count: 312 },
          { source: 'LinkedIn', count: 187 },
          { source: 'GitHub', count: 98 },
          { source: 'Twitter', count: 76 },
          { source: 'Other', count: 54 }
        ]);
        
        setLocations([
          { country: 'United States', count: 625 },
          { country: 'India', count: 187 },
          { country: 'United Kingdom', count: 143 },
          { country: 'Germany', count: 98 },
          { country: 'Canada', count: 76 },
          { country: 'Other', count: 121 }
        ]);
        
        // Fetch publication history
        if (showcaseData.id) {
          fetchPublicationHistory(showcaseData.id);
        } else {
          setIsLoading(false);
        }
      } else {
        setError('Showcase not found. Please create a showcase first.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching showcase data:', error);
      setError('Failed to load showcase data. Please try again.');
      setIsLoading(false);
    }
  };

  // Fetch publication history
  const fetchPublicationHistory = async (showcaseId: string) => {
    try {
      const historyResult = await client.graphql({
        query: getPublicationHistory,
        variables: {
          showcaseId
        }
      });
      
      if ('data' in historyResult && historyResult.data.getPublicationHistory) {
        const historyData = historyResult.data.getPublicationHistory;
        setPublicationHistory(historyData.items || []);
      }
    } catch (error) {
      console.error('Error fetching publication history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update visibility settings
  const handleUpdateVisibility = async () => {
    if (!showcase?.id) {
      setError('No showcase found to update.');
      return;
    }
    
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await client.graphql({
        query: updateShowcaseVisibility,
        variables: {
          id: showcase.id,
          visibility: visibilitySettings
        }
      });
      
      if ('data' in result && result.data.updateShowcaseVisibility) {
        setSuccess('Visibility settings updated successfully!');
        
        // Update showcase data
        const updatedShowcase = {
          ...showcase,
          visibility: visibilitySettings
        };
        
        setShowcase(updatedShowcase);
      } else {
        setError('Failed to update visibility settings. Please try again.');
      }
    } catch (error) {
      console.error('Error updating visibility settings:', error);
      setError('Failed to update visibility settings. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Rollback to a previous version
  const handleRollback = async (version: number) => {
    if (!showcase?.id) {
      setError('No showcase found to rollback.');
      return;
    }
    
    setIsRollingBack(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await client.graphql({
        query: rollbackToVersion,
        variables: {
          showcaseId: showcase.id,
          version
        }
      });
      
      if ('data' in result && result.data.rollbackToVersion) {
        setSuccess(`Successfully rolled back to version ${version}!`);
        
        // Refresh publication history
        fetchPublicationHistory(showcase.id);
        
        // Update published URL
        setPublishedUrl(result.data.rollbackToVersion.publishedUrl);
      } else {
        setError('Failed to rollback to the selected version. Please try again.');
      }
    } catch (error) {
      console.error('Error rolling back to version:', error);
      setError('Failed to rollback to the selected version. Please try again.');
    } finally {
      setIsRollingBack(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get publication status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variation="success">Published</Badge>;
      case 'draft':
        return <Badge variation="warning">Draft</Badge>;
      case 'archived':
        return <Badge variation="info">Archived</Badge>;
      default:
        return <Badge variation="warning">Draft</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <Flex justifyContent="center" padding={tokens.space.xl}>
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Heading level={2}>Manage Published Showcase</Heading>
      <Text>Manage your published showcase and view analytics.</Text>
      <Divider marginBlock={tokens.space.medium} />
      
      {error && (
        <Alert
          variation="error"
          isDismissible={true}
          hasIcon={true}
          heading="Error"
          marginBottom={tokens.space.medium}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert
          variation="success"
          isDismissible={true}
          hasIcon={true}
          heading="Success"
          marginBottom={tokens.space.medium}
        >
          {success}
        </Alert>
      )}
      
      {showcase && (
        <>
          {publishedUrl ? (
            <Card variation="outlined" padding={tokens.space.medium} marginBottom={tokens.space.medium}>
              <Heading level={4}>Published Showcase</Heading>
              <Divider marginBlock={tokens.space.small} />
              
              <Flex direction="column" gap={tokens.space.medium}>
                <Flex alignItems="center" gap={tokens.space.small}>
                  <Text fontWeight="bold">Public URL:</Text>
                  <Link href={publishedUrl} isExternal={true}>
                    {publishedUrl}
                  </Link>
                  <Button
                    size="small"
                    onClick={() => window.open(publishedUrl, '_blank')}
                  >
                    Visit
                  </Button>
                </Flex>
                
                {showcase.lastPublished && (
                  <Text>
                    <Text as="span" fontWeight="bold">Last Published:</Text> {formatDate(showcase.lastPublished)}
                  </Text>
                )}
                
                {showcase.publication?.version && (
                  <Text>
                    <Text as="span" fontWeight="bold">Current Version:</Text> v{showcase.publication.version}
                  </Text>
                )}
              </Flex>
            </Card>
          ) : (
            <Alert
              variation="warning"
              isDismissible={false}
              hasIcon={true}
              heading="Not Published"
              marginBottom={tokens.space.medium}
            >
              Your showcase has not been published yet. Go to the Publish page to publish your showcase.
            </Alert>
          )}
          
          <Tabs>
            <Tabs.Item title="Analytics" value="analytics">
              <Card variation="outlined" padding={tokens.space.medium}>
                <Heading level={4}>Showcase Analytics</Heading>
                <Text>View statistics about your published showcase.</Text>
                <Divider marginBlock={tokens.space.small} />
                
                {publishedUrl ? (
                  <>
                    <Flex justifyContent="space-between" marginBottom={tokens.space.large}>
                      <Card variation="outlined" padding={tokens.space.medium} flex="1" marginRight={tokens.space.small}>
                        <Heading level={5}>Total Views</Heading>
                        <Text fontSize={tokens.fontSizes.xxxl} fontWeight="bold">{viewStats.total}</Text>
                      </Card>
                      
                      <Card variation="outlined" padding={tokens.space.medium} flex="1" marginRight={tokens.space.small}>
                        <Heading level={5}>Today</Heading>
                        <Text fontSize={tokens.fontSizes.xxxl} fontWeight="bold">{viewStats.today}</Text>
                      </Card>
                      
                      <Card variation="outlined" padding={tokens.space.medium} flex="1" marginRight={tokens.space.small}>
                        <Heading level={5}>This Week</Heading>
                        <Text fontSize={tokens.fontSizes.xxxl} fontWeight="bold">{viewStats.week}</Text>
                      </Card>
                      
                      <Card variation="outlined" padding={tokens.space.medium} flex="1">
                        <Heading level={5}>This Month</Heading>
                        <Text fontSize={tokens.fontSizes.xxxl} fontWeight="bold">{viewStats.month}</Text>
                      </Card>
                    </Flex>
                    
                    <Flex gap={tokens.space.large}>
                      <Card variation="outlined" padding={tokens.space.medium} flex="1">
                        <Heading level={5}>Top Referrers</Heading>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell as="th">Source</TableCell>
                              <TableCell as="th">Views</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {referrers.map((referrer) => (
                              <TableRow key={referrer.source}>
                                <TableCell>{referrer.source}</TableCell>
                                <TableCell>{referrer.count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                      
                      <Card variation="outlined" padding={tokens.space.medium} flex="1">
                        <Heading level={5}>Top Locations</Heading>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell as="th">Country</TableCell>
                              <TableCell as="th">Views</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {locations.map((location) => (
                              <TableRow key={location.country}>
                                <TableCell>{location.country}</TableCell>
                                <TableCell>{location.count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </Flex>
                  </>
                ) : (
                  <Text>Analytics will be available after you publish your showcase.</Text>
                )}
              </Card>
            </Tabs.Item>
            
            <Tabs.Item title="Versions" value="versions">
              <Card variation="outlined" padding={tokens.space.medium}>
                <Heading level={4}>Publication History</Heading>
                <Text>View and manage previous versions of your published showcase.</Text>
                <Divider marginBlock={tokens.space.small} />
                
                {publicationHistory.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell as="th">Version</TableCell>
                        <TableCell as="th">Published Date</TableCell>
                        <TableCell as="th">Status</TableCell>
                        <TableCell as="th">Notes</TableCell>
                        <TableCell as="th">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {publicationHistory.map((version) => (
                        <TableRow key={version.version}>
                          <TableCell>v{version.version}</TableCell>
                          <TableCell>{formatDate(version.publishedAt)}</TableCell>
                          <TableCell>{getStatusBadge(version.status)}</TableCell>
                          <TableCell>{version.notes || '-'}</TableCell>
                          <TableCell>
                            <Flex gap={tokens.space.xs}>
                              {version.url && (
                                <Button
                                  size="small"
                                  onClick={() => window.open(version.url, '_blank')}
                                >
                                  View
                                </Button>
                              )}
                              {version.status === 'published' && showcase.publication?.version !== version.version && (
                                <Button
                                  size="small"
                                  variation="primary"
                                  onClick={() => handleRollback(version.version)}
                                  isLoading={isRollingBack}
                                  isDisabled={isRollingBack}
                                >
                                  Rollback
                                </Button>
                              )}
                            </Flex>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Text>No publication history available. Publish your showcase to create a version.</Text>
                )}
              </Card>
            </Tabs.Item>
            
            <Tabs.Item title="Visibility" value="visibility">
              <Card variation="outlined" padding={tokens.space.medium}>
                <Heading level={4}>Visibility Settings</Heading>
                <Text>Control who can access your published showcase.</Text>
                <Divider marginBlock={tokens.space.small} />
                
                <Flex direction="column" gap={tokens.space.medium}>
                  <SwitchField
                    label="Make showcase public"
                    labelPosition="start"
                    isChecked={visibilitySettings.isPublic}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVisibilitySettings({
                      ...visibilitySettings,
                      isPublic: e.target.checked
                    })}
                  />
                  
                  {visibilitySettings.isPublic && (
                    <>
                      <SelectField
                        label="Access Type"
                        value={visibilitySettings.accessType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVisibilitySettings({
                          ...visibilitySettings,
                          accessType: e.target.value
                        })}
                      >
                        <option value="public">Public (Anyone can view)</option>
                        <option value="link-only">Link Only (Only those with the link)</option>
                        <option value="password">Password Protected</option>
                        <option value="scheduled">Scheduled Publication</option>
                      </SelectField>
                      
                      {visibilitySettings.accessType === 'password' && (
                        <TextField
                          label="Password"
                          type="password"
                          value={visibilitySettings.password}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVisibilitySettings({
                            ...visibilitySettings,
                            password: e.target.value
                          })}
                          placeholder="Enter a password for your showcase"
                        />
                      )}
                      
                      {visibilitySettings.accessType === 'scheduled' && (
                        <TextField
                          label="Publication Date"
                          type="date"
                          value={visibilitySettings.scheduledDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVisibilitySettings({
                            ...visibilitySettings,
                            scheduledDate: e.target.value
                          })}
                        />
                      )}
                      
                      <TextField
                        label="Custom Domain (Optional)"
                        value={visibilitySettings.customDomain}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVisibilitySettings({
                          ...visibilitySettings,
                          customDomain: e.target.value
                        })}
                        placeholder="e.g., portfolio.yourdomain.com"
                      />
                    </>
                  )}
                  
                  <Button
                    variation="primary"
                    onClick={handleUpdateVisibility}
                    isLoading={isUpdating}
                    isDisabled={isUpdating}
                  >
                    Update Visibility Settings
                  </Button>
                </Flex>
              </Card>
            </Tabs.Item>
          </Tabs>
        </>
      )}
      
      <Flex justifyContent="space-between" marginTop={tokens.space.xl}>
        {onBack && (
          <Button
            variation="link"
            onClick={onBack}
          >
            Back
          </Button>
        )}
      </Flex>
    </Card>
  );
};

export default PublishedShowcaseManager; 