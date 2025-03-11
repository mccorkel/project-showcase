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
  Image
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getShowcase, getTemplateById } from '../../graphql/operations/showcase';

const client = generateClient();

interface ShowcasePreviewProps {
  onBack: () => void;
  onPublish?: () => void;
}

const ShowcasePreview: React.FC<ShowcasePreviewProps> = ({ onBack, onPublish }) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showcase, setShowcase] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  // Fetch showcase data when component mounts
  useEffect(() => {
    if (studentProfile?.id) {
      fetchShowcaseData();
    } else {
      setIsLoading(false);
      setLoadError('User profile not found. Please try again later.');
    }
  }, [studentProfile]);

  // Fetch showcase and template data
  const fetchShowcaseData = async () => {
    setIsLoading(true);
    setLoadError(null);
    
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
        
        // Fetch template data if templateId exists
        if (showcaseData.templateId) {
          const templateResult = await client.graphql({
            query: getTemplateById,
            variables: {
              id: showcaseData.templateId
            }
          });
          
          if ('data' in templateResult && templateResult.data.getTemplate) {
            const templateData = templateResult.data.getTemplate;
            setTemplate(templateData);
            
            // Generate preview HTML
            generatePreviewHtml(showcaseData, templateData);
          } else {
            setLoadError('Template not found. Please select a different template.');
          }
        } else {
          setLoadError('No template selected. Please select a template for your showcase.');
        }
      } else {
        setLoadError('Showcase not found. Please create a showcase first.');
      }
    } catch (error) {
      console.error('Error fetching showcase data:', error);
      setLoadError('Failed to load showcase data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate preview HTML from template and showcase data
  const generatePreviewHtml = (showcaseData: any, templateData: any) => {
    try {
      // In a real implementation, this would use the template's HTML and inject the showcase data
      // For this example, we'll create a simple preview based on the customization options
      
      const { customization, projects } = showcaseData;
      const { themeColor, accentColor, fontPreference } = customization;
      
      // Get included projects sorted by display order
      const includedProjects = projects
        .filter((project: any) => project.isIncluded)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
      
      // Create a simple HTML preview
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${studentProfile.firstName} ${studentProfile.lastName} - Portfolio</title>
          <style>
            body {
              font-family: ${fontPreference === 'system' ? 'sans-serif' : fontPreference};
              margin: 0;
              padding: 0;
              color: #333;
            }
            header {
              background-color: ${themeColor};
              color: white;
              padding: 2rem;
              text-align: center;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
            }
            .profile {
              display: flex;
              align-items: center;
              margin-bottom: 2rem;
            }
            .profile-image {
              width: 150px;
              height: 150px;
              border-radius: 50%;
              object-fit: cover;
              margin-right: 2rem;
            }
            .profile-info {
              flex: 1;
            }
            .projects {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 2rem;
            }
            .project-card {
              border: 1px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .project-image {
              width: 100%;
              height: 200px;
              object-fit: cover;
            }
            .project-content {
              padding: 1.5rem;
            }
            .project-title {
              color: ${themeColor};
              margin-top: 0;
            }
            .project-description {
              margin-bottom: 1rem;
            }
            .project-technologies {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            .technology-tag {
              background-color: ${accentColor};
              color: white;
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              font-size: 0.8rem;
            }
            .project-links {
              display: flex;
              gap: 1rem;
              margin-top: 1rem;
            }
            .project-link {
              color: ${themeColor};
              text-decoration: none;
            }
            .project-link:hover {
              text-decoration: underline;
            }
            .section-title {
              color: ${themeColor};
              border-bottom: 2px solid ${accentColor};
              padding-bottom: 0.5rem;
              margin-top: 2rem;
              margin-bottom: 1.5rem;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>${studentProfile.firstName} ${studentProfile.lastName}</h1>
            <p>${studentProfile.bio || 'Software Developer'}</p>
          </header>
          
          <div class="container">
            <div class="profile">
              <img src="${studentProfile.avatarUrl || 'https://via.placeholder.com/150'}" alt="Profile" class="profile-image">
              <div class="profile-info">
                <h2>About Me</h2>
                <p>${studentProfile.bio || 'No bio available.'}</p>
              </div>
            </div>
            
            <h2 class="section-title">Projects</h2>
            <div class="projects">
              ${includedProjects.map((project: any) => `
                <div class="project-card">
                  ${project.featuredImageUrl ? 
                    `<img src="${project.featuredImageUrl}" alt="${project.title}" class="project-image">` : 
                    ''
                  }
                  <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                      ${(project.technologies || []).map((tech: string) => 
                        `<span class="technology-tag">${tech}</span>`
                      ).join('')}
                    </div>
                    <div class="project-links">
                      ${project.repoLink ? `<a href="${project.repoLink}" class="project-link" target="_blank">Repository</a>` : ''}
                      ${project.demoLink ? `<a href="${project.demoLink}" class="project-link" target="_blank">Demo</a>` : ''}
                      ${project.deployedUrl ? `<a href="${project.deployedUrl}" class="project-link" target="_blank">Live Site</a>` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
        </html>
      `;
      
      setPreviewHtml(html);
    } catch (error) {
      console.error('Error generating preview HTML:', error);
      setLoadError('Failed to generate preview. Please try again.');
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
      <Heading level={2}>Showcase Preview</Heading>
      <Text>Preview how your showcase will appear to visitors.</Text>
      <Divider marginBlock={tokens.space.medium} />
      
      {loadError && (
        <Alert
          variation="error"
          isDismissible={true}
          hasIcon={true}
          heading="Error"
          marginBottom={tokens.space.medium}
        >
          {loadError}
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
            </Flex>
          </Flex>
        </Flex>
      )}
      
      {previewHtml && (
        <Card variation="outlined" padding={0} overflow="hidden">
          <iframe
            srcDoc={previewHtml}
            title="Showcase Preview"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        </Card>
      )}
      
      <Flex justifyContent="space-between" marginTop={tokens.space.xl}>
        <Button
          variation="link"
          onClick={onBack}
        >
          Back to Editor
        </Button>
        
        {onPublish && (
          <Button
            variation="primary"
            onClick={onPublish}
            isDisabled={!showcase?.templateId}
          >
            Publish Showcase
          </Button>
        )}
      </Flex>
    </Card>
  );
};

export default ShowcasePreview; 