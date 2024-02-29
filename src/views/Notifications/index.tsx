import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotificationSettings from './Settings';
// import NotificationsHome from './Home';

const Notifications = () => {
  return (
    <Switch>
      {/* <Route path="/notifications" component={NotificationsHome} exact /> */}

      <Route
        path="/notifications/settings"
        component={NotificationSettings}
        exact
      />
    </Switch>
  );
};

export default Notifications;
