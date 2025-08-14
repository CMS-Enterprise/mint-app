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
  path: '/models/:modelID/collaboration-area/task-list/prepare-for-clearance',
  element: ProtectedRoute(<PrepareForClearance />),
  children: [
    {
      path: '',
      element: ProtectedRoute(<PrepareForClearanceCheckList />)
    },
    {
      path: ':section/:sectionID',
      element: <ClearanceReview />
    }
  ]
};

export default PrepareForClearance;
