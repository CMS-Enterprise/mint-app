import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import { MTOModalProvider } from 'contexts/MTOModalContext';

import MTOModal from './_components/FormModal';
import MTOHome from './Home';
import MilestoneLibrary from './MilestoneLibrary';
import SolutionLibrary from './SolutionLibrary';

import './index.scss';

const ModelToOperations = () => {
  return (
    <MainContent className="mint-body-normal" data-testid="model-to-operations">
      <MTOModalProvider>
        <MTOModal />
        <Switch>
          <ProtectedRoute
            path="/models/:modelID/collaboration-area/model-to-operations/matrix"
            component={MTOHome}
            exact
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/model-to-operations/milestone-library"
            component={MilestoneLibrary}
            exact
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/model-to-operations/solution-library"
            component={SolutionLibrary}
            exact
          />

          <Redirect
            exact
            from="/models/:modelID/collaboration-area/model-to-operations"
            to="/models/:modelID/collaboration-area/model-to-operations/matrix"
          />

          <Route path="*" render={() => <NotFoundPartial />} />
        </Switch>
      </MTOModalProvider>
    </MainContent>
  );
};

export default ModelToOperations;
