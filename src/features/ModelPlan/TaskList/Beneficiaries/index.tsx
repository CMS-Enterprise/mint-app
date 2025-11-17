import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import BeneficiaryIdentification from './BeneficiaryIdentification';
import Frequency from './Frequency';
import PeopleImpact from './PeopleImpact';

const Beneficiaries = () => {
  return <Outlet />;
};

const beneficiariesRoutes = {
  path: '/models/:modelID/collaboration-area/model-plan/beneficiaries',
  element: (
    <ProtectedRoute>
      <Beneficiaries />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <BeneficiaryIdentification />
    },
    {
      path: 'people-impact',
      element: <PeopleImpact />
    },
    {
      path: 'beneficiary-frequency',
      element: <Frequency />
    }
  ]
};

export default beneficiariesRoutes;
