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

export const translateModelCategory = (category: string) => {
  switch (category) {
    case 'ACCOUNTABLE_CARE':
      return i18next.t('basics:modelCategories.accountableCare');
    case 'DEMONSTRATION':
      return i18next.t('basics:modelCategories.demonstration');
    case 'EPISODE_BASED_PAYMENT_INITIATIVES':
      return i18next.t('basics:modelCategories.paymentInitiatives');
    case 'INIT_ACCEL_DEV_AND_TEST':
      return i18next.t('basics:modelCategories.devAndTest');
    case 'INIT_MEDICAID_CHIP_POP':
      return i18next.t('basics:modelCategories.chipPop');
    case 'INIT_SPEED_ADOPT_BEST_PRACTICE':
      return i18next.t('basics:modelCategories.speedBestPractice');
    case 'INIT__MEDICARE_MEDICAID_ENROLLEES':
      return i18next.t('basics:modelCategories.medicareMedicaidEnrollees');
    case 'PRIMARY_CARE_TRANSFORMATION':
      return i18next.t('basics:modelCategories.primaryCare');
    case 'UNKNOWN':
      return i18next.t('basics:modelCategories.unknown');
    default:
      return '';
  }
};

export const translateCmsCenter = (category: string) => {
  switch (category) {
    case 'CMMI':
      return 'CMMI';
    case 'Center for Medicare (CM)':
      return 'CENTER_FOR_MEDICARE';
    case 'Federal Coordinated Health Care':
      return 'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE';
    case 'Center for Clinical Standards and Quality (CCSQ)':
      return 'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY';
    case 'Center for Program Integrity (CPI)':
      return 'CENTER_FOR_PROGRAM_INTEGRITY';
    case 'Other':
      return 'OTHER';
    default:
      return '';
  }
};

export const translateCmmiGroup = (category: string) => {
  switch (category) {
    case 'Patient Care Models Group (PCMG)':
      return 'PATIENT_CARE_MODELS_GROUP';
    case 'Policy and Programs Group (PPG)':
      return 'POLICY_AND_PROGRAMS_GROUP';
    case 'Preventative and Population Health Care Models Group (PPHCMG)':
      return 'PREVENTIVE_AND_POPULATION_HEALTH_CARE_MODELS_GROUP';
    case 'Seamless Care Models Group (SCMG)':
      return 'SEAMLESS_CARE_MODELS_GROUP';
    case 'State Innovations Group (SIG)':
      return 'STATE_INNOVATIONS_GROUP';
    default:
      return '';
  }
};
