import {
  TranslationBasics,
  TranslationGeneralCharacteristics
} from 'types/translation';

import { ModelPlanQuestionsDataType } from '.';

type BasicQuestionKey = Extract<
  keyof TranslationBasics,
  keyof ModelPlanQuestionsDataType
>;

type GeneralQuestionKey = Extract<
  keyof TranslationGeneralCharacteristics,
  keyof ModelPlanQuestionsDataType
>;

export type QuestionFieldType =
  | BasicQuestionKey
  | GeneralQuestionKey
  | 'resemblesExistingModelLinks'
  | 'participationInModelPreconditionLinks';

export type QuestionType = {
  field: QuestionFieldType;
  childRelation?: QuestionType[];
};

const MODEL_PLAN_QUESTIONS: QuestionType[][] = [
  [
    { field: 'modelCategory' },
    {
      field: 'additionalModelCategories'
    }
  ],
  [
    {
      field: 'cmsCenters',
      childRelation: [{ field: 'cmmiGroups' }]
    }
  ],
  [
    {
      field: 'isNewModel',
      childRelation: [
        {
          field: 'existingModel'
        }
      ]
    }
  ],
  [
    {
      field: 'resemblesExistingModel',
      childRelation: [
        {
          field: 'resemblesExistingModelWhyHow'
        },
        {
          field: 'resemblesExistingModelLinks' // it is 'resemblesExistingModelWhich' in translation file
        },
        {
          field: 'resemblesExistingModelHow'
        },
        {
          field: 'resemblesExistingModelOtherSpecify'
        }
      ]
    }
  ],
  [
    {
      field: 'participationInModelPrecondition',
      childRelation: [
        { field: 'participationInModelPreconditionLinks' }, // it is 'participationInModelPreconditionWhich' in translation file
        { field: 'participationInModelPreconditionWhyHow' },
        { field: 'participationInModelPreconditionOtherSpecify' }
      ]
    }
  ],
  [
    {
      field: 'keyCharacteristics',
      childRelation: [
        { field: 'collectPlanBids' },
        { field: 'managePartCDEnrollment' },
        { field: 'planContractUpdated' },
        { field: 'keyCharacteristicsOther' }
      ]
    }
  ],
  [
    {
      field: 'geographiesTargeted',
      childRelation: [
        { field: 'geographiesTargetedTypes' },
        { field: 'geographiesTargetedAppliedTo' }
      ]
    }
  ],
  [
    {
      field: 'waiversRequired',
      childRelation: [{ field: 'waiversRequiredTypes' }]
    }
  ]
];

export default MODEL_PLAN_QUESTIONS;
