'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
// Import AWS Amplify UI styles
import '@aws-amplify/ui-react/styles.css';

export default function LoginPage() {
  // Use state to track if the component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  // Configure Amplify only on the client side
  useEffect(() => {
    // Configure Amplify in login page
    Amplify.configure(outputs);
    setIsMounted(true);
  }, []);

  // Don't render anything until the component is mounted on the client
  if (!isMounted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Login to Student Project Showcase</h1>
        <Authenticator 
          hideSignUp={true}
          variation="modal"
          loginMechanisms={['email']}
        >
          {({ signOut, user }) => (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome, {user?.username}!</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">You are now signed in.</p>
              <div className="flex flex-col space-y-2">
                <Link href="/secure/dashboard">
                  <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Go to Dashboard</button>
                </Link>
                <button onClick={signOut} className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium rounded-md transition-colors">Sign Out</button>
              </div>
            </div>
          )}
        </Authenticator>
      </div>
    </main>
  );
} 