'use client';

import React from 'react';
import SubmissionsList from '@/components/submissions/SubmissionsList';

const SubmissionsPage = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Submissions</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your project submissions. You can create new submissions, edit existing ones, and track their status.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <SubmissionsList />
      </div>
    </main>
  );
};

export default SubmissionsPage; 