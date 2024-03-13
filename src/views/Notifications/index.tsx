import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotificationsHome from './Home';
import NotificationSettings from './Settings';

const Notifications = () => {
  return (
    <Switch>
      <Route path="/notifications" component={NotificationsHome} exact />

      <Route
        path="/notifications/settings"
        component={NotificationSettings}
        exact
      />
    </Switch>
  );
};

export default Notifications;
