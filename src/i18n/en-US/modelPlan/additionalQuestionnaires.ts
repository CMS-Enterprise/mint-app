import {
  DataExchangeApproachStatus,
  IddocQuestionnaireStatus
} from '../../../gql/generated/graphql';

const dataExchangeApproachStatus: Record<DataExchangeApproachStatus, string> = {
  [DataExchangeApproachStatus.READY]: 'Ready to start',
  [DataExchangeApproachStatus.IN_PROGRESS]: 'In progress',
  [DataExchangeApproachStatus.COMPLETE]: 'Completed'
};

const iddocQuestionnaireStatus: Record<IddocQuestionnaireStatus, string> = {
  [IddocQuestionnaireStatus.NOT_STARTED]: 'Ready to start',
  [IddocQuestionnaireStatus.IN_PROGRESS]: 'In progress',
  [IddocQuestionnaireStatus.NOT_NEEDED]: 'Not Needed',
  [IddocQuestionnaireStatus.COMPLETED]: 'Completed'
};

const additionalQuestionnaires = {
  heading: 'Additional questionnaires',
  returnToCollaboration: 'Return to model collaboration area',
  sideNav: {
    relatedContent: 'Related content',
    articles: [
      {
        copy: 'High-level project plan (opens in a new tab)',
        href: '/help-and-knowledge/high-level-project-plan'
      },
      {
        copy: 'Creating your model-to-operations matrix (MTO) in MINT (opens in a new tab)',
        href: '/help-and-knowledge/creating-mto-matrix'
      }
    ]
  },
  questionnaireStatus: {
    dataExchangeApproach: dataExchangeApproachStatus,
    iddocQuestionnaire: iddocQuestionnaireStatus
  },
  questionnairesList: {
    dataExchangeApproach: {
      heading: 'Data exchange approach',
      description:
        "After your 6-page concept paper is approved, work with your IT Lead or Solution Architect (or reach out to the MINT Team if one still needs to be assigned) to determine how you'll exchange data so that we can help with new policy or technology opportunities. You should also include your data exchange approach in your ICIP.",
      path: 'about-completing-data-exchange'
    },
    iddocQuestionnaire: {
      heading: '4i and ACO-OS',
      description:
        'As you work to complete your Model Plan and model-to-operations matrix (MTO), some of your responses may indicate the need to fill out additional, more-detailed questions about how you plan to implement and operationalize your model. As those questions become required, additional questionnaires will be unlocked in this section of the model collaboration area.',
      path: 'iddoc'
    }
  },
  questionnaireButton: {
    start: 'Start',
    continue: 'Continue',
    edit: 'Edit'
  },
  lastUpdated: 'Last updated',
  saveAndReturnToQuestionnaires: 'Save and return to questionnaires'
};

export default additionalQuestionnaires;
