import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Flex, 
  Divider, 
  Button, 
  TextField,
  useTheme,
  Icon
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { updateSocialLinks } from '../../graphql/operations/userProfile';

const client = generateClient();

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksEditorProps {
  onSave?: () => void;
}

const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({ onSave }) => {
  const { tokens } = useTheme();
  const { studentProfile, refreshStudentProfile } = useAuth();
  
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [otherLinks, setOtherLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load social links when the component mounts
  useEffect(() => {
    if (studentProfile?.socialLinks) {
      const links = studentProfile.socialLinks;
      setLinkedin(links.linkedin || '');
      setGithub(links.github || '');
      setTwitter(links.twitter || '');
      setPortfolio(links.portfolio || '');
      setOtherLinks(links.other || []);
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
    
    if (!studentProfile?.id) {
      console.error('No student profile ID found');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the social links object
      const socialLinks = {
        linkedin,
        github,
        twitter,
        portfolio,
        other: otherLinks
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
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating social links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Heading level={3}>Social Links</Heading>
      <Divider marginBlock={tokens.space.medium} />
      
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={tokens.space.medium}>
          <TextField
            label="LinkedIn"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            width="100%"
          />
          
          <TextField
            label="GitHub"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="https://github.com/yourusername"
            width="100%"
          />
          
          <TextField
            label="Twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="https://twitter.com/yourusername"
            width="100%"
          />
          
          <TextField
            label="Portfolio Website"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="https://yourportfolio.com"
            width="100%"
          />
          
          <Divider />
          
          <Heading level={5}>Other Links</Heading>
          
          {otherLinks.map((link, index) => (
            <Flex key={index} direction={{ base: 'column', large: 'row' }} gap={tokens.space.small}>
              <TextField
                label="Platform"
                value={link.platform}
                onChange={(e) => updateOtherLink(index, 'platform', e.target.value)}
                placeholder="e.g., Medium, Dribbble"
                width={{ base: '100%', large: '30%' }}
              />
              <TextField
                label="URL"
                value={link.url}
                onChange={(e) => updateOtherLink(index, 'url', e.target.value)}
                placeholder="https://example.com/yourprofile"
                width={{ base: '100%', large: '60%' }}
              />
              <Button
                onClick={() => removeOtherLink(index)}
                variation="destructive"
                alignSelf={{ base: 'flex-start', large: 'flex-end' }}
                marginTop={{ base: '0', large: tokens.space.xl }}
              >
                Remove
              </Button>
            </Flex>
          ))}
          
          <Button
            onClick={addOtherLink}
            variation="link"
            alignSelf="flex-start"
          >
            + Add Another Link
          </Button>
          
          <Divider />
          
          <Flex justifyContent="flex-end" gap={tokens.space.medium}>
            <Button
              type="button"
              variation="link"
              onClick={() => {
                // Reset form to original values
                if (studentProfile?.socialLinks) {
                  const links = studentProfile.socialLinks;
                  setLinkedin(links.linkedin || '');
                  setGithub(links.github || '');
                  setTwitter(links.twitter || '');
                  setPortfolio(links.portfolio || '');
                  setOtherLinks(links.other || []);
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

export default SocialLinksEditor; 