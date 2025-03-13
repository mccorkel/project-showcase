'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShowcasePreviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewExpiry, setPreviewExpiry] = useState<Date | null>(null);
  
  useEffect(() => {
    // Simulate loading preview data
    const loadPreview = async () => {
      // In a real implementation, this would generate a preview and get the URL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set a mock preview URL and expiry time (24 hours from now)
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);
      
      setPreviewUrl('/preview-placeholder');
      setPreviewExpiry(expiryDate);
      setIsLoading(false);
    };
    
    loadPreview();
  }, []);
  
  const formatExpiryTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const handlePublish = () => {
    // In a real implementation, this would publish the showcase
    alert('Showcase published successfully!');
  };
  
  const handleRegeneratePreview = () => {
    setIsLoading(true);
    // Simulate regenerating the preview
    setTimeout(() => {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);
      
      setPreviewExpiry(expiryDate);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">Showcase Preview</h1>
        <div className="flex flex-wrap gap-3">
          <button 
            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            onClick={handlePublish}
          >
            Publish Showcase
          </button>
          <Link href="/secure/showcase">
            <button className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md transition-colors">
              Edit Showcase
            </button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">Generating preview...</p>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
            This may take a few moments as we prepare your showcase preview.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Preview expires:</h2>
                <div className="flex items-center">
                  <span className="text-gray-800 dark:text-white font-medium mr-3">
                    {previewExpiry ? formatExpiryTime(previewExpiry) : 'N/A'}
                  </span>
                  <button 
                    className="text-sm py-1 px-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded transition-colors"
                    onClick={handleRegeneratePreview}
                  >
                    Regenerate Preview
                  </button>
                </div>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Preview URL:</h2>
                <div className="flex items-center">
                  <span className="text-gray-800 dark:text-white font-medium mr-3 truncate">
                    {previewUrl}
                  </span>
                  <button 
                    className="text-sm py-1 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                    onClick={() => navigator.clipboard.writeText(previewUrl)}
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <div className="flex space-x-2">
                <button className="py-1 px-3 bg-blue-600 text-white text-sm rounded">Desktop</button>
                <button className="py-1 px-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded">Tablet</button>
                <button className="py-1 px-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded">Mobile</button>
              </div>
              <button className="py-1 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded transition-colors">
                Refresh
              </button>
            </div>
            
            <div className="p-6 min-h-[500px] bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">Showcase Preview</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                  This is a placeholder for your showcase preview.
                </p>
                
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">John Doe</h3>
                      <p className="text-gray-600 dark:text-gray-300">Full Stack Developer</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">About Me</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      A passionate developer with experience in web and mobile applications.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Projects</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 dark:text-white mb-1">JavaScript Game</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">An interactive browser game built with vanilla JavaScript.</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 dark:text-white mb-1">HTML/CSS Portfolio</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">A responsive portfolio website built with HTML and CSS.</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 dark:text-white mb-1">React Application</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">A full-featured React application with state management.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">JavaScript</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">React</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">Node.js</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">HTML/CSS</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">AWS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between gap-3">
            <Link href="/secure/dashboard">
              <button className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md transition-colors">
                Back to Dashboard
              </button>
            </Link>
            
            <div className="flex gap-3">
              <Link href="/secure/showcase">
                <button className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md transition-colors">
                  Edit Showcase
                </button>
              </Link>
              <button 
                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                onClick={handlePublish}
              >
                Publish Showcase
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
} 