import { ModelPlanQuestionsFormTypeWithLinks } from '.';

export type QuestionFieldType = keyof ModelPlanQuestionsFormTypeWithLinks;

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

export const MULTI_SELECT_WITH_OTHER: Partial<
  Record<
    QuestionFieldType,
    | 'resemblesExistingModelOtherSelected'
    | 'participationInModelPreconditionOtherSelected'
  >
> = {
  resemblesExistingModelLinks: 'resemblesExistingModelOtherSelected',
  participationInModelPreconditionLinks:
    'participationInModelPreconditionOtherSelected'
};

export default MODEL_PLAN_QUESTIONS;
