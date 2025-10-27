import { ComponentGroup, ViewCustomizationType } from 'gql/generated/graphql';

export type HomepageSettingsType = Record<
  ViewCustomizationType,
  Record<'heading' | 'description', string>
>;

// TODO: Add translations for MODELS_BY_GROUP
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
  [ViewCustomizationType.MODELS_BY_STATUS]: {
    heading: 'Models by status',
    description:
      'This tabbed section displays models at each phase, starting with those that are pre-clearance through the model life cycle.'
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
      'This tabbed section displays the models using the solutions and IT systems you care about.'
  },
  [ViewCustomizationType.MODELS_BY_GROUP]: {
    heading: 'Models by group',
    description:
      'This tabbed section displays the models owned by a specific CMS component or CMMI group.'
  }
};

const componentGroups: Record<ComponentGroup, string> = {
  [ComponentGroup.CCMI_PCMG]: 'Patient Care Models Group (PCMG)',
  [ComponentGroup.CCMI_PPG]: 'Policy and Programs Group (PPG)',
  [ComponentGroup.CCMI_SCMG]: 'Seamless Care Models Group (SCMG)',
  [ComponentGroup.CCMI_SPHG]: 'State and Population Health Group (SPHG)',
  [ComponentGroup.CCMI_TBD]: 'To be determined',
  [ComponentGroup.CCSQ]: 'Center for Clinical Standards and Quality (CCSQ)',
  [ComponentGroup.CM]: 'Center for Medicare (CM)',
  [ComponentGroup.CMCS]: 'Center for Medicaid and CHIP Services (CMCS)',
  [ComponentGroup.CPI]: 'Center for Program Integrity (CPI)',
  [ComponentGroup.FCHCO]: 'Federal Coordinated Health Care Office (FCHCO)'
};

const componentGroupAcronyms: Record<ComponentGroup, string> = {
  [ComponentGroup.CCMI_PCMG]: 'CMMI/PCMG',
  [ComponentGroup.CCMI_PPG]: 'CMMI/PPG',
  [ComponentGroup.CCMI_SCMG]: 'CMMI/SCMG',
  [ComponentGroup.CCMI_SPHG]: 'CMMI/SPHG',
  [ComponentGroup.CCMI_TBD]: 'CMMI/TBD',
  [ComponentGroup.CCSQ]: 'CCSQ',
  [ComponentGroup.CM]: 'CM',
  [ComponentGroup.CMCS]: 'CMCS',
  [ComponentGroup.CPI]: 'CPI',
  [ComponentGroup.FCHCO]: 'FCHCO'
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
    'Models using the solutions and IT systems chosen below will show in a tabbed section.',
  operationalSolutions: 'Solutions',
  startTyping: 'Start typing the name of the solution',
  multiselectLabel: 'Solutions',
  save: 'Save',
  dontSelect: 'Don’t select solutions and return to previous page',
  success: ' Success! Your homepage has been updated.',
  noneSelected: 'None selected',
  componentGroups,
  componentGroupAcronyms,
  componentGroupsHeading: 'Select groups',
  componentGroupDescription:
    'Models owned by a specific CMS component or CMMI group chosen below will show in a tabbed section.',
  componentsAndGroups: 'Components and groups',
  startTypingComponentGroup:
    'Start typing the name or acronym of the component or group.',
  multiselectLabelGroups: 'Selected groups',
  dontSelectComponentGroups: 'Don’t select groups and return to previous page',
  selectComponentGroups: 'Select groups',
  updateGroups: 'Update groups'
};

export default homepageSettings;
