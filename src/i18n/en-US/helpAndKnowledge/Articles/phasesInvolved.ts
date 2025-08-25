const phasesInvolved = {
  title: 'Phases involved in creating IT and operational support for models',
  description:
    'There are two phases invovled in creating IT and operational support for CMMI models.',
  getStartedButton: 'Get started',
  steps: [
    {
      heading: 'Model design and solution design',
      description:
        'This phase kicks off work within MINT; assembles the team; and identifies all of the IT systems, data, and operational contracts needed to support the model.',
      description2: 'This includes three sets of activities:',
      activities: [
        'Start a Model Plan',
        'Assemble the IT and operational team',
        'Start drafting a model-to-operations matrix (MTO) and identify the solutions and IT systems the team will leverage for the model’s operational needs'
      ],
      linkText: 'Learn more about this phase',
      link: '/help-and-knowledge/model-and-solution-design'
    },
    {
      heading: 'Model implementation and solution implementation',
      description:
        'This phase initiates and completes the necessary IT projects for the model.',
      description2: 'This includes two sets of activities:',
      activities: [
        'Initiate work with each operational solution team',
        'Use the MTO to track work up through implementation'
      ],
      linkText: 'Learn more about this phase',
      link: '/help-and-knowledge/model-and-solution-implementation'
    }
  ]
};
export default phasesInvolved;
