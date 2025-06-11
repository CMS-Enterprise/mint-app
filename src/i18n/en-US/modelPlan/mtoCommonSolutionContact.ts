import { TranslationMTOCommonSolutionContactCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoCommonSolutionContact: TranslationMTOCommonSolutionContactCustom =
  {
    email: {
      gqlField: 'email',
      goField: 'Email',
      dbField: 'email',
      label: 'Email',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.0
    },
    isPrimary: {
      gqlField: 'isPrimary',
      goField: 'IsPrimary',
      dbField: 'is_primary',
      label: 'Primary point of contact',
      sublabel:
        'If you check this box, it will replace any existing primary point of contact, but will not remove the existing contact from the overall list. If this is already checked, you must designate another primary contact in order to remove this contact’s primary status.',
      questionTooltip:
        'The primary point of contact is the main person or mailbox that should be contacted with questions about this IT system or solution. They will receive update emails from MINT when a model chooses to use their system or solution.',
      dataType: TranslationDataType.BOOLEAN,
      formType: TranslationFormType.CHECKBOX,
      order: 1.1,
      options: {
        true: 'Yes',
        false: 'No'
      }
    },
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
    role: {
      gqlField: 'role',
      goField: 'Role',
      dbField: 'role',
      label: 'Role',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.4
    },
    isTeam: {
      gqlField: 'isTeam',
      goField: 'IsTeam',
      dbField: 'is_team',
      label: 'Is Team',
      dataType: TranslationDataType.BOOLEAN,
      formType: TranslationFormType.CHECKBOX,
      order: 1.5,
      options: {
        true: 'Yes',
        false: 'No'
      }
    },
    mailboxAddress: {
      gqlField: 'mailboxAddress',
      goField: 'mailboxAddress',
      dbField: 'mailbox_address',
      label: 'Mailbox address',
      sublabel: 'Add cms.hhs.gov team mailboxes.',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.6
    },
    mailboxTitle: {
      gqlField: 'mailboxTitle',
      goField: 'mailboxTitle',
      dbField: 'mailbox_title',
      label: 'Mailbox title',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.7
    },
    receiveEmails: {
      gqlField: 'receiveEmails',
      goField: 'receiveEmails',
      dbField: 'receive_emails',
      label: 'Receive emails?',
      sublabel:
        'If you check this box, this user or mailbox will receive update notifications from MINT when models select this operational solution. Primary points of contact will always receive notifications.',
      dataType: TranslationDataType.BOOLEAN,
      formType: TranslationFormType.CHECKBOX,
      order: 1.8,
      options: {
        true: 'Yes',
        false: 'No'
      }
    }
  };
export const mtoCommonSolutionContactMisc = {
  addTeamMember: 'Add team member',
  addTeamMailbox: 'Add team mailbox',
  addContractor: 'Add contractor',
  removePointOfContact: 'Remove point of contact',
  removeContractor: 'Remove contractor',
  cancel: 'Cancel',
  saveChanges: 'Save Changes',
  alert:
    'This point of contact will receive notifications when this solution is selected. Please make sure this individual should receive these notifications before you proceed.'
};

export default mtoCommonSolutionContact;
