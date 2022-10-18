import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

// import {
//   findLockedSection,
//   taskListSectionMap
// } from 'views/SubscriptionHandler';
// import { SubscriptionContext } from 'views/SubscriptionWrapper';
import PrepareForClearanceCheckList from './Checklist';

export const PrepareForClearance = () => {
  //   const { taskListSectionLocks } = useContext(SubscriptionContext);
  return (
    <MainContent data-testid="model-it-tools">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            {/* Model Plan CRTDL Pages */}
            <Route
              path="/models/:modelID/task-list/prepare-for-clearance"
              exact
              render={() => <PrepareForClearanceCheckList />}
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
