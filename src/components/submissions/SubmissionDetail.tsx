import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Flex, 
  Divider, 
  Button, 
  useTheme,
  Badge,
  Text,
  View,
  Image,
  Loader,
  Tabs,
  Link
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmission, submitForGrading } from '../../graphql/operations/submissions';
import SubmissionForm from './SubmissionForm';

const client = generateClient();

interface SubmissionDetailProps {
  submissionId: string;
  onBack?: () => void;
}

const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ submissionId, onBack }) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  
  const [submission, setSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Fetch submission when the component mounts
  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  // Fetch submission from the API
  const fetchSubmission = async () => {
    if (!submissionId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await client.graphql({
        query: getSubmission,
        variables: {
          id: submissionId
        }
      });
      
      if ('data' in result && result.data.getSubmission) {
        setSubmission(result.data.getSubmission);
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge variation based on status
  const getStatusBadgeVariation = (status: string) => {
    switch (status) {
      case 'draft':
        return 'warning';
      case 'submitted':
        return 'info';
      case 'graded':
        return 'success';
      default:
        return 'info';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle submitting for grading
  const handleSubmitForGrading = async () => {
    if (!submissionId) return;
    
    setIsSubmitting(true);
    
    try {
      await client.graphql({
        query: submitForGrading,
        variables: {
          id: submissionId
        }
      });
      
      // Refresh the submission data
      await fetchSubmission();
    } catch (error) {
      console.error('Error submitting for grading:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
    setActiveTab('edit');
  };

  // Handle save after editing
  const handleSave = async () => {
    // Refresh the submission data
    await fetchSubmission();
    setIsEditing(false);
    setActiveTab('details');
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setActiveTab('details');
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

  if (!submission) {
    return (
      <Card>
        <Flex direction="column" alignItems="center" padding={tokens.space.xl} gap={tokens.space.medium}>
          <Heading level={3}>Submission Not Found</Heading>
          <Text>The submission you're looking for doesn't exist or you don't have permission to view it.</Text>
          {onBack && (
            <Button
              variation="primary"
              onClick={onBack}
            >
              Back to Submissions
            </Button>
          )}
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={tokens.space.medium}>
          {onBack && (
            <Button
              variation="link"
              onClick={onBack}
            >
              ← Back
            </Button>
          )}
          <Heading level={3}>{submission.title}</Heading>
        </Flex>
        <Badge variation={getStatusBadgeVariation(submission.status)}>
          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
        </Badge>
      </Flex>
      <Divider marginBlock={tokens.space.medium} />
      
      <Tabs
        defaultValue="details"
        value={activeTab}
        onChange={(value: any) => setActiveTab(value)}
      >
        <Tabs.Item title="Details" value="details">
          <Flex direction="column" gap={tokens.space.large}>
            {/* Basic Information */}
            <Flex direction="column" gap={tokens.space.medium}>
              <Heading level={4}>Project Information</Heading>
              
              {/* Featured Image */}
              {submission.featuredImageUrl && (
                <View
                  width="100%"
                  height="300px"
                  overflow="hidden"
                  marginBottom={tokens.space.medium}
                >
                  <Image
                    src={submission.featuredImageUrl}
                    alt={submission.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </View>
              )}
              
              <Text>{submission.description}</Text>
              
              {submission.week && (
                <Flex alignItems="center" gap={tokens.space.small}>
                  <Text fontWeight="bold">Week:</Text>
                  <Text>Week {submission.week}</Text>
                </Flex>
              )}
              
              {/* Technologies */}
              {submission.technologies && submission.technologies.length > 0 && (
                <Flex direction="column" gap={tokens.space.small}>
                  <Text fontWeight="bold">Technologies:</Text>
                  <Flex wrap="wrap" gap={tokens.space.xs}>
                    {submission.technologies.map((tech: string, index: number) => (
                      <Badge key={index} variation="info">{tech}</Badge>
                    ))}
                  </Flex>
                </Flex>
              )}
            </Flex>
            
            {/* Links */}
            <Flex direction="column" gap={tokens.space.medium}>
              <Heading level={4}>Project Links</Heading>
              
              <Flex direction="column" gap={tokens.space.small}>
                {submission.repoLink && (
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Repository:</Text>
                    <Link href={submission.repoLink} isExternal={true}>
                      {submission.repoLink}
                    </Link>
                  </Flex>
                )}
                
                {submission.demoLink && (
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Demo:</Text>
                    <Link href={submission.demoLink} isExternal={true}>
                      {submission.demoLink}
                    </Link>
                  </Flex>
                )}
                
                {submission.deployedUrl && (
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Deployed URL:</Text>
                    <Link href={submission.deployedUrl} isExternal={true}>
                      {submission.deployedUrl}
                    </Link>
                  </Flex>
                )}
                
                {submission.brainliftLink && (
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Brainlift:</Text>
                    <Link href={submission.brainliftLink} isExternal={true}>
                      {submission.brainliftLink}
                    </Link>
                  </Flex>
                )}
                
                {submission.socialPost && (
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Social Post:</Text>
                    <Link href={submission.socialPost} isExternal={true}>
                      {submission.socialPost}
                    </Link>
                  </Flex>
                )}
              </Flex>
            </Flex>
            
            {/* Notes */}
            {submission.notes && (
              <Flex direction="column" gap={tokens.space.medium}>
                <Heading level={4}>Notes</Heading>
                <Text>{submission.notes}</Text>
              </Flex>
            )}
            
            {/* Grading Information */}
            {submission.status === 'graded' && (
              <Flex direction="column" gap={tokens.space.medium}>
                <Heading level={4}>Grading Information</Heading>
                
                <Flex direction="column" gap={tokens.space.small}>
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Grade:</Text>
                    <Text>{submission.grade || 'N/A'}</Text>
                  </Flex>
                  
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Passing:</Text>
                    <Badge variation={submission.passing ? 'success' : 'error'}>
                      {submission.passing ? 'Yes' : 'No'}
                    </Badge>
                  </Flex>
                  
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Graded At:</Text>
                    <Text>{formatDate(submission.gradedAt)}</Text>
                  </Flex>
                  
                  {submission.report && (
                    <Flex direction="column" gap={tokens.space.small}>
                      <Text fontWeight="bold">Instructor Feedback:</Text>
                      <Card variation="outlined">
                        <Text>{submission.report}</Text>
                      </Card>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            )}
            
            {/* Timestamps */}
            <Flex direction="column" gap={tokens.space.medium}>
              <Heading level={4}>Submission History</Heading>
              
              <Flex direction="column" gap={tokens.space.small}>
                <Flex alignItems="center" gap={tokens.space.small}>
                  <Text fontWeight="bold">Created:</Text>
                  <Text>{formatDate(submission.createdAt)}</Text>
                </Flex>
                
                <Flex alignItems="center" gap={tokens.space.small}>
                  <Text fontWeight="bold">Last Updated:</Text>
                  <Text>{formatDate(submission.lastStudentEdit || submission.updatedAt)}</Text>
                </Flex>
                
                {submission.submittedAt && (
                  <Flex alignItems="center" gap={tokens.space.small}>
                    <Text fontWeight="bold">Submitted for Grading:</Text>
                    <Text>{formatDate(submission.submittedAt)}</Text>
                  </Flex>
                )}
              </Flex>
            </Flex>
            
            {/* Actions */}
            <Flex justifyContent="flex-end" gap={tokens.space.medium}>
              {submission.status === 'draft' && (
                <>
                  <Button
                    variation="primary"
                    onClick={handleEdit}
                  >
                    Edit Submission
                  </Button>
                  <Button
                    variation="primary"
                    onClick={handleSubmitForGrading}
                    isLoading={isSubmitting}
                    loadingText="Submitting..."
                  >
                    Submit for Grading
                  </Button>
                </>
              )}
              
              {submission.status === 'submitted' && (
                <Button
                  variation="primary"
                  onClick={handleEdit}
                >
                  Edit Submission
                </Button>
              )}
              
              {submission.status === 'graded' && (
                <Button
                  variation="primary"
                  onClick={handleEdit}
                >
                  Edit Submission
                </Button>
              )}
            </Flex>
          </Flex>
        </Tabs.Item>
        
        <Tabs.Item title="Edit" value="edit" isDisabled={!isEditing}>
          {isEditing && (
            <SubmissionForm
              submissionId={submissionId}
              initialData={submission}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          )}
        </Tabs.Item>
      </Tabs>
    </Card>
  );
};

export default SubmissionDetail; 