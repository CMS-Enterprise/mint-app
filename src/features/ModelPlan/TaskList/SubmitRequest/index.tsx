import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound, { NotFoundPartial } from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

export const SubmitRequest = () => {
  return (
    <MainContent className="grid-container" data-testid="model-submit-request">
      <Switch>
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/task-list/submit-request/page-1" // page-* may change pending UX clarifcation
          render={() => <NotFound />}
        />
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default SubmitRequest;
