import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import CCWAndQuality from './CCWAndQuality';
import DataSharing from './DataSharing';
import Evaluation from './Evaluation';
import IDDOC from './IDDOC';
import IDDOCMonitoring from './IDDOCMonitoring';
import IDDOCTesting from './IDDOCTesting';
import Learning from './Learning';
import Performance from './Performance';
import Support from './Support';

const OpsEvalAndLearning = () => {
  return <Outlet />;
};

const opsEvalAndLearningRoutes = {
  path: '/models/:modelID/collaboration-area/model-plan/ops-eval-and-learning',
  element: (
    <ProtectedRoute>
      <OpsEvalAndLearning />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <Support />
    },
    {
      path: 'iddoc',
      element: <IDDOC />
    },
    {
      path: 'iddoc-testing',
      element: <IDDOCTesting />
    },
    {
      path: 'iddoc-monitoring',
      element: <IDDOCMonitoring />
    },
    {
      path: 'performance',
      element: <Performance />
    },
    {
      path: 'evaluation',
      element: <Evaluation />
    },
    {
      path: 'ccw-and-quality',
      element: <CCWAndQuality />
    },
    {
      path: 'data-sharing',
      element: <DataSharing />
    },
    {
      path: 'learning',
      element: <Learning />
    }
  ]
};

export default opsEvalAndLearningRoutes;
