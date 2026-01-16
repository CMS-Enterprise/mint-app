import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  FrequencyType,
  GetCommunicationDocument,
  GetCommunicationQuery,
  GetCommunicationQueryVariables,
  ModelStatus,
  ParticipantRiskType
} from 'gql/generated/graphql';
import { modelID, modelPlanBaseMock } from 'tests/mock/general';

import { ModelInfoContext } from 'contexts/ModelInfoContext';

import Communication from './index';

type GetCommunicationType =
  GetCommunicationQuery['modelPlan']['participantsAndProviders'];

const communicationMockData: GetCommunicationType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  participantAddedFrequency: [FrequencyType.CONTINUALLY],
  participantAddedFrequencyContinually: 'participant added continually',
  participantAddedFrequencyOther: '',
  participantAddedFrequencyNote: 'My note',
  participantRemovedFrequency: [FrequencyType.OTHER],
  participantRemovedFrequencyContinually: '',
  participantRemovedFrequencyOther: 'participant added other',
  participantRemovedFrequencyNote: 'Second note',
  communicationMethod: [],
  communicationMethodOther: '',
  communicationNote: '',
  riskType: [ParticipantRiskType.OTHER],
  riskOther: 'Programmatic Risk',
  riskNote: '',
  willRiskChange: null,
  willRiskChangeNote: ''
};

const communicationMock: MockedResponse<
  GetCommunicationQuery,
  GetCommunicationQueryVariables
>[] = [
  {
    request: {
      query: GetCommunicationDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
          ...modelPlanBaseMock,
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: communicationMockData
        }
      }
    }
  }
];

describe('Model Plan Communication', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/communication',
          element: (
            <ModelInfoContext.Provider
              value={{
                __typename: 'ModelPlan',
                id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
                modelName: 'My excellent plan that I just initiated',
                abbreviation: '',
                modifiedDts: '',
                createdDts: '2024-01-01T00:00:00Z',
                status: ModelStatus.PLAN_DRAFT,
                isMTOStarted: false
              }}
            >
              <Communication />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/communication'
        ]
      }
    );

    render(
      <MockedProvider mocks={communicationMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-communication-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-risk-type-other')
      ).toHaveValue('Programmatic Risk');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/communication',
          element: (
            <ModelInfoContext.Provider
              value={{
                __typename: 'ModelPlan',
                id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
                modelName: 'My excellent plan that I just initiated',
                abbreviation: '',
                modifiedDts: '',
                createdDts: '2024-01-01T00:00:00Z',
                status: ModelStatus.PLAN_DRAFT,
                isMTOStarted: false
              }}
            >
              <Communication />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/communication'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={communicationMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participant-removed-frequency-note')
      ).toHaveValue('Second note');
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-risk-type-other')
      ).toHaveValue('Programmatic Risk');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
