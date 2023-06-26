import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import { GetModelSummary_modelPlan as GetModelSummaryTypes } from 'queries/ReadOnly/types/GetModelSummary';
import {
  KeyCharacteristic,
  ModelStatus,
  TeamRole
} from 'types/graphql-global-types';
import ReadOnly from 'views/ModelPlan/ReadOnly';

const mockData: GetModelSummaryTypes = {
  __typename: 'ModelPlan',
  id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
  abbreviation: null,
  isFavorite: false,
  modelName: 'Testing Model Summary',
  modifiedDts: '2022-08-27T04:00:00Z',
  status: ModelStatus.PLAN_DRAFT,
  basics: {
    __typename: 'PlanBasics',
    goal: 'This is the goal',
    performancePeriodStarts: '2022-08-20T04:00:00Z'
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    keyCharacteristics: [KeyCharacteristic.EPISODE_BASED]
  },
  isCollaborator: true,

  collaborators: [
    {
      userAccount: {
        id: '890',
        __typename: 'UserAccount',
        email: '',
        username: 'MINT',
        commonName: 'First Collaborator'
      },
      teamRole: TeamRole.MODEL_LEAD,
      __typename: 'PlanCollaborator'
    }
  ],
  crTdls: [
    {
      __typename: 'PlanCrTdl',
      idNumber: 'TDL-123'
    }
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
          ...mockData
        }
      }
    }
  }
];

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('Read Only Filtered View Body Content', () => {
  it('renders without crashing', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/read-only/model-basics?filter-view=cmmi`
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <ReadOnly />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Model Team')).toBeInTheDocument();
    expect(screen.getByText('CMMI Cost Estimate')).toBeInTheDocument();

    expect(
      screen.getByTestId('read-only-model-plan--general-characteristics')
    ).toBeInTheDocument();
  });
});
