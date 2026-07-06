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
    cta: 'Save date'
  },
  dontSaveAndReturn: 'Don’t  add a date and return to model timeline',
  requiredField: 'Fields marked with an asterisk ( * ) are required.'
};
