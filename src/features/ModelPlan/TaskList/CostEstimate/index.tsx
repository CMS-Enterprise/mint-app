import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound, { NotFoundPartial } from 'features/NotFound';

import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';

export const CostEstimate = () => {
  return (
    <MainContent className="grid-container" data-testid="model-cost-estimate">
      <Routes>
        <Route
          path="page-1"
          element={ProtectedRoute({ element: <NotFound /> })}
        />
        <Route path="" element={<NotFound />} />
        <Route path="*" element={<NotFoundPartial />} />
      </Routes>
    </MainContent>
  );
};

export default CostEstimate;
