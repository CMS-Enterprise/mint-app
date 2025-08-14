import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import AnticipateDependencies from './AnticipateDependencies';
import BeneficiaryCostSharing from './BeneficiaryCostSharing';
import ClaimsBasedPayment from './ClaimsBasedPayment';
import Complexity from './Complexity';
import FundingSource from './FundingSource';
import NonClaimsBasedPayment from './NonClaimsBasedPayment';
import Recover from './Recover';

// Used to render the current page based on certain answers populated within this task list item
export const renderCurrentPage = (
  currentPage: number,
  hasClaims: boolean,
  hasNonClaims: boolean,
  hasReductionCostSharing: boolean
) => {
  let adjustedCurrentPage = currentPage;
  if (currentPage > 2 && !hasClaims) adjustedCurrentPage -= 2;
  if (currentPage > 3 && !hasReductionCostSharing) adjustedCurrentPage -= 1;
  if (currentPage > 5 && !hasNonClaims) adjustedCurrentPage -= 1;
  return adjustedCurrentPage;
};

// Used to render the total pages based on certain answers populated within this task list item
export const renderTotalPages = (
  hasClaims: boolean,
  hasNonClaims: boolean,
  hasReductionCostSharing: boolean
) => {
  let totalPages = 3;
  if (hasClaims) totalPages += 2;
  if (hasNonClaims) totalPages += 1;
  if (hasReductionCostSharing) totalPages += 1;
  return totalPages;
};

const Payment = () => {
  return <Outlet />;
};

const paymentRoutes = {
  path: '/models/:modelID/collaboration-area/task-list/payment',
  element: ProtectedRoute(<Payment />),
  children: [
    {
      path: '',
      element: <FundingSource />
    },
    {
      path: 'claims-based-payment',
      element: <ClaimsBasedPayment />
    },
    {
      path: 'non-claims-based-payment',
      element: <NonClaimsBasedPayment />
    },
    {
      path: 'anticipating-dependencies',
      element: <AnticipateDependencies />
    },
    {
      path: 'beneficiary-cost-sharing',
      element: <BeneficiaryCostSharing />
    },
    {
      path: 'complexity',
      element: <Complexity />
    },
    {
      path: 'recover-payment',
      element: <Recover />
    }
  ]
};

export default paymentRoutes;
