import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import BeneficiaryIdentification from './BeneficiaryIdentification';
import BeneficiariesPageThree from './PageThree';
import PeopleImpact from './PeopleImpact';

export const Beneficiaries = () => {
  return (
    <MainContent data-testid="model-beneficiaries">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Route
              path="/models/:modelID/task-list/beneficiaries" // page-* may change pending UX clarifcation
              exact
              render={() => <BeneficiaryIdentification />}
            />
            <Route
              path="/models/:modelID/task-list/beneficiaries/page-two"
              exact
              render={() => <PeopleImpact />}
            />
            <Route
              path="/models/:modelID/task-list/beneficiaries/page-three"
              exact
              render={() => <BeneficiariesPageThree />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Beneficiaries;
