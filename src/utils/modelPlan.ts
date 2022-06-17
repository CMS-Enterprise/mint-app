import i18next from 'i18next';

import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';
import { DocumentType } from 'types/graphql-global-types';

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

export const translateCmmiGroups = (category: string) => {
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

export const translateAlternativePaymentTypes = (type: string) => {
  switch (type) {
    case 'REGULAR':
      return i18next.t('generalCharacteristics:apmTypes.regularAPM');
    case 'MIPS':
      return i18next.t('generalCharacteristics:apmTypes.MIPSAPM');
    case 'ADVANCED':
      return i18next.t('generalCharacteristics:apmTypes.advancedAPM');
    default:
      return '';
  }
};

export const translateGeographyTypes = (type: string) => {
  switch (type) {
    case 'STATE':
      return i18next.t('generalCharacteristics:geoState');
    case 'REGION':
      return i18next.t('generalCharacteristics:geoRegion');
    case 'OTHER':
      return i18next.t('generalCharacteristics:other');
    default:
      return '';
  }
};

export const translateGeographyApplication = (type: string) => {
  switch (type) {
    case 'PARTICIPANTS':
      return i18next.t('generalCharacteristics:geoParticipants');
    case 'PROVIDERS':
      return i18next.t('generalCharacteristics:geoProviders');
    case 'BENEFICIARIES':
      return i18next.t('generalCharacteristics:geoBeneficiaries');
    case 'OTHER':
      return i18next.t('generalCharacteristics:other');
    default:
      return '';
  }
};

export const translateAgreementTypes = (type: string) => {
  switch (type) {
    case 'PARTICIPATION':
      return i18next.t('generalCharacteristics:participationAgreement');
    case 'COOPERATIVE':
      return i18next.t('generalCharacteristics:coopAgreement');
    case 'OTHER':
      return i18next.t('generalCharacteristics:other');
    default:
      return '';
  }
};

export const translateAuthorityAllowance = (type: string) => {
  switch (type) {
    case 'ACA':
      return i18next.t('generalCharacteristics:ACA3021');
    case 'CONGRESSIONALLY_MANDATED':
      return i18next.t('generalCharacteristics:mandatedDemonstration');
    case 'SSA_PART_B':
      return i18next.t('generalCharacteristics:section1833');
    case 'OTHER':
      return i18next.t('generalCharacteristics:other');
    default:
      return '';
  }
};

export const translateWaiverTypes = (type: string) => {
  switch (type) {
    case 'FRAUD_ABUSE':
      return i18next.t('generalCharacteristics:fraudAndAbuse');
    case 'PROGRAM_PAYMENT':
      return i18next.t('generalCharacteristics:programPayment');
    case 'MEDICAID':
      return i18next.t('generalCharacteristics:medicaid');
    default:
      return '';
  }
};

export const translateKeyCharacteristics = (characteristic: string) => {
  switch (characteristic) {
    case 'EPISODE_BASED':
      return i18next.t(
        'generalCharacteristics:keyCharacteristicsTypes.episodeBased'
      );
    case 'PART_C':
      return i18next.t('generalCharacteristics:keyCharacteristicsTypes.partC');
    case 'PART_D':
      return i18next.t('generalCharacteristics:keyCharacteristicsTypes.partD');
    case 'PAYMENT':
      return i18next.t(
        'generalCharacteristics:keyCharacteristicsTypes.payment'
      );
    case 'POPULATION_BASED':
      return i18next.t(
        'generalCharacteristics:keyCharacteristicsTypes.population'
      );
    case 'PREVENTATIVE':
      return i18next.t(
        'generalCharacteristics:keyCharacteristicsTypes.preventative'
      );
    case 'SERVICE_DELIVERY':
      return i18next.t(
        'generalCharacteristics:keyCharacteristicsTypes.service'
      );
    case 'SHARED_SAVINGS':
      return i18next.t('generalCharacteristics:keyCharacteristicsTypes.shared');
    case 'OTHER':
      return i18next.t('generalCharacteristics:keyCharacteristicsTypes.other');
    default:
      return '';
  }
};

export const translateParticipantsType = (type: string) => {
  switch (type) {
    case 'MEDICARE_PROVIDERS':
      return i18next.t(
        'participantsAndProviders:participantTypes.medicareProviders'
      );
    case 'ENTITIES':
      return i18next.t('participantsAndProviders:participantTypes.entities');
    case 'CONVENER':
      return i18next.t('participantsAndProviders:participantTypes.convener');
    case 'MEDICARE_ADVANTAGE_PLANS':
      return i18next.t(
        'participantsAndProviders:participantTypes.medicarePlan'
      );
    case 'STANDALONE_PART_D_PLANS':
      return i18next.t(
        'participantsAndProviders:participantTypes.standalonePartD'
      );
    case 'MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS':
      return i18next.t(
        'participantsAndProviders:participantTypes.medicarePrescription'
      );
    case 'STATE_MEDICAID_AGENCIES':
      return i18next.t(
        'participantsAndProviders:participantTypes.stateMedicaid'
      );
    case 'MEDICAID_MANAGED_CARE_ORGANIZATIONS':
      return i18next.t(
        'participantsAndProviders:participantTypes.medicaidManagedCare'
      );
    case 'MEDICAID_PROVIDERS':
      return i18next.t(
        'participantsAndProviders:participantTypes.medicaidProviders'
      );
    case 'STATES':
      return i18next.t('participantsAndProviders:participantTypes.states');
    case 'COMMUNITY_BASED_ORGANIZATIONS':
      return i18next.t('participantsAndProviders:participantTypes.community');
    case 'NON_PROFIT_ORGANIZATIONS':
      return i18next.t('participantsAndProviders:participantTypes.nonProfit');
    case 'COMMERCIAL_PAYERS':
      return i18next.t('participantsAndProviders:participantTypes.commercial');
    case 'OTHER':
      return i18next.t('participantsAndProviders:other');
    default:
      return '';
  }
};

export const translateConfidenceType = (type: string) => {
  switch (type) {
    case 'NOT_AT_ALL':
      return i18next.t('participantsAndProviders:estimateOptions.notAtAll');
    case 'SLIGHTLY':
      return i18next.t('participantsAndProviders:estimateOptions.slightly');
    case 'FAIRLY':
      return i18next.t('participantsAndProviders:estimateOptions.fairly');
    case 'COMPLETELY':
      return i18next.t('participantsAndProviders:estimateOptions.completely');
    default:
      return '';
  }
};

export const translateRecruitmentType = (type: string) => {
  switch (type) {
    case 'LOI':
      return i18next.t('participantsAndProviders:recruitOptions.loi');
    case 'RFA':
      return i18next.t('participantsAndProviders:recruitOptions.rfa');
    case 'NOFO':
      return i18next.t('participantsAndProviders:recruitOptions.nofo');
    case 'OTHER':
      return i18next.t('participantsAndProviders:recruitOptions.other');
    case 'NA':
      return i18next.t('participantsAndProviders:recruitOptions.notApplicable');
    default:
      return '';
  }
};

export const translateParticipantSelectiontType = (type: string) => {
  switch (type) {
    case 'MODEL_TEAM_REVIEW_APPLICATIONS':
      return i18next.t(
        'participantsAndProviders:selectOtions.reviewApplications'
      );
    case 'SUPPORT_FROM_CMMI':
      return i18next.t('participantsAndProviders:selectOtions.solicitSupport');
    case 'CMS_COMPONENT_OR_PROCESS':
      return i18next.t(
        'participantsAndProviders:selectOtions.anotherComponent'
      );
    case 'APPLICATION_REVIEW_AND_SCORING_TOOL':
      return i18next.t(
        'participantsAndProviders:selectOtions.applicationReview'
      );
    case 'APPLICATION_SUPPORT_CONTRACTOR':
      return i18next.t(
        'participantsAndProviders:selectOtions.applicationSupport'
      );
    case 'BASIC_CRITERIA':
      return i18next.t('participantsAndProviders:selectOtions.criteria');
    case 'OTHER':
      return i18next.t('participantsAndProviders:selectOtions.anotherProcess');
    case 'NO_SELECTING_PARTICIPANTS':
      return i18next.t('participantsAndProviders:selectOtions.notApplicable');
    default:
      return '';
  }
};

/**
 * Translate the document type API enum to a human readable string
 */

// TODO import gql gen document type
export const translateDocumentType = (documentType: DocumentType) => {
  switch (documentType) {
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

// Returns an object with th number of discussions with answered and unanswered questions
export const getUnansweredQuestions = (discussions: DiscussionType[]) => {
  const unansweredQuestions =
    discussions?.filter(
      (discussion: DiscussionType) => discussion.status === 'UNANSWERED'
    ).length || 0;
  const answeredQuestions = discussions?.length - unansweredQuestions;
  return {
    unansweredQuestions,
    answeredQuestions
  };
};

// Sorts discussions by the most recent reply
export const sortRepliesByDate = (
  discussionA: DiscussionType,
  discussionB: DiscussionType
) => {
  if (
    (discussionA.replies[discussionA.replies.length - 1]?.createdDts || 0) <
    (discussionB.replies[discussionB.replies.length - 1]?.createdDts || 0)
  ) {
    return 1;
  }
  if (
    (discussionA.replies[discussionA.replies.length - 1]?.createdDts || 0) >
    (discussionB.replies[discussionB.replies.length - 1]?.createdDts || 0)
  ) {
    return -1;
  }
  return 0;
};

// Sort mapped enums to be alphabetical and have 'OTHER' come last
export const sortOtherEnum = (a: string, b: string) => {
  if (b === 'NA' || b === 'NO_SELECTING_PARTICIPANTS') return -1;
  if (a < b || b === 'OTHER') {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};
