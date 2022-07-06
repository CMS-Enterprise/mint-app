import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import getPeopleImpacted from 'queries/Beneficiaries/getPeopleImpacted';
import { GetPeopleImpacted_modelPlan_beneficiaries as PeopleImpactType } from 'queries/Beneficiaries/types/GetPeopleImpacted';
import {
  ConfidenceType,
  SelectionMethodType
} from 'types/graphql-global-types';

import PeopleImpact from './index';

const mockData: PeopleImpactType = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  numberPeopleImpacted: 100,
  estimateConfidence: 'COMPLETELY' as ConfidenceType,
  confidenceNote: 'String',
  beneficiarySelectionNote: 'String',
  beneficiarySelectionOther: 'String',
  beneficiarySelectionMethod: ['HISTORICAL' as SelectionMethodType]
};

const beneficiaryMock = [
  {
    request: {
      query: getPeopleImpacted,
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/beneficiaries/people-impact'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/beneficiaries/people-impact">
            <PeopleImpact />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-people-impact-form')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/beneficiaries/people-impact'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/beneficiaries/people-impact">
            <PeopleImpact />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
