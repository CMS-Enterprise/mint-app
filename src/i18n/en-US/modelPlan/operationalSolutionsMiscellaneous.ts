const operationalSolutionsMiscellaneous = {
  heading: 'Operational solutions and implementation status tracker',
  headingReadOnly: 'Operational solutions',
  breadcrumb: 'Operational solutions tracker',
  summaryBox: {
    useTracker: 'Use this tracker to',
    listItem: {
      one:
        'select the solutions you plan to use to satisfy your model’s operational needs',
      two: 'update and manage the implementation status of those solutions',
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
      'The operational needs below have been selected based on your answers to questions in your Model Plan. You may use the table below to select operational solutions and track the implementation status of those solutions.',
    otherNeeds: 'Other operational needs',
    otherNeedsInfo:
      'The operational needs below are not required for your model either because you have not yet answered the relevant question as a part of your Model Plan, or because you have answered it in a way that means you do not need an operational solution for that need.',
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

    noSolutionSelected: 'No solution selected',
    error: {
      heading: 'There is a problem',
      body: 'Failed to fetch Model Plan operational needs'
    },
    noNeeds: 'There aren’t any other operational needs.',
    noNeedsReadonly:
      'There aren’t any operational needs that require solutions yet.',
    noNeedsInfo:
      'If you have additional operational needs you want to track, add an operational need or solution below.',
    noNeedsReadonlyInfo: 'Check back again later for updates.',
    noNeedsReadonlyEditInfo:
      'To determine the operational needs, fill out more of the Model Plan.',
    unusedSolutionsAlert:
      'This model has not specified they will use the following solution(s):'
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
    'Changing your answer to this question may also affect your selections in the operational solutions and implementation status tracker.  ',
  goToITSolutions: 'Go to operational solutions tracker.',
  helpBox: {
    heading: 'Don’t see what you’re looking for?',
    info:
      'Sometimes models have operational needs that are not uncovered in the Model Plan. If you want to track the status of additional workstreams, you may add them here.',
    button: 'Add an operational need or solution'
  },
  selectSolution: 'Select this solution',
  updateSolutions: 'Update solution selections',
  updateSolutionsInfo:
    'Adding additional solutions will create new solution pages, and removing a selected solution will delete the corresponding solution page. Tread carefully.',
  selectInfo:
    'Select from common solutions to solve your operational need or add another solution not listed.',
  operationalNeed: 'Operational need',
  whyNeed: 'Why is this a part of my operational needs?',
  youAnswered: 'In the Model Plan, you answered:',
  changeAnswer: 'Want to change your answer? ',
  goToQuestion: 'Go to the question.',
  chooseCommonSolution: 'Choose from common solutions',
  chooseOtherSolution: 'Other solutions',
  selectThisSolution: 'Select this solution',
  contact: 'Point of contact',
  aboutSolution: 'About this solution',
  selectAnother: 'Select another solution not listed',
  selectAlert:
    'When you continue to the next step, the points of contact for the selected preset solution(s) will be notified.',
  selectCustomAlert:
    'When you add this solution, the points of contact will be notified.',
  continue: 'Continue',
  dontAdd: 'Don’t add solutions and return to tracker',
  dontUpdate: 'Don’t update solutions and return to tracker',
  helpChoosing: 'Need help choosing a solution?',
  notSureWhatToDoNext: 'Don’t know what to do next?',
  helpTiming: 'Need help figuring out timing?',
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
  solutionName: 'Please add a name for your solution or contractor',
  solutionPOC: 'Point of contact information',
  solutionPOCInfo: 'Point of contact',
  solutionEmailInfo: 'Email',
  otherSolution: 'Other',
  selectedSectionHeading: 'Selected solution: ',
  addDetails: 'Add Details',
  updateTheseDetails: 'Update these details',
  removeTheseDetails: 'Remove these details',
  addError:
    'There was an error adding your solution details. Please try again.',
  updateError:
    'There was an error updating your solution details. Please try again.',
  solutionRemoveWarning:
    'Saving these selections will delete the following solution page(s) associated with this operational need:',
  successSolutionAdded: 'Success! Solutions added for {{-operationalNeedName}}',
  successSolutionUpdated: 'Success! Your solution details have been updated.',
  solution: 'Solution',
  saveSolutions: 'Save solutions',
  addImplementationDetails: 'Add solution implementation details',
  addImplementationDetailsInfo:
    'Add additional information and update the implementation status of each selected solution. If you do not know this information you may add it at a later date.',
  mustStartBy: 'Must start by',
  mustFinishBy: 'Must finish by',
  whatIsStatus: 'What is the status of this solution?',
  solutionDetails: 'Solution details',
  solutionDetailsInfo:
    'Update the implementation status, timing, and add any subtasks and documents to track your progress for this operational solution.',
  updateSolutionsLink: 'Update solutions for this operational need',
  notSpecified: 'not specified',
  updateStatusAndTiming: 'Update status and timing',
  updateDetails: 'Update solution implementation details',
  subtasks: {
    header: 'Subtasks',
    todo: 'To do',
    inProgress: 'In progress',
    done: 'Done',
    addSubtasks: 'Add subtasks',
    manageSubtasks: 'Manage subtasks',
    noSubtasks: 'No subtasks added yet'
  },
  documents: 'Documents',
  links: {
    linkDocuments: 'Connect existing documents',
    uploadDocuments: 'Add a new document'
  },
  updateStatus: 'Update status',
  updateStatusInfo:
    'Update the implementation status and deadline for this solution.',
  updateSolution: 'Update solution',
  dontUpdateandReturnToSolutionDetails:
    'Don’t update and return to solution details',
  dontUpdateandReturnToTracker: 'Don’t update and return to tracker',
  successStatusUpdated: 'Success! {{-operationalNeedName}} status updated.',
  errorStatusUpdated:
    'There was an issue updating the status for {{-operationalNeedName}}. Please try again.',
  addOpertationalNeed: 'Add an operational need',
  update: 'Update',
  updateThisOpertationalNeed: 'Update this operational need',
  addOpertationalNeedInfo:
    'Describe the operational need you’re solving or additional workstream you’re tracking.',
  noDuplicates:
    'Make sure you aren’t duplicating an operational need that’s already a part of the tracker.',
  customOperationalNeedName: 'What operational need are you solving?',
  dontAddandReturnToTracker: 'Don’t add and return to tracker',
  saveWithoutAdding: 'Save without adding a solution',
  editNeed: 'Edit this operational need',
  removeNeed: 'Remove this operational need',
  removeNeedModal: {
    heading: 'Confirm you want to remove {{-operationalNeedName}}.',
    warning:
      'You will not be able to access any associated solution details pages once it has been removed.',
    confirmButton: 'Remove operational need',
    cancel: 'Cancel'
  },
  modal: {
    heading:
      'Someone is currently editing the Model Plan section you’re trying to access.',
    subHeading: 'Please try again later.',
    return: 'Return to the task list',
    goBack: 'Go back'
  },
  successMessage: {
    onlyOperationalNeed:
      'Success! Your operational need “{{-operationalNeedName}}” is added.',
    operationalNeedAndSolution:
      'Success! Solutions added for {{-operationalNeedName}}',
    operationalNeedRemoval:
      'Success! {{-operationalNeedName}} has been removed.',
    operationalNeedUpdate: 'Success! Your operational need has been updated.'
  },
  errorMessage: {
    operationalNeedRemoval:
      'Sorry, we encountered a problem removing {{-operationalNeedName}}. Please try again.'
  },
  operationalSolutionKey: {
    contractor: 'Contractor',
    crossModelContract: 'Cross-model contract',
    existingCmsDataAndProcess: 'Existing CMS data and process',
    interalStaff: 'Internal staff',
    otherNewProcess: 'Other'
  },
  otherNewProcess: 'Other new process'
};
export default operationalSolutionsMiscellaneous;
