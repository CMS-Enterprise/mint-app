import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import NotificationsHome from './Home';
import NotificationSettings from './Settings';

const Notifications = () => {
  return <Outlet />;
};

export const notificationsRoutes = {
  path: '/notifications',
  element: (
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <NotificationsHome />
    },
    {
      path: 'settings',
      element: <NotificationSettings />
    }
  ]
};

export default Notifications;
