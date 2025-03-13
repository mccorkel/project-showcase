'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { updateSocialLinks } from '../../graphql/operations/userProfile';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaPlus, FaTrash } from 'react-icons/fa';

const client = generateClient();

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksEditorProps {
  onSave?: () => void;
}

const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({ onSave }) => {
  const { studentProfile, refreshStudentProfile } = useAuth();
  
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [otherLinks, setOtherLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load social links when the component mounts
  useEffect(() => {
    console.log("Loading social links from profile:", studentProfile?.socialLinks);
    if (studentProfile?.socialLinks) {
      try {
        const links = typeof studentProfile.socialLinks === 'string' 
          ? JSON.parse(studentProfile.socialLinks) 
          : studentProfile.socialLinks;
          
        setLinkedin(links.linkedin || '');
        setGithub(links.github || '');
        setTwitter(links.twitter || '');
        setPortfolio(links.portfolio || '');
        setOtherLinks(links.other || []);
      } catch (e) {
        console.error("Error parsing social links:", e);
        // Initialize with empty values if parsing fails
        setLinkedin('');
        setGithub('');
        setTwitter('');
        setPortfolio('');
        setOtherLinks([]);
      }
    }
  }, [studentProfile]);

  // Add a new other link
  const addOtherLink = () => {
    setOtherLinks([...otherLinks, { platform: '', url: '' }]);
  };

  // Update an other link
  const updateOtherLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...otherLinks];
    updatedLinks[index][field] = value;
    setOtherLinks(updatedLinks);
  };

  // Remove an other link
  const removeOtherLink = (index: number) => {
    const updatedLinks = [...otherLinks];
    updatedLinks.splice(index, 1);
    setOtherLinks(updatedLinks);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!studentProfile?.id) {
      setError('No student profile found. Please complete your basic profile information first.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Validate URLs
      const validateUrl = (url: string) => {
        if (!url) return true; // Empty URLs are valid
        try {
          new URL(url.startsWith('http') ? url : `https://${url}`);
          return true;
        } catch {
          return false;
        }
      };
      
      // Check all URLs
      const allUrls = [linkedin, github, twitter, portfolio, ...otherLinks.map(link => link.url)];
      const invalidUrls = allUrls.filter(url => url && !validateUrl(url));
      
      if (invalidUrls.length > 0) {
        setError('One or more URLs are invalid. Please check your links.');
        setIsLoading(false);
        return;
      }
      
      // Create the social links object
      const socialLinks = {
        linkedin: linkedin.trim(),
        github: github.trim(),
        twitter: twitter.trim(),
        portfolio: portfolio.trim(),
        other: otherLinks.filter(link => link.platform.trim() && link.url.trim())
      };
      
      // Update social links
      await client.graphql({
        query: updateSocialLinks,
        variables: {
          id: studentProfile.id,
          socialLinks: JSON.stringify(socialLinks)
        }
      });
      
      // Refresh the profile data
      await refreshStudentProfile();
      setSuccess('Social links updated successfully!');
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating social links:', error);
      setError('Failed to update social links. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format URL for display and input
  const formatUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Social Links</h3>
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6"></div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {/* LinkedIn */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-l-md">
                <FaLinkedin className="text-blue-600 dark:text-blue-400" />
              </div>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* GitHub */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</label>
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 w-10 h-10 rounded-l-md">
                <FaGithub className="text-gray-700 dark:text-gray-300" />
              </div>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="github.com/yourusername"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Twitter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter</label>
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-950 w-10 h-10 rounded-l-md">
                <FaTwitter className="text-blue-500 dark:text-blue-300" />
              </div>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="twitter.com/yourusername"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Portfolio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio Website</label>
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-green-100 dark:bg-green-900 w-10 h-10 rounded-l-md">
                <FaGlobe className="text-green-600 dark:text-green-400" />
              </div>
              <input
                type="text"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="yourportfolio.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Other Links */}
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Other Links</label>
              <button
                type="button"
                onClick={addOtherLink}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md transition-colors"
              >
                <FaPlus size={12} />
                <span>Add Link</span>
              </button>
            </div>
            
            {otherLinks.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No additional links added. Click "Add Link" to add more social or professional links.
              </p>
            )}
            
            {otherLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="w-2/5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</label>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => updateOtherLink(index, 'platform', e.target.value)}
                    placeholder="e.g., Medium, Dribbble"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="w-3/5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">URL</label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateOtherLink(index, 'url', e.target.value)}
                    placeholder="e.g., medium.com/@yourusername"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeOtherLink(index)}
                  className="mt-6 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                // Reset form to original values
                if (studentProfile?.socialLinks) {
                  try {
                    const links = typeof studentProfile.socialLinks === 'string' 
                      ? JSON.parse(studentProfile.socialLinks) 
                      : studentProfile.socialLinks;
                      
                    setLinkedin(links.linkedin || '');
                    setGithub(links.github || '');
                    setTwitter(links.twitter || '');
                    setPortfolio(links.portfolio || '');
                    setOtherLinks(links.other || []);
                  } catch (e) {
                    console.error("Error parsing social links:", e);
                  }
                }
                setError(null);
                setSuccess(null);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SocialLinksEditor; 