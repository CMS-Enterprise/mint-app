import { MockedResponse } from '@apollo/client/testing';
import {
  DataExchangeApproachStatus,
  GetAnalyticsSummaryDocument,
  GetAnalyticsSummaryQuery,
  GetAnalyticsSummaryQueryVariables,
  GetCollaborationAreaDocument,
  GetCollaborationAreaQuery,
  GetCollaborationAreaQueryVariables,
  GetEchimpCrandTdlDocument,
  GetEchimpCrandTdlQuery,
  GetEchimpCrandTdlQueryVariables,
  GetFavoritesDocument,
  GetFavoritesQuery,
  GetFavoritesQueryVariables,
  GetModelPlansDocument,
  GetModelPlansQuery,
  GetModelPlansQueryVariables,
  ModelCategory,
  ModelPhase,
  ModelPlanFilter,
  ModelStatus,
  MtoStatus,
  TaskStatus
} from 'gql/generated/graphql';

type GetFavoritesType = GetFavoritesQuery['modelPlanCollection'];
type GetModelPlansType = GetModelPlansQuery['modelPlanCollection'];
export type EchimpCrAndTdlsType =
  GetEchimpCrandTdlQuery['modelPlan']['echimpCRsAndTDLs'][0];

export const modelID: string = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const modelPlanData: GetModelPlansType = [
  {
    __typename: 'ModelPlan',
    id: modelID,
    modelName: 'My plan',
    status: ModelStatus.PLAN_DRAFT,
    abbreviation: 'MP',
    nameHistory: [],
    createdBy: '',
    createdDts: '',
    modifiedDts: '',
    isFavorite: false,
    isCollaborator: true,
    basics: {
      id: '123',
      demoCode: '',
      amsModelID: '',
      modelCategory: ModelCategory.ACCOUNTABLE_CARE,
      additionalModelCategories: [],
      __typename: 'PlanBasics'
    },
    timeline: {
      id: '789',
      clearanceStarts: '',
      performancePeriodStarts: '',
      applicationsStart: '',
      __typename: 'PlanTimeline'
    },
    generalCharacteristics: {
      id: '456',
      keyCharacteristics: [],
      __typename: 'PlanGeneralCharacteristics'
    },
    payments: {
      id: '111',
      paymentStartDate: '',
      __typename: 'PlanPayments'
    },
    collaborators: [],
    discussions: [],
    echimpCRsAndTDLs: [
      {
        id: '123',
        __typename: 'EChimpCR'
      },
      {
        id: '456',
        __typename: 'EChimpTDL'
      }
    ],
    mostRecentEdit: {
      __typename: 'TranslatedAudit',
      id: '64252',
      date: '2022-08-23T04:00:00Z'
    }
  }
];

export const modelPlanCollectionMock = (
  filter: ModelPlanFilter,
  isMAC: boolean = false
): MockedResponse<GetModelPlansQuery, GetModelPlansQueryVariables>[] => {
  return [
    {
      request: {
        query: GetModelPlansDocument,
        variables: { filter, isMAC }
      },
      result: {
        data: {
          __typename: 'Query',
          modelPlanCollection: modelPlanData
        }
      }
    }
  ];
};

