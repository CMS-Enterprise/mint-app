import { MockedResponse } from '@apollo/client/testing';
import {
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
  ModelPlanFilter,
  ModelStatus
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
      clearanceStarts: '',
      performancePeriodStarts: '',
      additionalModelCategories: [],
      applicationsStart: '',
      __typename: 'PlanBasics'
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
    ]
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
      performancePeriodStarts: '',

      __typename: 'PlanBasics'
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
