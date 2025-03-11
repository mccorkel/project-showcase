import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Student Project Showcase</h1>
      <p className="text-xl mb-8">Welcome to the Project Showcase platform</p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link 
          href="/secure/dashboard" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
} 