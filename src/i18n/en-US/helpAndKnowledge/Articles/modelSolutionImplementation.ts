const modelSolutionImplementation = {
  title: 'Model implementation and solution implementation',
  description:
    'This is the second phase in obtaining operational support for models. This phase initiates and completes the necessary IT projects for the model and tracks work in the model-to-operations matrix (MTO).',
  summaryBox: {
    copy: 'Activities involved',
    items: [
      'Initiate work with each operational solution team',
      'Track work up through implementation'
    ]
  },
  initiateWork: {
    heading: '1. Initiate work with each operational solution team',
    purpose: 'Purpose',
    purposeDescription:
      'To notify the project teams for each operational solution so that there is enough notice to implement the work needed.',
    when: 'When',
    whenDescription:
      'The IT Lead will document key dates in the model’s MTO and will assist model teams in understanding and following the release calendar of each system as all system timelines are different.',
    activities: {
      heading: 'Activities',
      items: [
        {
          heading: 'Determine priority',
          description:
            'Based on the solutions and IT systems added to the MTO in the previous phase, the IT Lead will work with the Model Lead to determine which projects need to begin first. Working with some systems takes longer than others. The IT Lead will help model teams with the necessary timing.'
        },
        {
          heading: 'Start work with the product/project teams',
          description:
            'The IT Lead will complete the documents and activities required by each operational solution team. All solutions are different, but this may include:',
          items: [
            'Onboarding request',
            'Change request',
            'Contract Action',
            'Business Requirements',
            'User Stories'
          ]
        }
      ],
      learnMore: 'Learn more about utilizing available operational solutions'
    },
    outcomes: {
      heading: 'Outcomes',
      description: 'These activities produce the following outcomes:',
      items: [
        'Relevant product/project teams have been notified about the model and the model is in the backlog.',
        'Solutions and milestones in the MTO are updated with the current status of work.'
      ]
    }
  },
  trackWork: {
    heading: '2. Track work up through implementation',
    purpose: 'Purpose',
    purposeDescription:
      'For all groups involved to stay organized and informed throughout the implementation process.',
    when: 'When',
    whenDescription:
      'After the operational solutions have been identified and outreach has began, the IT Lead will use the MTO to help keep track of the status of each solution up until it has been implemented.',
    activities: {
      heading: 'Activities',
      items: [
        {
          heading:
            'Stay informed on the status of each project relevant to the model',
          description:
            'To accomplish this, the IT Lead will need to do the following:',
          items: [
            'Attend project meetings',
            'Read project materials',
            'Communication with product owners'
          ]
        },
        {
          heading: 'Track progress of each operational solution within MINT',
          sections: [
            {
              description:
                'The IT Lead will work with the model team to update the status of each solution to the following:',
              items: [
                {
                  heading: 'Not started'
                },
                {
                  heading: 'Onboarding',
                  items: [
                    'Onboarding includes activities such as contract modification, change request, onboarding request, etc.'
                  ]
                },
                {
                  heading: 'Backlog',
                  items: [
                    'This means the model team’s work is on the project team’s backlog but not started yet.'
                  ]
                },
                {
                  heading: 'In progress'
                },
                {
                  heading: 'Completed'
                }
              ]
            },
            {
              description:
                'The IT Lead will work with the model team to flag the risk status of each of the solutions and its related milestones:',
              items: [
                {
                  heading: 'No risk (on track)'
                },
                {
                  heading: 'Some risk (off track)'
                },
                {
                  heading: 'Significantly at risk'
                }
              ]
            }
          ]
        }
      ]
    },
    outcomes: {
      heading: 'Outcomes',
      description: 'These activities produce the following outcomes:',
      items: [
        'Model Team knows the status of projects.',
        'Product owners, project managers, and associated teams manage and implement the systems and other services required for a model.',
        'Leadership can see the implementation status of projects.',
        'There is an up-to-date record of model milestones and solution activities in MINT.'
      ]
    }
  }
};

export default modelSolutionImplementation;
