import { QuestionnaireName } from 'types/questionnaires';

import {
  DataExchangeApproachStatus,
  IddocQuestionnaireTaskListStatus
} from '../../../gql/generated/graphql';

const dataExchangeApproachStatus: Record<DataExchangeApproachStatus, string> = {
  [DataExchangeApproachStatus.READY]: 'Ready to start',
  [DataExchangeApproachStatus.IN_PROGRESS]: 'In progress',
  [DataExchangeApproachStatus.COMPLETE]: 'Complete'
};

const iddocQuestionnaireStatus: Record<
  IddocQuestionnaireTaskListStatus,
  string
> = {
  [IddocQuestionnaireTaskListStatus.NOT_NEEDED]: 'Not Needed',
  [IddocQuestionnaireTaskListStatus.READY]: 'Ready to start',
  [IddocQuestionnaireTaskListStatus.IN_PROGRESS]: 'In progress',
  [IddocQuestionnaireTaskListStatus.COMPLETE]: 'Complete'
};

const questionnairesList: Record<
  QuestionnaireName,
  {
    heading: string;
    // Enter description text as an array of strings for bulleted lists
    description: (string | string[])[];
    path: string;
    responsibleTeamMember: string;
  }
> = {
  dataExchangeApproach: {
    heading: 'Data exchange approach',
    description: [
      "After your 6-page concept paper is approved, work with your IT Lead or Solution Architect (or reach out to the MINT Team if one still needs to be assigned) to determine how you'll exchange data so that we can help with new policy or technology opportunities. You should also include your data exchange approach in your ICIP."
    ],
    path: 'data-exchange-approach/about-completing-data-exchange',
    responsibleTeamMember: 'IT Lead (with assistance from other team members)'
  },
  waiverAssessmentSurvey: {
    heading: 'Waiver assessment survey',
    description: [
      'This survey will help determine which specific waivers are most appropriate for your model, ensure proper justification for waiver selections, and identify any instances where standard CMS authorities may be sufficient without additional waiver flexibility.',
      'Your responses will:',
      [
        'Inform stakeholder engagement strategies',
        'Support operational planning and implementation timelines',
        'Ensure compliance with statutory and regulatory requirements'
      ]
    ],
    path: 'waiver-assessment-survey/about',
    responsibleTeamMember:
      'Model Lead (with assistance from other team members)'
  },
  iddocQuestionnaire: {
    heading: '4i and ACO-OS',
    description: [
      'As you work to complete your Model Plan and model-to-operations matrix (MTO), some of your responses may indicate the need to fill out additional, more-detailed questions about how you plan to implement and operationalize your model. As those questions become required, additional questionnaires will be unlocked in this section of the model collaboration area.'
    ],
    path: 'iddoc-questionnaire/operations',
    responsibleTeamMember: 'IT Lead'
  }
};

const additionalQuestionnaires = {
  heading: 'Additional questionnaires',
  returnToCollaboration: 'Return to model collaboration area',
  returnToQuestionnaires: 'Return to questionnaires',
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
  questionnairesList,
  questionnaireButton: {
    start: 'Start',
    continue: 'Continue',
    edit: 'Edit'
  },
  mostRecentEdit: 'Most recent edit on {{-date}} by ',
  saveAndReturnToQuestionnaires: 'Save and return to questionnaires',
  responsibleTeamMember: 'Responsible team member: {{teamMember}}'
};

export default additionalQuestionnaires;
