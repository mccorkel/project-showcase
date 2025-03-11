import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Flex, 
  Loader, 
  Button, 
  SelectField,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  View,
  Divider
} from '@aws-amplify/ui-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

// Mock data for demonstration purposes
const generateMockData = () => {
  // User growth data
  const userGrowthData = Array.from({ length: 12 }, (_, i) => {
    const month = format(new Date(2024, i, 1), 'MMM');
    const students = 50 + Math.floor(Math.random() * 30) + (i * 15);
    const instructors = 5 + Math.floor(Math.random() * 3) + Math.floor(i/2);
    const admins = 2 + Math.floor(i/4);
    return { month, students, instructors, admins, total: students + instructors + admins };
  });

  // Showcase metrics
  const showcaseMetrics = {
    totalShowcases: 487,
    publishedShowcases: 342,
    averageViewsPerShowcase: 128,
    totalViews: 43776,
    highestViews: 2345,
    averageProjects: 4.2
  };

  // Traffic sources
  const trafficSources = [
    { name: 'Direct', value: 40 },
    { name: 'Social Media', value: 25 },
    { name: 'Search Engines', value: 20 },
    { name: 'Referrals', value: 10 },
    { name: 'Other', value: 5 }
  ];

  // Geographic distribution
  const geographicDistribution = [
    { country: 'United States', visitors: 15420 },
    { country: 'Canada', visitors: 5230 },
    { country: 'United Kingdom', visitors: 4120 },
    { country: 'Germany', visitors: 3450 },
    { country: 'Australia', visitors: 2980 },
    { country: 'France', visitors: 2540 },
    { country: 'Japan', visitors: 2210 },
    { country: 'Other', visitors: 7826 }
  ];

  // Device distribution
  const deviceDistribution = [
    { name: 'Desktop', value: 55 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 10 }
  ];

  // System performance
  const systemPerformance = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), 'MM/dd');
    const apiLatency = 100 + Math.floor(Math.random() * 150);
    const errorRate = Math.random() * 2;
    const requestVolume = 1000 + Math.floor(Math.random() * 2000) + (i * 50);
    return { date, apiLatency, errorRate, requestVolume };
  });

  // Top templates
  const topTemplates = [
    { name: 'Modern Portfolio', usage: 124, rating: 4.8 },
    { name: 'Academic Showcase', usage: 98, rating: 4.6 },
    { name: 'Creative Projects', usage: 87, rating: 4.7 },
    { name: 'Technical Resume', usage: 76, rating: 4.5 },
    { name: 'Minimalist Display', usage: 65, rating: 4.4 }
  ];

  return {
    userGrowthData,
    showcaseMetrics,
    trafficSources,
    geographicDistribution,
    deviceDistribution,
    systemPerformance,
    topTemplates
  };
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface SystemAnalyticsProps {
  // In a real implementation, we might pass in authentication or other props
}

