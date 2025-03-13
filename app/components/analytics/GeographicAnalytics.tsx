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

interface LocationData {
  country: string;
  region?: string;
  city?: string;
  count: number;
  percentage: number;
}

interface GeographicAnalyticsProps {
  locations: LocationData[];
  title?: string;
  showDetails?: boolean; // Whether to show region/city details
}

/**
 * GeographicAnalytics - A component that displays geographic location analytics
 * Shows where visitors are coming from geographically and their percentage of total views
 */
const GeographicAnalytics: React.FC<GeographicAnalyticsProps> = ({ 
  locations,
  title = "Visitor Locations",
  showDetails = false
}) => {
  // Sort locations by count (highest first)
  const sortedLocations = [...locations].sort((a, b) => b.count - a.count);
  
  // Calculate total views
  const totalViews = locations.reduce((sum, location) => sum + location.count, 0);
  
  // Determine if we have any data
  const hasData = locations.length > 0 && totalViews > 0;
  
  // Helper function to format country codes to country names
  const getCountryName = (countryCode: string): string => {
    // This is a simplified version - in a real app, you'd use a more complete mapping
    const countryMap: Record<string, string> = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'JP': 'Japan',
      'CN': 'China',
      'IN': 'India',
      'BR': 'Brazil',
      'Unknown': 'Unknown'
    };
    
    return countryMap[countryCode] || countryCode;
  };
  
  return (
    <Card>
      <Heading level={5}>{title}</Heading>
      
      {!hasData ? (
        <Text>No location data available yet.</Text>
      ) : (
        <>
          <Text>Total views from all locations: {totalViews}</Text>
          
          <View marginTop="1rem">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Location</TableCell>
                  {showDetails && (
                    <>
                      <TableCell as="th">Region</TableCell>
                      <TableCell as="th">City</TableCell>
                    </>
                  )}
                  <TableCell as="th">Views</TableCell>
                  <TableCell as="th">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedLocations.map((location) => (
                  <TableRow key={`${location.country}-${location.region || ''}-${location.city || ''}`}>
                    <TableCell>{getCountryName(location.country)}</TableCell>
                    {showDetails && (
                      <>
                        <TableCell>{location.region || 'Unknown'}</TableCell>
                        <TableCell>{location.city || 'Unknown'}</TableCell>
                      </>
                    )}
                    <TableCell>{location.count}</TableCell>
                    <TableCell>
                      <Flex alignItems="center">
                        <Text>{location.percentage}%</Text>
                        <View 
                          backgroundColor="brand.tertiary" 
                          width={`${location.percentage}%`}
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

export default GeographicAnalytics; 