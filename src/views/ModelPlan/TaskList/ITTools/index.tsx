import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import ITToolsPageOne from './PageOne';
import ITToolsPageThree from './PageThree';
import ITToolsPageTwo from './PageTwo';

export const ITTools = () => {
  return (
    <MainContent data-testid="model-it-tools">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Redirect
              exact
              from="/models/:modelID/task-list/it-tools"
              to="/models/:modelID/task-list/it-tools/page-one"
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-one"
              exact
              render={() => <ITToolsPageOne />}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-two"
              exact
              render={() => <ITToolsPageTwo />}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-three"
              exact
              render={() => <ITToolsPageThree />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITTools;
