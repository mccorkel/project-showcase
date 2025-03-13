'use client';

import React from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Flex, 
  useTheme
} from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import SubmissionDetail from '@/components/submissions/SubmissionDetail';

interface SubmissionDetailPageProps {
  params: Promise<{ id: string }>;
}

const SubmissionDetailPage = async ({ params }: SubmissionDetailPageProps) => {
  const { id } = await params;
  const { tokens } = useTheme();
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/secure/submissions');
  };
  
  return (
    <Flex direction="column" gap={tokens.space.large}>
      <SubmissionDetail 
        submissionId={id}
        onBack={handleBack}
      />
    </Flex>
  );
};

export default SubmissionDetailPage; 