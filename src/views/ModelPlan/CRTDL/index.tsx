import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from 'views/App/ProtectedRoute';
import NotFound from 'views/NotFound';

import AddCRTDL from './AddCRTDL';
import CRTDLs from './CRTDLs';

const CRTDL = () => {
  return (
    <Switch>
      {/* Model Plan CRTDL Pages */}
      <ProtectedRoute
        path="/models/:modelID/cr-and-tdl"
        exact
        render={() => <CRTDLs />}
      />
      <ProtectedRoute
        path="/models/:modelID/cr-and-tdl/add-cr-and-tdl"
        exact
        render={() => <AddCRTDL />}
      />

      {/* 404 */}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default CRTDL;
