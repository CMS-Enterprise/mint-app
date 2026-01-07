import { MockedResponse } from '@apollo/client/testing';
import { KeyContactCategoryType } from 'features/HelpAndKnowledge/_components/KeyContactDirectory/_components/CategoryModal';
import { QuestionnairesType } from 'features/ModelPlan/CollaborationArea/Cards/AdditionalQuestionnairesCard';
import {
  DataExchangeApproachStatus,
  GetAllKeyContactCategoriesDocument,
  GetAllKeyContactCategoriesQuery,
  GetAllKeyContactCategoriesQueryVariables,
  GetAllKeyContactsDocument,
  GetAllKeyContactsQuery,
  GetAllKeyContactsQueryVariables,
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
  GetModelPlanBaseDocument,
  GetModelPlanBaseQuery,
  GetModelPlanBaseQueryVariables,
  GetModelPlansByStatusGroupDocument,
  GetModelPlansByStatusGroupQuery,
  GetModelPlansByStatusGroupQueryVariables,
  GetModelPlansDocument,
  GetModelPlansQuery,
  GetModelPlansQueryVariables,
  IddocQuestionnaireStatus,
  ModelCategory,
  ModelPhase,
  ModelPlanFilter,
  ModelPlanStatusGroup,
  ModelStatus,
  MtoStatus,
  TaskStatus
} from 'gql/generated/graphql';

type GetFavoritesType = GetFavoritesQuery['modelPlanCollection'];
type GetModelPlansType = GetModelPlansQuery['modelPlanCollection'];
type GetModelPlansByStatusGroupType =
  GetModelPlansByStatusGroupQuery['modelPlansByStatusGroup'];

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

export const questionnairesMock: QuestionnairesType = {
  __typename: 'Questionnaires',
  dataExchangeApproach: {
    __typename: 'PlanDataExchangeApproach',
    id: '123',
    status: DataExchangeApproachStatus.IN_PROGRESS,
    modifiedDts: null,
    modifiedByUserAccount: null
  },
  iddocQuestionnaire: {
    __typename: 'IDDOCQuestionnaire',
    id: 'b4eead7a-6603-41ed-85b7-97f1b1f0b367',
    modifiedDts: '2026-01-05T22:55:26.923527Z',
    modifiedByUserAccount: null,
    status: IddocQuestionnaireStatus.NOT_NEEDED,
    needed: false
  }
};

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
  questionnaires: questionnairesMock,
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

export const modelPlansByStatusGroupPreClearanceMockData: GetModelPlansByStatusGroupType =
  [
    {
      id: 'notarealid-1',
      modelName: 'Plan With draft',
      status: ModelStatus.PLAN_DRAFT,
      abbreviation: null,
      nameHistory: ['Plan With echimp CRs and TDLs 2'],
      createdDts: '2025-11-03T17:35:50.985086Z',
      mostRecentEdit: {
        id: '04eacb02-1211-493c-bdc4',
        date: '2025-11-03T17:35:50.985086Z',
        __typename: 'TranslatedAudit'
      },
      basics: {
        id: 'ff887238-e644-475d-91e1',
        amsModelID: null,
        modelCategory: null,
        additionalModelCategories: [],
        __typename: 'PlanBasics'
      },
      timeline: {
        id: 'f90f4a55-8473-432d-ae72',
        clearanceStarts: null,
        performancePeriodStarts: null,
        performancePeriodEnds: null,
        __typename: 'PlanTimeline'
      },
      discussions: [],
      payments: {
        id: '899c7bc7-1b1c-42db-b9bd',
        paymentStartDate: null,
        __typename: 'PlanPayments'
      },
      __typename: 'ModelPlan'
    },
    {
      id: '98749f57-38c7-4da2-8be2-4edd1b24dd6d',
      modelName: 'Plan with Data Complete',
      status: ModelStatus.PLAN_COMPLETE,
      abbreviation: null,
      nameHistory: ['Plan with Data Exchange'],
      createdDts: '2025-11-03T17:35:50.726429Z',
      mostRecentEdit: {
        id: 'aaa74ef3-e422-407e-ae8c-cf8a33d36dc9',
        date: '2025-11-03T18:04:26.800639Z',
        __typename: 'TranslatedAudit'
      },
      basics: {
        id: '853de963-11ed-4614-8523-3b527f54dd35',
        amsModelID: null,
        modelCategory: null,
        additionalModelCategories: [],
        __typename: 'PlanBasics'
      },
      timeline: {
        id: '7bada62e-7acb-420c-93e2-5e0fc18c6cc8',
        clearanceStarts: null,
        performancePeriodStarts: null,
        performancePeriodEnds: null,
        __typename: 'PlanTimeline'
      },
      discussions: [],
      payments: {
        id: 'c42fd1fc-2d00-4a4a-8c09-6b583bbf55b0',
        paymentStartDate: null,
        __typename: 'PlanPayments'
      },
      __typename: 'ModelPlan'
    }
  ];

