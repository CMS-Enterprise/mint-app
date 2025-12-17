import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetParticipantOptionsDocument,
  GetParticipantOptionsQuery
} from 'gql/generated/graphql';
import { modelID, modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import ParticipantOptions from './index';

type GetParticipantOptionsType =
  GetParticipantOptionsQuery['modelPlan']['participantsAndProviders'];

const participantOptionsMockData: GetParticipantOptionsType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  expectedNumberOfParticipants: 350,
  estimateConfidence: null,
  confidenceNote: '',
  recruitmentMethod: null,
  recruitmentOther: '',
  recruitmentNote: '',
  selectionMethod: [],
  selectionOther: '',
  selectionNote: ''
};

const participantOptionsMock = [
  {
    request: {
      query: GetParticipantOptionsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: participantOptionsMockData,
          operationalNeeds: [
            {
              __typename: 'OperationalNeed',
              id: '424213',
              modifiedDts: null
            }
          ]
        }
      }
    }
  },
  ...modelPlanBaseMock
];

describe('Model Plan ParticipantsOptions', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/participants-options',
          element: (
            <ModelInfoWrapper>
              <ParticipantOptions />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/participants-options'
        ]
      }
    );

    render(
      <MockedProvider mocks={participantOptionsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-options-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-expected-participants')
      ).toHaveValue('350');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/participants-options',
          element: (
            <ModelInfoWrapper>
              <ParticipantOptions />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/participants-options'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={participantOptionsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-expected-participants')
      ).toHaveValue('350');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
