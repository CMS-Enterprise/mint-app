const prepareForClearance = {
  heading: 'Prepare for clearance',
  subheading: 'Select which sections are ready for clearance.',
  breadcrumb: 'Prepare for clearance',
  reviewBreadcrumbs: {
    basics: 'Review model basics',
    generalCharacteristics: 'Review general characteristics',
    participantsAndProviders: 'Review participants and providers',
    beneficiaries: 'Review beneficiaries',
    opsEvalAndLearning: 'Review operations evaluation and learning',
    payments: 'Review payment'
  },
  description:
    'After you’ve iterated on your Model Plan, make sure the information that’s included in your Model Plan matches any documentation that you’re using for clearance.',
  update: 'Update section statuses',
  dontUpdate: 'Don’t update statuses and return to task list',
  markedAsReady: 'Marked ready for clearance by {{-name}} on {{-date}}',
  review: 'Review {{-section}}',
  changes: 'Make changes to {{-section}}',
  forModelPlan: 'for {{-modelName}}',
  markAsReady: 'Mark as ready for clearance',
  basicsChanges: 'Make changes to model basics',
  errorHeading: 'Update Error',
  mutationError: 'Failed to mark section as ’Ready for clearance’',
  modal: {
    heading: 'Are you sure you want to update this Model Plan section?',
    subheading: 'This section has already been marked ready for clearance. ',
    update: 'Update this section ',
    goBack: 'Go back'
  }
};

export default prepareForClearance;
