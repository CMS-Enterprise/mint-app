import { TranslationOpsEvalAndLearning } from 'types/translation';

export const opsEvalAndLearning: TranslationOpsEvalAndLearning = {
  agencyOrStateHelp: {
    gqlField: 'agencyOrStateHelp',
    goField: 'AgencyOrStateHelp',
    dbField: 'agency_or_state_help',
    question:
      'Will another Agency or State help design/operate the model? Select all that apply.',
    readonlyQuestion:
      'Will another Agency or State help design/operate the model?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      YES_STATE: 'Yes, we will partner with states',
      YES_AGENCY_IDEAS: 'Yes, we will get ideas from another agency',
      YES_AGENCY_IAA:
        'Yes, we will get support from another agency through Inter Agency Agreement (IAA)',
      NO: 'No',
      OTHER: 'Other'
    }
  },
  agencyOrStateHelpOther: {
    gqlField: 'agencyOrStateHelpOther',
    goField: 'AgencyOrStateHelpOther',
    dbField: 'agency_or_state_help_other',
    question: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  agencyOrStateHelpNote: {
    gqlField: 'agencyOrStateHelpNote',
    goField: 'AgencyOrStateHelpNote',
    dbField: 'agency_or_state_help_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  stakeholders: {
    gqlField: 'stakeholders',
    goField: 'Stakeholders',
    dbField: 'stakeholders',
    question: 'What stakeholders do you plan to communicate with?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected stakeholders',
    options: {
      BENEFICIARIES: 'Beneficiaries',
      COMMUNITY_ORGANIZATIONS: 'Community organizations',
      PARTICIPANTS: 'Participants',
      PROFESSIONAL_ORGANIZATIONS: 'Professional organizations',
      PROVIDERS: 'Providers',
      STATES: 'States',
      OTHER: 'Other'
    },
    filterGroups: ['cbosc']
  },
  stakeholdersOther: {
    gqlField: 'stakeholdersOther',
    goField: 'StakeholdersOther',
    dbField: 'stakeholders',
    question:
      'Please describe the other stakeholders you plan to communicate with.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  stakeholdersNote: {
    gqlField: 'stakeholdersNote',
    goField: 'StakeholdersNote',
    dbField: 'stakeholders_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  helpdeskUse: {
    gqlField: 'helpdeskUse',
    goField: 'HelpdeskUse',
    dbField: 'stakeholders_note',
    question: 'Do you plan to use a helpdesk?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cbosc']
  },
  helpdeskUseNote: {
    gqlField: 'helpdeskUseNote',
    goField: 'HelpdeskUseNote',
    dbField: 'helpdesk_use_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  contractorSupport: {
    gqlField: 'contractorSupport',
    goField: 'ContractorSupport',
    dbField: 'contractor_support',
    question: 'What contractors will support your model?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      ONE: 'One contractor to support implementation',
      MULTIPLE:
        'May have separate contractors for different implementation functions',
      NONE: 'Do not plan to use an implemenation contractor',
      OTHER: 'Other'
    },
    filterGroups: ['cbosc', 'iddoc']
  },
  contractorSupportOther: {
    gqlField: 'contractorSupportOther',
    goField: 'ContractorSupportOther',
    dbField: 'contractor_support_other',
    question: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  contractorSupportHow: {
    gqlField: 'contractorSupportHow',
    goField: 'ContractorSupportHow',
    dbField: 'contractor_support_how',
    question: 'In what capacity will they support your model?',
    hint: '(implementation, data analysis, quality, etc.)',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  contractorSupportNote: {
    gqlField: 'contractorSupportNote',
    goField: 'ContractorSupportNote',
    dbField: 'contractor_support_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  iddocSupport: {
    gqlField: 'iddocSupport',
    goField: 'IddocSupport',
    dbField: 'iddoc_support',
    question: 'Are you planning to use IDDOC support?',
    hint:
      'IDDOC is commonly known as ACO-OS (Accountable Care Organization Operating System). They can provide support for design, development, operations, and maintenance.',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc']
  },
  iddocSupportNote: {
    gqlField: 'iddocSupportNote',
    goField: 'IddocSupportNote',
    dbField: 'iddoc_support_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  }
};

export const opsEvalAndLearningMisc = {
  heading: 'Operations, evaluation, and learning',
  operationsEvaluationAndLearningHeading:
    'Review operations, evaluation, and learning',
  breadcrumb: 'Operations, evaluation, and learning',
  additionalQuestionsInfo:
    'If you select yes, there will be additional questions to answer.'
};

export default opsEvalAndLearning;
