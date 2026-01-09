import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const iddocQuestionnaire: any = {
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Questionnaire status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 7.19,
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    },
    hideFromReadonly: true
  },
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label: 'This questionnaire (4i and ACO-OS) is complete.',
    dataType: 'UUID',
    formType: 'TEXT',
    order: 7.15,
    tableReference: 'user_account',
    hideFromReadonly: true
  }
};

export default iddocQuestionnaire;

export const iddocQuestionnaireMisc = {
  heading: '4i and ACO-OS',
  needHelpDiscussion: 'Need help with this questionnaire?',
  bannerText:
    'Your 4i and ACO-OS questionnaire can only be accessed by one person at a time. If you are not actively editing or reviewing this section, please exit out of it so others can access it.',
  iddocHeading: 'Operations questions',
  iddocReadonlyHeading: 'IDDOC Operations',
  icdHeading: 'Interface Control Document (ICD) questions',
  icdReadonlyHeading: 'Interface Control Document (ICD)'
};
