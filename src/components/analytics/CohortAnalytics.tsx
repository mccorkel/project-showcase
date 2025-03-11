import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  View, 
  Flex,
  Loader,
  Alert,
  Divider,
  SelectField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Grid
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { getCohortAnalytics } from '../../graphql/operations/analytics';

const client = generateClient();

interface CohortAnalyticsProps {
  cohortId: string;
  cohortName?: string;
}

/**
 * CohortAnalytics - A component for displaying analytics data for all students in a cohort
 * Provides instructors with insights into student showcase performance
 */
const CohortAnalytics: React.FC<CohortAnalyticsProps> = ({ 
  cohortId,
  cohortName
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [dateRange, setDateRange] = useState('30days'); // Default to last 30 days
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cohortId, dateRange]);
  
  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate date range based on selection
      const endDate = new Date().toISOString();
      let startDate;
      
      switch (dateRange) {
        case '7days':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '30days':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '90days':
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'alltime':
          startDate = undefined; // API will use the earliest available data
          break;
        default:
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      }
      
      const response = await client.graphql({
        query: getCohortAnalytics,
        variables: {
          cohortId,
          startDate,
          endDate
        }
      });
      
      // Fix the type issue by checking if data exists
      if ('data' in response && response.data?.getCohortAnalytics) {
        setAnalytics(response.data.getCohortAnalytics);
      } else {
        throw new Error('No analytics data returned');
      }
    } catch (err) {
      console.error('Error fetching cohort analytics:', err);
      setError('Failed to load cohort analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Handle export to CSV
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // In a real app, this would generate a CSV file with all analytics data
      // For now, we'll just simulate this with a timeout
      setTimeout(() => {
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add header row
        csvContent += "Student Name,Showcase Views,Projects,Published Date\n";
        
        // Add data rows for top showcases
        analytics.topShowcases.forEach((showcase: any) => {
          csvContent += `${showcase.studentName},${showcase.views},${showcase.projectCount || 0},${formatDate(showcase.publishedDate || new Date())}\n`;
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `cohort-analytics-${cohortId}-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Error exporting cohort analytics:', error);
      setIsExporting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Flex justifyContent="center" padding="2rem">
        <Loader size="large" />
      </Flex>
    );
  }
  
  if (error) {
    return (
      <Alert variation="error" heading="Error loading cohort analytics">
        {error}
      </Alert>
    );
  }
  
  // If no analytics data is available yet
  if (!analytics || !analytics.summary) {
    return (
      <Card>
        <Heading level={4}>No Cohort Analytics Data Available</Heading>
        <Text>
          Analytics data will be available after student showcases have been viewed.
          Check back later to see insights about your cohort's performance.
        </Text>
      </Card>
    );
  }
  
  return (
    <Card>
      <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
        <Heading level={4}>
          {cohortName ? `${cohortName} Analytics` : 'Cohort Analytics'}
        </Heading>
        <Flex alignItems="center" gap="1rem">
          <SelectField
            label="Time period"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="alltime">All time</option>
          </SelectField>
          <Button 
            onClick={handleExport} 
            isLoading={isExporting}
            loadingText="Exporting..."
          >
            Export CSV
          </Button>
        </Flex>
      </Flex>
      
      <Text>
        Data for period: {formatDate(analytics.period.startDate)} - {formatDate(analytics.period.endDate)}
      </Text>
      
      {/* Summary metrics */}
      <Flex direction="row" wrap="wrap" gap="1rem" marginTop="1rem">
        <Card variation="elevated" flex="1" minWidth="200px">
          <Heading level={5}>Total Students</Heading>
          <Text fontSize="2rem" fontWeight="bold">{analytics.summary.totalStudents}</Text>
        </Card>
        
        <Card variation="elevated" flex="1" minWidth="200px">
          <Heading level={5}>Published Showcases</Heading>
          <Text fontSize="2rem" fontWeight="bold">{analytics.summary.studentsWithPublishedShowcases}</Text>
          <Text fontSize="0.9rem" color="gray">
            {Math.round((analytics.summary.studentsWithPublishedShowcases / analytics.summary.totalStudents) * 100)}% of students
          </Text>
        </Card>
        
        <Card variation="elevated" flex="1" minWidth="200px">
          <Heading level={5}>Total Views</Heading>
          <Text fontSize="2rem" fontWeight="bold">{analytics.summary.totalShowcaseViews}</Text>
        </Card>
        
        <Card variation="elevated" flex="1" minWidth="200px">
          <Heading level={5}>Avg. Views</Heading>
          <Text fontSize="2rem" fontWeight="bold">{analytics.summary.averageViewsPerShowcase}</Text>
          <Text fontSize="0.9rem" color="gray">per showcase</Text>
        </Card>
      </Flex>
      
      <Divider marginTop="2rem" marginBottom="2rem" />
      
      {/* Views trend */}
      <Heading level={5}>Views Trend</Heading>
      <View marginTop="1rem" marginBottom="2rem">
        {/* In a real app, this would be a chart component */}
        <View height="200px" backgroundColor="#f5f5f5" borderRadius="8px" padding="1rem">
          <Text textAlign="center" marginTop="80px">Chart visualization would appear here</Text>
        </View>
      </View>
      
      <Divider marginTop="2rem" marginBottom="2rem" />
      
      {/* Top showcases */}
      <Heading level={5}>Top Student Showcases</Heading>
      <View marginTop="1rem" marginBottom="2rem">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th">Rank</TableCell>
              <TableCell as="th">Student</TableCell>
              <TableCell as="th">Views</TableCell>
              <TableCell as="th">Projects</TableCell>
              <TableCell as="th">Published</TableCell>
              <TableCell as="th">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.topShowcases.map((showcase: any, index: number) => (
              <TableRow key={showcase.studentId}>
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
                <TableCell>{showcase.studentName}</TableCell>
                <TableCell>{showcase.views}</TableCell>
                <TableCell>{showcase.projectCount || 'N/A'}</TableCell>
                <TableCell>{showcase.publishedDate ? formatDate(showcase.publishedDate) : 'N/A'}</TableCell>
                <TableCell>
                  <Button size="small" variation="link">
                    View Showcase
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
      
      <Divider marginTop="2rem" marginBottom="2rem" />
      
      {/* Analytics breakdown */}
      <Grid
        templateColumns="1fr 1fr"
        templateRows="auto"
        gap="1.5rem"
      >
        {/* Referrers */}
        <Card>
          <Heading level={5}>Traffic Sources</Heading>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Source</TableCell>
                <TableCell as="th">Views</TableCell>
                <TableCell as="th">%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.referrers.map((referrer: any) => (
                <TableRow key={referrer.source}>
                  <TableCell>{referrer.source}</TableCell>
                  <TableCell>{referrer.count}</TableCell>
                  <TableCell>{referrer.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        
        {/* Locations */}
        <Card>
          <Heading level={5}>Visitor Locations</Heading>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Country</TableCell>
                <TableCell as="th">Views</TableCell>
                <TableCell as="th">%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.locations.map((location: any) => (
                <TableRow key={location.country}>
                  <TableCell>{location.country}</TableCell>
                  <TableCell>{location.count}</TableCell>
                  <TableCell>{location.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        
        {/* Devices */}
        <Card>
          <Heading level={5}>Device Types</Heading>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Device</TableCell>
                <TableCell as="th">Views</TableCell>
                <TableCell as="th">%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.devices.map((device: any) => (
                <TableRow key={device.type}>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>{device.count}</TableCell>
                  <TableCell>{device.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        
        {/* Student Engagement */}
        <Card>
          <Heading level={5}>Student Engagement</Heading>
          <View height="200px" backgroundColor="#f5f5f5" borderRadius="8px" padding="1rem">
            <Text textAlign="center" marginTop="80px">Engagement chart would appear here</Text>
          </View>
        </Card>
      </Grid>
    </Card>
  );
};

export default CohortAnalytics; 