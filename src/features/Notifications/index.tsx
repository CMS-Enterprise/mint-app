import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';
import { NotFoundPartial } from 'features/NotFound';

import NotificationsHome from './Home';
import NotificationSettings from './Settings';

const Notifications = () => {
  return (
    <Switch>
      <ProtectedRoute
        path="/notifications"
        component={NotificationsHome}
        exact
      />

      <ProtectedRoute
        path="/notifications/settings"
        component={NotificationSettings}
        exact
      />

      <Route path="*" render={() => <NotFoundPartial />} />
    </Switch>
  );
};

export default Notifications;
