import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetAllParticipants from 'queries/ReadOnly/GetAllParticipants';
import { GetAllParticipants_modelPlan_participantsAndProviders as GetAllParticipantsTypes } from 'queries/ReadOnly/types/GetAllParticipants';
import {
  ConfidenceType,
  FrequencyType,
  OverlapType,
  ParticipantCommunicationType,
  ParticipantSelectionType,
  ParticipantsIDType,
  ParticipantsType,
  ProviderAddType,
  ProviderLeaveType,
  RecruitmentType,
  TaskStatus
} from 'types/graphql-global-types';

import ReadOnlyParticipantsAndProviders from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mockData: GetAllParticipantsTypes = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  participants: [
    ParticipantsType.MEDICAID_PROVIDERS,
    ParticipantsType.STATES,
    ParticipantsType.STATE_MEDICAID_AGENCIES,
    ParticipantsType.OTHER
  ],
  medicareProviderType: null,
  statesEngagement: 'State',
  participantsOther: 'This is the other',
  participantsNote: null,
  participantsCurrentlyInModels: true,
  participantsCurrentlyInModelsNote: null,
  modelApplicationLevel: 'ojnjklnmjknjkn',
  expectedNumberOfParticipants: 0,
  estimateConfidence: ConfidenceType.FAIRLY,
  confidenceNote: null,
  recruitmentMethod: RecruitmentType.NA,
  recruitmentOther: null,
  recruitmentNote: null,
  selectionMethod: [
    ParticipantSelectionType.APPLICATION_REVIEW_AND_SCORING_TOOL,
    ParticipantSelectionType.CMS_COMPONENT_OR_PROCESS
  ],
  selectionOther: null,
  selectionNote: null,
  communicationMethod: [
    ParticipantCommunicationType.IT_TOOL,
    ParticipantCommunicationType.MASS_EMAIL
  ],
  communicationMethodOther: null,
  communicationNote: null,
  participantAssumeRisk: null,
  riskType: null,
  riskOther: null,
  riskNote: null,
  willRiskChange: null,
  willRiskChangeNote: null,
  coordinateWork: null,
  coordinateWorkNote: null,
  gainsharePayments: null,
  gainsharePaymentsTrack: null,
  gainsharePaymentsNote: null,
  participantsIds: [ParticipantsIDType.CCNS],
  participantsIdsOther: null,
  participantsIDSNote: null,
  providerAdditionFrequency: FrequencyType.BIANNUALLY,
  providerAdditionFrequencyOther: null,
  providerAdditionFrequencyNote: null,
  providerAddMethod: [ProviderAddType.RETROSPECTIVELY],
  providerAddMethodOther: null,
  providerAddMethodNote: null,
  providerLeaveMethod: [ProviderLeaveType.NOT_APPLICABLE],
  providerLeaveMethodOther: null,
  providerLeaveMethodNote: null,
  providerOverlap: OverlapType.NO,
  providerOverlapHierarchy: null,
  providerOverlapNote: null,
  status: TaskStatus.IN_PROGRESS
};

const mocks = [
  {
    request: {
      query: GetAllParticipants,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          participantsAndProviders: mockData
        }
      }
    }
  }
];

describe('Read Only Model Plan Summary -- Participants And Providers', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/participants-and-providers`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/participants-and-providers">
            <ReadOnlyParticipantsAndProviders modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(screen.getByText('Medicaid providers')).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/participants-and-providers`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/participants-and-providers">
            <ReadOnlyParticipantsAndProviders modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(screen.getByText('Medicaid providers')).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
