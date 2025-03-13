'use client';

import React from 'react';
import CohortDetailWrapper from '@/components/admin/CohortDetailWrapper';

interface CohortDetailPageProps {
  params: Promise<{ id: string }>;
}

const CohortDetailPage = async ({ params }: CohortDetailPageProps) => {
  const { id } = await params;
  return <CohortDetailWrapper cohortId={id} />;
};

export default CohortDetailPage;
