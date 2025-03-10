'use client';

import React from 'react';
import Link from 'next/link';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

// Configure Amplify in login page
Amplify.configure(outputs);

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="auth-container">
        <h1>Login to Student Project Showcase</h1>
        <Authenticator 
          hideSignUp={true}
          variation="modal"
          loginMechanisms={['email']}
        >
          {({ signOut, user }) => (
            <div className="auth-success">
              <h2>Welcome, {user?.username}!</h2>
              <p>You are now signed in.</p>
              <div className="auth-buttons">
                <Link href="/secure/dashboard">
                  <button className="primary-button">Go to Dashboard</button>
                </Link>
                <button onClick={signOut} className="secondary-button">Sign Out</button>
              </div>
            </div>
          )}
        </Authenticator>
      </div>
    </main>
  );
} 