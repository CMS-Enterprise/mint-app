import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

import PrepareForClearanceCheckList from './Checklist';
import ClearanceReview from './ClearanceReview';

export const PrepareForClearance = () => {
  const { modelID = '' } = useParams<{ modelID: string }>();

  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Routes>
            {/* Model Plan Prepare for clearance Pages */}
            <Route
              path=""
              element={ProtectedRoute({
                element: <PrepareForClearanceCheckList modelID={modelID} />
              })}
            />

            <Route
              path=":section/:sectionID"
              element={ProtectedRoute({
                element: <ClearanceReview modelID={modelID} />
              })}
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPartial />} />
          </Routes>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default PrepareForClearance;
