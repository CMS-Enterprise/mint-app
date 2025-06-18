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
    label: 'Mailbox title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.6
  },
  mailboxAddress: {
    gqlField: 'mailboxAddress',
    goField: 'MailboxAddress',
    dbField: 'mailbox_address',
    label: 'Mailbox address',
    sublabel: 'Add cms.hhs.gov team mailboxes.',
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
    label: 'Primary point of contact',
    sublabel:
      'If you check this box, it will replace any existing primary point of contact, but will not remove the existing contact from the overall list.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.1,
    options: {
      true: 'Yes',
      false: 'No'
    },
    tooltips: {
      true: 'The primary point of contact is the main person or mailbox that should be contacted with questions about this IT system or solution. They will receive update emails from MINT when a model chooses to use their system or solution.'
    }
  },
  receiveEmails: {
    gqlField: 'receiveEmails',
    goField: 'ReceiveEmails',
    dbField: 'receive_emails',
    label: 'Receive emails?',
    sublabel:
      'If you check this box, this user or mailbox will receive update notifications from MINT when models select this operational solution. Primary points of contact will always receive notifications.',
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
    sublabel: 'This field searches CMS’ EUA database.',
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
  addTeamMember: {
    title: 'Add a team member',
    cta: 'Add team member'
  },
  addTeamMailbox: {
    title: 'Add a team mailbox',
    cta: 'Add team mailbox',
    success: 'You added {{-contact}} as a point of contact.',
    error:
      'There was an issue adding this team mailbox. Please try again, and if the problem persists, try again later.'
  },
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
    text: '<bold>Contractor to be removed: </bold>{{-contact}}',
    cta: 'Remove contractor',
    success: 'You removed <bold>{{-contact}}</bold> as a contractor.',
    error:
      'There was an issue removing this contractor. Please try again, and if the problem persists, try again later.'
  },
  allFieldsRequired:
    'Fields marked with an asterisk ( <s>*</s> ) are required.',
  actionWarning: 'This action cannot be undone.',
  cancel: 'Cancel',
  saveChanges: 'Save Changes',
  alert:
    'This point of contact will receive notifications when this solution is selected. Please make sure this individual should receive these notifications before you proceed.'
};

export default mtoCommonSolutionContact;