export const collaborationAreaData: GetCollaborationAreaQuery['modelPlan'] = {
  __typename: 'ModelPlan',
  isFavorite: true,
  id: '6e224030-09d5-46f7-ad04-4bb851b36eab',
  status: ModelStatus.PLAN_DRAFT,
  taskListStatus: TaskStatus.IN_PROGRESS,
  modelName: 'Test',
  opSolutionLastModifiedDts: '2022-05-12T15:01:39.190679Z',
  createdDts: '2022-05-12T15:01:39.190679Z',
  mostRecentEdit: {
    __typename: 'TranslatedAudit',
    id: '123',
    date: '2022-05-12T15:01:39.190679Z'
  },
  suggestedPhase: {
    __typename: 'PhaseSuggestion',
    phase: ModelPhase.ICIP_COMPLETE,
    suggestedStatuses: [ModelStatus.ICIP_COMPLETE]
  },
  basics: {
    __typename: 'PlanBasics',
    id: '123',
    modifiedDts: null,
    status: TaskStatus.READY,
    modifiedByUserAccount: {
      __typename: 'UserAccount',
      commonName: 'John Doe'
    }
  },
  opsEvalAndLearning: {
    __typename: 'PlanOpsEvalAndLearning',
    id: '7865676',
    modifiedDts: '',
    status: TaskStatus.IN_PROGRESS,
    modifiedByUserAccount: {
      __typename: 'UserAccount',
      commonName: 'John Doe'
    }
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    id: '54234',
    modifiedDts: '',
    status: TaskStatus.IN_PROGRESS,
    modifiedByUserAccount: {
      __typename: 'UserAccount',
      commonName: 'John Doe'
    }
  },
  participantsAndProviders: {
    __typename: 'PlanParticipantsAndProviders',
    id: '46246356',
    modifiedDts: '',
    status: TaskStatus.IN_PROGRESS,
    modifiedByUserAccount: {
      __typename: 'UserAccount',
      commonName: 'John Doe'
    }
  },
  beneficiaries: {
    __typename: 'PlanBeneficiaries',
    id: '09865643',
    modifiedDts: '',
    status: TaskStatus.IN_PROGRESS,
    modifiedByUserAccount: {
      __typename: 'UserAccount',
      commonName: 'John Doe'
    }
  },
  payments: {
    __typename: 'PlanPayments',
    id: '8756435235',
    modifiedDts: '',
    status: TaskStatus.IN_PROGRESS,
    modifiedByUserAccount: {
      __typename: 'UserAccount',
      commonName: 'John Doe'
    }
  },
  echimpCRsAndTDLs: [],
  mtoMatrix: {
    __typename: 'ModelsToOperationMatrix',
    status: MtoStatus.IN_PROGRESS,
    recentEdit: null,
    info: {
      __typename: 'MTOInfo',
      id: '123'
    },
    milestones: []
  },
  dataExchangeApproach: {
    __typename: 'PlanDataExchangeApproach',
    id: '123',
    status: DataExchangeApproachStatus.IN_PROGRESS,
    modifiedDts: '2022-05-12T15:01:39.190679Z',
    modifiedByUserAccount: {
      __typename: 'UserAccount',
      id: '123',
      commonName: 'John Doe'
    }
  },
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
        __typename: 'TaggedContent',
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
            __typename: 'TaggedContent',
            rawContent: 'This is an answer.'
          },
          createdBy: 'Jack Doe',
          createdDts: '2022-05-12T15:01:39.190679Z'
        }
      ]
    }
  ],
  timeline: {
    __typename: 'PlanTimeline',
    id: 'timeline-1',
    modifiedDts: '2025-06-24T12:00:00Z',
    modifiedByUserAccount: {
      __typename: 'UserAccount',
      id: '123',
      commonName: 'Jane Doe'
    },
    status: TaskStatus.IN_PROGRESS,
    datesAddedCount: 3,
    upcomingTimelineDate: {
      __typename: 'UpcomingTimelineDate',
      date: '2025-07-01T00:00:00Z',
      dateField: 'announced'
    }
  }
};

export const collaborationAreaMock: MockedResponse<
  GetCollaborationAreaQuery,
  GetCollaborationAreaQueryVariables
>[] = [
  {
    request: {
      query: GetCollaborationAreaDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: collaborationAreaData
      }
    }
  }
];

const favoritesModelPlanData: GetFavoritesType = [
  {
    __typename: 'ModelPlan',
    id: modelID,
    modelName: 'My plan',
    status: ModelStatus.PLAN_DRAFT,
    nameHistory: [],
    isFavorite: false,
    isCollaborator: true,
    basics: {
      id: '123',
      goal: '',
      __typename: 'PlanBasics'
    },
    timeline: {
      __typename: 'PlanTimeline',
      id: '789',
      performancePeriodStarts: ''
    },
    collaborators: [],
    echimpCRsAndTDLs: [
      {
        id: '123',
        __typename: 'EChimpCR'
      },
      {
        id: '456',
        __typename: 'EChimpTDL'
      }
    ]
  }
];

