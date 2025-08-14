import React from 'react';
import { Outlet } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import protectedRoute from 'components/ProtectedRoute';

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
  element: protectedRoute(<PrepareForClearance />),
  children: [
    {
      path: '',
      element: protectedRoute(<PrepareForClearanceCheckList />)
    },
    {
      path: ':section/:sectionID',
      element: <ClearanceReview />
    }
  ]
};

export default PrepareForClearance;
