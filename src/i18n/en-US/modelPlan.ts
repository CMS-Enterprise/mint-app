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
    planComplete: 'Model plan compelte',
    icipComplete: 'ICIP complete',
    cmmiClearance: 'Internal (CMMI) clearance',
    cmsClearance: 'CMS clearance',
    hhsClearance: 'HHS clearance',
    ombASRFClearance: 'OMB/ASRF clearance',
    cleared: 'Cleared',
    announced: 'Announced'
  },
  stepsOverview: {
    heading: 'Start a new model plan',
    getStartedButton: 'Get started',
    summaryBox: {
      copy: 'Use this service to:',
      listItem: {
        add:
          'add a new Innovation Model request and kick off the model clearance process',
        upload:
          'upload and access documents related to your model request, like concept documents or policy papers'
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
          'Add additional details to your model plan by uploading additional documents such as [DOCUMENT EXAMPLES].'
      },
      third: {
        heading: 'Iterate on your draft model plan',
        description:
          'Work with the Model Intake Team and other administrative teams to Iterate on model requirements such as cost and budget estimates.'
      },
      fourth: {
        heading: 'Finalize your model',
        description:
          'Review all forms and confirm with the Model Intake Team that your model is ready for internal clearance processes.'
      }
    }
  }
};

export default modelPlan;
