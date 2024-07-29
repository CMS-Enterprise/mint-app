import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'views/App/ProtectedRoute';
import NotFound, { NotFoundPartial } from 'views/NotFound';

export const SubmitRequest = () => {
  return (
    <MainContent className="grid-container" data-testid="model-submit-request">
      <Switch>
        <ProtectedRoute
          path="/models/:modelID/task-list/submit-request/page-1" // page-* may change pending UX clarifcation
          render={() => <NotFound />}
        />
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default SubmitRequest;
