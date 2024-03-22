import { GetFavoritesDocument, GetModelPlansDocument } from 'gql/gen/graphql';
import { GetFavorites_modelPlanCollection as GetFavoritesType } from 'gql/gen/types/GetFavorites';
import { GetModelPlans_modelPlanCollection as GetModelPlansType } from 'gql/gen/types/GetModelPlans';

import {
  ModelCategory,
  ModelPlanFilter,
  ModelStatus
} from 'types/graphql-global-types';

export const modelID: string = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const modelPlanData: GetModelPlansType[] = [
  {
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
    crs: [
      {
        __typename: 'PlanCR',
        idNumber: 'CR 123'
      }
    ],
    tdls: [
      {
        __typename: 'PlanTDL',
        idNumber: 'TDL 456'
      }
    ],
    __typename: 'ModelPlan'
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

const favoritesModelPlanData: GetFavoritesType[] = [
  {
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
    crs: [
      {
        __typename: 'PlanCR',
        idNumber: 'CR 123'
      }
    ],
    tdls: [
      {
        __typename: 'PlanTDL',
        idNumber: 'TDL 456'
      }
    ],
    __typename: 'ModelPlan'
  }
];

export const favoritesPlanCollectionMock = (
  filter: ModelPlanFilter,
  isMAC: boolean = false
) => {
  return [
    {
      request: {
        query: GetFavoritesDocument,
        variables: { filter, isMAC }
      },
      result: {
        data: {
          modelPlanCollection: favoritesModelPlanData
        }
      }
    }
  ];
};
