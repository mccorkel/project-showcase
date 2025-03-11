import React from 'react';
import { 
  Heading, 
  Text, 
  Flex, 
  useTheme
} from '@aws-amplify/ui-react';
import SubmissionsList from '../../../components/submissions/SubmissionsList';

const SubmissionsPage = () => {
  const { tokens } = useTheme();
  
  return (
    <Flex direction="column" gap={tokens.space.large}>
      <Flex direction="column" gap={tokens.space.small}>
        <Heading level={2}>My Submissions</Heading>
        <Text>View and manage your project submissions. You can create new submissions, edit existing ones, and track their status.</Text>
      </Flex>
      
      <SubmissionsList />
    </Flex>
  );
};

export default SubmissionsPage; 