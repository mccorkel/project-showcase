'use client';

import React from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="error-page server-error-page">
      <div className="error-container">
        <h1 className="error-code">500</h1>
        <h2 className="error-title">Server Error</h2>
        <p className="error-message">
          Something went wrong on our server. Please try again later.
        </p>
        <div className="error-actions">
          <button onClick={reset} className="primary-button">
            Try Again
          </button>
          <Link href="/">
            <button className="secondary-button">Return to Home</button>
          </Link>
        </div>
        <div className="error-details">
          <p>Error details: {error.message}</p>
          {error.digest && <p>Error ID: {error.digest}</p>}
        </div>
      </div>
    </main>
  );
} 