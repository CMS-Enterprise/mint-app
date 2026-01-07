import {
  DataExchangeApproachStatus,
  IddocQuestionnaireStatus
} from '../../../gql/generated/graphql';

const dataExchangeApproachStatus: Record<DataExchangeApproachStatus, string> = {
  [DataExchangeApproachStatus.READY]: 'Not started',
  [DataExchangeApproachStatus.IN_PROGRESS]: 'In progress',
  [DataExchangeApproachStatus.COMPLETE]: 'Completed'
};

const iddocQuestionnaireStatus: Record<IddocQuestionnaireStatus, string> = {
  [IddocQuestionnaireStatus.NOT_STARTED]: 'Not started',
  [IddocQuestionnaireStatus.IN_PROGRESS]: 'In progress',
  [IddocQuestionnaireStatus.NOT_NEEDED]: 'Not needed',
  [IddocQuestionnaireStatus.COMPLETED]: 'Completed'
};

const collaborationArea = {
  home: 'Home',
  heading: 'Model collaboration area',
  modelPlan: 'for {{modelName}}',
  errorHeading: 'Failed to fetch model plan',
  errorMessage: 'Please try again',
  switchToReadView: 'Switch to the Read View for the model',
  updateStatus: 'Update model status',
  areas: 'Areas',
  goToModelPlan: 'Go to Model Plan',
  modelPlanCard: {
    heading: 'Model Plan',
    body: 'The Model Plan will help components across CMS evaluate your model’s operational requirements and IT needs. It contains questions about payments, providers, general characteristics, and more. The Model Plan is flexible, so you may leave questions blank, add new information, and change information as you iterate on your model or learn of new dependencies.',
    mostRecentEdit: 'Most recent edit on {{-date}} by ',
    sectionsStarted: '{{-sectionsStarted}}/7 sections started',
    shareButton: 'Share or export Model Plan'
  },
  teamCard: {
    heading: 'Model team',
    body: 'Team members can edit all sections of a model collaboration area, including uploading documents and adding team members.',
    addMember: 'Add a team member',
    manageTeam: 'Manage model team',
    viewMoreTeamMembers: 'View {{count}} more team member',
    viewMoreTeamMembers_other: 'View {{count}} more team members',
    viewFewerTeamMembers: 'View fewer team members'
  },
  documentsCard: {
    heading: 'Documents',
    addDocument: 'Add document',
    viewAll: 'View all',
    noDocuments: 'No documents added',
    linkAdded: '{{count}} link added',
    linkAdded_other: '{{count}} links added',
    uploaded: '{{count}} uploaded'
  },
  discussionsCard: {
    heading: 'Discussions',
    startDiscussion: 'Start a discussion',
    viewAll: 'View all',
    discussion: '{{count}} discussion',
    discussion_other: '{{count}} discussions',
    noDiscussions: 'No discussions started'
  },
  crtdlsCard: {
    heading: 'FFS CRs and TDLS',
    addInEChimp: 'Add in ECHIMP',
    viewAll: 'View all',
    noCrtdls: 'No CRs or TDLs',
    andMore: ' + {{count}} more'
  },
  additionalQuestionnairesCard: {
    heading: 'Additional questionnaires',
    requiredQuestionnairesCount: '{{count}} required questionnaire',
    requiredQuestionnairesCount_other: '{{count}} required questionnaires',
    viewAllRequired: 'View all required questionnaires',
    otherQuestionnairesCount: '{{count}} other questionnaires',
    otherQuestionnairesCount_other: '{{count}} other questionnaires',
    viewAllQuestionnaires: 'View all questionnaires',
    goToQuestionnaires: 'Go to questionnaires',
    questionnaireStatus: {
      dataExchangeApproach: dataExchangeApproachStatus,
      iddocQuestionnaire: iddocQuestionnaireStatus
    }
  },
  mtoCard: {
    heading: 'Model-to-operations matrix (MTO)',
    body: 'Work with your IT Lead to document key model milestones and determine which operational solutions or IT systems your model will use to accomplish those milestones. Some milestones are suggested based on responses to questions in the Model Plan.',
    modelMilestonesAdded: 'Model milestones added: {{count}}',
    goToMatrix: 'Go to matrix',
    shareOrExport: 'Share or export matrix',
    lastModified: 'Most recent edit on {{-date}} by '
  },
  timelineCard: {
    heading: 'Model timeline',
    body: 'Add all your essential model dates, such as when you anticipate completing your ICIP, going through clearance, announcing the model, and when it will be active. As you iterate on the plans for your model, please be sure to keep this space up-to-date.',
    datesAddedCount: '{{datesAddedCount}}/9 dates added',
    upcomingDate: '<bold>Upcoming date:</bold> {{dateField}} ({{date}})',
    mostRecentEdit: 'Most recent edit on {{-date}} by ',
    startTimeline: 'Start timeline',
    editTimeline: 'Edit timeline',
    shareButton: 'Share or export timeline'
  }
};

export default collaborationArea;