export const modelsByStatusGroupPreClearanceMock: MockedResponse<
  GetModelPlansByStatusGroupQuery,
  GetModelPlansByStatusGroupQueryVariables
>[] = [
  {
    request: {
      query: GetModelPlansByStatusGroupDocument,
      variables: { statusGroup: ModelPlanStatusGroup.PRE_CLEARANCE }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByStatusGroup: modelPlansByStatusGroupPreClearanceMockData
      }
    }
  }
];

export const modelPlansByStatusGroupActiveMockData: GetModelPlansByStatusGroupType =
  [
    {
      id: '23070d62-e1fe-4444-a9fd-59a0034c2a0d',
      modelName: 'Test Plan with Basics',
      status: ModelStatus.ACTIVE,
      abbreviation: 'basics',
      nameHistory: ['Plan with Basics'],
      createdDts: '2025-11-03T17:35:50.490224Z',
      mostRecentEdit: {
        id: '67df518d-eaff-4b2c-b6d4-cc86b3f985c0',
        date: '2025-11-03T17:35:50.593821Z',
        __typename: 'TranslatedAudit'
      },
      basics: {
        id: '0b80b5c3-9e4d-4907-a4af-ca328d451a3d',
        amsModelID: null,
        modelCategory: null,
        additionalModelCategories: [],
        __typename: 'PlanBasics'
      },
      timeline: {
        id: '763e77af-3c7a-45ad-8efe-746f62372b0f',
        clearanceStarts: null,
        performancePeriodStarts: null,
        performancePeriodEnds: null,
        __typename: 'PlanTimeline'
      },
      discussions: [],
      payments: {
        id: 'b9888ae9-5d5c-4fce-854a-5c2da3908162',
        paymentStartDate: null,
        __typename: 'PlanPayments'
      },
      __typename: 'ModelPlan'
    },
    {
      id: 'fakeid-4',
      modelName: 'Test Plan with Timeline',
      status: ModelStatus.ACTIVE,
      abbreviation: null,
      nameHistory: ['Plan with Data Exchange'],
      createdDts: '2025-11-03T17:35:50.726429Z',
      mostRecentEdit: {
        id: 'aaa74ef3-e422-407e-ae8c-cf8a33d36dc9',
        date: '2025-11-03T18:04:26.800639Z',
        __typename: 'TranslatedAudit'
      },
      basics: {
        id: '853de963-11ed-4614-8523-3b527f54dd35',
        amsModelID: null,
        modelCategory: null,
        additionalModelCategories: [],
        __typename: 'PlanBasics'
      },
      timeline: {
        id: '7bada62e-7acb-420c-93e2-5e0fc18c6cc8',
        clearanceStarts: null,
        performancePeriodStarts: null,
        performancePeriodEnds: null,
        __typename: 'PlanTimeline'
      },
      discussions: [],
      payments: {
        id: 'c42fd1fc-2d00-4a4a-8c09-6b583bbf55b0',
        paymentStartDate: null,
        __typename: 'PlanPayments'
      },
      __typename: 'ModelPlan'
    }
  ];

export const modelsByStatusGroupActiveMock: MockedResponse<
  GetModelPlansByStatusGroupQuery,
  GetModelPlansByStatusGroupQueryVariables
