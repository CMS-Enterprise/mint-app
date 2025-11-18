import React from 'react';
import { Outlet } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

import PrepareForClearanceCheckList from './Checklist';
import ClearanceReview from './ClearanceReview';

export const PrepareForClearance = () => {
  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Outlet />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export const prepareForClearanceRoutes = {
  path: '/models/:modelID/collaboration-area/model-plan/prepare-for-clearance',
  element: (
    <ProtectedRoute>
      <PrepareForClearance />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <PrepareForClearanceCheckList />
    },
    {
      path: ':section/:sectionID',
      element: <ClearanceReview />
    }
  ]
};

export default PrepareForClearance;
