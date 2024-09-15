import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import { NotFoundPartial } from 'features/NotFound';

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

export const Payment = () => {
  return (
    <MainContent className="grid-container" data-testid="model-payment">
      <Switch>
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/payment"
          component={FundingSource}
          exact
        />
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/payment/claims-based-payment"
          component={ClaimsBasedPayment}
          exact
        />
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/payment/non-claims-based-payment"
          component={NonClaimsBasedPayment}
          exact
        />
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/payment/anticipating-dependencies"
          component={AnticipateDependencies}
          exact
        />
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/payment/beneficiary-cost-sharing"
          component={BeneficiaryCostSharing}
          exact
        />
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/payment/complexity"
          component={Complexity}
          exact
        />
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/payment/recover-payment"
          component={Recover}
          exact
        />
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default Payment;
