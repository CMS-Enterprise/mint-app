export const modelToOperations: any = {};

export const modelToOperationsMisc: Record<string, any> = {
  heading: 'Model-to-operations matrix',
  forModel: 'for {{ modelName }}',
  milestones: 'Milestones',
  'systems-and-solutions': 'IT systems and solutions',
  needHelpDiscussion: 'Need help?',
  isMTOReady: 'Is this MTO ready for review?',
  lastUpdated: 'MTO last updated {{date}}',
  emptyMTO: 'Your model-to-operations matrix is a bit empty!',
  emptyMTOdescription: 'Choose an option below to get started.',
  returnToCollaboration: 'Return to model collaboration area',
  optionsCard: {
    milestones: {
      label: 'Milestones',
      header: 'Start with model milestones',
      description:
        'Model milestones are the key activities and functions that models must accomplish in order to be ready to go live. Most will be fulfilled by one or more IT systems or solutions. Many milestones are similar across models, so MINT offers a library of common milestones to select from.',
      buttonText: 'Browse common milestones',
      linkText: 'or, add a custom milestone'
    },
    'systems-and-solutions': {
      label: 'Operational solutions',
      header: 'Start with IT systems or other solutions',
      description:
        'Models use a variety of IT systems or solutions to fulfill model requirements. These could be IT systems, contracts or contract vehicles, cross-cutting groups, and more. Many models use similar methodologies, so MINT offers a library of common solutions to select from.',
      buttonText: 'Browse common solutions',
      linkText: 'or, add a custom solution'
    }
  }
};

export default modelToOperations;
