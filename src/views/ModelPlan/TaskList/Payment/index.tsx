import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import AnticipateDependencies from './AnticipateDependencies';
import BeneficiaryCostSharing from './BeneficiaryCostSharing';
import ClaimsBasedPayment from './ClaimsBasedPayment';
import FundingSource from './FundingSource';
import TempPage from './temp';

// Used to render the current page based on certain answers populated within this task list item
export const renderCurrentPage = (
  currentPage: number,
  hasClaims: boolean | null,
  hasNonClaims: boolean | null
) => {
  let adjustedCurrentPage = currentPage;
  if (currentPage > 2 && !hasClaims) adjustedCurrentPage -= 3;
  if (currentPage > 6 && !hasNonClaims) adjustedCurrentPage -= 1;
  return adjustedCurrentPage;
};

// Used to render the total pages based on certain answers populated within this task list item
export const renderTotalPages = (
  hasClaims: boolean | null,
  hasNonClaims: boolean | null
) => {
  let totalPages = 3;
  if (hasClaims) totalPages += 2;
  if (hasNonClaims) totalPages += 1;
  return totalPages;
};

export const Payment = () => {
  return (
    <MainContent className="grid-container" data-testid="model-payment">
      <Switch>
        <Route
          path="/models/:modelID/task-list/payment"
          exact
          render={() => <FundingSource />}
        />
        <Route
          path="/models/:modelID/task-list/payment/claims-based-payment"
          exact
          render={() => <ClaimsBasedPayment />}
        />
        <Route
          path="/models/:modelID/task-list/payment/anticipating-dependencies"
          exact
          render={() => <AnticipateDependencies />}
        />
        <Route
          path="/models/:modelID/task-list/payment/beneficiary-cost-sharing"
          exact
          render={() => <BeneficiaryCostSharing />}
        />
        <Route
          path="/models/:modelID/task-list/payment/page-2"
          exact
          render={() => <TempPage />}
        />
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default Payment;
