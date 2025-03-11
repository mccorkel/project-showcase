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
  TextField,
  SwitchField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getShowcase, 
  publishShowcase, 
  getPublicationHistory 
} from '../../graphql/operations/showcase';

const client = generateClient();

interface PublishShowcaseProps {
  onBack?: () => void;
}

const PublishShowcase: React.FC<PublishShowcaseProps> = ({ onBack }) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [showcase, setShowcase] = useState<any>(null);
  const [publicationHistory, setPublicationHistory] = useState<any[]>([]);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [publishNotes, setPublishNotes] = useState('');

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
        setCustomDomain(showcaseData.visibility?.customDomain || '');
        setIsPublic(showcaseData.visibility?.isPublic || false);
        
        // Fetch publication history
        fetchPublicationHistory(showcaseData.id);
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

  // Publish showcase
  const handlePublish = async () => {
    if (!showcase) {
      setError('No showcase found to publish.');
      return;
    }
    
    if (!showcase.templateId) {
      setError('Please select a template before publishing.');
      return;
    }
    
    setIsPublishing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await client.graphql({
        query: publishShowcase,
        variables: {
          id: showcase.id,
          isPublic,
          customDomain: customDomain.trim() || undefined,
          notes: publishNotes.trim() || undefined
        }
      });
      
      if ('data' in result && result.data.publishShowcase) {
        const publishData = result.data.publishShowcase;
        setPublishedUrl(publishData.publishedUrl);
        setSuccess('Your showcase has been published successfully!');
        
        // Refresh publication history
        fetchPublicationHistory(showcase.id);
      } else {
        setError('Failed to publish showcase. Please try again.');
      }
    } catch (error) {
      console.error('Error publishing showcase:', error);
      setError('Failed to publish showcase. Please try again.');
    } finally {
      setIsPublishing(false);
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
      <Heading level={2}>Publish Showcase</Heading>
      <Text>Publish your showcase to make it accessible to the public.</Text>
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
          <Card variation="outlined" padding={tokens.space.medium} marginBottom={tokens.space.medium}>
            <Heading level={4}>Publication Settings</Heading>
            <Divider marginBlock={tokens.space.small} />
            
            <Flex direction="column" gap={tokens.space.medium}>
              <SwitchField
                label="Make showcase public"
                labelPosition="start"
                isChecked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              
              <TextField
                label="Custom Domain (Optional)"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="e.g., portfolio.yourdomain.com"
              />
              
              <TextField
                label="Publication Notes (Optional)"
                value={publishNotes}
                onChange={(e) => setPublishNotes(e.target.value)}
                placeholder="Notes about this publication version"
              />
              
              {publishedUrl && (
                <View>
                  <Text fontWeight="bold">Current Published URL:</Text>
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text>{publishedUrl}</Text>
                    <Button
                      size="small"
                      onClick={() => window.open(publishedUrl, '_blank')}
                    >
                      Visit
                    </Button>
                  </Flex>
                </View>
              )}
              
              <Button
                variation="primary"
                onClick={handlePublish}
                isLoading={isPublishing}
                isDisabled={isPublishing || !showcase.templateId}
              >
                {publishedUrl ? 'Update Published Showcase' : 'Publish Showcase'}
              </Button>
              
              {!showcase.templateId && (
                <Text color={tokens.colors.font.error}>
                  Please select a template before publishing.
                </Text>
              )}
            </Flex>
          </Card>
          
          {publicationHistory.length > 0 && (
            <Card variation="outlined" padding={tokens.space.medium}>
              <Heading level={4}>Publication History</Heading>
              <Text>Previous versions of your published showcase.</Text>
              <Divider marginBlock={tokens.space.small} />
              
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
                          {version.status === 'published' && (
                            <Button
                              size="small"
                              variation="link"
                              onClick={() => {
                                // Implement rollback functionality
                                alert('Rollback to this version is not yet implemented.');
                              }}
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
            </Card>
          )}
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

export default PublishShowcase; 