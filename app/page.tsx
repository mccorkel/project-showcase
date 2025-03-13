import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-2">
                Tiger Showcase Helper
              </h1>
              <h2 className="text-2xl md:text-3xl opacity-75 mb-8">
                Student Project Showcase Platform
              </h2>
              <p className="text-lg md:text-xl leading-relaxed mb-8">
                A powerful platform for students to showcase their projects, skills, and achievements to potential employers and the world.
              </p>
              <Link 
                href="/login" 
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-16">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-bold">Key Features</h2>
              <p className="text-lg leading-relaxed m-4">
                Everything you need to showcase your projects and skills
              </p>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-4/12 px-4 text-center mb-10">
              <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Customizable Templates</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose from various professional templates to personalize your showcase
                </p>
              </div>
            </div>
            <div className="w-full md:w-4/12 px-4 text-center mb-10">
              <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy Controls</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Control who sees your showcase with granular privacy settings
                </p>
              </div>
            </div>
            <div className="w-full md:w-4/12 px-4 text-center mb-10">
              <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Project Gallery</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Display your projects with descriptions, images, and links
                </p>
              </div>
            </div>
            <div className="w-full md:w-4/12 px-4 text-center mb-10">
              <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track who views your showcase and measure engagement
                </p>
              </div>
            </div>
            <div className="w-full md:w-4/12 px-4 text-center mb-10">
              <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your showcase looks great on all devices, from mobile to desktop
                </p>
              </div>
            </div>
            <div className="w-full md:w-4/12 px-4 text-center mb-10">
              <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">LMS Integration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automatically import your projects from the Learning Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to showcase your work?
              </h2>
              <p className="text-xl leading-relaxed text-blue-100 mb-8">
                Join now and create your professional portfolio in minutes.
              </p>
              <Link 
                href="/login" 
                className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 py-1">
                © {new Date().getFullYear()} Tiger Showcase Helper. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 