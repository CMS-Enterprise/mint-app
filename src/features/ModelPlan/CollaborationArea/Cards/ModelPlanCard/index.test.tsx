import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import {
  GetModelPlanDocument,
  GetModelPlanQuery,
  ModelPhase,
  ModelStatus,
  PrepareForClearanceStatus,
  TaskStatus
} from 'gql/generated/graphql';
import VerboseMockedProvider from 'tests/MockedProvider';
import setup from 'tests/util';

import ModelPlanCard, { getLastModifiedSection } from './index';

const modelID: string = 'f11eb129-2c80-4080-9440-439cbe1a286f';
type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];

const modelPlan = {
  __typename: 'ModelPlan',
  isFavorite: true,
  id: '6e224030-09d5-46f7-ad04-4bb851b36eab',
  status: ModelStatus.PLAN_DRAFT,
  taskListStatus: TaskStatus.IN_PROGRESS,
  modelName: 'Test',
  opSolutionLastModifiedDts: '2022-05-12T15:01:39.190679Z',
  modifiedDts: '2022-05-12T15:01:39.190679Z',
  modifiedByUserAccount: {
    __typename: 'UserAccount',
    commonName: 'John Doe'
  },
  archived: false,
  suggestedPhase: {
    __typename: 'PhaseSuggestion',
    phase: ModelPhase.ICIP_COMPLETE,
    suggestedStatuses: [ModelStatus.ICIP_COMPLETE]
  },
  basics: {
    __typename: 'PlanBasics',
    id: '123',
    modifiedDts: null,
    clearanceStarts: '2022-05-12T15:01:39.190679Z',
    readyForClearanceDts: '2022-05-12T15:01:39.190679Z',
    status: TaskStatus.READY
  },
  opsEvalAndLearning: {
    __typename: 'PlanOpsEvalAndLearning',
    id: '7865676',
    createdBy: 'John Doe',
    createdDts: '',
    modifiedBy: '',
    modifiedDts: '',
    readyForClearanceDts: '',
    status: TaskStatus.IN_PROGRESS
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    id: '54234',
    createdBy: 'John Doe',
    createdDts: '',
    modifiedBy: '',
    modifiedDts: '',
    readyForClearanceDts: '',
    status: TaskStatus.IN_PROGRESS
  },
  participantsAndProviders: {
    __typename: 'PlanParticipantsAndProviders',
    id: '46246356',
    createdBy: 'John Doe',
    createdDts: '',
    modifiedBy: '',
    modifiedDts: '',
    readyForClearanceDts: '',
    status: TaskStatus.IN_PROGRESS
  },
  beneficiaries: {
    __typename: 'PlanBeneficiaries',
    id: '09865643',
    createdBy: 'John Doe',
    createdDts: '',
    modifiedBy: '',
    modifiedDts: '',
    readyForClearanceDts: '',
    status: TaskStatus.IN_PROGRESS
  },
  prepareForClearance: {
    __typename: 'PrepareForClearance',
    status: PrepareForClearanceStatus.IN_PROGRESS,
    modifiedDts: ''
  },
  payments: {
    __typename: 'PlanPayments',
    id: '8756435235',
    createdBy: 'John Doe',
    createdDts: '',
    modifiedBy: '',
    modifiedDts: '',
    readyForClearanceDts: '',
    status: TaskStatus.IN_PROGRESS
  },
  crs: [],
  tdls: [],
  echimpCRsAndTDLs: [],
  operationalNeeds: [] as any,
  documents: [
    {
      __typename: 'PlanDocument',
      id: '6e224030-09d5-46f7-ad04-4bb851b36eab',
      fileName: 'test.pdf',
      fileType: 'application/pdf'
    }
  ],
  collaborators: [],
  discussions: [
    {
      __typename: 'PlanDiscussion',
      id: '123',
      content: {
        __typename: 'TaggedContent',
        rawContent: 'This is a question.'
      },
      createdBy: 'John Doe',
      createdDts: '2022-05-12T15:01:39.190679Z',
      replies: []
    },
    {
      __typename: 'PlanDiscussion',
      id: '456',
      content: {
        __typename: 'TaggedHTML',
        rawContent: 'This is a second question.'
      },
      createdBy: 'Jane Doe',
      createdDts: '2022-05-12T15:01:39.190679Z',
      replies: [
        {
          __typename: 'DiscussionReply',
          discussionID: '456',
          id: 'abc',
          content: {
            __typename: 'TaggedHTML',
            rawContent: 'This is an answer.'
          },
          createdBy: 'Jack Doe',
          createdDts: '2022-05-12T15:01:39.190679Z'
        }
      ]
    }
  ]
} as GetModelPlanTypes;

const modelPlanMocks = [
  {
    request: {
      query: GetModelPlanDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan
      }
    }
  }
];

describe('ModelPlanCard', () => {
  it('renders without issues', async () => {
    const { getByText } = setup(
      <MemoryRouter initialEntries={[`/models/${modelID}/collaboration-area`]}>
        <VerboseMockedProvider mocks={modelPlanMocks} addTypename={false}>
          <ModelPlanCard modelID={modelID} setStatusMessage={() => null} />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Model Plan')).toBeInTheDocument();
    });
  });

  it('returns null if no section of task list is started', () => {
    const result = getLastModifiedSection(modelPlan);
    expect(result).toBeUndefined();
  });

  it('returns most recent task list section', () => {
    const startedModelPlan = { ...modelPlan };

    startedModelPlan.beneficiaries.modifiedDts = '2021-05-12T15:01:39.190679Z';
    startedModelPlan.beneficiaries.modifiedByUserAccount = {
      __typename: 'UserAccount',
      commonName: 'Jane Doe'
    };

    startedModelPlan.generalCharacteristics.modifiedDts =
      '2022-05-12T15:01:39.190679Z';
    startedModelPlan.generalCharacteristics.modifiedByUserAccount = {
      __typename: 'UserAccount',
      commonName: 'John Doe'
    };

    const result = getLastModifiedSection(startedModelPlan);
    expect(result).toEqual(startedModelPlan.generalCharacteristics);
  });

  it('matches the snapshot', async () => {
    const { getByText, queryByText, asFragment } = setup(
      <MemoryRouter initialEntries={[`/models/${modelID}/collaboration-area`]}>
        <VerboseMockedProvider mocks={modelPlanMocks} addTypename={false}>
          <ModelPlanCard modelID={modelID} setStatusMessage={() => null} />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Model Plan')).toBeInTheDocument();
      expect(
        queryByText('Most recent edit on 05/12/2022 by')
      ).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
