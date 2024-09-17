import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

import BeneficiaryIdentification from './BeneficiaryIdentification';
import Frequency from './Frequency';
import PeopleImpact from './PeopleImpact';

export const Beneficiaries = () => {
  return (
    <MainContent data-testid="model-beneficiaries">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/beneficiaries" // page-* may change pending UX clarifcation
              exact
              render={() => <BeneficiaryIdentification />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/beneficiaries/people-impact"
              exact
              render={() => <PeopleImpact />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/beneficiaries/beneficiary-frequency"
              exact
              render={() => <Frequency />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Beneficiaries;
