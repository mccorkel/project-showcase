'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SubmissionForm from '@/components/submissions/SubmissionForm';

const CreateSubmissionPage = () => {
  const router = useRouter();
  
  const handleSave = (id: string) => {
    // Navigate to the submissions list page
    router.push('/secure/submissions');
  };
  
  const handleCancel = () => {
    // Navigate back to the submissions list page
    router.push('/secure/submissions');
  };
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create New Submission</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create a new project submission. You can save it as a draft or submit it for grading.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
        <SubmissionForm 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </main>
  );
};

export default CreateSubmissionPage; 