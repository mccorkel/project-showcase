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
  Flex,
  Icon
} from '@aws-amplify/ui-react';

interface DeviceData {
  type: string;
  count: number;
  percentage: number;
}

interface DeviceAnalyticsProps {
  devices: DeviceData[];
  title?: string;
}

/**
 * DeviceAnalytics - A component that displays device type analytics
 * Shows what types of devices visitors are using to view the showcase
 */
const DeviceAnalytics: React.FC<DeviceAnalyticsProps> = ({ 
  devices,
  title = "Device Types"
}) => {
  // Sort devices by count (highest first)
  const sortedDevices = [...devices].sort((a, b) => b.count - a.count);
  
  // Calculate total views
  const totalViews = devices.reduce((sum, device) => sum + device.count, 0);
  
  // Determine if we have any data
  const hasData = devices.length > 0 && totalViews > 0;
  
  // Helper function to get icon for device type
  const getDeviceIcon = (deviceType: string): string => {
    switch (deviceType.toLowerCase()) {
      case 'desktop':
        return '💻';
      case 'mobile':
        return '📱';
      case 'tablet':
        return '📱';
      default:
        return '🖥️';
    }
  };
  
  // Helper function to get color for device type
  const getDeviceColor = (deviceType: string): string => {
    switch (deviceType.toLowerCase()) {
      case 'desktop':
        return '#4285F4'; // Blue
      case 'mobile':
        return '#EA4335'; // Red
      case 'tablet':
        return '#FBBC05'; // Yellow
      default:
        return '#34A853'; // Green
    }
  };
  
  return (
    <Card>
      <Heading level={5}>{title}</Heading>
      
      {!hasData ? (
        <Text>No device data available yet.</Text>
      ) : (
        <>
          <Text>Total views from all devices: {totalViews}</Text>
          
          <View marginTop="1rem">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Device Type</TableCell>
                  <TableCell as="th">Views</TableCell>
                  <TableCell as="th">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedDevices.map((device) => (
                  <TableRow key={device.type}>
                    <TableCell>
                      <Flex alignItems="center">
                        <Text marginRight="0.5rem">{getDeviceIcon(device.type)}</Text>
                        <Text>{device.type.charAt(0).toUpperCase() + device.type.slice(1)}</Text>
                      </Flex>
                    </TableCell>
                    <TableCell>{device.count}</TableCell>
                    <TableCell>
                      <Flex alignItems="center">
                        <Text>{device.percentage}%</Text>
                        <View 
                          backgroundColor={getDeviceColor(device.type)}
                          width={`${device.percentage}%`}
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
          
          {/* Simple pie chart visualization */}
          <Flex justifyContent="center" marginTop="2rem">
            <View 
              width="200px" 
              height="200px" 
              borderRadius="50%" 
              position="relative"
              overflow="hidden"
            >
              {sortedDevices.map((device, index) => {
                // Calculate the starting angle for this segment
                const previousPercentages = sortedDevices
                  .slice(0, index)
                  .reduce((sum, d) => sum + d.percentage, 0);
                
                const startAngle = (previousPercentages / 100) * 360;
                const endAngle = ((previousPercentages + device.percentage) / 100) * 360;
                
                return (
                  <View
                    key={device.type}
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    style={{
                      background: `conic-gradient(${getDeviceColor(device.type)} ${startAngle}deg, ${getDeviceColor(device.type)} ${endAngle}deg, transparent ${endAngle}deg)`,
                    }}
                  />
                );
              })}
            </View>
          </Flex>
          
          {/* Legend */}
          <Flex justifyContent="center" marginTop="1rem" gap="1rem" wrap="wrap">
            {sortedDevices.map((device) => (
              <Flex key={device.type} alignItems="center" gap="0.5rem">
                <View 
                  width="12px" 
                  height="12px" 
                  backgroundColor={getDeviceColor(device.type)}
                  borderRadius="2px"
                />
                <Text>{device.type.charAt(0).toUpperCase() + device.type.slice(1)} ({device.percentage}%)</Text>
              </Flex>
            ))}
          </Flex>
        </>
      )}
    </Card>
  );
};

export default DeviceAnalytics; 