import React from 'react';
import { 
  Heading, 
  Text, 
  Flex, 
  useTheme
} from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import SubmissionDetail from '../../../../components/submissions/SubmissionDetail';

interface SubmissionDetailPageProps {
  params: {
    id: string;
  };
}

const SubmissionDetailPage: React.FC<SubmissionDetailPageProps> = ({ params }) => {
  const { tokens } = useTheme();
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/secure/submissions');
  };
  
  return (
    <Flex direction="column" gap={tokens.space.large}>
      <SubmissionDetail 
        submissionId={params.id}
        onBack={handleBack}
      />
    </Flex>
  );
};

export default SubmissionDetailPage; 