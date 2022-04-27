import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import NotFound, { NotFoundPartial } from 'views/NotFound';

const BasicsContent = () => {
  return <h1>hello world</h1>;
};

export const Basics = () => {
  return (
    <MainContent className="grid-container" data-testid="model-basics">
      <Switch>
        <Route
          path="/models/:modelId/task-list/basics"
          render={() => <BasicsContent />}
        />
        <Route
          path="/models/:modelId/task-list/basics/overview"
          render={() => <NotFound />}
        />
        <Route
          path="/models/:modelId/task-list/basics/milestones"
          render={() => <NotFound />}
        />
        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default Basics;
