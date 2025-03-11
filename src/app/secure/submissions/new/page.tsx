import React from 'react';
import { 
  Heading, 
  Text, 
  Flex, 
  useTheme
} from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import SubmissionForm from '../../../../components/submissions/SubmissionForm';

const CreateSubmissionPage = () => {
  const { tokens } = useTheme();
  const router = useRouter();
  
  const handleSave = (id: string) => {
    // Navigate to the submissions list page
    router.push('/secure/submissions');
  };
  
  const handleCancel = () => {
    // Navigate back to the submissions list page
    router.push('/secure/submissions');
  };
  
  return (
    <Flex direction="column" gap={tokens.space.large}>
      <Flex direction="column" gap={tokens.space.small}>
        <Heading level={2}>Create New Submission</Heading>
        <Text>Create a new project submission. You can save it as a draft or submit it for grading.</Text>
      </Flex>
      
      <SubmissionForm 
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Flex>
  );
};

export default CreateSubmissionPage; 