import i18next from 'i18next';
/**
 * Translate the API enum to a human readable string
 */
export const translateTeamRole = (teamRole: string) => {
  switch (teamRole) {
    case 'EVALUATION':
      return i18next.t('modelPlan:teamRoles.evaluation');
    case 'LEADERSHIP':
      return i18next.t('modelPlan:teamRoles.leadership');
    case 'LEARNING':
      return i18next.t('modelPlan:teamRoles.learning');
    case 'MODEL_LEAD':
      return i18next.t('modelPlan:teamRoles.modelLead');
    case 'MODEL_TEAM':
      return i18next.t('modelPlan:teamRoles.modelTeam');
    default:
      return '';
  }
};

export const translateModelPlanStatus = (status: string) => {
  switch (status) {
    case 'PLAN_DRAFT':
      return i18next.t('modelPlan:planStatuses.planDraft');
    case 'PLAN_COMPLETE':
      return i18next.t('modelPlan:planStatuses.planComplete');
    case 'ICIP_COMPLETE':
      return i18next.t('modelPlan:planStatuses.icipComplete');
    case 'INTERNAL_CMMI_CLEARANCE':
      return i18next.t('modelPlan:planStatuses.cmmiClearance');
    case 'CMS_CLEARANCE':
      return i18next.t('modelPlan:planStatuses.cmsClearance');
    case 'HHS_CLEARANCE':
      return i18next.t('modelPlan:planStatuses.hhsClearance');
    case 'OMB_ASRF_CLEARANCE':
      return i18next.t('modelPlan:planStatuses.ombASRFClearance');
    case 'CLEARED':
      return i18next.t('modelPlan:planStatuses.cleared');
    case 'ANNOUNCED':
      return i18next.t('modelPlan:planStatuses.announced');
    default:
      return '';
  }
};

/**
 * Translate the document type API enum to a human readable string
 */

// TODO import gql gen document type
export const translateDocumentCommonType = commonDocumentType => {
  switch (commonDocumentType) {
    case 'CONCEPT_PAPER':
      return i18next.t('documents:documentTypes.concept');
    case 'POLICY_PAPER':
      return i18next.t('documents:documentTypes.policy');
    case 'ICIP_DRAFT':
      return i18next.t('documents:documentTypes.icipDraft');
    case 'MARKET_RESEARCH':
      return i18next.t('documents:documentTypes.marketResearch');
    case 'OTHER':
      return i18next.t('documents:documentTypes.other');
    default:
      return '';
  }
};
