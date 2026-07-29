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
} from '../../gql/generated/graphql';

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
  [CtatHelpNeededType.CALM_SYSTEM_REQUISITION_SUPPORT]:
    'CALM system requisition support',
  [CtatHelpNeededType.PRE_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING]:
    'Contract Cost Review (CCR) processing',
  [CtatHelpNeededType.POST_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING]:
    'Contract Cost Review (CCR) processing',
  [CtatHelpNeededType.COR_TRANSCRIPT_REVIEW]: 'COR Transcript Review',
  [CtatHelpNeededType.DEFINING_AND_DOCUMENTING_CONTRACT_REQUIREMENTS]:
    'Defining and documenting contract requirements',
  [CtatHelpNeededType.DEPARTMENTAL_EFFICIENCY_REVIEW_DER]:
    'Departmental Efficiency Review (DER)',
  [CtatHelpNeededType.GUIDANCE_ON_DETERMINATIONS_AND_FINDINGS_DF]:
    'Guidance on Determinations & Findings (D&F)',
  [CtatHelpNeededType.GUIDANCE_ON_JUSTIFICATION_AND_APPROVAL_JA]:
    'Guidance on Justification and Approval (J&A)',
  [CtatHelpNeededType.GUIDANCE_ON_MARKET_RESEARCH]:
    'Guidance on Market Research',
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
  [CtatHelpNeededType.CONTRACTOR_PERFORMANCE_MANAGEMENT]:
    'Contractor Performance Management',
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
    'Political Appointee Approval (PAA) Modification',
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
  CtatHelpNeededType.COR_TRANSCRIPT_REVIEW,
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
  CtatHelpNeededType.CONTRACTOR_PERFORMANCE_MANAGEMENT,
  CtatHelpNeededType.DATA_USE_AGREEMENT_DUA,
  CtatHelpNeededType.DEPARTMENTAL_EFFICIENCY_REVIEW_DER_MODIFICATION,
  CtatHelpNeededType.DOCUMENTING_AND_SUBMITTING_CPARS,
  CtatHelpNeededType.ENTERPRISE_USER_ADMINISTRATION_EUA_JOB_CODES,
  CtatHelpNeededType.FOREIGN_NATIONAL_MANAGEMENT_SYSTEM_FNMS,
  CtatHelpNeededType.IDENTITY_AND_CREDENTIALING_TOOL_ICT,
  CtatHelpNeededType.INVOICE_PROCESSING_PLATFORM_IPP,
  CtatHelpNeededType.MAINTAINING_THE_ELECTRONIC_COR_ECOR_FILE,
  CtatHelpNeededType.POLITICAL_APPOINTEE_APPROVAL_PAA_MODIFICATION
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

const ctatRequest: TranslationContractAssistance = {
  requester: {
    gqlField: 'requester',
    goField: 'Requester',
    dbField: 'requester',
    label: 'Requester',
    sublabel:
      'This field is automatically populated based on your MINT user account.',
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
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.081
  },
  typeOfHelpNeeded: {
    gqlField: 'typeOfHelpNeeded',
    goField: 'TypeOfHelpNeeded',
    dbField: 'type_of_help_needed',
    label: 'Type of help needed',
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
    sublabel: 'mm/dd/yyyy',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.12
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

export default ctatRequest;
