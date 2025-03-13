import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Flex, 
  Divider, 
  Button, 
  TextField, 
  TextAreaField,
  Image,
  View,
  useTheme
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { updateStudentProfile, updateProfileImage } from '../../graphql/operations/userProfile';
import { uploadProfileImage } from '../../utils/storage';

const client = generateClient();

interface ProfileEditorProps {
  onSave?: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onSave }) => {
  const { tokens } = useTheme();
  const { studentProfile, refreshStudentProfile } = useAuth();
  
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

  // Load profile data when the component mounts
  useEffect(() => {
    if (studentProfile) {
      setFirstName(studentProfile.firstName || '');
      setLastName(studentProfile.lastName || '');
      setTitle(studentProfile.title || '');
      setBio(studentProfile.bio || '');
      setLocation(studentProfile.location || '');
      setContactEmail(studentProfile.contactEmail || '');
      setProfileImageUrl(studentProfile.profileImageUrl || '');
    }
  }, [studentProfile]);

  // Handle profile image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
    
    if (!studentProfile?.id) {
      console.error('No student profile ID found');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload profile image if a new one was selected
      let imageUrl = profileImageUrl;
      if (profileImage) {
        imageUrl = await uploadProfileImage(profileImage, studentProfile.id);
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
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Heading level={3}>Edit Profile</Heading>
      <Divider marginBlock={tokens.space.medium} />
      
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={tokens.space.medium}>
          {/* Profile Image */}
          <Flex direction="column" gap={tokens.space.small}>
            <Text>Profile Image</Text>
            <Flex direction="row" alignItems="center" gap={tokens.space.medium}>
              <View
                backgroundColor={tokens.colors.background.secondary}
                borderRadius="50%"
                width="100px"
                height="100px"
                overflow="hidden"
              >
                <Image
                  src={previewUrl || profileImageUrl || '/placeholder-profile.png'}
                  alt="Profile"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              </View>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="profile-image-upload"
              />
              <Button
                as="label"
                htmlFor="profile-image-upload"
                variation="primary"
              >
                Choose Image
              </Button>
            </Flex>
          </Flex>
          
          {/* Basic Information */}
          <Flex direction={{ base: 'column', large: 'row' }} gap={tokens.space.medium}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              width="100%"
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              width="100%"
            />
          </Flex>
          
          <TextField
            label="Professional Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Full Stack Developer"
            width="100%"
          />
          
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., San Francisco, CA"
            width="100%"
          />
          
          <TextField
            label="Contact Email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            type="email"
            width="100%"
          />
          
          <TextAreaField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={5}
            width="100%"
          />
          
          <Flex justifyContent="flex-end" gap={tokens.space.medium}>
            <Button
              type="button"
              variation="link"
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
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variation="primary"
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
};

export default ProfileEditor; 