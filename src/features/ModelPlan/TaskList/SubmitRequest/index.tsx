import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound, { NotFoundPartial } from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

export const SubmitRequest = () => {
  return (
    <MainContent className="grid-container" data-testid="model-submit-request">
      <Routes>
        <Route
          path="/models/:modelID/collaboration-area/task-list/submit-request/page-1" // page-* may change pending UX clarifcation
          element={<ProtectedRoute element={<NotFound />} />}
        />
        <Route path="*" element={<NotFoundPartial />} />
      </Routes>
    </MainContent>
  );
};

export default SubmitRequest;
