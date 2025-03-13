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
  Tabs,
  Loader,
  Alert
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getShowcase, updateShowcase, createShowcase } from '../../graphql/operations/showcase';
import TemplateSelector from './TemplateSelector';
import ProjectSelector from './ProjectSelector';
import CustomizationOptions from './CustomizationOptions';
import VisibilitySettings from './VisibilitySettings';

const client = generateClient();

interface ShowcaseEditorProps {
  onPreview?: () => void;
}

const ShowcaseEditor: React.FC<ShowcaseEditorProps> = ({ onPreview }) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [showcase, setShowcase] = useState<any>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedProjects, setSelectedProjects] = useState<any[]>([]);
  const [customization, setCustomization] = useState<any>({
    themeColor: '#0066cc',
    accentColor: '#ff9900',
    fontPreference: 'system',
    layoutPreference: 'standard',
    sectionsOrder: ['about', 'projects', 'skills', 'experience', 'education', 'blogs', 'contact'],
    sectionsVisibility: {
      about: true,
      projects: true,
      skills: true,
      experience: true,
      education: true,
      blogs: true,
      contact: true
    }
  });
  const [visibility, setVisibility] = useState<any>({
    isPublic: false,
    accessType: 'public'
  });

  // Fetch showcase data when component mounts
  useEffect(() => {
    if (studentProfile?.id) {
      fetchShowcase();
    } else {
      setIsLoading(false);
    }
  }, [studentProfile]);

  // Fetch showcase data from API
  const fetchShowcase = async () => {
    setIsLoading(true);
    
    try {
      const result = await client.graphql({
        query: getShowcase,
        variables: {
          studentProfileId: studentProfile.id
        }
      });
      
      if ('data' in result && result.data.getShowcase) {
        const showcaseData = result.data.getShowcase;
        setShowcase(showcaseData);
        
        // Set component states from showcase data
        if (showcaseData.templateId) {
          setSelectedTemplateId(showcaseData.templateId);
        }
        
        if (showcaseData.projects) {
          setSelectedProjects(showcaseData.projects);
        }
        
        if (showcaseData.customization) {
          setCustomization(showcaseData.customization);
        }
        
        if (showcaseData.visibility) {
          setVisibility(showcaseData.visibility);
        }
      }
    } catch (error) {
      console.error('Error fetching showcase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save showcase data
  const saveShowcase = async () => {
    if (!studentProfile?.id) {
      setSaveError('User profile not found. Please try again later.');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    const showcaseData = {
      studentProfileId: studentProfile.id,
      templateId: selectedTemplateId,
      projects: selectedProjects,
      customization,
      visibility,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      if (showcase?.id) {
        // Update existing showcase
        await client.graphql({
          query: updateShowcase,
          variables: {
            input: {
              id: showcase.id,
              ...showcaseData
            }
          }
        });
      } else {
        // Create new showcase
        await client.graphql({
          query: createShowcase,
          variables: {
            input: showcaseData
          }
        });
      }
      
      setSaveSuccess(true);
      
      // Refetch showcase to get latest data
      fetchShowcase();
    } catch (error) {
      console.error('Error saving showcase:', error);
      setSaveError('Failed to save showcase. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  // Handle projects change
  const handleProjectsChange = (projects: any[]) => {
    setSelectedProjects(projects);
  };

  // Handle customization change
  const handleCustomizationChange = (customizationData: any) => {
    setCustomization(customizationData);
  };

  // Handle visibility change
  const handleVisibilityChange = (visibilityData: any) => {
    setVisibility(visibilityData);
  };

  // Handle preview button click
  const handlePreview = () => {
    if (onPreview) {
      onPreview();
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
      <Heading level={2}>Showcase Editor</Heading>
      <Text>Create and customize your professional showcase.</Text>
      <Divider marginBlock={tokens.space.medium} />
      
      {saveSuccess && (
        <Alert
          variation="success"
          isDismissible={true}
          hasIcon={true}
          heading="Showcase Saved"
          marginBottom={tokens.space.medium}
        >
          Your showcase has been saved successfully.
        </Alert>
      )}
      
      {saveError && (
        <Alert
          variation="error"
          isDismissible={true}
          hasIcon={true}
          heading="Error"
          marginBottom={tokens.space.medium}
        >
          {saveError}
        </Alert>
      )}
      
      <Tabs>
        <Tabs.Item title="Template" value="template">
          <TemplateSelector 
            selectedTemplateId={selectedTemplateId} 
            onSelect={handleTemplateSelect} 
          />
        </Tabs.Item>
        
        <Tabs.Item title="Projects" value="projects">
          <ProjectSelector 
            selectedProjects={selectedProjects} 
            onProjectsChange={handleProjectsChange} 
          />
        </Tabs.Item>
        
        <Tabs.Item title="Customization" value="customization">
          <CustomizationOptions 
            customization={customization} 
            onChange={handleCustomizationChange} 
          />
        </Tabs.Item>
        
        <Tabs.Item title="Visibility" value="visibility">
          <VisibilitySettings 
            visibility={visibility} 
            onChange={handleVisibilityChange} 
          />
        </Tabs.Item>
      </Tabs>
      
      <Flex justifyContent="space-between" marginTop={tokens.space.xl}>
        <Button
          variation="primary"
          size="large"
          onClick={saveShowcase}
          isLoading={isSaving}
        >
          Save Showcase
        </Button>
        
        <Button
          variation="link"
          size="large"
          onClick={handlePreview}
          isDisabled={!selectedTemplateId}
        >
          Preview Showcase
        </Button>
      </Flex>
    </Card>
  );
};

export default ShowcaseEditor; 