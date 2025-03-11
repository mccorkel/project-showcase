import React from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  View, 
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Flex
} from '@aws-amplify/ui-react';

interface ProjectViewData {
  projectId: string;
  projectTitle: string;
  views: number;
  percentage: number;
}

interface ProjectPopularityProps {
  projectViews: ProjectViewData[];
  title?: string;
}

/**
 * ProjectPopularity - A component that displays project popularity analytics
 * Shows which projects are most viewed and their percentage of total views
 */
const ProjectPopularity: React.FC<ProjectPopularityProps> = ({ 
  projectViews,
  title = "Project Popularity"
}) => {
  // Sort projects by views (highest first)
  const sortedProjects = [...projectViews].sort((a, b) => b.views - a.views);
  
  // Calculate total views
  const totalViews = projectViews.reduce((sum, project) => sum + project.views, 0);
  
  // Determine if we have any data
  const hasData = projectViews.length > 0 && totalViews > 0;
  
  return (
    <Card>
      <Heading level={5}>{title}</Heading>
      
      {!hasData ? (
        <Text>No project view data available yet.</Text>
      ) : (
        <>
          <Text>Total project views: {totalViews}</Text>
          
          <View marginTop="1rem">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Rank</TableCell>
                  <TableCell as="th">Project</TableCell>
                  <TableCell as="th">Views</TableCell>
                  <TableCell as="th">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProjects.map((project, index) => (
                  <TableRow key={project.projectId}>
                    <TableCell>
                      {index === 0 ? (
                        <Badge variation="success">#{index + 1}</Badge>
                      ) : index === 1 ? (
                        <Badge variation="info">#{index + 1}</Badge>
                      ) : index === 2 ? (
                        <Badge variation="warning">#{index + 1}</Badge>
                      ) : (
                        `#${index + 1}`
                      )}
                    </TableCell>
                    <TableCell>{project.projectTitle}</TableCell>
                    <TableCell>{project.views}</TableCell>
                    <TableCell>
                      <Flex alignItems="center">
                        <Text>{project.percentage}%</Text>
                        <View 
                          backgroundColor="brand.primary" 
                          width={`${project.percentage}%`}
                          maxWidth="100px"
                          height="8px"
                          marginLeft="0.5rem"
                          borderRadius="4px"
                        />
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </View>
        </>
      )}
    </Card>
  );
};

export default ProjectPopularity; 