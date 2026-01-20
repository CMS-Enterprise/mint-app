import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  FrequencyType,
  GetProviderOptionsDocument,
  GetProviderOptionsQuery,
  GetProviderOptionsQueryVariables,
  ProviderAddType,
  TaskStatus
} from 'gql/generated/graphql';
import { modelPlanBaseMockData } from 'tests/mock/general';

import { ModelInfoContext } from 'contexts/ModelInfoContext';

import ProviderOptions from './index';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

type GetProviderOptionsType =
  GetProviderOptionsQuery['modelPlan']['participantsAndProviders'];

const providerOptionsMockData: GetProviderOptionsType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  providerAdditionFrequency: [FrequencyType.CONTINUALLY],
  providerAdditionFrequencyContinually: 'Continually',
  providerAdditionFrequencyOther: '',
  providerAdditionFrequencyNote: '',
  providerAddMethod: [ProviderAddType.OTHER],
  providerAddMethodOther: 'Competitive ball-room dancing, free for all',
  providerAddMethodNote: '',
  providerLeaveMethod: [],
  providerLeaveMethodOther: '',
  providerLeaveMethodNote: '',
  providerRemovalFrequency: [FrequencyType.CONTINUALLY],
  providerRemovalFrequencyContinually: 'Continually',
  providerRemovalFrequencyOther: '',
  providerRemovalFrequencyNote: 'removal note',
  providerOverlap: null,
  providerOverlapHierarchy: '',
  providerOverlapNote: '',
  readyForReviewByUserAccount: {
    commonName: 'ASDF',
    id: '000',
    __typename: 'UserAccount'
  },
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const providerOptionsMock: MockedResponse<
  GetProviderOptionsQuery,
  GetProviderOptionsQueryVariables
>[] = [
  {
    request: {
      query: GetProviderOptionsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: providerOptionsMockData
        }
      }
    }
  }
];

describe('Model Plan ProviderOptions', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/provider-options',
          element: (
            <ModelInfoContext.Provider value={modelPlanBaseMockData}>
              <ProviderOptions />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/provider-options'
        ]
      }
    );

    render(
      <MockedProvider mocks={providerOptionsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-providers-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'participants-and-providers-provider-add-method-other'
        )
      ).toHaveValue('Competitive ball-room dancing, free for all');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/provider-options',
          element: (
            <ModelInfoContext.Provider value={modelPlanBaseMockData}>
              <ProviderOptions />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/provider-options'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={providerOptionsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-removal-frequency-note')
      ).toHaveValue('removal note');
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'participants-and-providers-provider-add-method-other'
        )
      ).toHaveValue('Competitive ball-room dancing, free for all');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
