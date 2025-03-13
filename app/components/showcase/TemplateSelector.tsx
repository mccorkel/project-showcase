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
  Image,
  Loader,
  Collection
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { getTemplates } from '../../graphql/operations/showcase';

const client = generateClient();

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplateId, onSelect }) => {
  const { tokens } = useTheme();
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(selectedTemplateId || '');

  // Fetch templates when the component mounts
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Update selected template when prop changes
  useEffect(() => {
    if (selectedTemplateId) {
      setSelectedTemplate(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  // Fetch templates from the API
  const fetchTemplates = async () => {
    setIsLoading(true);
    
    try {
      const result = await client.graphql({
        query: getTemplates
      });
      
      if ('data' in result && result.data.listTemplates) {
        setTemplates(result.data.listTemplates.items);
        
        // If no template is selected and we have templates, select the first one
        if (!selectedTemplate && result.data.listTemplates.items.length > 0) {
          setSelectedTemplate(result.data.listTemplates.items[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelect(templateId);
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

  if (templates.length === 0) {
    return (
      <Card>
        <Flex direction="column" alignItems="center" padding={tokens.space.xl} gap={tokens.space.medium}>
          <Heading level={3}>No Templates Available</Heading>
          <Text>There are no templates available at the moment. Please try again later.</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Heading level={3}>Select a Template</Heading>
      <Text>Choose a template for your showcase. Each template has different features and customization options.</Text>
      <Divider marginBlock={tokens.space.medium} />
      
      <Collection
        items={templates}
        type="grid"
        gap={tokens.space.medium}
        templateColumns={{ base: '1fr', medium: '1fr 1fr', large: '1fr 1fr 1fr' }}
      >
        {(template) => (
          <Card
            key={template.id}
            variation="outlined"
            borderWidth={template.id === selectedTemplate ? '2px' : '1px'}
            borderColor={template.id === selectedTemplate ? 'blue' : tokens.colors.border.primary}
            padding={tokens.space.medium}
            onClick={() => handleTemplateSelect(template.id)}
            style={{ cursor: 'pointer' }}
          >
            <Flex direction="column" gap={tokens.space.small}>
              <Heading level={5}>{template.name}</Heading>
              
              {template.thumbnailUrl && (
                <View
                  width="100%"
                  height="150px"
                  overflow="hidden"
                  marginBottom={tokens.space.small}
                >
                  <Image
                    src={template.thumbnailUrl}
                    alt={template.name}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </View>
              )}
              
              <Text>{template.description}</Text>
              
              {template.features && template.features.length > 0 && (
                <Flex direction="column" gap={tokens.space.xs}>
                  <Text fontWeight="bold">Features:</Text>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {template.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </Flex>
              )}
              
              {template.id === selectedTemplate && (
                <Button
                  variation="primary"
                  isFullWidth
                >
                  Selected
                </Button>
              )}
              
              {template.id !== selectedTemplate && (
                <Button
                  variation="primary"
                  isFullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template.id);
                  }}
                >
                  Select
                </Button>
              )}
            </Flex>
          </Card>
        )}
      </Collection>
    </Card>
  );
};

export default TemplateSelector; 