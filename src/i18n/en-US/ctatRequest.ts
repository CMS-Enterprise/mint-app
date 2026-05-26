import {
  CtatcmmiDivisionOption,
  CtatcmmiGroupOption,
  CtatContractActivityType,
  CtatContractType,
  CtatHelpNeededType,
  CtatRequestUrgency,
  CtatStatus
} from 'gql/generated/graphql';

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
  [CtatcmmiDivisionOption.SCMG_DDI]: 'Division of Drug Innovation (SCMG-DDI)',
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
  [CtatContractType.FIRMED_FIXED_PRICE]: 'Firmed Fixed Price',
  [CtatContractType.INCENTIVE_CONTRACT]: 'Incentive Contract',
  [CtatContractType.TIME_AND_MATERIALS]: 'Time and Material',
  [CtatContractType.OTHER]: 'Other'
};

export const helpNeededTypes: Record<CtatHelpNeededType, string> = {
  [CtatHelpNeededType.CALM_SYSTEM_REQUISITION_SUPPORT]:
    'CALM system requisition support',
  [CtatHelpNeededType.CONTRACT_CHANGE_REQUEST_CCR_PROCESSING]:
    'Contract Change Request (CCR) processing',
  [CtatHelpNeededType.COR_TRANSCRIPT_REVIEW]: 'COR Transcript Review',
  [CtatHelpNeededType.DEFINING_AND_DOCUMENTING_CONTRACT_REQUIREMENTS]:
    'Defining and documenting contract requirements',
  [CtatHelpNeededType.DELIVERABLE_EVALUATION_REVIEW_DER]:
    'Deliverable/Evaluation Review (DER)',
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
  [CtatHelpNeededType.POST_AWARD_ACTIONS_PAA]: 'Post-Award Actions (PAA)',
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
  [CtatHelpNeededType.DELIVERABLE_EVALUATION_REVIEW_DER_MODIFICATION]:
    'Deliverable/Evaluation Review (DER) Modification',
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
  [CtatHelpNeededType.POST_AWARD_ACTIONS_PAA_MODIFICATION]:
    'Post-Award Actions (PAA) Modification',
  [CtatHelpNeededType.OTHER]: 'Other'
};

export const requestUrgencies: Record<CtatRequestUrgency, string> = {
  [CtatRequestUrgency.HIGH]: 'High',
  [CtatRequestUrgency.MEDIUM]: 'Medium',
  [CtatRequestUrgency.LOW]: 'Low'
};

export const statuses: Record<CtatStatus, string> = {
  [CtatStatus.IN_PROGRESS]: 'In Progress',
  [CtatStatus.NEW]: 'New',
  [CtatStatus.ASSIGNED]: 'Assigned',
  [CtatStatus.CLOSED]: 'Closed'
};

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

const ctatRequest = {
  cmmiGroups,
  cmmiDivisions,
  contractActivityTypes,
  contractTypes,
  helpNeededTypes,
  requestUrgencies,
  statuses,
  divisionOptionsByGroup
};

export default ctatRequest;
