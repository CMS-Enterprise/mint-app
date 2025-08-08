import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import Authority from './Authority';
import Involvements from './Involvements';
import KeyCharacteristics from './KeyCharacteristics';
import ModelRelation from './ModelRelation';
import TargetsAndOptions from './TargetsAndOptions';

const GeneralCharacteristics = () => {
  return <Outlet />;
};

const generalCharacteristicsRoutes = {
  path: '/models/:modelID/collaboration-area/task-list/characteristics',
  element: (
    <ProtectedRoute>
      <GeneralCharacteristics />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <ModelRelation />
    },
    {
      path: 'key-characteristics',
      element: <KeyCharacteristics />
    },
    {
      path: 'involvements',
      element: <Involvements />
    },
    {
      path: 'targets-and-options',
      element: <TargetsAndOptions />
    },
    {
      path: 'authority',
      element: <Authority />
    }
  ]
};

export default generalCharacteristicsRoutes;
