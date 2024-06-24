const homepageSettings = {
  heading: 'Homepage Settings',
  stepOne: '(Step 1 of 2)',
  description:
    'Display the content that’s most meaningful to your role. You can update this at any time.',
  selection: 'Select which information to display on your homepage.',
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
  selectSolutions: 'Select solutions'
};

export default homepageSettings;
