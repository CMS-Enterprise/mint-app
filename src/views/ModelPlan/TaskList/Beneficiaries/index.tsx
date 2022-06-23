import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import NotFound, { NotFoundPartial } from 'views/NotFound';

export const Beneficiaries = () => {
  return (
    <MainContent data-testid="model-beneficiaries">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Route
              path="/models/:modelID/task-list/beneficiaries/page-1" // page-* may change pending UX clarifcation
              render={() => <NotFound />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Beneficiaries;
