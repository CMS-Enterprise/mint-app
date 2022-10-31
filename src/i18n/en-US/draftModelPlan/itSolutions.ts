const itSolutions = {
  heading: 'IT solutions and implementation status tracker',
  breadcrumb: 'IT solutions tracker',
  summaryBox: {
    useTracker: 'Use this tracker to',
    listItem: {
      one:
        'select the IT solutions you plan to use to satisfy your model’s operational needs',
      two: 'update and manage the implementation status of those IT solutions',
      three:
        'add additional operational services and solutions for your model as needs arise'
    },
    implementationStatuses: 'Implementation statuses'
  },
  itSolutionsTable: {
    id: 'operational-needs',
    title: 'Operational Needs Table',
    needs: 'Selected operational needs and solutions',
    needsInfo:
      'The operational needs below have been selected based on your answers to questions in your Model Plan. You may use the table below to select IT solutions and track the implementation status of those solutions.',
    otherNeeds: 'Other operational needs',
    otherNeedsInfo:
      'The operational needs below are not required for your model either because you have not yet answered the relevant question as a part of your Model Plan, or because you have answered it in a way that means you do not need an IT solution for that need.',
    need: 'Operational needs',
    solution: 'Solution',
    finishBy: 'Must finish by',
    subtasks: 'Subtasks',
    status: 'Status',
    actions: 'Actions',
    section: 'Model Plan section',
    changePlanAnswer: 'Change Model Plan answer',
    changeAnswer: 'Change answer',
    answer: 'Answer question',
    updateStatus: 'Update status',
    viewDetails: 'View details',
    updateNeed: 'Update operational need',
    selectSolution: 'Select a solution',
    error: {
      heading: 'There is a problem',
      body: 'Failed to fetch Model Plan operational needs'
    },
    noNeeds: 'There aren’t any other operational needs.',
    noNeedsInfo:
      'If you have additional operational needs you want to track, add an operational need or IT solution below.'
  },
  status: {
    notAnswered: 'Not answered',
    notNeeded: 'Not needed',
    notStarted: 'Not started',
    onboarding: 'Onboarding',
    backlog: 'Backlog',
    inProgress: 'In progress',
    completed: 'Completed',
    atRisk: 'At risk'
  },
  warningRedirect:
    'Changing your answer to this question may also affect your selections in the IT solutions and implementation status tracker.  ',
  goToITTools: 'Go to IT solutions tracker.',
  helpBox: {
    heading: 'Don’t see what you’re looking for?',
    info:
      'Sometimes models have operational needs that are not uncovered in the Model Plan. If you want to track the status of additional workstreams, you may add them here.',
    button: 'Add an operational need or IT solution'
  }
};

export default itSolutions;
