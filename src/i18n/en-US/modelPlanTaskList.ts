const modelPlanTaskList = {
  navigation: {
    home: 'Home',
    modelPlanTaskList: 'Model Plan task list'
  },
  subheading: 'for <1>{{modelName}}</1>',
  status: 'Status:',
  update: 'Update',
  summaryBox: {
    copy: 'There are no documents uploaded for <1>{{modelName}}</1>.',
    existingDocuments: 'document<1>{{plural}}</1> uploaded for ',
    cta: 'Upload a document',
    viewAll: 'View all model documents',
    uploadAnother: 'Upload another document'
  },
  sideNav: {
    saveAndExit: 'Save & Exit',
    remove: 'Remove your Model Plan',
    relatedContent: 'Related Content',
    ariaLabelForOverview: 'Open overview for adding a system in a new tab',
    overview: 'Overview for adding a model <1>(opens in a new tab)</1>',
    modelTeam: 'Model team',
    editTeam: 'Edit team'
  },
  withdraw_modal: {
    header: 'Confirm you want to remove {{-requestName}}.',
    warning: 'You will lose any information you have filled in.',
    confirm: 'Remove request',
    cancel: 'Cancel',
    confirmationText_name: 'The request for {{-requestName}} has been removed',
    confirmationText_noName: 'The request has been removed'
  },
  numberedList: {
    basics: {
      heading: 'Model basics',
      copy:
        'Start filling out as much of the basic model information as you know and reach out to the Model Assessment Team if you need help.',
      path: 'basics'
    },
    generalCharacteristics: {
      heading: 'General characteristics',
      copy:
        'Start filling out as much of the general model characteristics as you know and reach out to the Model Assessment Team if you need help.',
      path: 'characteristics'
    },
    participantsAndProviders: {
      heading: 'Participants and providers',
      copy:
        'Start filling out as much of the model participant information as you know and reach out to the Model Assessment Team if you need help.',
      path: 'participants-and-providers'
    },
    beneficiaries: {
      heading: 'Beneficiaries',
      copy:
        'Start filling out as much of the beneficiary information as you know and reach out to the Model Assessment Team if you need help.',
      path: 'beneficiaries'
    },
    opsEvalAndLearning: {
      heading: 'Operations, evaluation, and learning',
      copy:
        'Start filling out as much of the model operation information as you know and reach out to the Model Assessment Team if you need help.',
      path: 'ops-eval-and-learning'
    },
    payments: {
      heading: 'Payment',
      copy:
        'Start filling out as much of the payment information as you know and reach out to the Model Assessment Team if you need help.',
      path: 'payment'
    },
    itTools: {
      heading: 'IT tools',
      copy:
        'Choose the IT solutions your model will utilize. Many questions in this section are populated based on responses to questions answered in previous sections.',
      path: 'it-tools'
    }
  },
  taskListButton: {
    start: 'Start',
    continue: 'Continue'
  },
  taskListItem: {
    ready: 'Ready to start',
    inProgress: 'In progress',
    completed: 'Completed',
    cannotStart: 'Cannot start yet',
    notNeeded: 'Not needed',
    lastUpdated: 'Last updated:'
  },
  errorHeading: 'Failed to fetch model plan',
  errorMessage: 'Please try again'
};

export default modelPlanTaskList;
