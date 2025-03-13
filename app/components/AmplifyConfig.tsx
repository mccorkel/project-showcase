'use client';

import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

export default function AmplifyConfig({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Configure Amplify only on the client side
    try {
      Amplify.configure(outputs);
      console.log('Amplify configured successfully');
    } catch (error) {
      console.error('Error configuring Amplify:', error);
    } finally {
      setIsConfigured(true);
    }
  }, []);

  // Don't render children until Amplify is configured
  if (!isConfigured) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 