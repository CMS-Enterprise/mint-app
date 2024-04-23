import { TranslationCRs } from 'types/translation';

export const crs: TranslationCRs = {
  idNumber: {
    gqlField: 'idNumber',
    goField: 'IdNumber',
    dbField: 'id_number',
    label: 'ID number',
    sublabel: 'Please include the prefix. Ex. CR-123456',
    dataType: 'string',
    formType: 'text'
  },
  title: {
    gqlField: 'title',
    goField: 'title',
    dbField: 'title',
    label: 'CR title',
    dataType: 'string',
    formType: 'text'
  },
  dateInitiated: {
    gqlField: 'dateInitiated',
    goField: 'DateInitiated',
    dbField: 'date_initiated',
    label: 'Initiated date',
    sublabel: 'mm/dd/yyyy',
    dataType: 'date',
    formType: 'datePicker'
  },
  dateImplemented: {
    gqlField: 'dateImplemented',
    goField: 'DateImplemented',
    dbField: 'date_implemented',
    label: 'Implementation date',
    sublabel: 'For example: April 2024',
    dataType: 'date',
    formType: 'select'
  },
  note: {
    gqlField: 'note',
    goField: 'note',
    dbField: 'note',
    label: 'Optional notes',
    sublabel:
      'Add any details about this CR that would be helpful to know at a glance',
    dataType: 'string',
    formType: 'textarea'
  }
};

export default crs;
