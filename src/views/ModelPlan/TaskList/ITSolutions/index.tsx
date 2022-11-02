import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import ITSolutionsHome from './Home';
import SelectSolutions from './SelectSolutions';

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
              path="/models/:modelID/task-list/it-solutions/select-solutions/:operationalNeedID"
              exact
            >
              <SelectSolutions />
            </Route>

            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITSolutions;
