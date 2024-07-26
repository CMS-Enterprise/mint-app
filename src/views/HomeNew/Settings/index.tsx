import React from 'react';
import { Switch } from 'react-router-dom';

import ProtectedRoute from 'views/App/ProtectedRoute';

import SelectSolutionSettings from './selectSolutions';
import SettingsForm from './settings';
import SettingsOrder from './settingsOrder';

export const HomePageSettings = () => {
  return (
    <Switch>
      <ProtectedRoute
        path="/homepage-settings"
        exact
        component={SettingsForm}
      />

      <ProtectedRoute
        path="/homepage-settings/order"
        component={SettingsOrder}
      />

      <ProtectedRoute
        path="/homepage-settings/solutions"
        component={SelectSolutionSettings}
      />
    </Switch>
  );
};

export default HomePageSettings;
