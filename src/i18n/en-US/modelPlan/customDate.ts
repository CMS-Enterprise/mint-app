import { TranslationCustomDate } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const customDate: TranslationCustomDate = {
  title: {
    gqlField: 'title',
    goField: 'title',
    dbField: 'title',
    label: 'Date title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  description: {
    gqlField: 'description',
    goField: 'description',
    dbField: 'description',
    label: 'Date description',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.02
  },
  dateType: {
    gqlField: 'dateType',
    goField: 'DateType',
    dbField: 'date_type',
    label: 'Date type',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    order: 1.03,
    options: {
      SINGLE: 'Single date',
      RANGE: 'Date range'
    }
  },
  startDate: {
    gqlField: 'startDate',
    goField: 'StartDate',
    dbField: 'start_date',
    label: 'Start date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.04
  },
  endDate: {
    gqlField: 'endDate',
    goField: 'EndDate',
    dbField: 'end_date',
    label: 'End date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.05
  }
};

export const customDateMisc = {
  add: {
    heading: 'Add a date',
    description: 'Add a custom date or date range to your model timeline.',
    returnCta: 'Don’t add a date and return to model timeline',
    saveCta: 'Save date',
    cancelCta: 'Don’t add a date and return to model timeline',
    success:
      'You have added a new date (<bold>{{-name}}</bold>) to the model timeline.',
    error:
      'There was an error adding your new timeline date. Please try again. If the error persists, please try again another time.'
  },
  edit: {
    heading: 'Edit a date',
    description:
      'Make changes to a custom date or date range on your model timeline.',
    returnCta: 'Don’t edit a date and return to model timeline',
    saveCta: 'Save changes',
    cancelCta: 'Don’t save changes and return to model timeline',
    success:
      'You have updated the date (<bold>{{-name}}</bold>) on the model timeline.',
    error:
      'There was an error editing your timeline date. Please try again. If the error persists, please try again another time.'
  },
  remove: {
    title: 'Are you sure you want to remove this date?',
    text: 'This action cannot be undone, though you may re-add the date after removing it.',
    cta: 'Remove date',
    cancel: 'Go back',
    success:
      'You have removed the date (<bold>{{-name}}</bold>) from the model timeline.',
    error:
      'There was an error removing your timeline date. Please try again. If the error persists, please try again another time.'
  },
  requiredField: 'Fields marked with an asterisk ( <s>*</s> ) are required.',
  date: 'Date',
  format: 'mm/dd/yyyy'
};
