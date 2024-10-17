import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

import AboutCompletingDataExchange from './AboutCompletingDataExchange';

const DataEchangeApproach = () => {
  return (
    <MainContent className="grid-container" data-testid="model-payment">
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.DATA_EXCHANGE_APPROACH
        ]}
      />
      <Switch>
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/data-exchange-approach/about-completing-data-exchange"
          component={AboutCompletingDataExchange}
          exact
        />

        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default DataEchangeApproach;
