import React from 'react';
import { Outlet } from 'react-router-dom';
import NotFound from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

import CRTDLs from './CRTDLs';

const CRTDL = () => {
  return (
    <MainContent className="grid-container" data-testid="model-crtdl">
      <Outlet />
    </MainContent>
  );
};

export const crtdlRoutes = {
  path: '/models/:modelID/collaboration-area/cr-and-tdl',
  element: (
    <ProtectedRoute>
      <CRTDL />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/models/:modelID/collaboration-area/cr-and-tdl',
      element: <CRTDLs />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default CRTDL;
