import React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'views/App/ProtectedRoute';
import { NotFoundPartial } from 'views/NotFound';

import PrepareForClearanceCheckList from './Checklist';
import ClearanceReview from './ClearanceReview';

export const PrepareForClearance = () => {
  const { modelID } = useParams<{ modelID: string }>();

  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            {/* Model Plan Prepare for clearance Pages */}
            <ProtectedRoute
              path="/models/:modelID/task-list/prepare-for-clearance"
              exact
              render={() => <PrepareForClearanceCheckList modelID={modelID} />}
            />

            <ProtectedRoute
              path="/models/:modelID/task-list/prepare-for-clearance/:section/:sectionID"
              exact
              render={() => <ClearanceReview modelID={modelID} />}
            />

            {/* 404 */}
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default PrepareForClearance;
