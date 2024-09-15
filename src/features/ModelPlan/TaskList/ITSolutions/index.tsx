import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import { NotFoundPartial } from 'features/NotFound';

import AddCustomSolution from './AddCustomSolution';
import AddOrUpdateOperationalNeed from './AddOrUpdateOperationalNeed';
import AddSolution from './AddSolution';
import ITSolutionsHome from './Home';
import LinkDocuments from './LinkDocuments';
import SelectSolutions from './SelectSolutions';
import SolutionDetails from './SolutionDetails';
import SolutionImplementation from './SolutionImplementation';
import Subtasks from './Subtasks';

const ITSolutions = () => {
  return (
    <MainContent data-testid="it-solutions">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions"
              component={ITSolutionsHome}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/add-an-operational-need"
              component={AddOrUpdateOperationalNeed}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/update-need/:operationalNeedID?"
              component={AddOrUpdateOperationalNeed}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/select-solutions"
              component={SelectSolutions}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/add-solution/:operationalSolutionID?"
              component={AddSolution}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID?"
              component={AddCustomSolution}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details/:solutionId?"
              component={SolutionImplementation}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/solution-details"
              component={SolutionDetails}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks"
              component={Subtasks}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/manage-subtasks"
              render={props => <Subtasks {...props} managingSubtasks />}
              exact
            />

            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/link-documents"
              component={LinkDocuments}
              exact
            />

            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITSolutions;
