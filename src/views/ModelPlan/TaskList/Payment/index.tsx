import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import FundingSource from './FundingSource';
import TempPage from './temp';

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
