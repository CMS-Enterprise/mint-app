import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetAllOpsEvalAndLearning from 'queries/ReadOnly/GettAllOpsEvalAndLearning';
import { GetAllOpsEvalAndLearning_modelPlan_opsEvalAndLearning as AllOpsEvalAndLearningTypes } from 'queries/ReadOnly/types/GetAllOpsEvalAndLearning';
import {
  AgencyOrStateHelpType,
  CcmInvolvmentType,
  ContractorSupportType,
  DataForMonitoringType,
  DataFrequencyType,
  DataToSendParticipantsType,
  EvaluationApproachType,
  ModelLearningSystemType,
  MonitoringFileType,
  StakeholdersType,
  TaskStatus
} from 'types/graphql-global-types';
import { translateDataToSendParticipantsType } from 'utils/modelPlan';

import ReadOnlyOpsEvalAndLearning from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mockData: AllOpsEvalAndLearningTypes = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  modelPlanID: modelID,
  status: TaskStatus.IN_PROGRESS,
  agencyOrStateHelp: [
    AgencyOrStateHelpType.YES_STATE,
    AgencyOrStateHelpType.OTHER
  ],
  agencyOrStateHelpOther: null,
  agencyOrStateHelpNote: null,
  stakeholders: [
    StakeholdersType.BENEFICIARIES,
    StakeholdersType.PARTICIPANTS,
    StakeholdersType.PROVIDERS
  ],
  stakeholdersOther: null,
  stakeholdersNote: null,
  helpdeskUse: null,
  helpdeskUseNote: null,
  contractorSupport: [
    ContractorSupportType.MULTIPLE,
    ContractorSupportType.OTHER
  ],
  contractorSupportOther: null,
  contractorSupportHow: null,
  contractorSupportNote: null,
  iddocSupport: null,
  iddocSupportNote: null,
  technicalContactsIdentified: null,
  technicalContactsIdentifiedDetail: null,
  technicalContactsIdentifiedNote: null,
  captureParticipantInfo: null,
  captureParticipantInfoNote: null,
  icdOwner: null,
  draftIcdDueDate: null,
  icdNote: null,
  uatNeeds: null,
  stcNeeds: null,
  testingTimelines: null,
  testingNote: null,
  dataMonitoringFileTypes: [
    MonitoringFileType.PART_A,
    MonitoringFileType.PART_B
  ],
  dataMonitoringFileOther: null,
  dataResponseType: null,
  dataResponseFileFrequency: null,
  dataFullTimeOrIncremental: null,
  eftSetUp: null,
  unsolicitedAdjustmentsIncluded: null,
  dataFlowDiagramsNeeded: null,
  produceBenefitEnhancementFiles: null,
  fileNamingConventions: null,
  dataMonitoringNote: null,
  benchmarkForPerformance: null,
  benchmarkForPerformanceNote: null,
  computePerformanceScores: null,
  computePerformanceScoresNote: null,
  riskAdjustPerformance: null,
  riskAdjustFeedback: null,
  riskAdjustPayments: null,
  riskAdjustOther: null,
  riskAdjustNote: null,
  appealPerformance: null,
  appealFeedback: null,
  appealPayments: null,
  appealOther: null,
  appealNote: null,
  evaluationApproaches: [
    EvaluationApproachType.INTERRUPTED_TIME,
    EvaluationApproachType.OTHER
  ],
  evaluationApproachOther: null,
  evalutaionApproachNote: null,
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION, CcmInvolvmentType.OTHER],
  ccmInvolvmentOther: null,
  ccmInvolvmentNote: null,
  dataNeededForMonitoring: [
    DataForMonitoringType.CLINICAL_DATA,
    DataForMonitoringType.MEDICARE_CLAIMS,
    DataForMonitoringType.OTHER
  ],
  dataNeededForMonitoringOther: null,
  dataNeededForMonitoringNote: null,
  dataToSendParticicipants: [
    DataToSendParticipantsType.BASELINE_HISTORICAL_DATA,
    DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA,
    DataToSendParticipantsType.OTHER_MIPS_DATA
  ],
  dataToSendParticicipantsOther: null,
  dataToSendParticicipantsNote: null,
  shareCclfData: null,
  shareCclfDataNote: null,
  sendFilesBetweenCcw: null,
  sendFilesBetweenCcwNote: null,
  appToSendFilesToKnown: null,
  appToSendFilesToWhich: null,
  appToSendFilesToNote: null,
  useCcwForFileDistribiutionToParticipants: null,
  useCcwForFileDistribiutionToParticipantsNote: null,
  developNewQualityMeasures: null,
  developNewQualityMeasuresNote: null,
  qualityPerformanceImpactsPayment: null,
  qualityPerformanceImpactsPaymentNote: null,
  dataSharingStarts: null,
  dataSharingStartsOther: null,
  dataSharingFrequency: [DataFrequencyType.DAILY],
  dataSharingFrequencyOther: null,
  dataSharingStartsNote: null,
  dataCollectionStarts: null,
  dataCollectionStartsOther: null,
  dataCollectionFrequency: [DataFrequencyType.MONTHLY],
  dataCollectionFrequencyOther: null,
  dataCollectionFrequencyNote: null,
  qualityReportingStarts: null,
  qualityReportingStartsOther: null,
  qualityReportingStartsNote: null,
  modelLearningSystems: [
    ModelLearningSystemType.IT_PLATFORM_CONNECT,
    ModelLearningSystemType.NO_LEARNING_SYSTEM,
    ModelLearningSystemType.OTHER
  ],
  modelLearningSystemsOther: null,
  modelLearningSystemsNote: null,
  anticipatedChallenges: null
};

const mocks = [
  {
    request: {
      query: GetAllOpsEvalAndLearning,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          opsEvalAndLearning: mockData
        }
      }
    }
  }
];

describe('Read Only Model Plan Summary -- Operations, Evaluation, and Learning', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/operations-evaluation-and-learning`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/operations-evaluation-and-learning">
            <ReadOnlyOpsEvalAndLearning modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          translateDataToSendParticipantsType(
            DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA
          )
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/operations-evaluation-and-learning`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/operations-evaluation-and-learning">
            <ReadOnlyOpsEvalAndLearning modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          translateDataToSendParticipantsType(
            DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA
          )
        )
      ).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
