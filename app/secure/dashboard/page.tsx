'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { signOutUser } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Profile Completion</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">75% Complete</p>
          <Link href="/secure/profile">
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Complete Profile</button>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Submissions</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-800 dark:text-white">3</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Graded</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-yellow-600 dark:text-yellow-400">1</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
            </div>
          </div>
          <Link href="/secure/submissions">
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">View Submissions</button>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Showcase</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Your showcase is <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium rounded-full">Not Published</span></p>
          <Link href="/secure/showcase">
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Manage Showcase</button>
          </Link>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Recent Activity</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-shrink-0 mr-4 text-2xl">📝</div>
            <div className="flex-grow">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Submission Graded</h4>
              <p className="text-gray-600 dark:text-gray-300">Your Week 3 submission has been graded.</p>
              <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
            </div>
          </div>
          <div className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-shrink-0 mr-4 text-2xl">🚀</div>
            <div className="flex-grow">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">New Submission</h4>
              <p className="text-gray-600 dark:text-gray-300">You submitted your Week 4 project.</p>
              <span className="text-sm text-gray-500 dark:text-gray-400">5 days ago</span>
            </div>
          </div>
          <div className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-shrink-0 mr-4 text-2xl">👤</div>
            <div className="flex-grow">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Profile Updated</h4>
              <p className="text-gray-600 dark:text-gray-300">You updated your profile information.</p>
              <span className="text-sm text-gray-500 dark:text-gray-400">1 week ago</span>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/secure/submissions/new" className="block">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Create New Submission</button>
          </Link>
          <Link href="/secure/showcase/preview" className="block">
            <button className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md transition-colors">Preview Showcase</button>
          </Link>
          <Link href="/secure/profile" className="block">
            <button className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md transition-colors">Edit Profile</button>
          </Link>
        </div>
      </section>
    </main>
  );
} 