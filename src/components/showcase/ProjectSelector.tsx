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
  Collection,
  SwitchField,
  TextField,
  SelectField
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmissions } from '../../graphql/operations/submissions';

const client = generateClient();

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  featuredImageUrl?: string;
  repoLink?: string;
  demoLink?: string;
  deployedUrl?: string;
  isIncluded: boolean;
  displayOrder: number;
}

interface ProjectSelectorProps {
  selectedProjects: Project[];
  onProjectsChange: (projects: Project[]) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  selectedProjects, 
  onProjectsChange 
}) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>(selectedProjects || []);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Fetch submissions when the component mounts
  useEffect(() => {
    fetchSubmissions();
  }, [studentProfile]);

  // Update projects when selectedProjects prop changes
  useEffect(() => {
    if (selectedProjects && selectedProjects.length > 0) {
      setProjects(selectedProjects);
    }
  }, [selectedProjects]);

  // Apply search filter when projects or search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredProjects(
        projects.filter(
          project => 
            project.title.toLowerCase().includes(term) || 
            project.description.toLowerCase().includes(term) ||
            (project.technologies && project.technologies.some(tech => tech.toLowerCase().includes(term)))
        )
      );
    }
  }, [projects, searchTerm]);

  // Fetch submissions from the API
  const fetchSubmissions = async () => {
    if (!studentProfile?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await client.graphql({
        query: getSubmissions,
        variables: {
          studentProfileId: studentProfile.id,
          limit: 100
        }
      });
      
      if ('data' in result && result.data.listSubmissions) {
        const submissionData = result.data.listSubmissions.items;
        
        // Convert submissions to projects
        const newProjects = submissionData.map((submission: any) => {
          // Check if this submission is already in the projects list
          const existingProject = projects.find(p => p.id === submission.id);
          
          return {
            id: submission.id,
            title: submission.title,
            description: submission.description,
            technologies: submission.technologies || [],
            featuredImageUrl: submission.featuredImageUrl,
            repoLink: submission.repoLink,
            demoLink: submission.demoLink,
            deployedUrl: submission.deployedUrl,
            isIncluded: existingProject ? existingProject.isIncluded : false,
            displayOrder: existingProject ? existingProject.displayOrder : 999
          };
        });
        
        setSubmissions(submissionData);
        setProjects(newProjects);
        setFilteredProjects(newProjects);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle project inclusion
  const toggleProjectInclusion = (projectId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          isIncluded: !project.isIncluded
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    onProjectsChange(updatedProjects);
  };

  // Update project display order
  const updateProjectOrder = (projectId: string, order: number) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          displayOrder: order
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    onProjectsChange(updatedProjects);
  };

  // Get included projects sorted by display order
  const getIncludedProjects = () => {
    return projects
      .filter(project => project.isIncluded)
      .sort((a, b) => a.displayOrder - b.displayOrder);
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

  if (projects.length === 0) {
    return (
      <Card>
        <Flex direction="column" alignItems="center" padding={tokens.space.xl} gap={tokens.space.medium}>
          <Heading level={3}>No Projects Available</Heading>
          <Text>You don't have any projects to include in your showcase. Create submissions first.</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Heading level={3}>Select Projects</Heading>
      <Text>Choose which projects to include in your showcase and set their display order.</Text>
      <Divider marginBlock={tokens.space.medium} />
      
      {/* Search and Filter */}
      <TextField
        label="Search Projects"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title, description, or technology"
        marginBottom={tokens.space.medium}
      />
      
      {/* Selected Projects Summary */}
      <Card variation="outlined" marginBottom={tokens.space.medium}>
        <Heading level={4}>Selected Projects ({getIncludedProjects().length})</Heading>
        {getIncludedProjects().length === 0 ? (
          <Text>No projects selected. Toggle the switch on projects below to include them.</Text>
        ) : (
          <Collection
            items={getIncludedProjects()}
            type="list"
            gap={tokens.space.small}
          >
            {(project, index) => (
              <Flex key={project.id} alignItems="center" gap={tokens.space.small}>
                <Text fontWeight="bold">{index + 1}.</Text>
                <Text>{project.title}</Text>
              </Flex>
            )}
          </Collection>
        )}
      </Card>
      
      {/* Projects List */}
      <Collection
        items={filteredProjects}
        type="list"
        gap={tokens.space.medium}
      >
        {(project) => (
          <Card key={project.id} variation="outlined">
            <Flex direction={{ base: 'column', large: 'row' }} gap={tokens.space.medium}>
              {/* Featured Image */}
              {project.featuredImageUrl && (
                <View
                  width={{ base: '100%', large: '200px' }}
                  height={{ base: '150px', large: '150px' }}
                  overflow="hidden"
                >
                  <Image
                    src={project.featuredImageUrl}
                    alt={project.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </View>
              )}
              
              {/* Content */}
              <Flex direction="column" gap={tokens.space.small} flex="1">
                <Heading level={5}>{project.title}</Heading>
                
                <Flex wrap="wrap" gap={tokens.space.xs}>
                  {project.technologies && project.technologies.map((tech, index) => (
                    <Text key={index} fontSize={tokens.fontSizes.small} color={tokens.colors.neutral[60]}>
                      {tech}{index < project.technologies.length - 1 ? ', ' : ''}
                    </Text>
                  ))}
                </Flex>
                
                <Text>{project.description?.substring(0, 150)}...</Text>
                
                <Flex direction={{ base: 'column', medium: 'row' }} gap={tokens.space.small} alignItems="center" justifyContent="space-between">
                  <SwitchField
                    label="Include in Showcase"
                    labelPosition="start"
                    isChecked={project.isIncluded}
                    onChange={() => toggleProjectInclusion(project.id)}
                  />
                  
                  {project.isIncluded && (
                    <SelectField
                      label="Display Order"
                      labelHidden
                      value={project.displayOrder.toString()}
                      onChange={(e) => updateProjectOrder(project.id, parseInt(e.target.value))}
                      width={{ base: '100%', medium: '150px' }}
                    >
                      {Array.from({ length: projects.length }, (_, i) => (
                        <option key={i + 1} value={(i + 1).toString()}>
                          Position {i + 1}
                        </option>
                      ))}
                    </SelectField>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Card>
        )}
      </Collection>
    </Card>
  );
};

export default ProjectSelector; 