import { TranslationTDLs } from 'types/translation';

export const tdls: TranslationTDLs = {
  idNumber: {
    gqlField: 'idNumber',
    goField: 'IdNumber',
    dbField: 'id_number',
    label: 'ID number',
    sublabel: 'Please include the prefix. Ex. TDL-123456',
    dataType: 'string',
    formType: 'text'
  },
  title: {
    gqlField: 'title',
    goField: 'title',
    dbField: 'title',
    label: 'TDL title',
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
  note: {
    gqlField: 'note',
    goField: 'note',
    dbField: 'note',
    label: 'Optional notes',
    sublabel:
      'Add any details about this TDL that would be helpful to know at a glance',
    dataType: 'string',
    formType: 'textarea'
  }
};

export default tdls;
