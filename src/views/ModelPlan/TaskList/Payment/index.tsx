import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

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
        <Route path="/models/:modelID/task-list/payment" exact>
          <FundingSource />
        </Route>
        <Route
          path="/models/:modelID/task-list/payment/claims-based-payment"
          exact
        >
          <ClaimsBasedPayment />
        </Route>
        <Route
          path="/models/:modelID/task-list/payment/non-claims-based-payment"
          exact
        >
          <NonClaimsBasedPayment />
        </Route>
        <Route
          path="/models/:modelID/task-list/payment/anticipating-dependencies"
          exact
        >
          <AnticipateDependencies />
        </Route>
        <Route
          path="/models/:modelID/task-list/payment/beneficiary-cost-sharing"
          exact
        >
          <BeneficiaryCostSharing />
        </Route>
        <Route path="/models/:modelID/task-list/payment/complexity" exact>
          <Complexity />
        </Route>
        <Route path="/models/:modelID/task-list/payment/recover-payment" exact>
          <Recover />
        </Route>
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default Payment;
