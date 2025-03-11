import React, { useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { trackShowcaseView, trackProjectView } from '../../graphql/operations/analytics';

const client = generateClient();

interface PublicViewTrackerProps {
  showcaseId: string;
  projectId?: string; // Optional - only needed when viewing a specific project
  username: string;
}

/**
 * PublicViewTracker - A component that tracks showcase and project views from public visitors
 * This component doesn't render anything visible, it just tracks analytics
 * It's specifically designed for use on public pages where the user might not be authenticated
 */
const PublicViewTracker: React.FC<PublicViewTrackerProps> = ({ 
  showcaseId, 
  projectId, 
  username 
}) => {
  useEffect(() => {
    // Track the view when the component mounts
    const trackView = async () => {
      try {
        // Get referrer information
        const referrer = document.referrer || 'direct';
        
        // Get device information
        const deviceType = getDeviceType();
        
        // Get location information (in a real app, this might come from a geolocation service)
        // For now, we'll just use browser language as a proxy for location
        const language = navigator.language || 'unknown';
        const location = {
          country: language.split('-')[1] || 'Unknown',
          region: 'Unknown',
          city: 'Unknown'
        };
        
        // Track showcase view
        await client.graphql({
          query: trackShowcaseView,
          variables: {
            input: {
              showcaseId,
              username,
              referrer,
              deviceType,
              location,
              isPublicView: true
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
                username,
                referrer,
                deviceType,
                location,
                isPublicView: true
              }
            }
          });
        }
      } catch (error) {
        // Silently fail - we don't want to disrupt the user experience
        // In a production app, we might log this to a monitoring service
        console.error('Error tracking public view:', error);
      }
    };
    
    trackView();
    
    // We only want to track the view once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcaseId, projectId, username]);
  
  // Helper function to determine device type
  const getDeviceType = (): string => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return /ipad/i.test(userAgent) ? 'tablet' : 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };
  
  // This component doesn't render anything visible
  return null;
};

export default PublicViewTracker; 