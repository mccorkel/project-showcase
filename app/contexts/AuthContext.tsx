import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getUserProfile, getStudentProfile } from '../graphql/operations/userProfile';

// Create a client for API calls
const client = generateClient();

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);

  // Function to sign out the user
  const signOutUser = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
      setUserProfile(null);
      setStudentProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Function to refresh the user profile
  const refreshUserProfile = async () => {
    if (!user?.userId) return;

    try {
      const userProfileData = await client.graphql({
        query: getUserProfile,
        variables: { userId: user.userId },
      });
      
      if ('data' in userProfileData) {
        setUserProfile(userProfileData.data.getUser);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Function to refresh the student profile
  const refreshStudentProfile = async () => {
    if (!user?.userId) return;

    try {
      const studentProfileData = await client.graphql({
        query: getStudentProfile,
        variables: { userId: user.userId },
      });
      
      if ('data' in studentProfileData) {
        setStudentProfile(studentProfileData.data.getStudentProfile);
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
    }
  };

  // Effect to check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);

        // Fetch user profile
        await refreshUserProfile();
        
        // Fetch student profile
        await refreshStudentProfile();
      } catch (error) {
        console.error('Not authenticated:', error);
        setIsAuthenticated(false);
        setUser(null);
        setUserProfile(null);
        setStudentProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext); 