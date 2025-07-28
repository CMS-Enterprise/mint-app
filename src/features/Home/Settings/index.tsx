import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import SelectSolutionSettings from './selectSolutions';
import SettingsForm from './settings';
import SettingsOrder from './settingsOrder';

export const HomePageSettings = () => {
  return (
    <Routes>
      <Route
        path="/homepage-settings"
        element={ProtectedRoute({ element: <SettingsForm /> })}
      />

      <Route
        path="/homepage-settings/order"
        element={ProtectedRoute({ element: <SettingsOrder /> })}
      />

      <Route
        path="/homepage-settings/solutions"
        element={ProtectedRoute({ element: <SelectSolutionSettings /> })}
      />
    </Routes>
  );
};

export default HomePageSettings;
