import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
          <Routes>
            <Route
              path="" // page-* may change pending UX clarifcation
              element={
                <ProtectedRoute element={<BeneficiaryIdentification />} />
              }
            />
            <Route
              path="people-impact"
              element={<ProtectedRoute element={<PeopleImpact />} />}
            />
            <Route
              path="beneficiary-frequency"
              element={<ProtectedRoute element={<Frequency />} />}
            />
            <Route path="*" element={<NotFoundPartial />} />
          </Routes>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Beneficiaries;
