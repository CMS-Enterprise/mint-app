import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import { GetModelSummary_modelPlan as GetModelSummaryTypes } from 'queries/ReadOnly/types/GetModelSummary';
import {
  KeyCharacteristic,
  ModelStatus,
  TeamRole
} from 'types/graphql-global-types';

import BodyContent from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mockData: GetModelSummaryTypes = {
  __typename: 'ModelPlan',
  id: modelID,
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
      variables: { id: 'modelID' }
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
          `/models/${modelID}/read-only/model-basics?filter-view=oact`
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <BodyContent modelID={modelID} filteredView="oact" />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Model Team')).toBeInTheDocument();
    expect(screen.getByTestId('alert')).toBeInTheDocument();

    expect(
      screen.getByTestId('read-only-model-plan--general-characteristics')
    ).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/model-basics?filter-view=oact`
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <BodyContent modelID={modelID} filteredView="oact" />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Model Team')).toBeInTheDocument();
      expect(screen.getByTestId('alert')).toBeInTheDocument();

      expect(
        screen.getByTestId('read-only-model-plan--general-characteristics')
      ).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
