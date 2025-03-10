'use client';

import React from 'react';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <main className="error-page forbidden-page">
      <div className="error-container">
        <h1 className="error-code">403</h1>
        <h2 className="error-title">Access Forbidden</h2>
        <p className="error-message">
          You don't have permission to access this page.
        </p>
        <div className="error-actions">
          <Link href="/">
            <button className="primary-button">Return to Home</button>
          </Link>
          <Link href="/login">
            <button className="secondary-button">Login with Different Account</button>
          </Link>
        </div>
      </div>
    </main>
  );
} 