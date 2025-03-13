'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getStudentProfile } from '../graphql/operations/userProfile';

// Add server-side console log
console.log('Debug page is being rendered');

const client = generateClient();

export default function DebugPage() {
  const { isAuthenticated, isLoading, user, userProfile, studentProfile, refreshStudentProfile } = useAuth();
  const [manualUser, setManualUser] = useState<any>(null);
  const [manualProfile, setManualProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Add console log when component mounts
  useEffect(() => {
    console.log('Debug page mounted');
    console.log('Auth state:', { isAuthenticated, isLoading, hasUser: !!user, hasUserProfile: !!userProfile, hasStudentProfile: !!studentProfile });
  }, []);

  const addLog = (message: string) => {
    console.log(message); // Also log to console
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addLog(`Auth state: isAuthenticated=${isAuthenticated}, isLoading=${isLoading}`);
    addLog(`Has user: ${!!user}, Has userProfile: ${!!userProfile}, Has studentProfile: ${!!studentProfile}`);
    
    if (user) {
      addLog(`User: ${user.username}, ${user.userId}`);
    }
    
    if (studentProfile) {
      addLog(`Student profile: ${studentProfile.firstName} ${studentProfile.lastName}`);
    }
  }, [isAuthenticated, isLoading, user, userProfile, studentProfile]);

  const fetchCurrentUser = async () => {
    try {
      addLog('Manually fetching current user...');
      const currentUser = await getCurrentUser();
      setManualUser(currentUser);
      addLog(`Manual user fetch success: ${currentUser.username}`);
      
      // Log all properties
      addLog(`User properties: ${Object.keys(currentUser).join(', ')}`);
      
      // Try to access attributes
      const userAny = currentUser as any;
      if (userAny.attributes) {
        addLog(`User attributes: ${JSON.stringify(userAny.attributes)}`);
      }
      
      return currentUser;
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error fetching user';
      addLog(`Error fetching user: ${errorMessage}`);
      setError(errorMessage);
      return null;
    }
  };

  const fetchStudentProfile = async (userId: string) => {
    try {
      addLog(`Manually fetching student profile with ID: ${userId}`);
      const result = await client.graphql({
        query: getStudentProfile,
        variables: { userId },
      });
      
      if ('data' in result && result.data?.getStudentProfile) {
        addLog(`Manual profile fetch success: ${JSON.stringify(result.data.getStudentProfile)}`);
        setManualProfile(result.data.getStudentProfile);
      } else {
        addLog('No student profile found with this ID');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error fetching profile';
      addLog(`Error fetching profile: ${errorMessage}`);
      setError(errorMessage);
    }
  };

  const tryAllPossibleIds = async () => {
    const currentUser = await fetchCurrentUser();
    if (!currentUser) return;
    
    // Try with username
    addLog('Trying with username...');
    await fetchStudentProfile(currentUser.username);
    
    // Try with userId
    if (currentUser.userId) {
      addLog('Trying with userId...');
      await fetchStudentProfile(currentUser.userId);
    }
    
    // Try with loginId
    if (currentUser.signInDetails?.loginId) {
      addLog('Trying with loginId...');
      await fetchStudentProfile(currentUser.signInDetails.loginId);
    }
    
    // Try with email and sub if available
    const userAny = currentUser as any;
    if (userAny.attributes?.email) {
      addLog('Trying with email...');
      await fetchStudentProfile(userAny.attributes.email);
    }
    
    if (userAny.attributes?.sub) {
      addLog('Trying with sub (Cognito ID)...');
      await fetchStudentProfile(userAny.attributes.sub);
    }
  };

  const forceRefreshProfile = async () => {
    addLog('Forcing profile refresh from context...');
    try {
      await refreshStudentProfile();
      addLog('Profile refresh completed');
    } catch (err: any) {
      addLog(`Error refreshing profile: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Auth Context State</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Has User:</strong> {user ? 'Yes' : 'No'}</p>
            <p><strong>Has User Profile:</strong> {userProfile ? 'Yes' : 'No'}</p>
            <p><strong>Has Student Profile:</strong> {studentProfile ? 'Yes' : 'No'}</p>
          </div>
          
          {user && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">User Details</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto text-sm">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          {studentProfile && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Student Profile</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto text-sm">
                {JSON.stringify(studentProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manual Fetch Results</h2>
          
          <div className="space-y-4">
            <button 
              onClick={fetchCurrentUser}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fetch Current User
            </button>
            
            <button 
              onClick={tryAllPossibleIds}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-2"
            >
              Try All Possible IDs
            </button>
            
            <button 
              onClick={forceRefreshProfile}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ml-2"
            >
              Force Refresh Profile
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          
          {manualUser && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Manual User Fetch</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto text-sm">
                {JSON.stringify(manualUser, null, 2)}
              </pre>
            </div>
          )}
          
          {manualProfile && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Manual Profile Fetch</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto text-sm">
                {JSON.stringify(manualProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
        <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 