import { FrequencyType } from 'gql/gen/graphql';

export const miscellaneous: Record<string, string> = {
  mandatoryFields: 'All fields are mandatory',
  saveAndReturn: 'Save and return to task list',
  for: 'for',
  home: 'Home',
  next: 'Next',
  back: 'Back',
  tasklistBreadcrumb: 'Model Plan task list',
  cancel: 'Cancel',
  select: 'Select',
  additionalNote: 'Add an additional note',
  datePlaceholder: 'mm/dd/yyyy',
  yes: 'Yes',
  no: 'No',
  howSo: 'How so?',
  pleaseDescribe: 'Please describe',
  pleaseSpecify: 'Please specify',
  saveAndStartNext: 'Save and start next Model Plan section',
  continueToTaskList: 'Continue to Model Plan task list',
  returnToTaskList: 'Return to Model Plan task list',
  noResults: 'No results found',
  checkAndFix: 'Please check and fix the following',
  notes: 'Notes',
  noneEntered: 'None entered',
  na: 'No answer entered',
  noAdditionalInformation: 'No additional information specified',
  otherNotSpecified: 'Other not specified',
  noAdditionalInfo: 'No additional information specified',
  dateWarning:
    'You’ve entered one or more dates that are in the past. Please double-check your dates to make sure they’re accurate.',
  helpText:
    "If there's a question or field that is not applicable to your model or you don't currently know the answer, you may leave it blank. If you need help, ask a question using the link below.",
  modelPlanStatus: 'Model Plan status',
  modelPlanCopy:
    'This section of the Model Plan ({{-sectionName}}) is ready for review.',
  markedReady: 'Marked ready for review by {{-reviewer}} on ',
  validDate: 'Please use a valid date format.',
  apolloFailField: 'Failed to save field value/s'
};

// Reusable translated option for all frequency type questions
export const frequencyOptions: Record<FrequencyType, string> = {
  ANNUALLY: 'Annually',
  SEMIANUALLY: 'Semiannually',
  QUARTERLY: 'Quarterly',
  MONTHLY: 'Monthly',
  CONTINUALLY: 'Continually',
  OTHER: 'Other'
};

export default miscellaneous;
