import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  DataForMonitoringType,
  GetCcwAndQualityDocument,
  GetCcwAndQualityQuery,
  YesNoOtherType
} from 'gql/generated/graphql';

import CCWAndQuality from '.';

type GetCCWAndQualityType =
  GetCcwAndQualityQuery['modelPlan']['opsEvalAndLearning'];

const ccwAndQualityMockData: GetCCWAndQualityType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [
    DataForMonitoringType.QUALITY_CLAIMS_BASED_MEASURES
  ],
  iddocSupport: true,
  sendFilesBetweenCcw: null,
  sendFilesBetweenCcwNote: '',
  appToSendFilesToKnown: null,
  appToSendFilesToWhich: '',
  appToSendFilesToNote: '',
  useCcwForFileDistribiutionToParticipants: null,
  useCcwForFileDistribiutionToParticipantsNote: '',
  developNewQualityMeasures: null,
  developNewQualityMeasuresNote: '',
  qualityPerformanceImpactsPayment: YesNoOtherType.YES,
  qualityPerformanceImpactsPaymentOther: 't',
  qualityPerformanceImpactsPaymentNote: ''
};

const ccwAndQualityMock = [
  {
    request: {
      query: GetCcwAndQualityDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          operationalNeeds: [
            {
              id: '780c990e-91f5-48a2-869a-59420940a533',
              modifiedDts: '2024-05-12T15:01:39.190679Z',
              __typename: 'OperationalNeed'
            }
          ],
          opsEvalAndLearning: ccwAndQualityMockData
        }
      }
    }
  }
];

describe('Model Plan Ops Eval and Learning CCW and Qualtiy', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/ccw-and-quality'
        ]}
      >
        <MockedProvider mocks={ccwAndQualityMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/ccw-and-quality">
            <CCWAndQuality />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-ccw-and-quality-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-performance-impact-YES')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/ccw-and-quality'
        ]}
      >
        <MockedProvider mocks={ccwAndQualityMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/ccw-and-quality">
            <CCWAndQuality />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-performance-impact-YES')
      ).toBeChecked();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
