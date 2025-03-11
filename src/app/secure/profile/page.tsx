import React from 'react';
import { 
  Heading, 
  Text, 
  Flex, 
  Tabs,
  useTheme
} from '@aws-amplify/ui-react';
import ProfileEditor from '../../../components/profile/ProfileEditor';
import SocialLinksEditor from '../../../components/profile/SocialLinksEditor';
import EducationEditor from '../../../components/profile/EducationEditor';
import SkillsEditor from '../../../components/profile/SkillsEditor';

const ProfilePage = () => {
  const { tokens } = useTheme();
  
  return (
    <Flex direction="column" gap={tokens.space.large}>
      <Flex direction="column" gap={tokens.space.small}>
        <Heading level={2}>Profile Management</Heading>
        <Text>Manage your profile information, which will be displayed in your public showcase.</Text>
      </Flex>
      
      <Tabs>
        <Tabs.Item title="Basic Information" value="basic">
          <ProfileEditor />
        </Tabs.Item>
        
        <Tabs.Item title="Social Links" value="social">
          <SocialLinksEditor />
        </Tabs.Item>
        
        <Tabs.Item title="Education" value="education">
          <EducationEditor />
        </Tabs.Item>
        
        <Tabs.Item title="Skills" value="skills">
          <SkillsEditor />
        </Tabs.Item>
      </Tabs>
    </Flex>
  );
};

export default ProfilePage; 