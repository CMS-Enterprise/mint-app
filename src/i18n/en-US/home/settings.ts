const homepageSettings = {
  heading: 'Homepage Settings',
  stepOne: '(Step 1 of 2)',
  stepTwo: '(Step 2 of 2)',
  description:
    'Display the content that’s most meaningful to your role. You can update this at any time.',
  descriptionTwo:
    'Arrange the content however you wish. You can update this at any time.',
  selection: 'Select which information to display on your homepage.',
  selectionTwo: 'Set the display order for your homepage.',
  settings: {
    MY_MODEL_PLANS: {
      heading: 'My Model Plans',
      description:
        'This section displays all of the Model Plans that you’re a team member of. Model links go to the Task List.'
    },
    ALL_MODEL_PLANS: {
      heading: 'All Model Plans',
      description:
        'This searchable table displays all Model Plans (like the one on the Models tab).'
    },
    FOLLOWED_MODELS: {
      heading: 'Models I’m following Models',
      description:
        'This section shows only the models you’re following (like the one on the Models tab).'
    },
    MODELS_WITH_CR_TDL: {
      heading: 'Models with FFS CRs or TDLs',
      description:
        'This searchable table displays models with Fee-for-Service (FFS) Change Requests (CRs) and Technical Direction Letters (TDLs).'
    },
    MODELS_BY_OPERATIONAL_SOLUTION: {
      heading: 'Models using specific operational solutions',
      description:
        'This tabbed section displays the models using the operational solutions you care about.'
    }
  },
  selectSolutions: 'Select solutions',
  emptySettings:
    'You don’t have any sections selected. Are you sure you want to proceed?',
  emptySettingsTwo:
    'You don’t have any sections selected. Go back to the previous step to select sections.',
  allSettings:
    'Are you sure you want every section? Your homepage will be really long.',
  back: 'Don’t customize and return to homepage',
  submit: 'Save customizations'
};

export default homepageSettings;
