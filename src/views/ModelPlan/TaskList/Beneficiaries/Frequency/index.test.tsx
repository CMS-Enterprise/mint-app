import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import getFrequency from 'queries/Beneficiaries/getFrequency';
import { GetFrequency_modelPlan_beneficiaries as BeneficiaryFrequencyType } from 'queries/Beneficiaries/types/GetFrequency';
import { FrequencyType, OverlapType } from 'types/graphql-global-types';

import Frequency from './index';

const mockData: BeneficiaryFrequencyType = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  beneficiarySelectionFrequency: 'ANNUALLY' as FrequencyType,
  beneficiarySelectionFrequencyNote: '',
  beneficiarySelectionFrequencyOther: '',
  beneficiaryOverlap: 'YES_NO_ISSUES' as OverlapType,
  beneficiaryOverlapNote: '',
  precedenceRules: ''
};

const beneficiaryMock = [
  {
    request: {
      query: getFrequency,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          beneficiaries: mockData
        }
      }
    }
  }
];

describe('Model Plan Beneficiaries', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/beneficiaries/beneficiary-frequency'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/beneficiaries/beneficiary-frequency">
            <Frequency />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-frequency-form')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/beneficiaries/beneficiary-frequency'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/beneficiaries/beneficiary-frequency">
            <Frequency />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
