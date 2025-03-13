'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getUserProfile, getStudentProfile } from '../graphql/operations/userProfile';

// Create a client for API calls
const client = generateClient();

// Enable verbose debugging
const DEBUG = true;

// Debug logger function - use direct console.log for better visibility in terminal
const debug = (...args: any[]) => {
  if (DEBUG) {
    console.log('🔍 [AuthContext]', ...args);
  }
};

// Define the types for our context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  userProfile: any | null;
  studentProfile: any | null;
  signOutUser: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshStudentProfile: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  userProfile: null,
  studentProfile: null,
  signOutUser: async () => {},
  refreshUserProfile: async () => {},
  refreshStudentProfile: async () => {},
});

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🔄 AuthProvider rendering');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);

  // Function to sign out the user
  const signOutUser = async () => {
    try {
      console.log('🚪 Signing out user');
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
      setUserProfile(null);
      setStudentProfile(null);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  // Function to refresh the user profile
  const refreshUserProfile = async () => {
    if (!user?.userId) {
      console.log('⚠️ No userId available, skipping user profile fetch');
      return;
    }

    try {
      console.log('🔄 Fetching user profile with userId:', user.userId);
      const userProfileData = await client.graphql({
        query: getUserProfile,
        variables: { userId: user.userId },
      });
      
      console.log('📊 User profile GraphQL result:', JSON.stringify(userProfileData, null, 2));
      
      if ('data' in userProfileData && userProfileData.data?.getUser) {
        console.log('✅ User profile found:', userProfileData.data.getUser);
        setUserProfile(userProfileData.data.getUser);
      } else {
        console.log('⚠️ No user profile found for userId:', user.userId);
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
    }
  };

  // Function to refresh the student profile
  const refreshStudentProfile = async () => {
    console.log('🔄 refreshStudentProfile called, isLoading:', isLoading);
    if (!user) {
      console.log('⚠️ No user available, skipping student profile fetch');
      setIsLoading(false);
      return;
    }

    try {
      // Try multiple approaches to find the student profile
      console.log('🔍 Fetching student profile for user:', JSON.stringify(user, null, 2));
      
      // Collect all possible IDs to try
      const possibleIds = [];
      
      // Add username
      if (user.username) {
        possibleIds.push({ id: user.username, type: 'username' });
      }
      
      // Add userId
      if (user.userId) {
        possibleIds.push({ id: user.userId, type: 'userId' });
      }
      
      // Add loginId
      if (user.signInDetails?.loginId) {
        possibleIds.push({ id: user.signInDetails.loginId, type: 'loginId' });
      }
      
      // Add email if available - using any type to access potential attributes
      const userAny = user as any;
      if (userAny.attributes?.email) {
        possibleIds.push({ id: userAny.attributes.email, type: 'email' });
      }
      
      // Add sub (Cognito ID) if available
      if (userAny.attributes?.sub) {
        possibleIds.push({ id: userAny.attributes.sub, type: 'sub' });
      }
      
      // Add cognitoId if available in userProfile
      if (userProfile?.cognitoId) {
        possibleIds.push({ id: userProfile.cognitoId, type: 'cognitoId' });
      }
      
      console.log('🧪 Will try these IDs to find student profile:', possibleIds);
      
      let studentProfileData = null;
      let foundProfile = false;
      
      // Try each ID in sequence
      for (const { id, type } of possibleIds) {
        if (foundProfile) break;
        
        console.log(`🔍 Trying with ${type}:`, id);
        try {
          const result = await client.graphql({
            query: getStudentProfile,
            variables: { userId: id },
          });
          
          console.log(`📊 GraphQL result for ${type}:`, JSON.stringify(result, null, 2));
          
          if ('data' in result && result.data?.getStudentProfile) {
            console.log(`✅ Found profile with ${type}:`, result.data.getStudentProfile);
            studentProfileData = result;
            foundProfile = true;
            break;
          } else {
            console.log(`⚠️ No profile found with ${type}:`, id);
          }
        } catch (error) {
          console.log(`❌ Error fetching with ${type}:`, error);
          // Continue to the next ID
        }
      }
      
      if (foundProfile && studentProfileData && 'data' in studentProfileData) {
        console.log('✅ Setting student profile:', studentProfileData.data.getStudentProfile);
        setStudentProfile(studentProfileData.data.getStudentProfile);
        console.log('🔄 Setting isLoading to false after finding profile');
        setIsLoading(false);
      } else {
        console.log('⚠️ No student profile found after trying all options');
        console.log('⚠️ No student profile found for user:', user);
        
        // Set loading to false even if no profile is found
        console.log('🔄 Setting isLoading to false because no profile was found');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Error fetching student profile:', error);
      // Set loading to false on error
      console.log('🔄 Setting isLoading to false due to error');
      setIsLoading(false);
    }
  };

  // Effect to check if the user is authenticated on mount
  useEffect(() => {
    console.log('🔄 AuthProvider useEffect running');
    const checkAuth = async () => {
      console.log('🔄 checkAuth started, setting isLoading to true');
      try {
        setIsLoading(true);
        console.log('🔄 Calling getCurrentUser');
        const currentUser = await getCurrentUser();
        console.log('👤 Current user from getCurrentUser:', JSON.stringify(currentUser, null, 2));
        console.log('📋 User properties:', Object.keys(currentUser));
        console.log('👤 User username:', currentUser.username);
        console.log('🆔 User userId:', currentUser.userId);
        
        // Log all user attributes if available - using any type to access potential attributes
        const currentUserAny = currentUser as any;
        if (currentUserAny.attributes) {
          console.log('📝 User attributes:', currentUserAny.attributes);
        }
        
        // Access attributes safely
        if (currentUser.signInDetails?.loginId) {
          console.log('🔑 User login ID:', currentUser.signInDetails.loginId);
        }
        
        console.log('🔄 Setting user and isAuthenticated');
        setUser(currentUser);
        setIsAuthenticated(true);

        // Fetch user profile
        console.log('🔄 Calling refreshUserProfile');
        await refreshUserProfile();
        
        // Fetch student profile
        console.log('🔄 Calling refreshStudentProfile');
        await refreshStudentProfile();
        
        console.log('✅ checkAuth completed successfully');
      } catch (error) {
        console.error('❌ Not authenticated:', error);
        console.log('🔄 Setting isAuthenticated to false due to error');
        setIsAuthenticated(false);
        setUser(null);
        setUserProfile(null);
        setStudentProfile(null);
        console.log('🔄 Setting isLoading to false due to authentication error');
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Add a safety timeout to ensure isLoading is set to false after 5 seconds
    // Reduced from 10 seconds to 5 seconds to prevent long loading states
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('⚠️ SAFETY TIMEOUT: Setting isLoading to false after timeout');
        setIsLoading(false);
      }
    }, 5000);
    
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Debug current state
  useEffect(() => {
    console.log('🔄 State updated - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    
    // Force isLoading to false if authenticated but still loading after a delay
    // This ensures the profile page doesn't get stuck in a loading state
    if (isAuthenticated && isLoading) {
      const forceLoadingTimeout = setTimeout(() => {
        if (isLoading) {
          console.log('⚠️ FORCE LOADING OFF: User is authenticated but still loading');
          setIsLoading(false);
        }
      }, 3000);
      
      return () => {
        clearTimeout(forceLoadingTimeout);
      };
    }
  }, [isAuthenticated, isLoading]);

  // Create the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    userProfile,
    studentProfile,
    signOutUser,
    refreshUserProfile,
    refreshStudentProfile,
  };

  console.log('🔄 Rendering AuthProvider with context:', { 
    isAuthenticated, 
    isLoading, 
    hasUser: !!user, 
    hasUserProfile: !!userProfile, 
    hasStudentProfile: !!studentProfile 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext); 