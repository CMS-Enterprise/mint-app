import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

import './index.scss';

const Timeline = () => {
  return (
    <MainContent className="mint-body-normal" data-testid="timeline">
      <Switch>
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/timeline"
          //   component={}
          exact
        />

        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default Timeline;
