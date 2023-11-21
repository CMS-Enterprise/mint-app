import GetFavorites from 'queries/GetFavorites';
import GetModelPlans from 'queries/GetModelPlans';
import { GetFavorites_modelPlanCollection as GetFavoritesType } from 'queries/types/GetFavorites';
import { GetModelPlans_modelPlanCollection as GetModelPlansType } from 'queries/types/GetModelPlans';
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
    crTdls: [],
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
        query: GetModelPlans,
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
    crTdls: [],
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
        query: GetFavorites,
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
