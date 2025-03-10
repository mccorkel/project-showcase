import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="error-page not-found-page">
      <div className="error-container">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <button className="primary-button">Return to Home</button>
        </Link>
      </div>
    </main>
  );
} 