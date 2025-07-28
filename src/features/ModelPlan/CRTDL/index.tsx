import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from 'features/NotFound';

import MainContent from 'components/MainContent';

import CRTDLs from './CRTDLs';

const CRTDL = () => {
  return (
    <MainContent className="grid-container" data-testid="model-crtdl">
      <Routes>
        {/* Model Plan CRTDL Pages */}
        <Route
          path="/models/:modelID/collaboration-area/cr-and-tdl"
          element={<CRTDLs />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainContent>
  );
};

export default CRTDL;
