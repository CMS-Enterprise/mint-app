import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import ITCharacteristics from './Characteristics';

export const ITTools = () => {
  return (
    <MainContent data-testid="model-it-tools">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Redirect
              exact
              from="/models/:modelID/task-list/it-tools"
              to="/models/:modelID/task-list/it-tools/characteristics"
            />
            <Route
              path="/models/:modelID/task-list/it-tools/characteristics"
              exact
              render={() => <ITCharacteristics />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITTools;
