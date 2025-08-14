import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import MainContent from 'components/MainContent';
import protectedRoute from 'components/ProtectedRoute';
import { MTOModalProvider } from 'contexts/MTOModalContext';

import MTOModal from './_components/FormModal';
import MTOHome from './Home';
import MilestoneLibrary from './MilestoneLibrary';
import SolutionLibrary from './SolutionLibrary';

import './index.scss';

const ModelToOperations = () => {
  return (
    <MainContent className="mint-body-normal" data-testid="model-to-operations">
      <MTOModalProvider>
        <MTOModal />
        <Outlet />
      </MTOModalProvider>
    </MainContent>
  );
};

const MTORedirect = () => {
  const { modelID } = useParams();
  return (
    <Navigate
      to={`/models/${modelID}/collaboration-area/model-to-operations/matrix`}
      replace
    />
  );
};

export const modelToOperationsRoutes = {
  path: '/models/:modelID/collaboration-area/model-to-operations',
  element: protectedRoute(<ModelToOperations />),
  children: [
    {
      path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
      element: <MTOHome />
    },
    {
      path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
      element: <MilestoneLibrary />
    },
    {
      path: '/models/:modelID/collaboration-area/model-to-operations/solution-library',
      element: <SolutionLibrary />
    },
    {
      path: '/models/:modelID/collaboration-area/model-to-operations',
      element: <MTORedirect />
    }
  ]
};

export default ModelToOperations;
