import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GainshareArrangementEligibility,
  GetCoordinationDocument,
  GetCoordinationQuery,
  ParticipantRequireFinancialGuaranteeType,
  ParticipantsIdType
} from 'gql/generated/graphql';
import { modelID, modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import Coordination from './index';

type GetCoordinationType =
  GetCoordinationQuery['modelPlan']['participantsAndProviders'];

const coordinationMockData: GetCoordinationType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  participantRequireFinancialGuarantee: true,
  participantRequireFinancialGuaranteeType: [
    ParticipantRequireFinancialGuaranteeType.ESCROW
  ],
  participantRequireFinancialGuaranteeOther:
    'participantRequireFinancialGuaranteeOther',
  participantRequireFinancialGuaranteeNote: '',
  coordinateWork: null,
  coordinateWorkNote: '',
  gainsharePayments: null,
  gainsharePaymentsTrack: null,
  gainsharePaymentsNote: '',
  gainsharePaymentsEligibility: [GainshareArrangementEligibility.OTHER],
  gainsharePaymentsEligibilityOther: 'Eligibility other',
  participantsIds: [ParticipantsIdType.OTHER],
  participantsIdsOther: 'Candy Kingdom Operations Number',
  participantsIDSNote: ''
};

const coordinationMock = [
  {
    request: {
      query: GetCoordinationDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          operationalNeeds: [
            {
              id: '780c990e-91f5-48a2-869a-59420940a533',
              modifiedDts: '2024-05-12T15:01:39.190679Z',
              __typename: 'OperationalNeed'
            }
          ],
          participantsAndProviders: coordinationMockData
        }
      }
    }
  },
  ...modelPlanBaseMock
];

describe('Model Plan Coordination', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/coordination',
          element: (
            <ModelInfoWrapper>
              <Coordination />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/coordination'
        ]
      }
    );

    render(
      <MockedProvider mocks={coordinationMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-coordination-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-participant-id-other')
      ).toHaveValue('Candy Kingdom Operations Number');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/coordination',
          element: (
            <ModelInfoWrapper>
              <Coordination />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/coordination'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={coordinationMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-participant-id-other')
      ).toHaveValue('Candy Kingdom Operations Number');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
