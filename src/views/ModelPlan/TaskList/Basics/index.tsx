import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import NotFound, { NotFoundPartial } from 'views/NotFound';

export const Basics = () => {
  return (
    <MainContent
      className="grid-container margin-bottom-5"
      data-testid="model-basics"
    >
      <Switch>
        <Route
          path="/models/:modelId/task-list/basics/page-1" // page-* may change pending UX clarifcation
          render={() => <NotFound />}
        />
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default Basics;
