import { TranslationMTOInfo } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const modelToOperations: TranslationMTOInfo = {
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label: 'Ready for review by',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01,
    tableReference: TableName.USER_ACCOUNT
  },
  readyForReviewDTS: {
    gqlField: 'readyForReviewDTS',
    goField: 'ReadyForReviewDTS',
    dbField: 'ready_for_review_dts',
    label: 'Ready for review by',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.02
  }
};

export const modelToOperationsMisc: Record<string, any> = {
  heading: 'Model-to-operations matrix',
  forModel: 'for {{ modelName }}',
  milestones: 'Milestones',
  'systems-and-solutions': 'IT systems and solutions',
  needHelpDiscussion: 'Need help?',
  isMTOReady: 'Is this MTO ready for review?',
  isMTOInProgress: 'Is this MTO still in progress',
  lastUpdated: 'MTO last updated {{date}}',
  emptyMTO: 'Your model-to-operations matrix is a bit empty!',
  emptyMTOdescription: 'Choose an option below to get started.',
  returnToCollaboration: 'Return to model collaboration area',
  startWithCategories: 'Start with categories or templates',
  aboutTemplates: 'About templates',
  aboutTemplatesDescription:
    'All models are unique, but many have similarities based on key characteristics of the model. Templates contain a combination of categories, milestones, and/or solutions. They are starting points for certain model types and can be further customized once added.',
  aboutCategories: 'About categories',
  aboutCategoriesDescription:
    'Many teams find it useful to organize the model milestones in their into overarching high-level categories and sub-categories. MINT offers a template set of standard categories as a starting point for new MTOs. The categories can be further customized once added.',
  optionsCard: {
    milestones: {
      label: 'Milestones',
      header: 'Start with model milestones',
      description:
        'Model milestones are the key activities and functions that models must accomplish in order to be ready to go live. Most will be fulfilled by one or more IT systems or solutions. Many milestones are similar across models, so MINT offers a library of common milestones to select from.',
      buttonText: 'Browse common milestones',
      linkText: 'or, add a custom milestone'
    },
    'systems-and-solutions': {
      label: 'Operational solutions',
      header: 'Start with IT systems or other solutions',
      description:
        'Models use a variety of IT systems or solutions to fulfill model requirements. These could be IT systems, contracts or contract vehicles, cross-cutting groups, and more. Many models use similar methodologies, so MINT offers a library of common solutions to select from.',
      buttonText: 'Browse common solutions',
      linkText: 'or, add a custom solution'
    },
    template: {
      label: 'Template',
      header: 'Standard categories',
      description: '18 categories, 0 milestones, 0 solutions',
      buttonText: 'Use this template'
    }
  },
  readyForReview: {
    headingInReview: 'Set MTO status to ready for review?',
    headingInProgress: 'Set MTO status to in progress?',
    descriptionReady:
      'The "ready for review" status indicates to others viewing your MTO that your milestones and chosen solutions are relatively well set, though you may continue to update content and statuses.',
    descriptionInProgress:
      'The "in progress" status indicates to others viewing your MTO that you are still extensively adding, removing, and reorganizing milestones and chosen solutions.',
    markAsReady: 'Mark as ready for review',
    markAsInProgress: 'Mark as in progress',
    goBack: 'Go back to MTO',
    error: 'Failed to update MTO status'
  }
};

export default modelToOperations;
