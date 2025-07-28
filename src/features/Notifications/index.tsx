import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';

import ProtectedRoute from 'components/ProtectedRoute';

import NotificationsHome from './Home';
import NotificationSettings from './Settings';

const Notifications = () => {
  return (
    <Routes>
      <Route
        path="/notifications"
        element={ProtectedRoute({ element: <NotificationsHome /> })}
      />

      <Route
        path="/notifications/settings"
        element={ProtectedRoute({ element: <NotificationSettings /> })}
      />

      <Route path="*" element={<NotFoundPartial />} />
    </Routes>
  );
};

export default Notifications;
