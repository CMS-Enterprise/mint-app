import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

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
            <Route path="/models/:modelID/task-list/it-solutions" exact>
              <ITSolutionsHome />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/add-an-operational-need"
              exact
            >
              <AddOrUpdateOperationalNeed />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/update-need/:operationalNeedID?"
              exact
            >
              <AddOrUpdateOperationalNeed />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions"
              exact
            >
              <SelectSolutions />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/update-solutions"
              exact
            >
              <SelectSolutions update />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-solution/:operationalSolutionID?"
              exact
            >
              <AddSolution />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID?"
              exact
            >
              <AddCustomSolution />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-implementation-details"
              exact
            >
              <SolutionImplementation />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/update-status/:solutionId?"
              exact
            >
              <SolutionImplementation isUpdatingStatus />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/solution-details"
              exact
            >
              <SolutionDetails />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks"
              exact
            >
              <Subtasks />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/manage-subtasks"
              exact
            >
              <Subtasks manageSubtasks />
            </Route>

            <Route
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/link-documents"
              exact
            >
              <LinkDocuments />
            </Route>

            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITSolutions;
