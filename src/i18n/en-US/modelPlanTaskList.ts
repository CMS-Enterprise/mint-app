import {
  ModelPhase,
  PrepareForClearanceStatus,
  TaskStatus
} from 'gql/gen/graphql';

const statusText: Record<ModelPhase, string> = {
  [ModelPhase.ICIP_COMPLETE]:
    'Your model’s anticipated timeline suggests that your ICIP is now complete. Would you like to update the status of your model to reflect that? If your model’s ICIP is not yet complete, please adjust your model’s anticipated timeline.',
  [ModelPhase.IN_CLEARANCE]:
    'Your model’s anticipated timeline suggests that it is now in clearance. Would you like to update the status of your model to reflect that? If your model is not yet in clearance, please adjust your model’s anticipated timeline.',
  [ModelPhase.CLEARED]:
    'Your model’s anticipated timeline suggests that it is now cleared. Would you like to update the status of your model to reflect that? If your model is not yet cleared, please adjust your model’s anticipated timeline.',
  [ModelPhase.ANNOUNCED]:
    'Your model’s anticipated timeline suggests that it is now announced. Would you like to update the status of your model to reflect that? If your model is not yet announced, please adjust your model’s anticipated timeline.',
  [ModelPhase.ACTIVE]:
    'Your model’s anticipated timeline suggests that it is now active. Would you like to update the status of your model to reflect that? If your model is not yet active, please adjust your model’s anticipated timeline.',
  [ModelPhase.ENDED]:
    'Your model’s anticipated timeline suggests that it is now ended. Would you like to update the status of your model to reflect that? If your model has not yet ended, please adjust your model’s anticipated timeline.'
};

const taskListStatus: Record<TaskStatus | PrepareForClearanceStatus, string> = {
  [TaskStatus.READY]: 'Ready to start',
  [TaskStatus.IN_PROGRESS]: 'In progress',
  [TaskStatus.READY_FOR_REVIEW]: 'Ready for review',
  [TaskStatus.READY_FOR_CLEARANCE]: 'Ready for clearance',
  [PrepareForClearanceStatus.CANNOT_START]: 'Cannot start yet'
};

