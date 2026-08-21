import { TranslationContractAssistance } from 'types/translation';

import {
  CtatcmmiDivisionOption,
  CtatcmmiGroupOption,
  CtatContractActivityType,
  CtatContractType,
  CtatHelpNeededType,
  CtatRequestUrgency,
  CtatStatus,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

type CtatRealGroupOption =
  | CtatcmmiGroupOption.BSG
  | CtatcmmiGroupOption.LDG
  | CtatcmmiGroupOption.PCMG
  | CtatcmmiGroupOption.PPG
  | CtatcmmiGroupOption.RREG
  | CtatcmmiGroupOption.SCMG
  | CtatcmmiGroupOption.SPHG;

export const cmmiGroups: Record<CtatcmmiGroupOption, string> = {
  [CtatcmmiGroupOption.BSG]: 'Business Service Group (BSG)',
  [CtatcmmiGroupOption.LDG]: 'Learning and Diffusion Group (LDG)',
  [CtatcmmiGroupOption.PCMG]: 'Patient Care Model Group (PCMG)',
  [CtatcmmiGroupOption.PPG]: 'Policy and Programs Group (PPG)',
  [CtatcmmiGroupOption.RREG]:
    'Research and Rapid Cycle Evaluation Group (RREG)',
  [CtatcmmiGroupOption.SCMG]: 'Seamless Care Model Group (SCMG)',
  [CtatcmmiGroupOption.SPHG]: 'State and Population Health Group (SPHG)',
  [CtatcmmiGroupOption.OTHER]: 'Other'
};

export const cmmiDivisions: Record<CtatcmmiDivisionOption, string> = {
  [CtatcmmiDivisionOption.BSG_DBOM]:
    'Division of Business Operations & Management (BSG/DBOM)',
  [CtatcmmiDivisionOption.BSG_DCCS]:
    'Division of Central Contracts Services (BSG/DCCS)',
  [CtatcmmiDivisionOption.BSG_DSSOS]:
    'Division of Systems Support, Operation, & Security (BSG/DSSOS)',
  [CtatcmmiDivisionOption.BSG_DTS]:
    'Division of Technology Solutions (BSG/DTS)',
  [CtatcmmiDivisionOption.LDG_DMLS]:
    'Division of Model Learning Systems (LDG/DMLS)',
  [CtatcmmiDivisionOption.LDG_DAN]: 'Division of Analysis & Networks (LDG/DAN)',
  [CtatcmmiDivisionOption.PCMG_DAPC]:
    'Division of Advance Primary Care (PCMG/DAPC)',
  [CtatcmmiDivisionOption.PCMG_DHCPM]:
    'Division of Health Care Payment Models (PCMG/DHCPM)',
  [CtatcmmiDivisionOption.PCMG_DSPM]:
    'Division of Specialty Payment Models (PCMG/DSPM)',
  [CtatcmmiDivisionOption.PCMG_DAPM]:
    'Division of Ambulatory Payment Models (PCMG/DAPM)',
  [CtatcmmiDivisionOption.PCMG_DPM]: 'Division of Payment Models (PCMG/DPM)',
  [CtatcmmiDivisionOption.PPG_DAPMI]:
    'Division of Alternative Payment Model Infrastructure (PPG/DAPMI)',
  [CtatcmmiDivisionOption.PPG_DDA]: 'Division of Data Analytics (PPG/DDA)',
  [CtatcmmiDivisionOption.PPG_DESP]:
    'Division of Stakeholder Engagement & Policy (PPG/DESP)',
  [CtatcmmiDivisionOption.PPG_DPMS]:
    'Division of Portfolio Management & Strategy (PPG/DPMS)',
  [CtatcmmiDivisionOption.RREG_DHSR]:
    'Division of Health System Research (RREG/DHSR)',
  [CtatcmmiDivisionOption.RREG_DPAR]:
    'Division of Payment and Accountability Research (RREG/DPAR)',
  [CtatcmmiDivisionOption.RREG_DSPR]:
    'Division of Special Populations Research (RREG/DSPR)',
  [CtatcmmiDivisionOption.RREG_DRAM]:
    'Division of Data, Research, and Analytic Methods (RREG/DRAM)',
  [CtatcmmiDivisionOption.SCMG_DHPI]:
    'Division of Health Plan Innovation (SCMG/DHPI)',
  [CtatcmmiDivisionOption.SCMG_DFR]: 'Division of Financial Risk (SCMG/DFR)',
  [CtatcmmiDivisionOption.SCMG_DSI]:
    'Division of Seamless Infrastructure (SCMG/DSI)',
  [CtatcmmiDivisionOption.SCMG_DDI]: 'Division of Drug Innovation (SCMG/DDI)',
  [CtatcmmiDivisionOption.SPHG_DMPM]:
    'Division of Multi-Payer Models (SPHG/DMPM)',
  [CtatcmmiDivisionOption.SPHG_DHII]:
    'Division of Health Innovation & Integration (SPHG/DHII)',
  [CtatcmmiDivisionOption.SPHG_DPHII]:
    'Division of Population Health Incentive & Infrastructure (SPHG/DPHII)',
  [CtatcmmiDivisionOption.SPHG_DHCD]:
    'Division of Health Care Delivery (SPHG/DHCD)',
  [CtatcmmiDivisionOption.SPHG_DSBI]:
    'Division of State Based initiatives (SPHG/DSBI)',
  [CtatcmmiDivisionOption.OTHER]: 'Other'
};

export const contractActivityTypes: Record<CtatContractActivityType, string> = {
  [CtatContractActivityType.EVALUATION]: 'Evaluation',
  [CtatContractActivityType.IMPLEMENTATION]: 'Implementation',
  [CtatContractActivityType.LEARNING]: 'Learning',
  [CtatContractActivityType.TECHNICAL_ASSISTANCE]: 'Technical Assistance',
  [CtatContractActivityType.OTHER]: 'Other'
};

export const contractTypes: Record<CtatContractType, string> = {
  [CtatContractType.COST_PLUS_FIXED_FEE]: 'Cost Plus Fixed Fee',
  [CtatContractType.COST_REIMBURSEMENT]: 'Cost Reimbursement',
  [CtatContractType.FIRM_FIXED_PRICE]: 'Firm Fixed Price',
  [CtatContractType.INCENTIVE_CONTRACT]: 'Incentive Contract',
  [CtatContractType.TIME_AND_MATERIALS]: 'Time and Materials',
  [CtatContractType.OTHER]: 'Other'
};

export const helpNeededTypes: Record<CtatHelpNeededType, string> = {
  [CtatHelpNeededType.CALM_SYSTEM_REQUISITION_SUPPORT]: 'CALM support',
  [CtatHelpNeededType.PRE_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING]:
    'Contract Cost Review (CCR) processing',
  [CtatHelpNeededType.POST_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING]:
    'Contract Cost Review (CCR) processing',
  [CtatHelpNeededType.DEFINING_AND_DOCUMENTING_CONTRACT_REQUIREMENTS]:
    'Defining and documenting contract requirements',
  [CtatHelpNeededType.DEPARTMENTAL_EFFICIENCY_REVIEW_DER]:
    'Departmental Efficiency Review (DER)',
  [CtatHelpNeededType.GUIDANCE_ON_DETERMINATIONS_AND_FINDINGS_DF]:
    'Guidance on Determinations & Findings (D&F)',
  [CtatHelpNeededType.GUIDANCE_ON_JUSTIFICATION_AND_APPROVAL_JA]:
    'Guidance on Justification and Approval (J&A)',
  [CtatHelpNeededType.GUIDANCE_ON_MARKET_RESEARCH]:
    'Guidance on market research',
  [CtatHelpNeededType.GUIDANCE_ON_TEP_MEMBERSHIP_SCORING_REPORTING]:
    'Guidance on Technical Evaluation Panel (TEP) membership, scoring, and/or reporting',
  [CtatHelpNeededType.INDEPENDENT_GOVERNMENT_COST_ESTIMATE_IGCE_PREPARATION]:
    'Independent Government Cost Estimate (IGCE) preparation',
  [CtatHelpNeededType.POLITICAL_APPOINTEE_APPROVAL_PAA]:
    'Political Appointee Approval (PAA)',
  [CtatHelpNeededType.REQUEST_FOR_CONTRACT_MEMO_RFC]:
    'Request for Contract Memo (RFC)',
  [CtatHelpNeededType.REQUEST_FOR_INFORMATION_RFI]:
    'Request for Information (RFI)',
  [CtatHelpNeededType.REQUEST_FOR_PROPOSAL_RFP]: 'Request for Proposal (RFP)',
  [CtatHelpNeededType.REQUEST_FOR_QUOTATION_RFQ]: 'Request for Quotation (RFQ)',
  [CtatHelpNeededType.SOW_SOO_PWS_DEVELOPMENT]:
    'Statement of Work (SOW) / Statement of Objectives (SOO) / Performance Work Statement (PWS) development',
  [CtatHelpNeededType.CONTRACT_CLOSEOUT_ACTIVITIES_SUPPORT]:
    'Contract close out activities and support',
  [CtatHelpNeededType.CONTRACTOR_PERFORMANCE_MANAGEMENT]:
    'Contractor performance management',
  [CtatHelpNeededType.DATA_USE_AGREEMENT_DUA]: 'Data Use Agreement (DUA)',
  [CtatHelpNeededType.DEPARTMENTAL_EFFICIENCY_REVIEW_DER_MODIFICATION]:
    'Departmental Efficiency Review (DER) Modification',
  [CtatHelpNeededType.DOCUMENTING_AND_SUBMITTING_CPARS]:
    'Documenting and submitting contractor performance evaluations (CPARS)',
  [CtatHelpNeededType.ENTERPRISE_USER_ADMINISTRATION_EUA_JOB_CODES]:
    'Enterprise User Administration (EUA) job codes',
  [CtatHelpNeededType.FOREIGN_NATIONAL_MANAGEMENT_SYSTEM_FNMS]:
    'Foreign National Management System (FNMS)',
  [CtatHelpNeededType.IDENTITY_AND_CREDENTIALING_TOOL_ICT]:
    'Identity and Credentialing Tool (ICT)',
  [CtatHelpNeededType.INVOICE_PROCESSING_PLATFORM_IPP]:
    'Invoice Processing Platform (IPP)',
  [CtatHelpNeededType.MAINTAINING_THE_ELECTRONIC_COR_ECOR_FILE]:
    'Maintaining the electronic COR (e-COR) file',
  [CtatHelpNeededType.POLITICAL_APPOINTEE_APPROVAL_PAA_MODIFICATION]:
    'Political Appointee Approval (PAA) modification',
  [CtatHelpNeededType.TECHNICAL_DIRECTION_LETTERS_TDLS]:
    'Technical Direction Letters (TDLs)',
  [CtatHelpNeededType.OTHER]: 'Other'
};

export const helpNeededTypeDisplayOverrides: Partial<
  Record<CtatHelpNeededType, string>
> = {
  [CtatHelpNeededType.PRE_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING]:
    'Contract Cost Review (CCR) processing - Pre-award',
  [CtatHelpNeededType.POST_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING]:
    'Contract Cost Review (CCR) processing - Post-award'
};

export const requestUrgencies: Record<CtatRequestUrgency, string> = {
  [CtatRequestUrgency.HIGH]: 'High',
  [CtatRequestUrgency.MEDIUM]: 'Medium',
  [CtatRequestUrgency.LOW]: 'Low'
};

export const statuses: Record<CtatStatus, string> = {
  [CtatStatus.IN_PROGRESS]: 'In progress',
  [CtatStatus.NEW]: 'New',
  [CtatStatus.ASSIGNED]: 'Assigned',
  [CtatStatus.CLOSED]: 'Closed'
};

export const helpNeededGroupLabels = {
  preAward: 'Pre-award activities',
  postAward: 'Post-award activities',
  other: 'Other'
};

export const helpNeededTypesPreAward: CtatHelpNeededType[] = [
  CtatHelpNeededType.CALM_SYSTEM_REQUISITION_SUPPORT,
  CtatHelpNeededType.PRE_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING,
  CtatHelpNeededType.DEFINING_AND_DOCUMENTING_CONTRACT_REQUIREMENTS,
  CtatHelpNeededType.DEPARTMENTAL_EFFICIENCY_REVIEW_DER,
  CtatHelpNeededType.GUIDANCE_ON_DETERMINATIONS_AND_FINDINGS_DF,
  CtatHelpNeededType.GUIDANCE_ON_JUSTIFICATION_AND_APPROVAL_JA,
  CtatHelpNeededType.GUIDANCE_ON_MARKET_RESEARCH,
  CtatHelpNeededType.GUIDANCE_ON_TEP_MEMBERSHIP_SCORING_REPORTING,
  CtatHelpNeededType.INDEPENDENT_GOVERNMENT_COST_ESTIMATE_IGCE_PREPARATION,
  CtatHelpNeededType.POLITICAL_APPOINTEE_APPROVAL_PAA,
  CtatHelpNeededType.REQUEST_FOR_CONTRACT_MEMO_RFC,
  CtatHelpNeededType.REQUEST_FOR_INFORMATION_RFI,
  CtatHelpNeededType.REQUEST_FOR_PROPOSAL_RFP,
  CtatHelpNeededType.REQUEST_FOR_QUOTATION_RFQ,
  CtatHelpNeededType.SOW_SOO_PWS_DEVELOPMENT
];

export const helpNeededTypesPostAward: CtatHelpNeededType[] = [
  CtatHelpNeededType.POST_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING,
  CtatHelpNeededType.CONTRACT_CLOSEOUT_ACTIVITIES_SUPPORT,
  CtatHelpNeededType.CONTRACTOR_PERFORMANCE_MANAGEMENT,
  CtatHelpNeededType.DATA_USE_AGREEMENT_DUA,
  CtatHelpNeededType.DEPARTMENTAL_EFFICIENCY_REVIEW_DER_MODIFICATION,
  CtatHelpNeededType.DOCUMENTING_AND_SUBMITTING_CPARS,
  CtatHelpNeededType.ENTERPRISE_USER_ADMINISTRATION_EUA_JOB_CODES,
  CtatHelpNeededType.FOREIGN_NATIONAL_MANAGEMENT_SYSTEM_FNMS,
  CtatHelpNeededType.IDENTITY_AND_CREDENTIALING_TOOL_ICT,
  CtatHelpNeededType.INVOICE_PROCESSING_PLATFORM_IPP,
  CtatHelpNeededType.MAINTAINING_THE_ELECTRONIC_COR_ECOR_FILE,
  CtatHelpNeededType.POLITICAL_APPOINTEE_APPROVAL_PAA_MODIFICATION,
  CtatHelpNeededType.TECHNICAL_DIRECTION_LETTERS_TDLS
];

export const helpNeededTypesOther: CtatHelpNeededType[] = [
  CtatHelpNeededType.OTHER
];

export const divisionOptionsByGroup: Record<
  CtatRealGroupOption,
  CtatcmmiDivisionOption[]
> = {
  [CtatcmmiGroupOption.BSG]: [
    CtatcmmiDivisionOption.BSG_DBOM,
    CtatcmmiDivisionOption.BSG_DCCS,
    CtatcmmiDivisionOption.BSG_DSSOS,
    CtatcmmiDivisionOption.BSG_DTS
  ],
  [CtatcmmiGroupOption.LDG]: [
    CtatcmmiDivisionOption.LDG_DMLS,
    CtatcmmiDivisionOption.LDG_DAN
  ],
  [CtatcmmiGroupOption.PCMG]: [
    CtatcmmiDivisionOption.PCMG_DAPC,
    CtatcmmiDivisionOption.PCMG_DHCPM,
    CtatcmmiDivisionOption.PCMG_DSPM,
    CtatcmmiDivisionOption.PCMG_DAPM,
    CtatcmmiDivisionOption.PCMG_DPM
  ],
  [CtatcmmiGroupOption.PPG]: [
    CtatcmmiDivisionOption.PPG_DAPMI,
    CtatcmmiDivisionOption.PPG_DDA,
    CtatcmmiDivisionOption.PPG_DESP,
    CtatcmmiDivisionOption.PPG_DPMS
  ],
  [CtatcmmiGroupOption.RREG]: [
    CtatcmmiDivisionOption.RREG_DHSR,
    CtatcmmiDivisionOption.RREG_DPAR,
    CtatcmmiDivisionOption.RREG_DSPR,
    CtatcmmiDivisionOption.RREG_DRAM
  ],
  [CtatcmmiGroupOption.SCMG]: [
    CtatcmmiDivisionOption.SCMG_DHPI,
    CtatcmmiDivisionOption.SCMG_DFR,
    CtatcmmiDivisionOption.SCMG_DSI,
    CtatcmmiDivisionOption.SCMG_DDI
  ],
  [CtatcmmiGroupOption.SPHG]: [
    CtatcmmiDivisionOption.SPHG_DMPM,
    CtatcmmiDivisionOption.SPHG_DHII,
    CtatcmmiDivisionOption.SPHG_DPHII,
    CtatcmmiDivisionOption.SPHG_DHCD,
    CtatcmmiDivisionOption.SPHG_DSBI
  ]
};

const contractAssistance: TranslationContractAssistance = {
  requester: {
    gqlField: 'requester',
    goField: 'Requester',
    dbField: 'requester',
    label: 'Requester',
    sublabel:
      'This field is automatically populated based on your MINT user account.',
    exportLabel: 'Requester name and email',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  cmmiGroup: {
    gqlField: 'cmmiGroup',
    goField: 'CmmiGroup',
    dbField: 'cmmi_group',
    label: 'CMMI group',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: cmmiGroups,
    optionsRelatedInfo: {
      OTHER: 'cmmiGroupOther'
    },
    order: 1.02
  },
  cmmiGroupOther: {
    gqlField: 'cmmiGroupOther',
    goField: 'CmmiGroupOther',
    dbField: 'cmmi_group_other',
    label: 'Describe other',
    sublabel: 'Please describe your "Other" CMMI group.',
    exportLabel: 'Other CMMI group',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.021
  },
  cmmiDivision: {
    gqlField: 'cmmiDivision',
    goField: 'CmmiDivision',
    dbField: 'cmmi_division',
    label: 'CMMI division',
    sublabel: 'Select your CMMI group before selecting your division.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: cmmiDivisions,
    optionsRelatedInfo: {
      OTHER: 'cmmiDivisionOther'
    },
    order: 1.03
  },
  cmmiDivisionOther: {
    gqlField: 'cmmiDivisionOther',
    goField: 'CmmiDivisionOther',
    dbField: 'cmmi_division_other',
    label: 'Describe other',
    sublabel: 'Please describe your "Other" division.',
    exportLabel: 'Other CMMI division',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.031
  },
  relatedMINTModels: {
    gqlField: 'relatedMINTModels',
    goField: 'RelatedMINTModels',
    dbField: 'related_mint_models',
    label: 'Model or demonstration',
    sublabel:
      'If applicable, select the model(s) associated with this assistance request. Only models listed in MINT will appear in this list. Select all that apply.',
    multiSelectLabel: 'Selected models',
    exportLabel: 'Model(s) or demonstration(s)',
    flattenNestedData: 'modelName',
    tableReference: TableName.CTAT_REQUEST_MODEL_PLAN_LINK,
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.MULTISELECT,
    order: 1.04
  },
  contractActivityType: {
    gqlField: 'contractActivityType',
    goField: 'ContractActivityType',
    dbField: 'contract_activity_type',
    label: 'Contract activity type',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: contractActivityTypes,
    optionsRelatedInfo: {
      OTHER: 'contractActivityTypeOther'
    },
    order: 1.05
  },
  contractActivityTypeOther: {
    gqlField: 'contractActivityTypeOther',
    goField: 'ContractActivityTypeOther',
    dbField: 'contract_activity_type_other',
    label: 'Describe other',
    sublabel: 'Please describe your "Other" contract activity type.',
    exportLabel: 'Other contract activity type',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.051
  },
  contractName: {
    gqlField: 'contractName',
    goField: 'ContractName',
    dbField: 'contract_name',
    label: 'Contract name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.06
  },
  contractNumber: {
    gqlField: 'contractNumber',
    goField: 'ContractNumber',
    dbField: 'contract_number',
    label: 'Contract number (if applicable)',
    exportLabel: 'Contract number',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.07
  },
  contractType: {
    gqlField: 'contractType',
    goField: 'ContractType',
    dbField: 'contract_type',
    label: 'Contract type',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: contractTypes,
    optionsRelatedInfo: {
      OTHER: 'contractTypeOther'
    },
    order: 1.08
  },
  contractTypeOther: {
    gqlField: 'contractTypeOther',
    goField: 'ContractTypeOther',
    dbField: 'contract_type_other',
    label: 'Describe other',
    sublabel: 'Please describe your "Other" contract type.',
    exportLabel: 'Other contract type',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.081
  },
  typeOfHelpNeeded: {
    gqlField: 'typeOfHelpNeeded',
    goField: 'TypeOfHelpNeeded',
    dbField: 'type_of_help_needed',
    label: 'Type of help needed',
    sublabel: 'Select all that apply.',
    multiSelectLabel: 'Selected help types',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    options: helpNeededTypes,
    optionsRelatedInfo: {
      [CtatHelpNeededType.OTHER]: 'typeOfHelpNeededOther'
    },
    order: 1.09
  },
  typeOfHelpNeededOther: {
    gqlField: 'typeOfHelpNeededOther',
    goField: 'TypeOfHelpNeededOther',
    dbField: 'type_of_help_needed_other',
    label: 'Please specify the type of help needed',
    exportLabel: 'Other help type',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.091
  },
  describeHelpNeeded: {
    gqlField: 'describeHelpNeeded',
    goField: 'DescribeHelpNeeded',
    dbField: 'describe_help_needed',
    label: 'Describe the type of assistance you need.',
    sublabel:
      'Add additional detail about the help you need. If you selected "Other" in the previous question, please explain.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.1
  },
  requestUrgency: {
    gqlField: 'requestUrgency',
    goField: 'RequestUrgency',
    dbField: 'request_urgency',
    label: 'Request urgency',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: requestUrgencies,
    order: 1.11
  },
  dateAssistanceNeededBy: {
    gqlField: 'dateAssistanceNeededBy',
    goField: 'DateAssistanceNeededBy',
    dbField: 'date_assistance_needed_by',
    label: 'When do you need assistance by?',
    exportLabel: 'Need by date',
    sublabel: 'mm/dd/yyyy',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.12
  },
  supportingDocuments: {
    gqlField: 'supportingDocuments',
    goField: 'SupportingDocuments',
    dbField: 'supporting_documents',
    label: 'Supporting documents',
    sublabel:
      'Upload any documentation that will help CTAT better understand your request. Maximum file size 32 mb.',
    flattenNestedData: 'fileName',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.13
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: statuses,
    order: 2.01
  },
  assignedAdmin: {
    gqlField: 'assignedAdmin',
    goField: 'AssignedAdmin',
    dbField: 'assigned_admin',
    label: 'Assigned admin team member',
    sublabel:
      'Look up the admin team member you wish to assign this ticket to. You may look up by name or EUA ID.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 2.02
  },
  notes: {
    gqlField: 'notes',
    goField: 'Notes',
    dbField: 'notes',
    label: 'Progress notes',
    sublabel:
      'Add any notes about your progress on this ticket. Once saved, these notes are viewable by the requester, who will receive an email update alerting them to your changes.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.03
  },
  resolution: {
    gqlField: 'resolution',
    goField: 'Resolution',
    dbField: 'resolution',
    label: 'Resolution',
    sublabel:
      'Document the final outcome of this ticket. Once saved, this resolution is viewable by the requester, who will receive an email update alerting them to the new resolution.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.04
  }
};

const contractAssistanceMisc = {
  hkcHeading: 'Contract assistance',
  hkcDescription:
    'Need contract-related help for your model? Raise a ticket to get help from the Contract Technical Assistance Team (CTAT). CTAT can assist with a variety of contracting needs including requirements gathering, Independent Government Cost Estimate (IGCE) preparation, Requests for Proposal (RFPs), guidance on market research, and more.',
  hkcJumpToLabel: 'Contract assistance',
  hkcViewCta: 'Create and manage help tickets',
  description:
    'The Contract Technical Assistance Team (CTAT) can help with a variety of contracting needs and activities in pre-award and post-award timeframes.',
  dccsDescription:
    'For additional acquisition support and guidance, visit the CTAT E-library, which provides acquisition support for both pre-award and post-award activities, including documents, templates, and resources.',
  dccsLinkText: 'Visit the CTAT E-library on SharePoint',
  table: {
    ticketId: 'Ticket ID',
    submissionDate: 'Submission date',
    cmmiGroup: 'CMMI group',
    contractName: 'Contract name',
    helpType: 'Help type',
    status: 'Status',
    noContractName: 'No contract name added'
  },
  adminActions: {
    title: 'Admin ticket management',
    emptyState: {
      all: {
        title: 'There are no submitted help tickets.',
        copy: 'Once a MINT user submits a request for contract assistance, it will appear here.'
      },
      open: {
        title: 'There are no open help tickets.',
        copy: 'Once a MINT user submits a request for contract assistance, it will appear here until work is complete and it is closed. You may choose another option above to see a different subset of submitted contract assistance tickets.'
      },
      unassigned: {
        title: 'There are no unassigned help tickets.',
        copy: 'Once a MINT user submits a request for contract assistance, it will appear here until assigned. You may choose another option above to see a different subset of submitted contract assistance tickets.'
      },
      myTickets: {
        title: 'You have no help tickets assigned to you.',
        copy: 'Any contract assistance tickets assigned to you will appear here. To see a different subset of submitted contract assistance tickets, choose another option above. You may assign any unassigned tickets to yourself.'
      },
      closed: {
        title: 'There are no closed help tickets.',
        copy: 'Once work is completed for a contract assistance ticket and it is closed, it will appear here. You may choose another option above to see a different subset of submitted contract assistance tickets.'
      }
    },
    table: {
      caption: 'Contract assistance help tickets'
    },
    tabs: {
      all: 'All tickets ({{count}})',
      open: 'Open tickets ({{count}})',
      unassigned: 'Unassigned tickets ({{count}})',
      myTickets: 'My assigned tickets ({{count}})',
      closed: 'Closed tickets ({{count}})'
    }
  },
  userSubmittedTickets: {
    title: 'My submitted help tickets',
    description:
      'Use the button below to start a new contract assistance ticket.',
    button: 'Create a new ticket',
    emptyState: {
      title: 'You have not submitted any help tickets.',
      copy: 'Use the button above to create a new ticket and request contract assistance from CTAT.'
    },
    table: {
      caption: 'Your contract assistance help tickets'
    }
  },

  ctatViewPanel: {
    submittedOn: 'Submitted on {{date}}',
    progressHeading: 'Ticket progress and resolution',
    ticketDetailsHeading: 'Ticket details',
    assignedMember: 'Assigned contract assistance team member',
    uploadedDocuments: 'Uploaded documents',
    viewModelInMint: 'View model in MINT',
    empty: {
      notAssigned: 'Not assigned yet',
      noNotes: 'No notes added',
      noResolution: 'No resolution added',
      noModel: 'No model added',
      noContractActivityType: 'No contract activity type added',
      noContractName: 'No contract name added',
      noContractNumber: 'No contract number added',
      noContractType: 'No contract type added',
      noDocuments: 'No documents added'
    }
  },

  ctatAdminPanel: {
    saveChanges: 'Save changes',
    success:
      'You have updated a contract assistance ticket (<bold>{{ticketId}}</bold>).',
    error:
      'There was an error saving your changes. Please try again. If the error persists, please try again another time.',
    leaveConfirm: {
      description:
        'You have made changes that will not be saved if you navigate away from this view.'
    }
  },

  ctatSidePanel: {
    modalHeading: 'Contract assistance ticket',
    allFieldsRequired:
      'Fields marked with an asterisk ( <s>*</s> ) are required.',
    statusInfo: {
      label: 'What do these statuses mean?',
      statuses: [
        '<bold>New:</bold> This ticket is newly submitted and CTAT has not yet looked at it.',
        '<bold>Assigned:</bold> A CTAT admin has been assigned to your ticket, but has not yet started working on it.',
        '<bold>In progress:</bold> The CTAT admin assigned to your ticket has started work on your ticket.',
        '<bold>Closed:</bold> The CTAT admin assigned to your ticket has completed work and added a resolution to your ticket. The resolution should be documented in the “Resolution” field below.'
      ]
    },
    newTicketHeading: 'New ticket',
    submitTicket: 'Submit ticket',
    cancel: 'Cancel',
    success:
      'You submitted a new contract assistance ticket (<bold>{{ticketId}}</bold>).',
    error:
      'There was an error submitting your ticket. Please try again. If the error persists, please try again another time.',
    validation: {
      fillOut: 'Please fill out the required field.',
      correctDate: 'Please enter a valid date'
    },
    leaveConfirm: {
      heading: 'Are you sure you want to leave?',
      description:
        'You have unsaved changes. If you leave, your changes will not be saved.',
      confirm: 'Leave without saving',
      dontLeave: 'Stay on page'
    },
    selectDefault: '- Select -',
    charactersAllowed: '500 characters allowed',
    whatHappensNext: {
      heading: 'What happens next?',
      intro: 'After you submit your ticket:',
      bullet1:
        'you will receive an automated confirmation email from MINT that includes all the details you shared about your assistance request',
      bullet2:
        'CTAT will assign a team member to your assistance request, and they will work with you to investigate your issue and provide assistance',
      bullet3:
        'you will receive update emails when CTAT updates anything about your ticket in MINT or changes the status',
      bullet4:
        'you may continue to check on the status of your ticket from the contract assistance page in the MINT Help and Knowledge Center'
    }
  },

  reportHeaders: {
    dateSubmitted: 'Date submitted',
    dateAssigned: 'Date assigned',
    dateClosed: 'Date closed',
    daysFromSubmittedToCompleted: 'Days from submission to close'
  }
};

export { contractAssistance, contractAssistanceMisc };
