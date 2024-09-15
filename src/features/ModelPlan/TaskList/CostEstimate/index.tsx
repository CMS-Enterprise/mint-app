import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import NotFound, { NotFoundPartial } from 'features/NotFound';

export const CostEstimate = () => {
  return (
    <MainContent className="grid-container" data-testid="model-cost-estimate">
      <Switch>
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/cost-estimate/page-1" // page-* may change pending UX clarifcation
          render={() => <NotFound />}
        />
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default CostEstimate;
