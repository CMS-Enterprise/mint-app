import React from 'react';
import { Outlet } from 'react-router-dom';

import SelectSolutionSettings from './selectSolutions';
import SettingsForm from './settings';
import SettingsOrder from './settingsOrder';

export const HomePageSettings = () => {
  return <Outlet />;
};

export const homePageSettingsRoutes = {
  path: '/homepage-settings',
  element: <HomePageSettings />,
  children: [
    {
      path: 'form',
      element: <SettingsForm />
    },
    {
      path: 'order',
      element: <SettingsOrder />
    },
    {
      path: 'solutions',
      element: <SelectSolutionSettings />
    }
  ]
};

export default HomePageSettings;
