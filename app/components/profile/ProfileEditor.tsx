'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { updateStudentProfile } from '../../graphql/operations/userProfile';
import { uploadProfileImage } from '../../utils/storage';

const client = generateClient();

interface ProfileEditorProps {
  onSave?: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onSave }) => {
  const { studentProfile, refreshStudentProfile, user } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load profile data when the component mounts
  useEffect(() => {
    console.log("Current student profile:", studentProfile);
    if (studentProfile) {
      setFirstName(studentProfile.firstName || '');
      setLastName(studentProfile.lastName || '');
      setTitle(studentProfile.title || '');
      setBio(studentProfile.bio || '');
      setLocation(studentProfile.location || '');
      setContactEmail(studentProfile.contactEmail || user?.email || '');
      setProfileImageUrl(studentProfile.profileImageUrl || '');
    } else if (user) {
      // If no student profile but we have a user, pre-fill email
      setContactEmail(user.email || '');
    }
  }, [studentProfile, user]);

  // Handle profile image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Please select an image under 5MB.');
        return;
      }
      
      setProfileImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!firstName || !lastName) {
      setError('First name and last name are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload profile image if a new one was selected
      let imageUrl = profileImageUrl;
      if (profileImage) {
        try {
          if (studentProfile?.id) {
            imageUrl = await uploadProfileImage(profileImage, studentProfile.id);
          } else if (user?.userId) {
            // If no profile ID yet, use user ID
            imageUrl = await uploadProfileImage(profileImage, user.userId);
          }
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          setError('Failed to upload profile image. Please try again.');
          setIsLoading(false);
          return;
        }
      }
      
      // If we don't have a student profile yet, we need to create one
      if (!studentProfile?.id && user) {
        // This would require a createStudentProfile mutation
        // For now, we'll just show an error
        setError('Unable to update profile. Please contact support.');
        setIsLoading(false);
        return;
      }
      
      // Update profile data
      await client.graphql({
        query: updateStudentProfile,
        variables: {
          id: studentProfile.id,
          firstName,
          lastName,
          title,
          bio,
          location,
          contactEmail,
          profileImageUrl: imageUrl
        }
      });
      
      // Refresh the profile data
      await refreshStudentProfile();
      
      // Show success message
      setSuccess('Profile updated successfully!');
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile</h3>
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
          {/* Profile Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                <img
                  src={previewUrl || profileImageUrl || '/placeholder-profile.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="profile-image-upload"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors cursor-pointer inline-block text-center"
                >
                  Choose Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image-upload"
                />
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImage(null);
                      setPreviewUrl('');
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: Square image, at least 300x300 pixels, max 5MB
                </p>
              </div>
            </div>
          </div>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Your first name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {isLoading && !firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">First name is required</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Your last name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {isLoading && !lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">Last name is required</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Professional Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Full Stack Developer"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, CA"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Your professional email address"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself, your background, interests, and goals..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                // Reset form to original values
                if (studentProfile) {
                  setFirstName(studentProfile.firstName || '');
                  setLastName(studentProfile.lastName || '');
                  setTitle(studentProfile.title || '');
                  setBio(studentProfile.bio || '');
                  setLocation(studentProfile.location || '');
                  setContactEmail(studentProfile.contactEmail || '');
                  setProfileImageUrl(studentProfile.profileImageUrl || '');
                  setProfileImage(null);
                  setPreviewUrl('');
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

export default ProfileEditor; 