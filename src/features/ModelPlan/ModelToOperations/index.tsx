import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
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
        <Routes>
          <Route
            path="/models/:modelID/collaboration-area/model-to-operations/matrix"
            element={ProtectedRoute({ element: <MTOHome /> })}
          />

          <Route
            path="/models/:modelID/collaboration-area/model-to-operations/milestone-library"
            element={ProtectedRoute({ element: <MilestoneLibrary /> })}
          />

          <Route
            path="/models/:modelID/collaboration-area/model-to-operations/solution-library"
            element={ProtectedRoute({ element: <SolutionLibrary /> })}
          />

          <Route
            path="/models/:modelID/collaboration-area/model-to-operations"
            element={
              <Navigate
                to="/models/:modelID/collaboration-area/model-to-operations/matrix"
                replace
              />
            }
          />

          <Route path="*" element={<NotFoundPartial />} />
        </Routes>
      </MTOModalProvider>
    </MainContent>
  );
};

export default ModelToOperations;
