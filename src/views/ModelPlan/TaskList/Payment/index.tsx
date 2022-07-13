import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import FundingSource from './FundingSource';

export const Payment = () => {
  return (
    <MainContent className="grid-container" data-testid="model-payment">
      <Switch>
        <Route
          path="/models/:modelID/task-list/payments"
          render={() => <FundingSource />}
        />
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default Payment;
