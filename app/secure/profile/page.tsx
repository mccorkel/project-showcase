'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileEditor from '@/components/profile/ProfileEditor';
import SocialLinksEditor from '@/components/profile/SocialLinksEditor';
import EducationEditor from '@/components/profile/EducationEditor';
import SkillsEditor from '@/components/profile/SkillsEditor';

// Add server-side console log
console.log('📄 Profile page is being rendered');

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const { isLoading, studentProfile, user, userProfile } = useAuth();
  
  // Add debug logging
  useEffect(() => {
    console.log('📄 [ProfilePage] Rendering with state:', { 
      isLoading, 
      hasStudentProfile: !!studentProfile,
      hasUser: !!user,
      hasUserProfile: !!userProfile
    });
    
    if (studentProfile) {
      console.log('📄 [ProfilePage] Student profile data:', studentProfile);
    }
    
    if (isLoading) {
      console.log('📄 [ProfilePage] Page is in loading state');
    } else {
      console.log('📄 [ProfilePage] Page is no longer loading');
    }
  }, [isLoading, studentProfile, user, userProfile]);
  
  const tabs = [
    { id: 'basic', label: 'Basic Information', component: <ProfileEditor /> },
    { id: 'social', label: 'Social Links', component: <SocialLinksEditor /> },
    { id: 'education', label: 'Education', component: <EducationEditor /> },
    { id: 'skills', label: 'Skills', component: <SkillsEditor /> }
  ];
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Profile Management</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your profile information, which will be displayed in your public showcase.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-300">Loading profile data...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage; 