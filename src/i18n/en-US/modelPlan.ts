const modelPlan = {
  home: 'Home',
  teamRoles: {
    modelLead: 'Model Lead',
    leadership: 'Leadership',
    evaluation: 'Evaluation',
    learning: 'Learning',
    modelTeam: 'Model Team'
  },
  planStatuses: {
    planDraft: 'Draft model plan',
    planComplete: 'Model plan complete',
    icipComplete: 'ICIP complete',
    cmmiClearance: 'Internal (CMMI) clearance',
    cmsClearance: 'CMS clearance',
    hhsClearance: 'HHS clearance',
    ombASRFClearance: 'OMB/ASRF clearance',
    cleared: 'Cleared',
    announced: 'Announced'
  },
  status: {
    heading: 'Update status',
    copy:
      'After you’ve iterated on your Model Plan, update the status so others know what stage it’s at in the design and clearance process.',
    label: 'What is the status of your Model Plan?',
    updateButton: 'Update status',
    return: 'Don’t update status and return to task list'
  },
  favorite: {
    modelLead: 'Model lead(s)',
    startDate: 'Start date',
    cRTDLs: 'CRs and TDLs',
    toBeDetermined: 'To be determined',
    noneEntered: 'None entered',
    follow: 'Follow',
    following: 'Following'
  },
  stepsOverview: {
    heading: 'Start a new model plan',
    getStartedButton: 'Get started',
    summaryBox: {
      copy: 'Use this service to:',
      listItem: {
        start:
          'start a new Model Plan to analyze the operational and implementation needs of the model',
        upload:
          'upload and access documents related to your model request, like concept documents or policy papers',
        track:
          'track the IT solutions the model will use and track its status through implementation'
      },
      email:
        'If you have any questions, you can reach the [CMMI POC Team] at: <1>[email]@cms.hhs.gov</1>.'
    },
    steps: {
      heading: 'Steps involved in the process',
      description:
        'Below is an overview of the process involved in creating your draft model plan.',
      first: {
        heading:
          'Fill out the sections of the draft model plan form and document model requirements',
        description:
          'Tell the Model Intake Team about your model and collaborate with the rest of your team to draft model requirements around participants, population, operations, payment options, and more.'
      },
      second: {
        heading: 'Upload any existing model documentation',
        description:
          'Add additional details to your Model Plan by uploading documents such as a concept paper, draft ICIP, or other related materials.'
      },
      third: {
        heading: 'Iterate on your draft model plan',
        description:
          'Work with the Model Assessment Team and other administrative teams to iterate on model requirements.'
      },
      fourth: {
        heading: 'Track your IT solutions',
        description:
          'Work with your IT Lead or BSG to determine which IT solutions your model will use for the operational needs. Then, track the implementation status of those solutions to stay organized throughout the process.'
      },
      fifth: {
        heading: 'Finalize your Model Plan and prepare for clearance',
        description:
          'Review all sections of your Model Plan and confirm that your model is ready for internal clearance processes and matches your clearance documentation.'
      }
    }
  }
};

export default modelPlan;
