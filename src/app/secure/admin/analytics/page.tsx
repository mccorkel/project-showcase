import React from 'react';
import { Card, Heading, Text, Flex, Divider, Button, SelectField, Badge } from '@aws-amplify/ui-react';

const SystemAnalyticsPage = () => {
  return (
    <Flex direction="column" gap="1rem">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={2}>System Analytics</Heading>
        <Flex gap="1rem">
          <SelectField label="Time Period" labelHidden>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
            <option value="custom">Custom Range</option>
          </SelectField>
          <Button variation="primary">Export Report</Button>
        </Flex>
      </Flex>
      
      <Text>View analytics data for the entire Student Project Showcase system.</Text>
      
      <Flex direction={{ base: 'column', large: 'row' }} gap="1rem">
        <Card width={{ base: '100%', large: '25%' }}>
          <Heading level={5}>Total Users</Heading>
          <Heading level={2}>1,245</Heading>
          <Text color="green.60">+12% from previous period</Text>
          <Divider marginBlock="1rem" />
          <Flex justifyContent="space-between">
            <Text>Students</Text>
            <Badge variation="success">1,120</Badge>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Instructors</Text>
            <Badge variation="info">115</Badge>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Administrators</Text>
            <Badge variation="warning">10</Badge>
          </Flex>
        </Card>
        
        <Card width={{ base: '100%', large: '25%' }}>
          <Heading level={5}>Active Showcases</Heading>
          <Heading level={2}>876</Heading>
          <Text color="green.60">+8% from previous period</Text>
          <Divider marginBlock="1rem" />
          <Flex justifyContent="space-between">
            <Text>Published</Text>
            <Badge variation="success">654</Badge>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Draft</Text>
            <Badge variation="warning">222</Badge>
          </Flex>
        </Card>
        
        <Card width={{ base: '100%', large: '25%' }}>
          <Heading level={5}>Total Submissions</Heading>
          <Heading level={2}>3,782</Heading>
          <Text color="green.60">+15% from previous period</Text>
          <Divider marginBlock="1rem" />
          <Flex justifyContent="space-between">
            <Text>Graded</Text>
            <Badge variation="success">3,245</Badge>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Pending</Text>
            <Badge variation="warning">537</Badge>
          </Flex>
        </Card>
        
        <Card width={{ base: '100%', large: '25%' }}>
          <Heading level={5}>Showcase Views</Heading>
          <Heading level={2}>15,432</Heading>
          <Text color="green.60">+23% from previous period</Text>
          <Divider marginBlock="1rem" />
          <Flex justifyContent="space-between">
            <Text>Unique Visitors</Text>
            <Badge variation="info">8,765</Badge>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Avg. Time on Page</Text>
            <Badge variation="info">2m 45s</Badge>
          </Flex>
        </Card>
      </Flex>
      
      <Card>
        <Heading level={3}>User Engagement Metrics</Heading>
        <Divider />
        <Flex direction="column" padding="1rem">
          <Text>User engagement chart would be displayed here, showing daily active users, session duration, and interaction rates over time.</Text>
          <Flex height="300px" alignItems="center" justifyContent="center" backgroundColor="background.secondary" marginBlock="1rem">
            [User Engagement Chart Placeholder]
          </Flex>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Submission Statistics</Heading>
        <Divider />
        <Flex direction="column" padding="1rem">
          <Text>Submission statistics chart would be displayed here, showing submission counts by week, pass/fail rates, and average grades.</Text>
          <Flex height="300px" alignItems="center" justifyContent="center" backgroundColor="background.secondary" marginBlock="1rem">
            [Submission Statistics Chart Placeholder]
          </Flex>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Showcase Publication Metrics</Heading>
        <Divider />
        <Flex direction="column" padding="1rem">
          <Text>Showcase publication metrics would be displayed here, showing publication rates, template usage, and customization preferences.</Text>
          <Flex height="300px" alignItems="center" justifyContent="center" backgroundColor="background.secondary" marginBlock="1rem">
            [Showcase Publication Chart Placeholder]
          </Flex>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>System Performance Metrics</Heading>
        <Divider />
        <Flex direction="column" padding="1rem">
          <Text>System performance metrics would be displayed here, showing API response times, error rates, and resource utilization.</Text>
          <Flex height="300px" alignItems="center" justifyContent="center" backgroundColor="background.secondary" marginBlock="1rem">
            [System Performance Chart Placeholder]
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default SystemAnalyticsPage; 