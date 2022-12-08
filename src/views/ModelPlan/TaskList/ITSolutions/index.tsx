import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import UpdateStatus from './Home/UpdateStatus';
import AddCustomSolution from './AddCustomSolution';
import AddSolution from './AddSolution';
import ITSolutionsHome from './Home';
import SelectSolutions from './SelectSolutions';
import SolutionImplementation from './SolutionImplementation';

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
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions"
              exact
            >
              <SelectSolutions />
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
              path="/models/:modelID/task-list/it-solutions/:operationalNeedID/update-status"
              exact
            >
              <UpdateStatus />
            </Route>

            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITSolutions;
