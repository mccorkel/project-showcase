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
  Flex
} from '@aws-amplify/ui-react';

interface ReferrerData {
  source: string;
  count: number;
  percentage: number;
}

interface ReferrerAnalyticsProps {
  referrers: ReferrerData[];
  title?: string;
}

/**
 * ReferrerAnalytics - A component that displays referrer analytics
 * Shows where visitors are coming from and their percentage of total views
 */
const ReferrerAnalytics: React.FC<ReferrerAnalyticsProps> = ({ 
  referrers,
  title = "Traffic Sources"
}) => {
  // Sort referrers by count (highest first)
  const sortedReferrers = [...referrers].sort((a, b) => b.count - a.count);
  
  // Calculate total views
  const totalViews = referrers.reduce((sum, referrer) => sum + referrer.count, 0);
  
  // Determine if we have any data
  const hasData = referrers.length > 0 && totalViews > 0;
  
  // Helper function to format referrer sources for display
  const formatSource = (source: string): string => {
    if (source === 'direct') return 'Direct / Bookmark';
    if (source === 'unknown') return 'Unknown';
    
    try {
      // Try to extract domain from URL
      const url = new URL(source);
      return url.hostname.replace('www.', '');
    } catch {
      // If not a valid URL, just return the source
      return source;
    }
  };
  
  return (
    <Card>
      <Heading level={5}>{title}</Heading>
      
      {!hasData ? (
        <Text>No referrer data available yet.</Text>
      ) : (
        <>
          <Text>Total views from all sources: {totalViews}</Text>
          
          <View marginTop="1rem">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Source</TableCell>
                  <TableCell as="th">Views</TableCell>
                  <TableCell as="th">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedReferrers.map((referrer) => (
                  <TableRow key={referrer.source}>
                    <TableCell>{formatSource(referrer.source)}</TableCell>
                    <TableCell>{referrer.count}</TableCell>
                    <TableCell>
                      <Flex alignItems="center">
                        <Text>{referrer.percentage}%</Text>
                        <View 
                          backgroundColor="brand.secondary" 
                          width={`${referrer.percentage}%`}
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

export default ReferrerAnalytics; 