const SystemAnalytics: React.FC<SystemAnalyticsProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<string>('30days');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, we would fetch data from an API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockData = generateMockData();
        setAnalyticsData(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching system analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  const exportToCsv = () => {
    // In a real implementation, this would generate and download a CSV file
    alert('CSV export functionality would be implemented here');
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
      <Card variation="elevated">
        <Heading level={3}>Error</Heading>
        <Text>{error}</Text>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card variation="elevated">
        <Heading level={3}>No Data Available</Heading>
        <Text>There is no analytics data available for the selected period.</Text>
      </Card>
    );
  }

  const { 
    userGrowthData, 
    showcaseMetrics, 
    trafficSources, 
    geographicDistribution, 
    deviceDistribution,
    systemPerformance,
    topTemplates
  } = analyticsData;

  return (
    <Flex direction="column" gap="1.5rem">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={3}>System-wide Analytics Dashboard</Heading>
        <Flex gap="1rem">
          <SelectField
            label="Date Range"
            value={dateRange}
            onChange={handleDateRangeChange}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
            <option value="allTime">All Time</option>
          </SelectField>
          <Button onClick={exportToCsv}>Export to CSV</Button>
        </Flex>
      </Flex>

      {/* Summary Metrics */}
      <Card>
        <Heading level={4}>System Summary</Heading>
        <Flex wrap="wrap" gap="1rem" marginTop="1rem">
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Total Users</Text>
            <Heading level={5}>{userGrowthData[userGrowthData.length - 1].total}</Heading>
          </Card>
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Total Showcases</Text>
            <Heading level={5}>{showcaseMetrics.totalShowcases}</Heading>
          </Card>
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Published Showcases</Text>
            <Heading level={5}>{showcaseMetrics.publishedShowcases}</Heading>
          </Card>
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Total Views</Text>
            <Heading level={5}>{showcaseMetrics.totalViews.toLocaleString()}</Heading>
          </Card>
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Avg. Views/Showcase</Text>
            <Heading level={5}>{showcaseMetrics.averageViewsPerShowcase}</Heading>
          </Card>
        </Flex>
      </Card>

      {/* User Growth Chart */}
      <Card>
        <Heading level={4}>User Growth</Heading>
        <Text>Monthly user growth by role type</Text>
        <View height="300px" marginTop="1rem">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={userGrowthData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" stackId="a" fill="#0088FE" name="Students" />
              <Bar dataKey="instructors" stackId="a" fill="#00C49F" name="Instructors" />
              <Bar dataKey="admins" stackId="a" fill="#FFBB28" name="Administrators" />
            </BarChart>
          </ResponsiveContainer>
        </View>
      </Card>

      {/* System Performance */}
      <Card>
        <Heading level={4}>System Performance</Heading>
        <Text>API latency and error rates over time</Text>
        <View height="300px" marginTop="1rem">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={systemPerformance}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="apiLatency" stroke="#8884d8" name="API Latency (ms)" />
              <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ff8042" name="Error Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
        </View>
      </Card>

      {/* Traffic and Device Distribution */}
      <Flex gap="1.5rem" wrap={{ base: 'wrap', large: 'nowrap' }}>
        <Card flex="1" minWidth={{ base: '100%', large: '0' }}>
          <Heading level={4}>Traffic Sources</Heading>
          <Text>Where visitors are coming from</Text>
          <View height="300px" marginTop="1rem">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </View>
        </Card>

        <Card flex="1" minWidth={{ base: '100%', large: '0' }}>
          <Heading level={4}>Device Distribution</Heading>
          <Text>Types of devices used to access showcases</Text>
          <View height="300px" marginTop="1rem">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </View>
        </Card>
      </Flex>

      {/* Geographic Distribution */}
      <Card>
        <Heading level={4}>Geographic Distribution</Heading>
        <Text>Visitor locations by country</Text>
        <Table marginTop="1rem">
          <TableHead>
            <TableRow>
              <TableCell as="th">Country</TableCell>
              <TableCell as="th">Visitors</TableCell>
              <TableCell as="th">Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {geographicDistribution.map((item, index) => {
              const totalVisitors = geographicDistribution.reduce((sum, country) => sum + country.visitors, 0);
              const percentage = ((item.visitors / totalVisitors) * 100).toFixed(1);
              
              return (
                <TableRow key={index}>
                  <TableCell>{item.country}</TableCell>
                  <TableCell>{item.visitors.toLocaleString()}</TableCell>
                  <TableCell>{percentage}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Top Templates */}
      <Card>
        <Heading level={4}>Top Templates</Heading>
        <Text>Most popular showcase templates</Text>
        <Table marginTop="1rem">
          <TableHead>
            <TableRow>
              <TableCell as="th">Template Name</TableCell>
              <TableCell as="th">Usage Count</TableCell>
              <TableCell as="th">Average Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topTemplates.map((template, index) => (
              <TableRow key={index}>
                <TableCell>{template.name}</TableCell>
                <TableCell>{template.usage}</TableCell>
                <TableCell>
                  {template.rating} 
                  <Text as="span" color="orange" marginLeft="0.5rem">
                    {'★'.repeat(Math.round(template.rating))}
                  </Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Request Volume */}
      <Card>
        <Heading level={4}>System Usage</Heading>
        <Text>Daily request volume</Text>
        <View height="300px" marginTop="1rem">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={systemPerformance}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="requestVolume" fill="#82ca9d" name="Request Volume" />
            </BarChart>
          </ResponsiveContainer>
        </View>
      </Card>
    </Flex>
  );
};

export default SystemAnalytics; 