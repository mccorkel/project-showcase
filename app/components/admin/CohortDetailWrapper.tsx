'use client';

import React from 'react';
import CohortDetail from './CohortDetail';

interface CohortDetailWrapperProps {
  cohortId: string;
}

const CohortDetailWrapper: React.FC<CohortDetailWrapperProps> = ({ cohortId }) => {
  return <CohortDetail cohortId={cohortId} />;
};

export default CohortDetailWrapper; 