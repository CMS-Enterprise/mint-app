import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import NotificationsHome from './Home';
import NotificationHome from './home';
import NotificationSettings from './Settings';

const Notifications = () => {
  return (
    <Switch>
      {/* <Route path="/notifications" component={NotificationsHome} exact /> */}

      <Route
        path="/notifications/settings"
        component={NotificationSettings}
        exact
      />
      <Route path="/notifications" component={NotificationHome} />
    </Switch>
  );
};

export default Notifications;
