import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Flex, 
  Text, 
  View, 
  Loader, 
  Alert,
  Badge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  SelectField,
  Divider
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { getShowcaseAnalytics } from '../../graphql/operations/analytics';

const client = generateClient();

interface ShowcaseAnalyticsProps {
  showcaseId: string;
}

const ShowcaseAnalytics: React.FC<ShowcaseAnalyticsProps> = ({ showcaseId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [dateRange, setDateRange] = useState('7days'); // Default to last 7 days
  
  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcaseId, dateRange]);
  
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
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      }
      
      const response = await client.graphql({
        query: getShowcaseAnalytics,
        variables: {
          showcaseId,
          startDate,
          endDate
        }
      });
      
      // Fix the type issue by checking if data exists
      if ('data' in response && response.data?.getShowcaseAnalytics) {
        setAnalytics(response.data.getShowcaseAnalytics);
      } else {
        throw new Error('No analytics data returned');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again later.');
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
  
  if (isLoading) {
    return (
      <Flex justifyContent="center" padding="2rem">
        <Loader size="large" />
      </Flex>
    );
  }
  
  if (error) {
    return (
      <Alert variation="error" heading="Error loading analytics">
        {error}
      </Alert>
    );
  }
  
  // If no analytics data is available yet
  if (!analytics || !analytics.summary) {
    return (
      <Card>
        <Heading level={4}>No Analytics Data Available</Heading>
        <Text>
          Analytics data will be available after your showcase has been viewed.
          Check back later to see insights about your showcase's performance.
        </Text>
      </Card>
    );
  }
  
  return (
    <Card>
      <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
        <Heading level={4}>Showcase Analytics</Heading>
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
      </Flex>
      
      <Text>
        Data for period: {formatDate(analytics.period.startDate)} - {formatDate(analytics.period.endDate)}
      </Text>
      
      {/* Summary metrics */}
      <Flex direction="row" wrap="wrap" gap="1rem" marginTop="1rem">
        <Card variation="elevated" flex="1" minWidth="200px">
          <Heading level={5}>Total Views</Heading>
          <Text fontSize="2rem" fontWeight="bold">{analytics.summary.totalViews}</Text>
        </Card>
        
        <Card variation="elevated" flex="1" minWidth="200px">
          <Heading level={5}>Unique Visitors</Heading>
          <Text fontSize="2rem" fontWeight="bold">{analytics.summary.uniqueVisitors}</Text>
        </Card>
        
        <Card variation="elevated" flex="1" minWidth="200px">
          <Heading level={5}>Avg. Time on Page</Heading>
          <Text fontSize="2rem" fontWeight="bold">{analytics.summary.averageTimeOnPage}</Text>
        </Card>
        
        <Card variation="elevated" flex="1" minWidth="200px">
          <Heading level={5}>Bounce Rate</Heading>
          <Text fontSize="2rem" fontWeight="bold">{analytics.summary.bounceRate}%</Text>
        </Card>
      </Flex>
      
      <Divider marginTop="2rem" marginBottom="2rem" />
      
      {/* Views by day */}
      <Heading level={5}>Views Over Time</Heading>
      <View marginTop="1rem" marginBottom="2rem">
        {/* In a real app, this would be a chart component */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th">Date</TableCell>
              <TableCell as="th">Views</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.viewsByDay.map((day: any) => (
              <TableRow key={day.date}>
                <TableCell>{formatDate(day.date)}</TableCell>
                <TableCell>{day.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
      
      <Divider marginTop="2rem" marginBottom="2rem" />
      
      {/* Project views */}
      <Heading level={5}>Project Popularity</Heading>
      <View marginTop="1rem" marginBottom="2rem">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th">Project</TableCell>
              <TableCell as="th">Views</TableCell>
              <TableCell as="th">Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.projectViews.map((project: any) => (
              <TableRow key={project.projectId}>
                <TableCell>{project.projectTitle}</TableCell>
                <TableCell>{project.views}</TableCell>
                <TableCell>{project.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
      
      <Flex direction="row" wrap="wrap" gap="2rem">
        {/* Referrers */}
        <View flex="1" minWidth="300px">
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
        </View>
        
        {/* Locations */}
        <View flex="1" minWidth="300px">
          <Heading level={5}>Visitor Locations</Heading>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Location</TableCell>
                <TableCell as="th">Views</TableCell>
                <TableCell as="th">%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.locations.map((location: any) => (
                <TableRow key={`${location.country}-${location.region}-${location.city}`}>
                  <TableCell>
                    {location.city !== 'Unknown' ? `${location.city}, ` : ''}
                    {location.region !== 'Unknown' ? `${location.region}, ` : ''}
                    {location.country}
                  </TableCell>
                  <TableCell>{location.count}</TableCell>
                  <TableCell>{location.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </View>
      </Flex>
      
      {/* Devices */}
      <View marginTop="2rem">
        <Heading level={5}>Device Types</Heading>
        <Flex direction="row" gap="1rem" marginTop="1rem">
          {analytics.devices.map((device: any) => (
            <Card key={device.type} variation="outlined" flex="1">
              <Heading level={6}>{device.type.charAt(0).toUpperCase() + device.type.slice(1)}</Heading>
              <Text fontSize="1.5rem" fontWeight="bold">{device.count}</Text>
              <Badge variation="info">{device.percentage}%</Badge>
            </Card>
          ))}
        </Flex>
      </View>
    </Card>
  );
};

export default ShowcaseAnalytics; 