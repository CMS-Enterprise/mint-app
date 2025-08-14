import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import BasicsInfo from './BasicsInfo';
import Overview from './Overview';

const Basics = () => {
  return <Outlet />;
};

const basicsRoutes = {
  path: '/models/:modelID/collaboration-area/task-list/basics',
  element: ProtectedRoute(<Basics />),
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
