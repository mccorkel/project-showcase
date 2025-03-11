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
  Image,
  SelectField
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getTemplateById, generateTemplatePreview } from '../../graphql/operations/showcase';

const client = generateClient();

interface TemplatePreviewProps {
  templateId: string;
  onBack?: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  templateId, 
  onBack 
}) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [template, setTemplate] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewExpiry, setPreviewExpiry] = useState<string | null>(null);
  
  const [dataSet, setDataSet] = useState('default');
  const [customData, setCustomData] = useState<any>({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Full Stack Developer',
      bio: 'Passionate developer with experience in web and mobile application development.',
      avatarUrl: 'https://via.placeholder.com/150',
      location: 'San Francisco, CA',
      skills: ['JavaScript', 'React', 'Node.js', 'GraphQL', 'AWS'],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2018',
          endDate: '2022'
        }
      ],
      experience: [
        {
          company: 'Tech Solutions Inc.',
          position: 'Junior Developer',
          startDate: '2022',
          endDate: 'Present',
          description: 'Developing web applications using React and Node.js.'
        }
      ],
      socialLinks: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe'
      }
    },
    projects: [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform with product management, cart functionality, and payment processing.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        featuredImageUrl: 'https://via.placeholder.com/300x200',
        repoLink: 'https://github.com/johndoe/ecommerce',
        demoLink: 'https://demo.example.com/ecommerce',
        deployedUrl: 'https://ecommerce.example.com',
        isIncluded: true,
        displayOrder: 1
      },
      {
        id: '2',
        title: 'Weather App',
        description: 'A weather application that provides real-time weather information based on location.',
        technologies: ['React', 'OpenWeather API', 'CSS'],
        featuredImageUrl: 'https://via.placeholder.com/300x200',
        repoLink: 'https://github.com/johndoe/weather-app',
        demoLink: 'https://demo.example.com/weather',
        deployedUrl: 'https://weather.example.com',
        isIncluded: true,
        displayOrder: 2
      },
      {
        id: '3',
        title: 'Task Manager',
        description: 'A task management application with features like task creation, assignment, and status tracking.',
        technologies: ['React', 'Firebase', 'Material UI'],
        featuredImageUrl: 'https://via.placeholder.com/300x200',
        repoLink: 'https://github.com/johndoe/task-manager',
        demoLink: 'https://demo.example.com/tasks',
        deployedUrl: 'https://tasks.example.com',
        isIncluded: true,
        displayOrder: 3
      }
    ],
    customization: {
      themeColor: '#0066cc',
      accentColor: '#ff9900',
      fontPreference: 'sans-serif',
      layoutPreference: 'standard',
      sectionsOrder: ['about', 'projects', 'skills', 'experience', 'education'],
      sectionsVisibility: {
        about: true,
        projects: true,
        skills: true,
        experience: true,
        education: true,
        blogs: false,
        contact: true
      }
    }
  });

  // Fetch template data when component mounts
  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  // Fetch template data from API
  const fetchTemplate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: getTemplateById,
        variables: {
          id: templateId
        }
      });
      
      if ('data' in result && result.data.getTemplate) {
        const templateData = result.data.getTemplate;
        setTemplate(templateData);
        
        // Generate preview with default data
        generatePreview(templateData);
      } else {
        setError('Template not found. Please select a different template.');
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      setError('Failed to load template data. Please try again.');
      setIsLoading(false);
    }
  };

  // Generate template preview
  const generatePreview = async (templateData: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Prepare showcase data for preview
      const showcaseData = {
        templateId: templateData.id,
        ...customData
      };
      
      // Call API to generate preview
      const result = await client.graphql({
        query: generateTemplatePreview,
        variables: {
          templateId: templateData.id,
          showcaseData: JSON.stringify(showcaseData)
        }
      });
      
      if ('data' in result && result.data.generateTemplatePreview) {
        const previewData = result.data.generateTemplatePreview;
        setPreviewUrl(previewData.previewUrl);
        setPreviewExpiry(previewData.expiresAt);
      } else {
        setError('Failed to generate preview. Please try again.');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      setError('Failed to generate preview. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  // Handle data set change
  const handleDataSetChange = (value: string) => {
    setDataSet(value);
    
    // If using student profile data, update customData
    if (value === 'profile' && studentProfile) {
      // Create a copy of customData with student profile information
      const updatedData = { ...customData };
      
      // Update profile information
      updatedData.profile = {
        firstName: studentProfile.firstName || 'Your',
        lastName: studentProfile.lastName || 'Name',
        title: studentProfile.title || 'Software Developer',
        bio: studentProfile.bio || 'Your professional bio will appear here.',
        avatarUrl: studentProfile.avatarUrl || 'https://via.placeholder.com/150',
        location: studentProfile.location || 'Your Location',
        skills: studentProfile.skills || ['JavaScript', 'React', 'Node.js'],
        education: studentProfile.education || [],
        experience: studentProfile.experience || [],
        socialLinks: studentProfile.socialLinks || {}
      };
      
      // Update projects with actual submissions if available
      if (studentProfile.submissions && studentProfile.submissions.length > 0) {
        updatedData.projects = studentProfile.submissions.map((submission: any, index: number) => ({
          id: submission.id,
          title: submission.title || `Project ${index + 1}`,
          description: submission.description || 'Project description',
          technologies: submission.technologies || ['React', 'JavaScript'],
          featuredImageUrl: submission.featuredImageUrl || 'https://via.placeholder.com/300x200',
          repoLink: submission.repoLink || '',
          demoLink: submission.demoLink || '',
          deployedUrl: submission.deployedUrl || '',
          isIncluded: true,
          displayOrder: index + 1
        }));
      }
      
      setCustomData(updatedData);
      
      // Regenerate preview with updated data
      if (template) {
        generatePreview(template);
      }
    } else if (value === 'minimal') {
      // Create minimal data set
      const minimalData = {
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          title: 'Web Developer',
          bio: 'A brief bio.',
          avatarUrl: 'https://via.placeholder.com/150',
          skills: ['HTML', 'CSS', 'JavaScript']
        },
        projects: [
          {
            id: '1',
            title: 'Portfolio Website',
            description: 'A personal portfolio website.',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            isIncluded: true,
            displayOrder: 1
          }
        ],
        customization: customData.customization
      };
      
      setCustomData(minimalData);
      
      // Regenerate preview with updated data
      if (template) {
        generatePreview(template);
      }
    } else if (value === 'comprehensive') {
      // Create comprehensive data set
      const comprehensiveData = {
        profile: {
          firstName: 'Alex',
          lastName: 'Johnson',
          title: 'Senior Full Stack Engineer',
          bio: 'Experienced software engineer with a passion for building scalable web applications and mentoring junior developers. Specialized in React, Node.js, and cloud architecture.',
          avatarUrl: 'https://via.placeholder.com/150',
          location: 'New York, NY',
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis', 'CI/CD', 'Microservices'],
          education: [
            {
              institution: 'MIT',
              degree: 'Master of Science',
              field: 'Computer Science',
              startDate: '2015',
              endDate: '2017'
            },
            {
              institution: 'Stanford University',
              degree: 'Bachelor of Science',
              field: 'Computer Engineering',
              startDate: '2011',
              endDate: '2015'
            }
          ],
          experience: [
            {
              company: 'Tech Giants Inc.',
              position: 'Senior Software Engineer',
              startDate: '2020',
              endDate: 'Present',
              description: 'Leading development of cloud-native applications and mentoring junior developers.'
            },
            {
              company: 'Startup Innovations',
              position: 'Full Stack Developer',
              startDate: '2017',
              endDate: '2020',
              description: 'Developed and maintained multiple web applications using React and Node.js.'
            }
          ],
          socialLinks: {
            github: 'https://github.com/alexjohnson',
            linkedin: 'https://linkedin.com/in/alexjohnson',
            twitter: 'https://twitter.com/alexjohnson',
            portfolio: 'https://alexjohnson.dev'
          }
        },
        projects: [
          {
            id: '1',
            title: 'Enterprise Resource Planning System',
            description: 'A comprehensive ERP system for managing company resources, inventory, and personnel.',
            technologies: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker'],
            featuredImageUrl: 'https://via.placeholder.com/300x200',
            repoLink: 'https://github.com/alexjohnson/erp-system',
            demoLink: 'https://demo.example.com/erp',
            deployedUrl: 'https://erp.example.com',
            isIncluded: true,
            displayOrder: 1
          },
          {
            id: '2',
            title: 'Real-time Collaboration Platform',
            description: 'A platform for real-time document editing and team collaboration with video conferencing.',
            technologies: ['React', 'WebRTC', 'Socket.io', 'MongoDB', 'Express', 'AWS'],
            featuredImageUrl: 'https://via.placeholder.com/300x200',
            repoLink: 'https://github.com/alexjohnson/collab-platform',
            demoLink: 'https://demo.example.com/collab',
            deployedUrl: 'https://collab.example.com',
            isIncluded: true,
            displayOrder: 2
          },
          {
            id: '3',
            title: 'AI-Powered Content Generator',
            description: 'An application that uses machine learning to generate content based on user prompts.',
            technologies: ['React', 'Python', 'TensorFlow', 'Flask', 'AWS Lambda', 'S3'],
            featuredImageUrl: 'https://via.placeholder.com/300x200',
            repoLink: 'https://github.com/alexjohnson/ai-content-gen',
            demoLink: 'https://demo.example.com/ai-content',
            deployedUrl: 'https://ai-content.example.com',
            isIncluded: true,
            displayOrder: 3
          },
          {
            id: '4',
            title: 'Blockchain Voting System',
            description: 'A secure voting system built on blockchain technology to ensure transparency and security.',
            technologies: ['React', 'Solidity', 'Ethereum', 'Web3.js', 'Node.js'],
            featuredImageUrl: 'https://via.placeholder.com/300x200',
            repoLink: 'https://github.com/alexjohnson/blockchain-voting',
            demoLink: 'https://demo.example.com/voting',
            deployedUrl: 'https://voting.example.com',
            isIncluded: true,
            displayOrder: 4
          },
          {
            id: '5',
            title: 'IoT Home Automation',
            description: 'A system for controlling smart home devices with voice commands and mobile app.',
            technologies: ['React Native', 'Node.js', 'MQTT', 'Raspberry Pi', 'Arduino'],
            featuredImageUrl: 'https://via.placeholder.com/300x200',
            repoLink: 'https://github.com/alexjohnson/iot-home',
            demoLink: 'https://demo.example.com/iot-home',
            deployedUrl: 'https://iot-home.example.com',
            isIncluded: true,
            displayOrder: 5
          }
        ],
        customization: customData.customization
      };
      
      setCustomData(comprehensiveData);
      
      // Regenerate preview with updated data
      if (template) {
        generatePreview(template);
      }
    } else {
      // Reset to default data
      setCustomData({
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          title: 'Full Stack Developer',
          bio: 'Passionate developer with experience in web and mobile application development.',
          avatarUrl: 'https://via.placeholder.com/150',
          location: 'San Francisco, CA',
          skills: ['JavaScript', 'React', 'Node.js', 'GraphQL', 'AWS'],
          education: [
            {
              institution: 'University of Technology',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startDate: '2018',
              endDate: '2022'
            }
          ],
          experience: [
            {
              company: 'Tech Solutions Inc.',
              position: 'Junior Developer',
              startDate: '2022',
              endDate: 'Present',
              description: 'Developing web applications using React and Node.js.'
            }
          ],
          socialLinks: {
            github: 'https://github.com/johndoe',
            linkedin: 'https://linkedin.com/in/johndoe',
            twitter: 'https://twitter.com/johndoe'
          }
        },
        projects: [
          {
            id: '1',
            title: 'E-commerce Platform',
            description: 'A full-stack e-commerce platform with product management, cart functionality, and payment processing.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            featuredImageUrl: 'https://via.placeholder.com/300x200',
            repoLink: 'https://github.com/johndoe/ecommerce',
            demoLink: 'https://demo.example.com/ecommerce',
            deployedUrl: 'https://ecommerce.example.com',
            isIncluded: true,
            displayOrder: 1
          },
          {
            id: '2',
            title: 'Weather App',
            description: 'A weather application that provides real-time weather information based on location.',
            technologies: ['React', 'OpenWeather API', 'CSS'],
            featuredImageUrl: 'https://via.placeholder.com/300x200',
            repoLink: 'https://github.com/johndoe/weather-app',
            demoLink: 'https://demo.example.com/weather',
            deployedUrl: 'https://weather.example.com',
            isIncluded: true,
            displayOrder: 2
          },
          {
            id: '3',
            title: 'Task Manager',
            description: 'A task management application with features like task creation, assignment, and status tracking.',
            technologies: ['React', 'Firebase', 'Material UI'],
            featuredImageUrl: 'https://via.placeholder.com/300x200',
            repoLink: 'https://github.com/johndoe/task-manager',
            demoLink: 'https://demo.example.com/tasks',
            deployedUrl: 'https://tasks.example.com',
            isIncluded: true,
            displayOrder: 3
          }
        ],
        customization: {
          themeColor: '#0066cc',
          accentColor: '#ff9900',
          fontPreference: 'sans-serif',
          layoutPreference: 'standard',
          sectionsOrder: ['about', 'projects', 'skills', 'experience', 'education'],
          sectionsVisibility: {
            about: true,
            projects: true,
            skills: true,
            experience: true,
            education: true,
            blogs: false,
            contact: true
          }
        }
      });
      
      // Regenerate preview with updated data
      if (template) {
        generatePreview(template);
      }
    }
  };

  // Refresh preview
  const refreshPreview = () => {
    if (template) {
      generatePreview(template);
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
      <Heading level={2}>Template Preview</Heading>
      <Text>Preview how the template will look with different data sets.</Text>
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
      
      {template && (
        <Flex direction="column" gap={tokens.space.medium} marginBottom={tokens.space.medium}>
          <Flex alignItems="center" gap={tokens.space.medium}>
            <Image
              src={template.thumbnailUrl || 'https://via.placeholder.com/100'}
              alt={template.name}
              width="100px"
              height="100px"
              objectFit="cover"
              borderRadius={tokens.radii.medium}
            />
            <Flex direction="column">
              <Heading level={4}>{template.name}</Heading>
              <Text>{template.description}</Text>
              
              {template.features && template.features.length > 0 && (
                <Flex wrap="wrap" gap={tokens.space.xs} marginTop={tokens.space.xs}>
                  {template.features.map((feature: string) => (
                    <Badge
                      key={feature}
                      variation="info"
                      marginRight={tokens.space.xs}
                      marginBottom={tokens.space.xs}
                    >
                      {feature}
                    </Badge>
                  ))}
                </Flex>
              )}
            </Flex>
          </Flex>
          
          <Flex alignItems="flex-end" gap={tokens.space.medium}>
            <SelectField
              label="Preview Data"
              value={dataSet}
              onChange={(e) => handleDataSetChange(e.target.value)}
              flex="1"
            >
              <option value="default">Default Sample Data</option>
              <option value="minimal">Minimal Data</option>
              <option value="comprehensive">Comprehensive Data</option>
              {studentProfile && (
                <option value="profile">Your Profile Data</option>
              )}
            </SelectField>
            
            <Button
              onClick={refreshPreview}
              isLoading={isGenerating}
              isDisabled={isGenerating}
            >
              Refresh Preview
            </Button>
          </Flex>
        </Flex>
      )}
      
      {previewUrl && (
        <Card variation="outlined" padding={0} overflow="hidden">
          <iframe
            src={previewUrl}
            title="Template Preview"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        </Card>
      )}
      
      {previewExpiry && (
        <Text fontSize={tokens.fontSizes.small} color={tokens.colors.neutral[60]} marginTop={tokens.space.small}>
          Preview expires: {new Date(previewExpiry).toLocaleString()}
        </Text>
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

export default TemplatePreview; 