const modelPlanTaskList = {
  heading: 'Model Plan task list',
  subheading: 'for {{modelName}}',
  status: 'Status:',
  update: 'Update',
  edit: 'Edit Model Plan',
  taskListStatus,
  documentSummaryBox: {
    heading: 'Documents',
    copy: 'There are no documents added.',
    document: 'document',
    document_other: 'documents',
    cta: 'Add a document',
    viewAll: 'View all model documents',
    addAnother: 'Add a document'
  },
  crTDLsSummaryBox: {
    heading: 'FFS CRs and TDLs',
    copy: 'There are no CRs or TDLs added.',
    add: 'Add a CR or TDL',
    viewAll: 'Manage CRs and TDLs',
    uploadAnother: 'Add another CR or TDL',
    more: ' more'
  },
  sideNav: {
    actions: 'Actions',
    readOnlyView: 'Switch to the Read View for this Model Plan',
    saveAndExit: 'Save & Exit',
    view: 'View this Model Plan',
    remove: 'Remove your Model Plan',
    relatedContent: 'Related Content',
    ariaLabelForOverview: 'Open overview for adding a system in a new tab',
    overview: 'Overview for adding a model <1>(opens in a new tab)</1>',
    sampleModelPlan: 'Sample Model Plan <1>(opens in a new tab)</1>',
    modelTeam: 'Model team',
    editTeam: 'Edit team'
  },
  withdraw_modal: {
    header: 'Confirm you want to remove {{-requestName}}.',
    warning:
      'Nobody will be able to edit or access this plan. This action cannot be undone. Please proceed with caution.',
    confirm: 'Remove Model Plan',
    cancel: 'Keep Model Plan',
    confirmationText_name:
      'Success! {{-modelName}} has been removed from MINT.',
    confirmationText_noName: 'The request has been removed'
  },
  numberedList: {
    basics: {
      heading: 'Model basics',
      team: 'Start filling out as much of the basic model information as you know and reach out to the MINT Team if you need help. Model basics includes the model name, problem, goal, and high level timelines.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'basics'
    },
    generalCharacteristics: {
      heading: 'General characteristics',
      team: 'Start filling out as much of the general model characteristics as you know and reach out to the MINT Team if you need help. This section includes the key characteristics of the model, agreement type, waivers, and rulemaking.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'characteristics'
    },
    participantsAndProviders: {
      heading: 'Participants and providers',
      team: 'Start filling out as much of the model participant information as you know and reach out to the MINT Team if you need help.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'participants-and-providers'
    },
    beneficiaries: {
      heading: 'Beneficiaries',
      team: 'Start filling out as much of the beneficiary information as you know and reach out to the MINT Team if you need help.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'beneficiaries'
    },
    opsEvalAndLearning: {
      heading: 'Operations, evaluation, and learning',
      team: 'Start filling out as much of the model operation information as you know and reach out to the MINT Team if you need help.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'ops-eval-and-learning'
    },
    payments: {
      heading: 'Payment',
      team: 'Start filling out as much of the payment information as you know and reach out to the MINT Team if you need help.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'payment'
    },
    itSolutions: {
      heading: 'Operational solutions and implementation status',
      team: 'Choose the solutions your model will utilize. Many items in this section are populated based on responses to questions answered in previous sections.',
      team2:
        'Track your progress towards implementation, see points of contact for operational services, and monitor deadlines. Keeping this information up-to-date will also help the MINT Team understand how best to help you.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'it-solutions'
    },
    prepareForClearance: {
      heading: 'Prepare for clearance',
      team: 'Once you have iterated on your Model Plan, review each section and confirm your answers are ready for clearance and match the information included in your ICIP. As a part of this step you should also add any refined cost estimates and check your uploaded documents.',
      assessment:
        'Once you have iterated on your Model Plan, review each section and confirm your answers are ready for clearance and match the information included in your ICIP. As a part of this step you should also add any refined cost estimates and check your uploaded documents.',
      path: 'prepare-for-clearance'
    }
  },
  cannotStartClearance:
    'This step will become available 20 days prior to beginning internal clearance.',
  taskListButton: {
    start: 'Start',
    continue: 'Continue',
    update: 'Update',
    updateStatuses: 'Update statuses'
  },
  lastUpdated: 'Last updated:',
  errorHeading: 'Failed to fetch model plan',
  errorMessage: 'Please try again',
  locked:
    '{{-teamMember}} is editing this section. You may access it when they’re done.',
  selfLocked: 'You are editing this section.',
  assessmentLocked:
    'The MINT Team | {{-assessmentUser}} is editing this section. You may access it when they’re done.',
  lockedHeading:
    'Someone is currently editing the Model Plan section you’re trying to access.',
  lockedSubheading: 'Please try again later.',
  returnToTaskList: 'Return to the task list',
  breadCrumbState: {
    basics: 'Model basics',
    beneficiaries: 'Beneficiaries',
    characteristics: 'General characteristics',
    'it-solutions': 'Operational solutions tracker',
    'ops-eval-and-learning': 'Operation, evaluation, and learning',
    'participants-and-providers': 'Participants and providers',
    payment: 'payment'
  },
  lockErrorHeading: 'Sorry, an has error occured.',
  lockErrorInfo: 'Please return to the task list and try again.',
  statusUpdateSuccess:
    'You have successfully updated the status to {{status}}.',
  statusUpdateError:
    'There was an error updating the status to {{status}}. Please try again.',
  statusUpdateErrorExists: 'The status has already been updated to {{status}}.',
  statusModal: {
    heading: 'Update model status?',
    currentStatus: 'Current status: ',
    newStatus: 'New status ',
    update: 'Yes, update status',
    goToTimeline: 'No, go to timeline',
    hint: 'Select the specific clearance phase.',
    statusText
  },
  returnToCollaboration: 'Return to model collaboration area'
};

export default modelPlanTaskList;
