'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmissions } from '../../graphql/operations/submissions';

const client = generateClient();

// Template data - we'll keep this for now as templates might not be in the database yet
const templates = [
  {
    id: '1',
    name: 'Modern Portfolio',
    description: 'A clean, modern design with emphasis on projects and skills.',
    thumbnailUrl: '/templates/modern-thumbnail.jpg',
    isActive: true
  },
  {
    id: '2',
    name: 'Creative Developer',
    description: 'A vibrant, creative design that showcases your personality.',
    thumbnailUrl: '/templates/creative-thumbnail.jpg',
    isActive: true
  },
  {
    id: '3',
    name: 'Minimal Resume',
    description: 'A minimalist design focused on professional experience.',
    thumbnailUrl: '/templates/minimal-thumbnail.jpg',
    isActive: true
  }
];

export default function ShowcaseManagementPage() {
  const { studentProfile } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [projects, setProjects] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customization, setCustomization] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    fontFamily: 'modern',
    layoutPreference: 'grid'
  });
  
  // Fetch submissions when the component mounts
  useEffect(() => {
    fetchSubmissions();
  }, [studentProfile]);
  
  // Fetch submissions from the API
  const fetchSubmissions = async () => {
    if (!studentProfile?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await client.graphql({
        query: getSubmissions,
        variables: {
          studentProfileId: studentProfile.id,
          limit: 100
        }
      });
      
      if ('data' in result && result.data.listSubmissions) {
        // Transform submissions into project format
        const submissionProjects = result.data.listSubmissions.items.map((submission: any, index: number) => ({
          id: submission.id,
          name: submission.title || `Project ${index + 1}`,
          description: submission.description || 'No description provided.',
          technologies: submission.technologies || [],
          thumbnailUrl: submission.featuredImageUrl || '/projects/default-thumbnail.jpg',
          isSelected: submission.showcaseIncluded || false,
          priority: submission.showcasePriority || index + 1,
          demoLink: submission.demoLink,
          repoLink: submission.repoLink,
          deployedUrl: submission.deployedUrl
        }));
        
        setProjects(submissionProjects);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  
  const handleToggleProject = (projectId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, isSelected: !project.isSelected }
        : project
    ));
  };
  
  const handlePriorityChange = (projectId: string, priority: number) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, priority }
        : project
    ));
  };
  
  const handleCustomizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomization({
      ...customization,
      [name]: value
    });
  };
  
  const handlePublish = async () => {
    if (!studentProfile?.id) {
      alert('You must be logged in to publish your showcase.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update each selected project with showcase information
      const updatePromises = projects.map(project => 
        client.graphql({
          query: `
            mutation UpdateSubmission($id: ID!, $showcaseIncluded: Boolean, $showcasePriority: Int) {
              updateSubmission(input: { 
                id: $id, 
                showcaseIncluded: $showcaseIncluded, 
                showcasePriority: $showcasePriority 
              }) {
                id
              }
            }
          `,
          variables: {
            id: project.id,
            showcaseIncluded: project.isSelected,
            showcasePriority: project.priority
          }
        })
      );
      
      await Promise.all(updatePromises);
      
      alert('Showcase published successfully!');
    } catch (error) {
      console.error('Error publishing showcase:', error);
      alert('Error publishing showcase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Showcase Management</h1>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {isPublic ? 'Public' : 'Private'}
              </span>
            </label>
          </div>
          <button 
            onClick={handlePublish}
            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Publish Changes'}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Template Selection */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Choose a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map(template => (
                <div 
                  key={template.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-blue-600 ring-2 ring-blue-600 dark:ring-blue-500' 
                      : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <div className="text-gray-400 dark:text-gray-500">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{template.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Project Selection */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select Projects</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Choose the projects you want to display in your showcase and arrange them in order of priority.
            </p>
            
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300 mb-4">You don't have any submissions yet.</p>
                <Link href="/secure/submissions/new" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                  Create Your First Submission
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects
                  .sort((a, b) => a.priority - b.priority)
                  .map(project => (
                    <div 
                      key={project.id} 
                      className={`border rounded-lg overflow-hidden transition-all ${
                        project.isSelected 
                          ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:w-16 flex items-center justify-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={project.isSelected}
                              onChange={() => handleToggleProject(project.id)}
                            />
                            <div className="w-6 h-6 bg-gray-200 rounded-sm peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-0 peer-checked:after:translate-y-0 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                          </label>
                        </div>
                        
                        <div className="md:w-32 h-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {project.thumbnailUrl ? (
                            <img 
                              src={project.thumbnailUrl} 
                              alt={project.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 dark:text-gray-500">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 flex-grow">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{project.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies && project.technologies.map((tech: string) => (
                              <span 
                                key={tech} 
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-4 md:w-32 flex items-center">
                          <div>
                            <label htmlFor={`priority-${project.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Priority:
                            </label>
                            <select 
                              id={`priority-${project.id}`}
                              value={project.priority}
                              onChange={(e) => handlePriorityChange(project.id, parseInt(e.target.value))}
                              disabled={!project.isSelected}
                              className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                            >
                              {Array.from({ length: projects.length }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
          
          {/* Customization */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Customize Your Showcase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Primary Color
                </label>
                <input
                  type="color"
                  id="primaryColor"
                  name="primaryColor"
                  value={customization.primaryColor}
                  onChange={handleCustomizationChange}
                  className="h-10 w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Secondary Color
                </label>
                <input
                  type="color"
                  id="secondaryColor"
                  name="secondaryColor"
                  value={customization.secondaryColor}
                  onChange={handleCustomizationChange}
                  className="h-10 w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Font Family
                </label>
                <select
                  id="fontFamily"
                  name="fontFamily"
                  value={customization.fontFamily}
                  onChange={handleCustomizationChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="modern">Modern Sans-Serif</option>
                  <option value="classic">Classic Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="layoutPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Layout Preference
                </label>
                <select
                  id="layoutPreference"
                  name="layoutPreference"
                  value={customization.layoutPreference}
                  onChange={handleCustomizationChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="grid">Grid Layout</option>
                  <option value="list">List Layout</option>
                  <option value="masonry">Masonry Layout</option>
                </select>
              </div>
            </div>
          </section>
          
          {/* Preview Button */}
          <div className="flex justify-center">
            <Link href="/secure/showcase/preview" className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors text-lg">
              Preview Your Showcase
            </Link>
          </div>
        </div>
      )}
    </main>
  );
} 