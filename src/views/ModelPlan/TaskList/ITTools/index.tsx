import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import ITToolsPageFive from './PageFive';
import ITToolsPageFour from './PageFour';
import ITToolsPageOne from './PageOne';
import ITToolsPageSeven from './PageSeven';
import ITToolsPageSix from './PageSix';
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
            <Route
              path="/models/:modelID/task-list/it-tools/page-four"
              exact
              render={() => <ITToolsPageFour />}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-five"
              exact
              render={() => <ITToolsPageFive />}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-six"
              exact
              render={() => <ITToolsPageSix />}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-seven"
              exact
              render={() => <ITToolsPageSeven />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITTools;