>[] = [
  {
    request: {
      query: GetModelPlansByStatusGroupDocument,
      variables: { statusGroup: ModelPlanStatusGroup.ACTIVE }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByStatusGroup: modelPlansByStatusGroupActiveMockData
      }
    }
  }
];

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
        numberOfRecordChanges: 5
      },
      {
        __typename: 'ModelChangesAnalytics',
        modelName: 'Test Model 2',
        numberOfChanges: 15,
        numberOfRecordChanges: 8
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
        numberOfFollowers: 12
      }
    ],
    numberOfModelsOverTime: [
      {
        __typename: 'ModelCountAnalyticsOverTime',
        monthYear: '2022-01-01',
        numberOfModels: 10
      }
    ],
    changesPerModelBySection: [
      {
        __typename: 'ModelChangesBySectionAnalytics',
        modelName: 'Test Model 1',
        tableName: 'plan_basics',
        numberOfChanges: 5,
        numberOfRecordChanges: 3
      },
      {
        __typename: 'ModelChangesBySectionAnalytics',
        modelName: 'Test Model 2',
        tableName: 'plan_basics',
        numberOfChanges: 3,
        numberOfRecordChanges: 2
      }
    ],
    changesPerModelOtherData: [
      {
        __typename: 'ModelChangesOtherDataAnalytics',
        modelName: 'Test Model 1',
        numberOfChanges: 3,
        numberOfRecordChanges: 2,
        section: 'plan_documents'
      },
      {
        __typename: 'ModelChangesOtherDataAnalytics',
        modelName: 'Test Model 2',
        numberOfChanges: 2,
        numberOfRecordChanges: 1,
        section: 'plan_documents'
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

export const modelPlanBaseMock: MockedResponse<
  GetModelPlanBaseQuery,
  GetModelPlanBaseQueryVariables
>[] = [
  {
    request: {
      query: GetModelPlanBaseDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          abbreviation: null,
          modifiedDts: '2024-01-01T00:00:00Z',
          createdDts: '2024-01-01T00:00:00Z',
          status: ModelStatus.PLAN_DRAFT,
          mtoMatrix: {
            __typename: 'ModelsToOperationMatrix',
            status: MtoStatus.READY,
            info: {
              __typename: 'MTOInfo',
              id: 'mto-id'
            }
          }
        }
      }
    }
  }
];

export const keyContactCategoryMockData: KeyContactCategoryType[] = [
  {
    __typename: 'KeyContactCategory',
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e350',
    name: 'Healthcare',
    keyContacts: [
      {
        __typename: 'KeyContact',
        email: 'aliza.kim@cms.hhs.gov',
        id: '53c12785-c0c1-47a9-a91d-4f69d82d45cc',
        name: 'Aliza Kim',
        subjectArea: 'Insurance and Coverage',
        subjectCategoryID: 'a95a1f98-fb7a-43f9-9e3c-abc52238e350'
      }
    ]
  },
  {
    __typename: 'KeyContactCategory',
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e351',
    name: 'CMS Programs',
    keyContacts: [
      {
        __typename: 'KeyContact',
        email: 'aliza.kim@cms.hhs.gov',
        id: '53c12785-c0c1-47a9-a91d-4f69d82d45cc',
        name: 'Aliza Kim',
        subjectArea: 'Insurance and Coverage',
        subjectCategoryID: 'a95a1f98-fb7a-43f9-9e3c-abc52238e350'
      }
    ]
  }
];

export const keyContactCategoriesMock: MockedResponse<
  GetAllKeyContactCategoriesQuery,
  GetAllKeyContactCategoriesQueryVariables
>[] = [
  {
    request: {
      query: GetAllKeyContactCategoriesDocument
    },
    result: {
      data: {
        __typename: 'Query',
        keyContactCategory: keyContactCategoryMockData
      }
    }
  }
];

type KeyContactsType =
  GetAllKeyContactCategoriesQuery['keyContactCategory'][number]['keyContacts'];

export const keyContactsMockData: KeyContactsType = [
  {
    email: 'aliza.kim@cms.hhs.gov',
    id: '53c12785-c0c1-47a9-a91d-4f69d82d45cc',
    name: 'Aliza Kim',
    subjectArea: 'Insurance and Coverage',
    subjectCategoryID: keyContactCategoryMockData[0].id,
    __typename: 'KeyContact'
  },
  {
    email: 'pstm@example.com',
    id: '54c12785-c0c1-47a9-a91d-4f69d82d45cc',
    name: 'pstm team mailbox',
    subjectArea: 'Paperwork Reduction Act',
    subjectCategoryID: keyContactCategoryMockData[0].id,
    __typename: 'KeyContact'
  }
];

export const keyContactsMock: MockedResponse<
  GetAllKeyContactsQuery,
  GetAllKeyContactsQueryVariables
>[] = [
  {
    request: {
      query: GetAllKeyContactsDocument
    },
    result: {
      data: {
        __typename: 'Query',
        keyContacts: keyContactsMockData
      }
    }
  }
];
