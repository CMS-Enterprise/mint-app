const modelPlanTaskList = {
  navigation: {
    home: 'Home',
    modelPlanTaskList: 'Model Plan task list'
  },
  subheading: 'for <1>{{modelName}}</1>',
  status: 'Status:',
  update: 'Update',
  documentSummaryBox: {
    heading: 'Documents',
    copy: 'There are no documents uploaded',
    existingDocuments: 'document<1>{{plural}}</1> uploaded',
    cta: 'Upload a document',
    viewAll: 'View all model documents',
    uploadAnother: 'Upload another document'
  },
  crTDLsSummaryBox: {
    heading: 'CRs and TDLs',
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
      team:
        'Start filling out as much of the basic model information as you know and reach out to the MINT Team if you need help. Model basics includes the model name, problem, goal, and high level timelines.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'basics'
    },
    generalCharacteristics: {
      heading: 'General characteristics',
      team:
        'Start filling out as much of the general model characteristics as you know and reach out to the MINT Team if you need help. This section includes the key characteristics of the model, agreement type, waivers, and rulemaking.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'characteristics'
    },
    participantsAndProviders: {
      heading: 'Participants and providers',
      team:
        'Start filling out as much of the model participant information as you know and reach out to the MINT Team if you need help.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'participants-and-providers'
    },
    beneficiaries: {
      heading: 'Beneficiaries',
      team:
        'Start filling out as much of the beneficiary information as you know and reach out to the MINT Team if you need help.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'beneficiaries'
    },
    opsEvalAndLearning: {
      heading: 'Operations, evaluation, and learning',
      team:
        'Start filling out as much of the model operation information as you know and reach out to the MINT Team if you need help.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'ops-eval-and-learning'
    },
    payments: {
      heading: 'Payment',
      team:
        'Start filling out as much of the payment information as you know and reach out to the MINT Team if you need help.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'payment'
    },
    itSolutions: {
      heading: 'IT solutions and implementation status',
      team:
        'Choose the IT solutions your model model will utilize. Many items in this section are populated based on responses to questions answered in previous sections.',
      team2:
        'Track your progress towards implementation, see points of contact for operational services, and monitor deadlines. Keeping this information up-to-date will also help the MINT Team understand how best to help you.',
      assessment:
        'The Model Team will fill out as much of the basic model information as they know and reach out to you if they need help.',
      path: 'it-solutions'
    },
    prepareForClearance: {
      heading: 'Prepare for clearance',
      team:
        'Once you have iterated on your Model Plan, review each section and confirm your answers are ready for clearance and match the information included in your ICIP. As a part of this step you should also add any refined cost estimates and check your uploaded documents.',
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
  taskListItem: {
    ready: 'Ready to start',
    readyForReview: 'Ready for review',
    inProgress: 'In progress',
    completed: 'Completed',
    notNeeded: 'Not needed',
    lastUpdated: 'Last updated:',
    readyForClearance: 'Ready for clearance',
    cannotStart: 'Cannot start yet'
  },
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
    'it-solutions': 'IT solutions tracker',
    'ops-eval-and-learning': 'Operation, evaluation, and learning',
    'participants-and-providers': 'Participants and providers',
    payment: 'payment'
  },
  lockErrorHeading: 'Sorry, an has error occured.',
  lockErrorInfo: 'Please return to the task list and try again.'
};

export default modelPlanTaskList;