export const favoritesPlanCollectionMock = (
  filter: ModelPlanFilter
): MockedResponse<GetFavoritesQuery, GetFavoritesQueryVariables>[] => {
  return [
    {
      request: {
        query: GetFavoritesDocument,
        variables: { filter }
      },
      result: {
        data: {
          __typename: 'Query',
          modelPlanCollection: favoritesModelPlanData
        }
      }
    }
  ];
};

const echimpCRandTDLMockData: EchimpCrAndTdlsType[] = [
  {
    __typename: 'EChimpCR',
    id: '123',
    title: 'Echimp CR',
    emergencyCrFlag: true,
    sensitiveFlag: false,
    crStatus: 'Open',
    initiator: 'Initiator',
    implementationDate: '2022-07-30T05:00:00Z',
    relatedCrTdlNumbers: '123',
    crSummary: {
      __typename: 'TaggedContent',
      rawContent: '<p>CR Summary</p>'
    }
  },
  {
    __typename: 'EChimpTDL',
    id: '456',
    title: 'Echimp TDL',
    status: 'Open',
    issuedDate: '2022-07-30T05:00:00Z'
  }
];

export const echimpCRsAndTDLsMock: MockedResponse<
  GetEchimpCrandTdlQuery,
  GetEchimpCrandTdlQueryVariables
>[] = [
  {
    request: {
      query: GetEchimpCrandTdlDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          echimpCRsAndTDLs: echimpCRandTDLMockData
        }
      }
    }
  }
];

type GetAnalyticsSummaryType = GetAnalyticsSummaryQuery;

// Mock data
export const mockAnalyticsData: GetAnalyticsSummaryType = {
  __typename: 'Query',
  analytics: {
    __typename: 'AnalyticsSummary',
    changesPerModel: [
      {
        __typename: 'ModelChangesAnalytics',
        modelName: 'Test Model 1',
        numberOfChanges: 10,
        numberOfRecordChanges: 5,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174000'
      },
      {
        __typename: 'ModelChangesAnalytics',
        modelName: 'Test Model 2',
        numberOfChanges: 15,
        numberOfRecordChanges: 8,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174001'
      }
    ],
    modelsByStatus: [
      {
        __typename: 'ModelsByStatusAnalytics',
        status: ModelStatus.ACTIVE,
        numberOfModels: 25
      },
      {
        __typename: 'ModelsByStatusAnalytics',
        status: ModelStatus.PLAN_DRAFT,
        numberOfModels: 15
      }
    ],
    numberOfFollowersPerModel: [
      {
        __typename: 'ModelFollowersAnalytics',
        modelName: 'Test Model 1',
        numberOfFollowers: 12,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174000'
      }
    ],
    totalNumberOfModels: {
      __typename: 'ModelCountAnalytics',
      totalNumberOfModels: 40
    },
    changesPerModelBySection: [
      {
        __typename: 'ModelChangesBySectionAnalytics',
        modelName: 'Test Model 1',
        tableName: 'plan_basics',
        numberOfChanges: 5,
        numberOfRecordChanges: 3,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174000'
      },
      {
        __typename: 'ModelChangesBySectionAnalytics',
        modelName: 'Test Model 2',
        tableName: 'plan_basics',
        numberOfChanges: 3,
        numberOfRecordChanges: 2,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174001'
      }
    ],
    changesPerModelOtherData: [
      {
        __typename: 'ModelChangesOtherDataAnalytics',
        modelName: 'Test Model 1',
        numberOfChanges: 3,
        numberOfRecordChanges: 2,
        section: 'plan_documents',
        modelPlanID: '123e4567-e89b-12d3-a456-426614174000'
      },
      {
        __typename: 'ModelChangesOtherDataAnalytics',
        modelName: 'Test Model 2',
        numberOfChanges: 2,
        numberOfRecordChanges: 1,
        section: 'plan_documents',
        modelPlanID: '123e4567-e89b-12d3-a456-426614174001'
      }
    ]
  }
};

export const analyticsSummaryMock: MockedResponse<
  GetAnalyticsSummaryQuery,
  GetAnalyticsSummaryQueryVariables
>[] = [
  {
    request: {
      query: GetAnalyticsSummaryDocument
    },
    result: {
      data: mockAnalyticsData
    }
  }
];
