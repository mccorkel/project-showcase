import React, { useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { trackShowcaseView, trackProjectView } from '../../graphql/operations/analytics';

const client = generateClient();

interface ViewTrackerProps {
  showcaseId: string;
  projectId?: string; // Optional - only needed when viewing a specific project
  referrer?: string;
}

/**
 * ViewTracker - A component that tracks showcase and project views
 * This component doesn't render anything visible, it just tracks analytics
 */
const ViewTracker: React.FC<ViewTrackerProps> = ({ 
  showcaseId, 
  projectId, 
  referrer 
}) => {
  useEffect(() => {
    // Track the view when the component mounts
    const trackView = async () => {
      try {
        // Get referrer information
        const viewReferrer = referrer || document.referrer || 'direct';
        
        // Get device information
        const deviceType = getDeviceType();
        
        // Get location information (in a real app, this might come from a geolocation service)
        // For now, we'll just use a placeholder
        const location = {
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown'
        };
        
        // Track showcase view
        await client.graphql({
          query: trackShowcaseView,
          variables: {
            input: {
              showcaseId,
              referrer: viewReferrer,
              deviceType,
              location
            }
          }
        });
        
        // If a projectId is provided, also track the project view
        if (projectId) {
          await client.graphql({
            query: trackProjectView,
            variables: {
              input: {
                showcaseId,
                projectId,
                referrer: viewReferrer,
                deviceType,
                location
              }
            }
          });
        }
      } catch (error) {
        // Silently fail - we don't want to disrupt the user experience
        // In a production app, we might log this to a monitoring service
        console.error('Error tracking view:', error);
      }
    };
    
    trackView();
    
    // We only want to track the view once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcaseId, projectId]);
  
  // Helper function to determine device type
  const getDeviceType = (): string => {
    const userAgent = navigator.userAgent;
    
    if (/mobile/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet/i.test(userAgent) || /ipad/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };
  
  // This component doesn't render anything visible
  return null;
};

export default ViewTracker; 