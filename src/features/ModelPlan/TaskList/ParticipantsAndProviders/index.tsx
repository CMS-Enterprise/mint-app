import React from 'react';
import { Outlet } from 'react-router-dom';

import protectedRoute from 'components/ProtectedRoute';

import Communication from './Communication';
import Coordination from './Coordination';
import ParticipantOptions from './ParticipantOptions';
import Participants from './Participants';
import ProviderOptions from './ProviderOptions';

const ParticipantsAndProviders = () => {
  return <Outlet />;
};

const participantsAndProvidersRoutes = {
  path: '/models/:modelID/collaboration-area/task-list/participants-and-providers',
  element: protectedRoute(<ParticipantsAndProviders />),
  children: [
    {
      path: '',
      element: <Participants />
    },
    {
      path: 'participants-options',
      element: <ParticipantOptions />
    },
    {
      path: 'communication',
      element: <Communication />
    },
    {
      path: 'coordination',
      element: <Coordination />
    },
    {
      path: 'provider-options',
      element: <ProviderOptions />
    }
  ]
};

export default participantsAndProvidersRoutes;
