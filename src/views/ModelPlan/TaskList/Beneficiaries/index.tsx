import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import BeneficiariesPageOne from './PageOne';

export const Beneficiaries = () => {
  return (
    <MainContent data-testid="model-beneficiaries">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Route
              path="/models/:modelID/task-list/beneficiaries" // page-* may change pending UX clarifcation
              exact
              render={() => <BeneficiariesPageOne />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Beneficiaries;
