import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from 'features/NotFound';

import CRTDLs from './CRTDLs';

const CRTDL = () => {
  return (
    <Switch>
      {/* Model Plan CRTDL Pages */}
      <Route
        path="/models/:modelID/collaboration-area/cr-and-tdl"
        exact
        render={() => <CRTDLs />}
      />

      {/* 404 */}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default CRTDL;
