import { TranslationKeyContactCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const keyContact: TranslationKeyContactCustom = {
  subjectCategoryID: {
    gqlField: 'subjectCategoryID',
    goField: 'SubjectCategoryID',
    dbField: 'subject_category_id',
    label: 'Subject category',
    sublabel:
      "If you don't see the overall category you need, add a category before adding a SME.",
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.SELECT,
    tableReference: TableName.KEY_CONTACT_CATEGORY,
    order: 1
  },
  mailboxAddress: {
    gqlField: 'mailboxAddress',
    goField: 'MailboxAddress',
    dbField: 'mailbox_address',
    label: 'Mailbox address',
    sublabel: 'Add cms.hhs.gov team mailboxes.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.1
  },
  mailboxTitle: {
    gqlField: 'mailboxTitle',
    goField: 'MailboxTitle',
    dbField: 'mailbox_title',
    label: 'Mailbox title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.2
  },
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'SME name',
    sublabel: 'This field searches CMS’ EUA database.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.3
  },
  email: {
    gqlField: 'email',
    goField: 'Email',
    dbField: 'email',
    label: 'SME email',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.4
  },
  userId: {
    gqlField: 'userId',
    goField: 'UserId',
    dbField: 'user_id',
    label: 'User ID',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 1.5
  },
  subjectArea: {
    gqlField: 'subjectArea',
    goField: 'SubjectArea',
    dbField: 'subject_area',
    label: 'SME subject area',
    sublabel: 'Comma-separate multiple areas of subject matter expertise.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.6
  }
};

export const keyContactMisc = {
  add: { heading: 'Add a subject matter expert (SME)', cta: 'Add SME' },
  edit: { heading: 'Edit a subject matter expert (SME)', cta: 'Save changes' },
  selectDefault: 'Select',
  navs: ['Individual', 'Team mailbox'],
  cancel: 'Cancel',
  allFieldsRequired: 'Fields marked with an asterisk ( <s>*</s> ) are required.'
};

export default keyContact;
