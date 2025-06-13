import { TranslationMTOCommonSolutionContactCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const mtoCommonSolutionContact: TranslationMTOCommonSolutionContactCustom = {
  key: {
    gqlField: 'key',
    goField: 'Key',
    dbField: 'mto_common_solution_key',
    label: 'MTO Common Solution Contact',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.TEXT,
    tableReference: TableName.MTO_COMMON_SOLUTION,
    order: 1.2
  },
  mailboxTitle: {
    gqlField: 'mailboxTitle',
    goField: 'MailboxTitle',
    dbField: 'mailbox_title',
    label: 'Mailbox Title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.6
  },
  mailboxAddress: {
    gqlField: 'mailboxAddress',
    goField: 'MailboxAddress',
    dbField: 'mailbox_address',
    label: 'Mailbox Address',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.7
  },
  userId: {
    gqlField: 'userId',
    goField: 'UserId',
    dbField: 'user_id',
    label: 'User ID',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 1.8
  },
  isTeam: {
    gqlField: 'isTeam',
    goField: 'IsTeam',
    dbField: 'is_team',
    label: 'Is this contact a team mailbox?',
    sublabel:
      "Select 'Yes' if this contact represents a team mailbox rather than an individual.",
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.5,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  role: {
    gqlField: 'role',
    goField: 'Role',
    dbField: 'role',
    label: 'Role',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.4
  },
  isPrimary: {
    gqlField: 'isPrimary',
    goField: 'IsPrimary',
    dbField: 'is_primary',
    label: 'Is this the primary contact?',
    sublabel: "Select 'Yes' if this is the main contact for this solution.",
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.1,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  receiveEmails: {
    gqlField: 'receiveEmails',
    goField: 'ReceiveEmails',
    dbField: 'receive_emails',
    label: 'Should this contact receive emails?',
    sublabel:
      "Select 'Yes' if this contact should receive notifications or emails.",
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.9,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.3
  },
  email: {
    gqlField: 'email',
    goField: 'Email',
    dbField: 'email',
    label: 'Email',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1
  }
};

export const mtoCommonSolutionContactMisc = {
  addTeamMember: 'Add team member',
  addTeamMailbox: 'Add team mailbox',
  addContractor: 'Add contractor',
  removePointOfContact: {
    title: 'Are you sure you want to remove this point of contact?',
    text: '<bold>Point of contact to be removed:</bold> {{-contact}}',
    cta: 'Remove point of contact',
    success: 'You removed <bold>{{-contact}}</bold> as a point of contact.',
    error:
      'There was an issue removing this point of contact. Please try again, and if the problem persists, try again later.'
  },
  removeContractor: {
    title: 'Are you sure you want to remove this contractor?',
    text: '<bold>Contractor to be removed::</bold> {{-contact}}',
    cta: 'Remove contractor',
    success: 'You removed <bold>{{-contact}}</bold> as a contractor.',
    error:
      'There was an issue removing this contractor. Please try again, and if the problem persists, try again later.'
  },
  actionWarning: 'This action cannot be undone.',
  cancel: 'Cancel',
  saveChanges: 'Save Changes',
  alert:
    'This point of contact will receive notifications when this solution is selected. Please make sure this individual should receive these notifications before you proceed.'
};

export default mtoCommonSolutionContact;
