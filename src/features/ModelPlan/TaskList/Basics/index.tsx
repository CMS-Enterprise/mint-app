import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import BasicsInfo from './BasicsInfo';
import Overview from './Overview';

const Basics = () => {
  return <Outlet />;
};

const basicsRoutes = {
  path: '/models/:modelID/collaboration-area/model-plan/basics',
  element: (
    <ProtectedRoute>
      <Basics />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <BasicsInfo />
    },
    {
      path: 'overview',
      element: <Overview />
    }
  ]
};

export default basicsRoutes;
