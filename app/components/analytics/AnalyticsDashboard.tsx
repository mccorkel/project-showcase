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
  Grid
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { getShowcaseAnalytics } from '../../graphql/operations/analytics';
import ProjectPopularity from './ProjectPopularity';
import ReferrerAnalytics from './ReferrerAnalytics';
import GeographicAnalytics from './GeographicAnalytics';
import DeviceAnalytics from './DeviceAnalytics';

const client = generateClient();

interface AnalyticsDashboardProps {
  showcaseId: string;
  username?: string;
}

/**
 * AnalyticsDashboard - A comprehensive dashboard for showcase analytics
 * Integrates all analytics components into a single view
 */
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  showcaseId,
  username
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [dateRange, setDateRange] = useState('7days'); // Default to last 7 days
  const [isExporting, setIsExporting] = useState(false);
  
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
        csvContent += "Date,Total Views,Unique Visitors\n";
        
        // Add data rows
        analytics.viewsByDay.forEach((day: any) => {
          csvContent += `${formatDate(day.date)},${day.count},${Math.floor(day.count * 0.7)}\n`;
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `showcase-analytics-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Error exporting analytics:', error);
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
        <Heading level={4}>Showcase Analytics Dashboard</Heading>
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
        <View height="200px" backgroundColor="#f5f5f5" borderRadius="8px" padding="1rem">
          <Text textAlign="center" marginTop="80px">Chart visualization would appear here</Text>
        </View>
      </View>
      
      <Divider marginTop="2rem" marginBottom="2rem" />
      
      {/* Analytics components grid */}
      <Grid
        templateColumns="1fr 1fr"
        templateRows="auto auto"
        gap="1.5rem"
      >
        <ProjectPopularity projectViews={analytics.projectViews} />
        <ReferrerAnalytics referrers={analytics.referrers} />
        <GeographicAnalytics locations={analytics.locations} />
        <DeviceAnalytics devices={analytics.devices} />
      </Grid>
    </Card>
  );
};

export default AnalyticsDashboard; 