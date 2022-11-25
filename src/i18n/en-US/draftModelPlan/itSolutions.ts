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
  solutionStatuses: {
    notStarted: {
      status: 'Not started',
      description: 'No work has started on this service'
    },
    onboarding: {
      status: 'Onboarding',
      description:
        'Model work is being planned (e.g., contract modification, change request, or onboarding request)'
    },
    backlog: {
      status: 'Backlog',
      description: 'Model work is on the project team’s backlog'
    },
    inProgress: {
      status: 'In progress',
      description:
        'Model work is in progress (e.g., developement, configuration, testing, etc.)'
    },
    completed: {
      status: 'Completed',
      description: 'Model work is finished'
    },
    atRisk: {
      status: 'At risk',
      description: 'Work is delayed or blocked and could affect timelines'
    }
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
  },
  selectSolution: 'Select a solution',
  selectInfo:
    'Select from common solutions to solve your operational need or add another solution not listed.',
  operationalNeed: 'Operational need',
  whyNeed: 'Why is this a part of my operational needs?',
  youAnswered: 'In the Model Plan, you answered:',
  changeAnswer: 'Want to change your answer? ',
  goToQuestion: 'Go to the question.',
  chooseSolution: 'Choose from common solutions',
  selectThisSolution: 'Select this solution',
  contact: 'Point of contact',
  aboutSolution: 'About this solution',
  selectAnother: 'Select another solution not listed',
  continue: 'Continue',
  dontAdd: 'Don’t add solutions and return to tracker',
  helpChoosing: 'Need help choosing a solution?',
  helpfulLinks: 'Helpful links',
  availableSolutions: 'Available operational solutions (opens in a new tab)',
  addSolution: 'Add a solution',
  addSolutionInfo:
    'Select which service or solution you’ll use for this operational need.',
  howWillYouSolve: 'How will you solve this?',
  howWillYouSolveInfo:
    'Select an operational solution or select "Other" if you’ll solve this a different way.',
  addSolutionButton: 'Add solution',
  addSolutionDetails: 'Add solution details',
  dontAddSolution: 'Don’t add and return to previous page',
  dontUpdateSolution: 'Don’t update and return to previous page',
  updateSolutionDetails: 'Update solution details',
  solutionName: 'Please add a name for your solution',
  solutionPOC: 'Point of contact information',
  solutionPOCInfo: 'Point of contact',
  solutionEmailInfo: 'Email or other contact information',
  otherSolution: 'Other',
  updateTheseDetails: 'Update these details',
  removeTheseDetails: 'Remove these details',
  addError:
    'There was an error adding your solution details. Please try again.',
  updateError:
    'There was an error updating your solution details. Please try again.',
  successSolutionAdded: 'Success! Solutions added for {{-operationalNeedName}}',
  solution: 'Solution',
  saveSolutions: 'Save solutions',
  addImplementationDetails: 'Add solution implementation details',
  addImplementationDetailsInfo:
    'Add additional information and update the implementation status of each selected solution. If you do not know this information you may add it at a later date.',
  mustStartBy: 'Must start by',
  mustFinishBy: 'Must finish by',
  whatIsStatus: 'What is the status of this solution?'
};

export default itSolutions;
