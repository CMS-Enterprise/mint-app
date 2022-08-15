import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';

import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import { GetModelSummary_modelPlan as GetModelSummaryTypes } from 'queries/ReadOnly/types/GetModelSummary';
import { KeyCharacteristic, ModelStatus } from 'types/graphql-global-types';

import ReadOnly from './index';

const mockData: GetModelSummaryTypes = {
  __typename: 'ModelPlan',
  modelName: 'Testing Model Summary',
  modifiedDts: null,
  status: ModelStatus.PLAN_DRAFT,
  basics: {
    __typename: 'PlanBasics',
    goal: 'This is the goal',
    applicationsStart: null
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    keyCharacteristics: [KeyCharacteristic.EPISODE_BASED]
  },
  collaborators: [
    { __typename: 'PlanCollaborator', fullName: 'First Collaborator' }
  ]
};

const mock = [
  {
    request: {
      query: GetModelSummary,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          ...mockData
        }
      }
    }
  }
];

describe('Read Only Model Plan Summary', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/read-only'
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Route path="/models/:modelID/read-only">
            <ReadOnly />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('read-only-model-summary')).toBeInTheDocument();
    });

    await waitFor(() => {
      const { getByText } = within(
        screen.getByTestId('read-only-model-summary__description')
      );
      expect(getByText('This is the goal')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/read-only'
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Route path="/models/:modelID/read-only">
            <ReadOnly />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('read-only-model-summary')).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
