import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Flex, 
  Divider, 
  Button, 
  TextField,
  TextAreaField,
  SelectField,
  useTheme,
  Badge,
  Text,
  View,
  Image
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { createSubmission, updateSubmission, submitForGrading } from '../../graphql/operations/submissions';
import { uploadProjectImage } from '../../utils/storage';
import { isSubmissionFieldEditable } from '../../utils/accessControl';

const client = generateClient();

interface SubmissionFormProps {
  submissionId?: string;
  initialData?: any;
  onSave?: (id: string) => void;
  onSubmit?: (id: string) => void;
  onCancel?: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ 
  submissionId, 
  initialData, 
  onSave, 
  onSubmit,
  onCancel 
}) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [week, setWeek] = useState<number | undefined>(undefined);
  const [demoLink, setDemoLink] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [brainliftLink, setBrainliftLink] = useState('');
  const [socialPost, setSocialPost] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTechnology, setNewTechnology] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data if editing an existing submission
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setWeek(initialData.week || undefined);
      setDemoLink(initialData.demoLink || '');
      setRepoLink(initialData.repoLink || '');
      setBrainliftLink(initialData.brainliftLink || '');
      setSocialPost(initialData.socialPost || '');
      setDeployedUrl(initialData.deployedUrl || '');
      setNotes(initialData.notes || '');
      setTechnologies(initialData.technologies || []);
      setFeaturedImageUrl(initialData.featuredImageUrl || '');
    }
  }, [initialData]);

  // Handle featured image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a technology
  const addTechnology = () => {
    if (!newTechnology.trim()) return;
    
    if (!technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()]);
    }
    setNewTechnology('');
  };

  // Remove a technology
  const removeTechnology = (techToRemove: string) => {
    setTechnologies(technologies.filter(tech => tech !== techToRemove));
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!repoLink.trim()) {
      newErrors.repoLink = 'Repository link is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save as draft
  const saveAsDraft = async () => {
    if (!validateForm()) return;
    
    if (!studentProfile?.id) {
      console.error('No student profile ID found');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Upload featured image if a new one was selected
      let imageUrl = featuredImageUrl;
      if (featuredImage) {
        imageUrl = await uploadProjectImage(featuredImage, submissionId || 'new');
      }
      
      if (submissionId) {
        // Update existing submission
        const result = await client.graphql({
          query: updateSubmission,
          variables: {
            id: submissionId,
            title,
            description,
            week: week || null,
            demoLink,
            repoLink,
            brainliftLink,
            socialPost,
            deployedUrl,
            notes,
            technologies,
            featuredImageUrl: imageUrl,
            status: 'draft'
          }
        });
        
        if (onSave) {
          onSave(submissionId);
        }
      } else {
        // Create new submission
        const result = await client.graphql({
          query: createSubmission,
          variables: {
            studentProfileId: studentProfile.id,
            title,
            description,
            week: week || null,
            demoLink,
            repoLink,
            brainliftLink,
            socialPost,
            deployedUrl,
            notes,
            technologies,
            status: 'draft'
          }
        });
        
        if ('data' in result && result.data.createSubmission) {
          const newId = result.data.createSubmission.id;
          
          // Upload featured image if one was selected
          if (featuredImage) {
            imageUrl = await uploadProjectImage(featuredImage, newId);
            
            // Update the submission with the featured image URL
            await client.graphql({
              query: updateSubmission,
              variables: {
                id: newId,
                featuredImageUrl: imageUrl
              }
            });
          }
          
          if (onSave) {
            onSave(newId);
          }
        }
      }
    } catch (error) {
      console.error('Error saving submission:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Submit for grading
  const submitForGradingHandler = async () => {
    if (!validateForm()) return;
    
    // First save the submission
    await saveAsDraft();
    
    if (!submissionId) {
      console.error('No submission ID found');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit for grading
      await client.graphql({
        query: submitForGrading,
        variables: {
          id: submissionId
        }
      });
      
      if (onSubmit) {
        onSubmit(submissionId);
      }
    } catch (error) {
      console.error('Error submitting for grading:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if a field is editable based on submission status
  const isFieldEditable = (fieldName: string): boolean => {
    if (!initialData) return true; // New submission, all fields are editable
    
    // Get the user role from the auth context
    const userRole = 'student'; // For now, hardcode as student. In a real app, get from auth context
    
    return isSubmissionFieldEditable(fieldName, initialData.status || 'draft', userRole);
  };

  return (
    <Card>
      <Heading level={3}>{submissionId ? 'Edit Submission' : 'Create New Submission'}</Heading>
      <Divider marginBlock={tokens.space.medium} />
      
      <form onSubmit={(e) => { e.preventDefault(); saveAsDraft(); }}>
        <Flex direction="column" gap={tokens.space.medium}>
          {/* Basic Information */}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., E-commerce Platform"
            required
            hasError={!!errors.title}
            errorMessage={errors.title}
            isDisabled={!isFieldEditable('title')}
          />
          
          <TextAreaField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project..."
            rows={5}
            required
            hasError={!!errors.description}
            errorMessage={errors.description}
            isDisabled={!isFieldEditable('description')}
          />
          
          <SelectField
            label="Week"
            value={week?.toString() || ''}
            onChange={(e) => setWeek(e.target.value ? parseInt(e.target.value) : undefined)}
            isDisabled={!isFieldEditable('week')}
          >
            <option value="">Select Week</option>
            {Array.from({ length: 20 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString()}>Week {i + 1}</option>
            ))}
          </SelectField>
          
          {/* Links */}
          <Heading level={5}>Project Links</Heading>
          
          <TextField
            label="Repository Link"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            placeholder="e.g., https://github.com/username/repo"
            required
            hasError={!!errors.repoLink}
            errorMessage={errors.repoLink}
            isDisabled={!isFieldEditable('repoLink')}
          />
          
          <TextField
            label="Demo Link"
            value={demoLink}
            onChange={(e) => setDemoLink(e.target.value)}
            placeholder="e.g., https://youtube.com/watch?v=..."
            isDisabled={!isFieldEditable('demoLink')}
          />
          
          <TextField
            label="Deployed URL"
            value={deployedUrl}
            onChange={(e) => setDeployedUrl(e.target.value)}
            placeholder="e.g., https://myproject.vercel.app"
            isDisabled={!isFieldEditable('deployedUrl')}
          />
          
          <TextField
            label="Brainlift Link"
            value={brainliftLink}
            onChange={(e) => setBrainliftLink(e.target.value)}
            placeholder="e.g., https://docs.google.com/document/d/..."
            isDisabled={!isFieldEditable('brainliftLink')}
          />
          
          <TextField
            label="Social Post"
            value={socialPost}
            onChange={(e) => setSocialPost(e.target.value)}
            placeholder="e.g., https://twitter.com/username/status/..."
            isDisabled={!isFieldEditable('socialPost')}
          />
          
          {/* Technologies */}
          <Heading level={5}>Technologies Used</Heading>
          
          <Flex direction="column" gap={tokens.space.small}>
            {/* Display technologies as badges */}
            {technologies.length > 0 && (
              <Flex wrap="wrap" gap={tokens.space.xs}>
                {technologies.map((tech, i) => (
                  <Badge 
                    key={i} 
                    variation="info"
                    onClick={() => isFieldEditable('technologies') && removeTechnology(tech)}
                    style={{ cursor: isFieldEditable('technologies') ? 'pointer' : 'default' }}
                  >
                    {tech} {isFieldEditable('technologies') && '✕'}
                  </Badge>
                ))}
              </Flex>
            )}
            
            {/* Add technology */}
            {isFieldEditable('technologies') && (
              <Flex direction="row" gap={tokens.space.small}>
                <TextField
                  placeholder="Add a technology"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  width="100%"
                  label="Add Technology"
                  labelHidden
                />
                <Button
                  onClick={addTechnology}
                  variation="primary"
                >
                  Add
                </Button>
              </Flex>
            )}
          </Flex>
          
          {/* Featured Image */}
          <Heading level={5}>Featured Image</Heading>
          
          <Flex direction="column" gap={tokens.space.small}>
            <Text>Upload a screenshot or image that represents your project</Text>
            <Flex direction="row" alignItems="center" gap={tokens.space.medium}>
              {(previewUrl || featuredImageUrl) && (
                <View
                  backgroundColor={tokens.colors.background.secondary}
                  width="200px"
                  height="120px"
                  overflow="hidden"
                >
                  <Image
                    src={previewUrl || featuredImageUrl}
                    alt="Featured"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </View>
              )}
              {isFieldEditable('featuredImageUrl') && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="featured-image-upload"
                  />
                  <Button
                    as="label"
                    htmlFor="featured-image-upload"
                    variation="primary"
                  >
                    Choose Image
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
          
          {/* Notes */}
          <TextAreaField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes or comments..."
            rows={3}
            isDisabled={!isFieldEditable('notes')}
          />
          
          {/* Buttons */}
          <Flex justifyContent="flex-end" gap={tokens.space.medium}>
            {onCancel && (
              <Button
                type="button"
                variation="link"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variation="primary"
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save as Draft
            </Button>
            {submissionId && initialData?.status === 'draft' && (
              <Button
                type="button"
                variation="primary"
                onClick={submitForGradingHandler}
                isLoading={isSubmitting}
                loadingText="Submitting..."
              >
                Submit for Grading
              </Button>
            )}
          </Flex>
        </Flex>
      </form>
    </Card>
  );
};

export default SubmissionForm; 