import { ViewCustomizationType } from 'gql/generated/graphql';

export type HomepageSettingsType = Record<
  ViewCustomizationType,
  Record<'heading' | 'description', string>
>;

const settings: HomepageSettingsType = {
  [ViewCustomizationType.MY_MODEL_PLANS]: {
    heading: 'My Model Plans',
    description:
      'This section displays all of the Model Plans that you’re a team member of. Model links go to the Task List.'
  },
  [ViewCustomizationType.ALL_MODEL_PLANS]: {
    heading: 'All Model Plans',
    description:
      'This searchable table displays all Model Plans (like the one on the Models tab).'
  },
  [ViewCustomizationType.FOLLOWED_MODELS]: {
    heading: 'Models I’m following',
    description:
      'This section shows only the models you’re following (like the one on the Models tab).'
  },
  [ViewCustomizationType.MODELS_WITH_CR_TDL]: {
    heading: 'Models with FFS CRs or TDLs',
    description:
      'This searchable table displays models with Fee-for-Service (FFS) Change Requests (CRs) and Technical Direction Letters (TDLs).'
  },
  [ViewCustomizationType.MODELS_APPROACHING_CLEARANCE]: {
    heading: 'Models approaching clearance',
    description:
      'This simplified section displays the models within six months of clearance organized chronologically.'
  },
  [ViewCustomizationType.MODELS_BY_SOLUTION]: {
    heading: 'Models using specific solutions',
    description:
      'This tabbed section displays the models using the solutions you care about.'
  }
};

const homepageSettings = {
  heading: 'Homepage settings',
  stepOne: '(Step 1 of 2)',
  stepTwo: '(Step 2 of 2)',
  description:
    'Display the content that’s most meaningful to your role. You can update this at any time.',
  descriptionTwo:
    'Arrange the content however you wish. You can update this at any time.',
  selection: 'Select which information to display on your homepage.',
  selectionTwo: 'Set the display order for your homepage.',
  orderUp: 'Order setting up',
  orderDown: 'Order setting down',
  settings,
  selectSolutions: 'Select solutions',
  updateSolutions: 'Update solutions',
  emptySettings:
    'You don’t have any sections selected. Are you sure you want to proceed?',
  emptySettingsTwo:
    'You don’t have any sections selected. Go back to the previous step to select sections.',
  allSettings:
    'Are you sure you want every section? Your homepage will be really long.',
  back: 'Don’t customize and return to homepage',
  submit: 'Save customizations',
  solutionError:
    'There was a problem saving your selected solutions. Please try again.',
  settingsError:
    'There was a problem saving your selected settings. Please try again.',
  solutionsHeading: 'Select solutions',
  solutionDescription:
    'Models using the solutions chosen below will show in a tabbed section.',
  operationalSolutions: 'Solutions',
  startTyping: 'Start typing the name of the solution',
  multiselectLabel: 'Solutions',
  save: 'Save',
  dontSelect: 'Don’t select solutions and return to previous page',
  success: ' Success! Your homepage has been updated.',
  noneSelected: 'None selected'
};

export default homepageSettings;
