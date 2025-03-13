'use client';

import React, { useState } from 'react';
import ProfileEditor from '@/components/profile/ProfileEditor';
import SocialLinksEditor from '@/components/profile/SocialLinksEditor';
import EducationEditor from '@/components/profile/EducationEditor';
import SkillsEditor from '@/components/profile/SkillsEditor';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('basic');
  
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
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
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
    </main>
  );
};

export default ProfilePage; 