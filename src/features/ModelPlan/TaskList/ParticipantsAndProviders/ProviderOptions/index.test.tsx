import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  FrequencyType,
  GetProviderOptionsDocument,
  GetProviderOptionsQuery,
  ProviderAddType,
  TaskStatus
} from 'gql/generated/graphql';

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

const providerOptionsMock = [
  {
    request: {
      query: GetProviderOptionsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
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
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/provider-options'
        ]}
      >
        <MockedProvider mocks={providerOptionsMock} addTypename={false}>
          <Routes>
          <Route
            path="/models/:modelID/collaboration-area/task-list/participants-and-providers/provider-options"
            element={<ProviderOptions  />}
          />
        </Routes>
        </MockedProvider>
      </MemoryRouter>
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
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/provider-options'
        ]}
      >
        <MockedProvider mocks={providerOptionsMock} addTypename={false}>
          <Routes>
          <Route
            path="/models/:modelID/collaboration-area/task-list/participants-and-providers/provider-options"
            element={<ProviderOptions  />}
          />
        </Routes>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() =>
      screen.getByTestId(
        'participants-and-providers-removal-frequency-note-add-note-toggle'
      )
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
