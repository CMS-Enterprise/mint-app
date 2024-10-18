import {
  GetFavoritesDocument,
  GetFavoritesQuery,
  GetModelPlansDocument,
  GetModelPlansQuery,
  ModelCategory,
  ModelPlanFilter,
  ModelStatus
} from 'gql/generated/graphql';

type GetFavoritesType = GetFavoritesQuery['modelPlanCollection'];
type GetModelPlansType = GetModelPlansQuery['modelPlanCollection'];

export const modelID: string = 'f11eb129-2c80-4080-9440-439cbe1a286f';

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
) => {
  return [
    {
      request: {
        query: GetModelPlansDocument,
        variables: { filter, isMAC }
      },
      result: {
        data: {
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

export const favoritesPlanCollectionMock = (filter: ModelPlanFilter) => {
  return [
    {
      request: {
        query: GetFavoritesDocument,
        variables: { filter }
      },
      result: {
        data: {
          modelPlanCollection: favoritesModelPlanData
        }
      }
    }
  ];
};
