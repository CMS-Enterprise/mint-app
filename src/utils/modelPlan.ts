import i18next from 'i18next';

import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';
import {
  ComplexityCalculationLevelType,
  DocumentType,
  OperationalSolutionKey,
  OperationalSolutionSubtaskStatus
} from 'types/graphql-global-types';
import { getKeys } from 'types/translation';

/**
 * Translate the API enum to a human readable string
 */

export const translateBoolean = (type: boolean) => {
  switch (type) {
    case true:
      return i18next.t('draftModelPlan:yes');
    case false:
      return i18next.t('draftModelPlan:no');
    default:
      return '';
  }
};

export const translateBooleanOrNull = (type: boolean | null | undefined) => {
  switch (type) {
    case true:
      return i18next.t('draftModelPlan:yes');
    case false:
      return i18next.t('draftModelPlan:no');
    case null:
      return null;
    default:
      return '';
  }
};

export const translateNewModel = (type: boolean | null | undefined) => {
  switch (type) {
    case true:
      return i18next.t('generalCharacteristicsOld:newModel');
    case false:
      return i18next.t('generalCharacteristicsOld:newTrack');
    default:
      return null;
  }
};

export const translateTriStateAnswer = (type: string) => {
  switch (type) {
    case 'YES':
      return i18next.t('draftModelPlan:yes');
    case 'NO':
      return i18next.t('draftModelPlan:no');
    case 'TBD':
      return i18next.t('beneficiariesOld:beneficiariesOptions.na');
    default:
      return '';
  }
};

export const translateTeamRole = (teamRole: string) => {
  switch (teamRole) {
    case 'EVALUATION':
      return i18next.t('plan:teamRoles.evaluation');
    case 'IT_LEAD':
      return i18next.t('plan:teamRoles.itLead');
    case 'LEADERSHIP':
      return i18next.t('plan:teamRoles.leadership');
    case 'LEARNING':
      return i18next.t('plan:teamRoles.learning');
    case 'MODEL_LEAD':
      return i18next.t('plan:teamRoles.modelLead');
    case 'MODEL_TEAM':
      return i18next.t('plan:teamRoles.modelTeam');
    case 'OACT':
      return i18next.t('plan:teamRoles.oact');
    case 'PAYMENT':
      return i18next.t('plan:teamRoles.payment');
    case 'QUALITY':
      return i18next.t('plan:teamRoles.quality');
    default:
      return '';
  }
};

export const translateComplexityLevel = (
  key: ComplexityCalculationLevelType
) => {
  switch (key) {
    case ComplexityCalculationLevelType.LOW:
      return i18next.t('payments:complexityLevel.low');
    case ComplexityCalculationLevelType.MIDDLE:
      return i18next.t('payments:complexityLevel.middle');
    case ComplexityCalculationLevelType.HIGH:
      return i18next.t('payments:complexityLevel.high');
    default:
      return '';
  }
};

export const translateModelCategory = (category: string) => {
  switch (category) {
    case 'ACCOUNTABLE_CARE':
      return i18next.t('basicsOld:modelCategories.accountableCare');
    case 'DEMONSTRATION':
      return i18next.t('basicsOld:modelCategories.demonstration');
    case 'EPISODE_BASED_PAYMENT_INITIATIVES':
      return i18next.t('basicsOld:modelCategories.paymentInitiatives');
    case 'INIT_ACCEL_DEV_AND_TEST':
      return i18next.t('basicsOld:modelCategories.devAndTest');
    case 'INIT_MEDICAID_CHIP_POP':
      return i18next.t('basicsOld:modelCategories.chipPop');
    case 'INIT_SPEED_ADOPT_BEST_PRACTICE':
      return i18next.t('basicsOld:modelCategories.speedBestPractice');
    case 'INIT__MEDICARE_MEDICAID_ENROLLEES':
      return i18next.t('basicsOld:modelCategories.medicareMedicaidEnrollees');
    case 'PRIMARY_CARE_TRANSFORMATION':
      return i18next.t('basicsOld:modelCategories.primaryCare');
    case 'UNKNOWN':
      return i18next.t('basicsOld:modelCategories.unknown');
    default:
      return '';
  }
};

export const translateModelPlanStatus = (status: string) => {
  switch (status) {
    case 'PLAN_DRAFT':
      return i18next.t('plan:planStatuses.planDraft');
    case 'PLAN_COMPLETE':
      return i18next.t('plan:planStatuses.planComplete');
    case 'ICIP_COMPLETE':
      return i18next.t('plan:planStatuses.icipComplete');
    case 'INTERNAL_CMMI_CLEARANCE':
      return i18next.t('plan:planStatuses.cmmiClearance');
    case 'CMS_CLEARANCE':
      return i18next.t('plan:planStatuses.cmsClearance');
    case 'HHS_CLEARANCE':
      return i18next.t('plan:planStatuses.hhsClearance');
    case 'OMB_ASRF_CLEARANCE':
      return i18next.t('plan:planStatuses.ombASRFClearance');
    case 'CLEARED':
      return i18next.t('plan:planStatuses.cleared');
    case 'ANNOUNCED':
      return i18next.t('plan:planStatuses.announced');
    case 'PAUSED':
      return i18next.t('plan:planStatuses.paused');
    case 'CANCELED':
      return i18next.t('plan:planStatuses.canceled');
    case 'ACTIVE':
      return i18next.t('plan:planStatuses.active');
    case 'ENDED':
      return i18next.t('plan:planStatuses.ended');
    default:
      return '';
  }
};

export const translateAlternativePaymentTypes = (type: string) => {
  switch (type) {
    case 'REGULAR':
      return i18next.t('generalCharacteristicsOld:apmTypes.regularAPM');
    case 'MIPS':
      return i18next.t('generalCharacteristicsOld:apmTypes.MIPSAPM');
    case 'ADVANCED':
      return i18next.t('generalCharacteristicsOld:apmTypes.advancedAPM');
    case 'NOT_APM':
      return i18next.t('generalCharacteristicsOld:apmTypes.notAPM');
    default:
      return '';
  }
};

export const translateGeographyTypes = (type: string) => {
  switch (type) {
    case 'STATE':
      return i18next.t('generalCharacteristicsOld:geoState');
    case 'REGION':
      return i18next.t('generalCharacteristicsOld:geoRegion');
    case 'OTHER':
      return i18next.t('generalCharacteristicsOld:other');
    default:
      return '';
  }
};

export const translateGeographyApplication = (type: string) => {
  switch (type) {
    case 'PARTICIPANTS':
      return i18next.t('generalCharacteristicsOld:geoParticipants');
    case 'PROVIDERS':
      return i18next.t('generalCharacteristicsOld:geoProviders');
    case 'BENEFICIARIES':
      return i18next.t('generalCharacteristicsOld:geoBeneficiaries');
    case 'OTHER':
      return i18next.t('generalCharacteristicsOld:other');
    default:
      return '';
  }
};

export const translatePayRecipient = (type: string) => {
  switch (type) {
    case 'PARTICIPANTS':
      return i18next.t('payments:whoWillYouPayOptions.participants');
    case 'PROVIDERS':
      return i18next.t('payments:whoWillYouPayOptions.providers');
    case 'BENEFICIARIES':
      return i18next.t('payments:whoWillYouPayOptions.beneficiaries');
    case 'STATES':
      return i18next.t('payments:whoWillYouPayOptions.states');
    case 'OTHER':
      return i18next.t('payments:whoWillYouPayOptions.other');
    default:
      return '';
  }
};

export const translateAgreementTypes = (type: string) => {
  switch (type) {
    case 'PARTICIPATION':
      return i18next.t('generalCharacteristicsOld:participationAgreement');
    case 'COOPERATIVE':
      return i18next.t('generalCharacteristicsOld:coopAgreement');
    case 'OTHER':
      return i18next.t('generalCharacteristicsOld:other');
    default:
      return '';
  }
};

export const translateAuthorityAllowance = (type: string) => {
  switch (type) {
    case 'ACA':
      return i18next.t('generalCharacteristicsOld:ACA3021');
    case 'CONGRESSIONALLY_MANDATED':
      return i18next.t('generalCharacteristicsOld:mandatedDemonstration');
    case 'SSA_PART_B':
      return i18next.t('generalCharacteristicsOld:section1833');
    case 'OTHER':
      return i18next.t('generalCharacteristicsOld:other');
    default:
      return '';
  }
};

export const translateWaiverTypes = (type: string) => {
  switch (type) {
    case 'FRAUD_ABUSE':
      return i18next.t('generalCharacteristicsOld:fraudAndAbuse');
    case 'PROGRAM_PAYMENT':
      return i18next.t('generalCharacteristicsOld:programPayment');
    case 'MEDICAID':
      return i18next.t('generalCharacteristicsOld:medicaid');
    default:
      return '';
  }
};

export const translateWaiverTypesLabel = (type: string) => {
  switch (type) {
    case 'FRAUD_ABUSE':
      return i18next.t('generalCharacteristicsOld:fraudAndAbuseNote');
    case 'PROGRAM_PAYMENT':
      return i18next.t('generalCharacteristicsOld:programPaymentNote');
    case 'MEDICAID':
      return i18next.t('generalCharacteristicsOld:medicaidNote');
    default:
      return '';
  }
};

export const translateKeyCharacteristics = (characteristic: string) => {
  switch (characteristic) {
    case 'EPISODE_BASED':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.episodeBased'
      );
    case 'PART_C':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.partC'
      );
    case 'PART_D':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.partD'
      );
    case 'PAYMENT':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.payment'
      );
    case 'POPULATION_BASED':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.population'
      );
    case 'PREVENTATIVE':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.preventative'
      );
    case 'SERVICE_DELIVERY':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.service'
      );
    case 'SHARED_SAVINGS':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.shared'
      );
    case 'OTHER':
      return i18next.t(
        'generalCharacteristicsOld:keyCharacteristicsTypes.other'
      );
    default:
      return '';
  }
};

export const translateParticipantsType = (type: string) => {
  switch (type) {
    case 'MEDICARE_PROVIDERS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.medicareProviders'
      );
    case 'ENTITIES':
      return i18next.t('participantsAndProvidersOld:participantTypes.entities');
    case 'CONVENER':
      return i18next.t('participantsAndProvidersOld:participantTypes.convener');
    case 'MEDICARE_ADVANTAGE_PLANS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.medicarePlan'
      );
    case 'STANDALONE_PART_D_PLANS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.standalonePartD'
      );
    case 'MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.medicarePrescription'
      );
    case 'STATE_MEDICAID_AGENCIES':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.stateMedicaid'
      );
    case 'MEDICAID_MANAGED_CARE_ORGANIZATIONS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.medicaidManagedCare'
      );
    case 'MEDICAID_PROVIDERS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.medicaidProviders'
      );
    case 'STATES':
      return i18next.t('participantsAndProvidersOld:participantTypes.states');
    case 'COMMUNITY_BASED_ORGANIZATIONS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.community'
      );
    case 'NON_PROFIT_ORGANIZATIONS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.nonProfit'
      );
    case 'COMMERCIAL_PAYERS':
      return i18next.t(
        'participantsAndProvidersOld:participantTypes.commercial'
      );
    case 'OTHER':
      return i18next.t('participantsAndProvidersOld:other');
    default:
      return '';
  }
};

export const translateBeneficiariesType = (type: string) => {
  switch (type) {
    case 'DISEASE_SPECIFIC':
      return i18next.t('beneficiariesOld:beneficiariesOptions.diseaseSpecific');
    case 'DUALLY_ELIGIBLE':
      return i18next.t('beneficiariesOld:beneficiariesOptions.duallyEligible');
    case 'MEDICAID':
      return i18next.t('beneficiariesOld:beneficiariesOptions.medicaid');
    case 'MEDICARE_ADVANTAGE':
      return i18next.t(
        'beneficiariesOld:beneficiariesOptions.medicareAdvantage'
      );
    case 'MEDICARE_FFS':
      return i18next.t('beneficiariesOld:beneficiariesOptions.medicareFfs');
    case 'MEDICARE_PART_D':
      return i18next.t('beneficiariesOld:beneficiariesOptions.medicarePartD');
    case 'OTHER':
      return i18next.t('beneficiariesOld:beneficiariesOptions.other');
    case 'NA':
      return i18next.t('beneficiariesOld:beneficiariesOptions.na');
    default:
      return '';
  }
};

export const translateSelectionMethodType = (type: string) => {
  switch (type) {
    case 'HISTORICAL':
      return i18next.t('beneficiariesOld:selectionMethod.historical');
    case 'PROSPECTIVE':
      return i18next.t('beneficiariesOld:selectionMethod.prospective');
    case 'PROVIDER_SIGN_UP':
      return i18next.t('beneficiariesOld:selectionMethod.retrospective');
    case 'RETROSPECTIVE':
      return i18next.t('beneficiariesOld:selectionMethod.voluntary');
    case 'VOLUNTARY':
      return i18next.t('beneficiariesOld:selectionMethod.providerSignUp');
    case 'OTHER':
      return i18next.t('beneficiariesOld:selectionMethod.other');
    case 'NA':
      return i18next.t('beneficiariesOld:selectionMethod.na');
    default:
      return '';
  }
};

export const translateSourceOptions = (type: string) => {
  switch (type) {
    case 'PATIENT_PROTECTION_AFFORDABLE_CARE_ACT':
      return i18next.t('payments:sourceOptions.ppaca');
    case 'TRUST_FUND':
      return i18next.t('payments:sourceOptions.trustFund');
    case 'OTHER':
      return i18next.t('payments:sourceOptions.other');
    default:
      return '';
  }
};

export const translatePayType = (type: string) => {
  switch (type) {
    case 'CLAIMS_BASED_PAYMENTS':
      return i18next.t('payments:whatWillYouPayOptions.claims');
    case 'GRANTS':
      return i18next.t('payments:whatWillYouPayOptions.grants');
    case 'NON_CLAIMS_BASED_PAYMENTS':
      return i18next.t('payments:whatWillYouPayOptions.nonClaims');
    default:
      return '';
  }
};

export const translateClaimsBasedPayType = (type: string) => {
  switch (type) {
    case 'ADJUSTMENTS_TO_FFS_PAYMENTS':
      return i18next.t('payments:selectClaimsOptions.ffsPayments');
    case 'REDUCTIONS_TO_BENEFICIARY_COST_SHARING':
      return i18next.t('payments:selectClaimsOptions.reduction');
    case 'CARE_MANAGEMENT_HOME_VISITS':
      return i18next.t('payments:selectClaimsOptions.homeVisits');
    case 'SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS':
      return i18next.t('payments:selectClaimsOptions.snfClaims');
    case 'TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE':
      return i18next.t('payments:selectClaimsOptions.telehealth');
    case 'SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE':
      return i18next.t('payments:selectClaimsOptions.servicesNotCovered');
    case 'OTHER':
      return i18next.t('payments:selectClaimsOptions.other');
    default:
      return '';
  }
};

export const translateNonClaimsBasedPayType = (type: string) => {
  switch (type) {
    case 'ADVANCED_PAYMENT':
      return i18next.t('payments:nonClaimsPaymentsOptions.advancedPayment');
    case 'BUNDLED_EPISODE_OF_CARE':
      return i18next.t(
        'payments:nonClaimsPaymentsOptions.bundledEpisodeOfCare'
      );
    case 'CAPITATION_POPULATION_BASED_FULL':
      return i18next.t(
        'payments:nonClaimsPaymentsOptions.capitationPopulationBasedFull'
      );
    case 'CAPITATION_POPULATION_BASED_PARTIAL':
      return i18next.t(
        'payments:nonClaimsPaymentsOptions.capitationPopulationBasedPartial'
      );
    case 'CARE_COORDINATION_MANAGEMENT_FEE':
      return i18next.t(
        'payments:nonClaimsPaymentsOptions.careCoordinationManagementFee'
      );
    case 'GLOBAL_BUDGET':
      return i18next.t('payments:nonClaimsPaymentsOptions.globalBudget');
    case 'GRANTS':
      return i18next.t('payments:nonClaimsPaymentsOptions.grants');
    case 'INCENTIVE_PAYMENT':
      return i18next.t('payments:nonClaimsPaymentsOptions.incentivePayment');
    case 'MAPD_SHARED_SAVINGS':
      return i18next.t('payments:nonClaimsPaymentsOptions.mapdSharedSavings');
    case 'OTHER':
      return i18next.t('payments:nonClaimsPaymentsOptions.other');
    case 'SHARED_SAVINGS':
      return i18next.t('payments:nonClaimsPaymentsOptions.sharedSavings');
    default:
      return '';
  }
};

export const translateAnticipatedPaymentFrequencyType = (type: string) => {
  switch (type) {
    case 'ANNUALLY':
      return i18next.t('payments:anticipatedPaymentFrequencyOptions.annually');
    case 'BIANNUALLY':
      return i18next.t(
        'payments:anticipatedPaymentFrequencyOptions.biannually'
      );
    case 'DAILY':
      return i18next.t('payments:anticipatedPaymentFrequencyOptions.daily');
    case 'MONTHLY':
      return i18next.t('payments:anticipatedPaymentFrequencyOptions.monthly');
    case 'OTHER':
      return i18next.t('payments:anticipatedPaymentFrequencyOptions.other');
    case 'QUARTERLY':
      return i18next.t('payments:anticipatedPaymentFrequencyOptions.quarterly');
    case 'SEMIMONTHLY':
      return i18next.t(
        'payments:anticipatedPaymentFrequencyOptions.semimonthly'
      );
    case 'WEEKLY':
      return i18next.t('payments:anticipatedPaymentFrequencyOptions.weekly');
    default:
      return '';
  }
};

export const translateConfidenceType = (type: string) => {
  switch (type) {
    case 'NOT_AT_ALL':
      return i18next.t('beneficiariesOld:estimateOptions.notAtAll');
    case 'SLIGHTLY':
      return i18next.t('beneficiariesOld:estimateOptions.slightly');
    case 'FAIRLY':
      return i18next.t('beneficiariesOld:estimateOptions.fairly');
    case 'COMPLETELY':
      return i18next.t('beneficiariesOld:estimateOptions.completely');
    default:
      return '';
  }
};

export const translateRecruitmentType = (type: string) => {
  switch (type) {
    case 'LOI':
      return i18next.t('participantsAndProvidersOld:recruitOptions.loi');
    case 'APPLICATION_COLLECTION_TOOL':
      return i18next.t(
        'participantsAndProvidersOld:recruitOptions.appCollectionTool'
      );
    case 'NOFO':
      return i18next.t('participantsAndProvidersOld:recruitOptions.nofo');
    case 'OTHER':
      return i18next.t('participantsAndProvidersOld:recruitOptions.other');
    case 'NA':
      return i18next.t(
        'participantsAndProvidersOld:recruitOptions.notApplicable'
      );
    default:
      return '';
  }
};

export const translateParticipantSelectiontType = (type: string) => {
  switch (type) {
    case 'MODEL_TEAM_REVIEW_APPLICATIONS':
      return i18next.t(
        'participantsAndProvidersOld:selectOtions.reviewApplications'
      );
    case 'SUPPORT_FROM_CMMI':
      return i18next.t(
        'participantsAndProvidersOld:selectOtions.solicitSupport'
      );
    case 'CMS_COMPONENT_OR_PROCESS':
      return i18next.t(
        'participantsAndProvidersOld:selectOtions.anotherComponent'
      );
    case 'APPLICATION_REVIEW_AND_SCORING_TOOL':
      return i18next.t(
        'participantsAndProvidersOld:selectOtions.applicationReview'
      );
    case 'APPLICATION_SUPPORT_CONTRACTOR':
      return i18next.t(
        'participantsAndProvidersOld:selectOtions.applicationSupport'
      );
    case 'BASIC_CRITERIA':
      return i18next.t('participantsAndProvidersOld:selectOtions.criteria');
    case 'OTHER':
      return i18next.t('participantsAndProvidersOld:selectOtions.other');
    case 'NO_SELECTING_PARTICIPANTS':
      return i18next.t(
        'participantsAndProvidersOld:selectOtions.notApplicable'
      );
    default:
      return '';
  }
};

export const translateCommunicationType = (type: string) => {
  switch (type) {
    case 'MASS_EMAIL':
      return i18next.t(
        'participantsAndProvidersOld:participantCommunicationOptions.sendEmails'
      );
    case 'IT_TOOL':
      return i18next.t(
        'participantsAndProvidersOld:participantCommunicationOptions.itTool'
      );
    case 'NO_COMMUNICATION':
      return i18next.t(
        'participantsAndProvidersOld:participantCommunicationOptions.noCommunication'
      );
    case 'OTHER':
      return i18next.t(
        'participantsAndProvidersOld:participantCommunicationOptions.other'
      );
    default:
      return '';
  }
};

export const translateRiskType = (type: string) => {
  switch (type) {
    case 'TWO_SIDED':
      return i18next.t('participantsAndProvidersOld:riskTypeOptions.twoSided');
    case 'ONE_SIDED':
      return i18next.t('participantsAndProvidersOld:riskTypeOptions.oneSided');
    case 'CAPITATION':
      return i18next.t(
        'participantsAndProvidersOld:riskTypeOptions.capitalization'
      );
    case 'OTHER':
      return i18next.t('participantsAndProvidersOld:riskTypeOptions.other');
    default:
      return '';
  }
};

export const translateParticipantIDType = (type: string) => {
  switch (type) {
    case 'TINS':
      return i18next.t('participantsAndProvidersOld:collectTINsOptions.tins');
    case 'NPIS':
      return i18next.t('participantsAndProvidersOld:collectTINsOptions.npis');
    case 'CCNS':
      return i18next.t('participantsAndProvidersOld:collectTINsOptions.ccns');
    case 'OTHER':
      return i18next.t('participantsAndProvidersOld:collectTINsOptions.other');
    case 'NO_IDENTIFIERS':
      return i18next.t('participantsAndProvidersOld:collectTINsOptions.no');
    default:
      return '';
  }
};

export const translateFrequencyType = (type: string) => {
  switch (type) {
    case 'ANNUALLY':
      return i18next.t('beneficiariesOld:frequencyOptions.annually');
    case 'BIANNUALLY':
      return i18next.t('beneficiariesOld:frequencyOptions.biannually');
    case 'QUARTERLY':
      return i18next.t('beneficiariesOld:frequencyOptions.quarterly');
    case 'MONTHLY':
      return i18next.t('beneficiariesOld:frequencyOptions.monthly');
    case 'ROLLING':
      return i18next.t('beneficiariesOld:frequencyOptions.rolling');
    case 'OTHER':
      return i18next.t('beneficiariesOld:frequencyOptions.other');
    default:
      return '';
  }
};

export const translateSubtasks = (status: string) => {
  switch (status) {
    case OperationalSolutionSubtaskStatus.TODO:
      return i18next.t('itSolutions:subtasks.todo');
    case OperationalSolutionSubtaskStatus.IN_PROGRESS:
      return i18next.t('itSolutions:subtasks.inProgress');
    case OperationalSolutionSubtaskStatus.DONE:
      return i18next.t('itSolutions:subtasks.done');
    default:
      return '';
  }
};

export const translateOperationalSolutionKey = (
  key: OperationalSolutionKey
) => {
  switch (key) {
    case OperationalSolutionKey.CONTRACTOR:
      return i18next.t('itSolutions:operationalSolutionKey.contractor');
    case OperationalSolutionKey.CROSS_MODEL_CONTRACT:
      return i18next.t('itSolutions:operationalSolutionKey.crossModelContract');
    case OperationalSolutionKey.EXISTING_CMS_DATA_AND_PROCESS:
      return i18next.t(
        'itSolutions:operationalSolutionKey.existingCmsDataAndProcess'
      );
    case OperationalSolutionKey.INTERNAL_STAFF:
      return i18next.t('itSolutions:operationalSolutionKey.interalStaff');
    case OperationalSolutionKey.OTHER_NEW_PROCESS:
      return i18next.t('itSolutions:operationalSolutionKey.otherNewProcess');
    default:
      return '';
  }
};

export const translateProviderAddType = (type: string) => {
  switch (type) {
    case 'PROSPECTIVELY':
      return i18next.t(
        'participantsAndProvidersOld:decideProvidersOptions.prospectively'
      );
    case 'RETROSPECTIVELY':
      return i18next.t(
        'participantsAndProvidersOld:decideProvidersOptions.retrospectively'
      );
    case 'VOLUNTARILY':
      return i18next.t(
        'participantsAndProvidersOld:decideProvidersOptions.voluntarily'
      );
    case 'MANDATORILY':
      return i18next.t(
        'participantsAndProvidersOld:decideProvidersOptions.manditorily'
      );
    case 'ONLINE_TOOLS':
      return i18next.t(
        'participantsAndProvidersOld:decideProvidersOptions.onlineTools'
      );
    case 'OTHER':
      return i18next.t(
        'participantsAndProvidersOld:decideProvidersOptions.other'
      );
    case 'NA':
      return i18next.t('participantsAndProvidersOld:decideProvidersOptions.na');
    default:
      return '';
  }
};

export const translateProviderLeaveType = (type: string) => {
  switch (type) {
    case 'VOLUNTARILY_WITHOUT_IMPLICATIONS':
      return i18next.t(
        'participantsAndProvidersOld:canProvidersLeaveOptions.voluntarily'
      );
    case 'AFTER_A_CERTAIN_WITH_IMPLICATIONS':
      return i18next.t(
        'participantsAndProvidersOld:canProvidersLeaveOptions.certainDate'
      );
    case 'VARIES_BY_TYPE_OF_PROVIDER':
      return i18next.t(
        'participantsAndProvidersOld:canProvidersLeaveOptions.varies'
      );
    case 'NOT_ALLOWED_TO_LEAVE':
      return i18next.t(
        'participantsAndProvidersOld:canProvidersLeaveOptions.notAllowed'
      );
    case 'OTHER':
      return i18next.t(
        'participantsAndProvidersOld:canProvidersLeaveOptions.other'
      );
    case 'NOT_APPLICABLE':
      return i18next.t(
        'participantsAndProvidersOld:canProvidersLeaveOptions.notApplicable'
      );
    default:
      return '';
  }
};

export const translateOverlapType = (type: string) => {
  switch (type) {
    case 'YES_NEED_POLICIES':
      return i18next.t('beneficiariesOld:overlapOptions.yes');
    case 'YES_NO_ISSUES':
      return i18next.t('beneficiariesOld:overlapOptions.yesNoIssue');
    case 'NO':
      return i18next.t('beneficiariesOld:overlapOptions.no');
    default:
      return '';
  }
};

export const translateAgencyOrStateHelpType = (type: string) => {
  switch (type) {
    case 'YES_STATE':
      return i18next.t('opsEvalAndLearningOld:anotherAgencyOptions.withState');
    case 'YES_AGENCY_IDEAS':
      return i18next.t('opsEvalAndLearningOld:anotherAgencyOptions.getIdeas');
    case 'YES_AGENCY_IAA':
      return i18next.t('opsEvalAndLearningOld:anotherAgencyOptions.getSupport');
    case 'NO':
      return i18next.t('opsEvalAndLearningOld:anotherAgencyOptions.no');
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:anotherAgencyOptions.other');
    default:
      return '';
  }
};

export const translateStakeholdersType = (type: string) => {
  switch (type) {
    case 'BENEFICIARIES':
      return i18next.t(
        'opsEvalAndLearningOld:stakeholdersOptions.beneficiaries'
      );
    case 'COMMUNITY_ORGANIZATIONS':
      return i18next.t(
        'opsEvalAndLearningOld:stakeholdersOptions.communityOrganizations'
      );
    case 'PARTICIPANTS':
      return i18next.t(
        'opsEvalAndLearningOld:stakeholdersOptions.participants'
      );
    case 'PROFESSIONAL_ORGANIZATIONS':
      return i18next.t(
        'opsEvalAndLearningOld:stakeholdersOptions.professionalOrganizations'
      );
    case 'PROVIDERS':
      return i18next.t('opsEvalAndLearningOld:stakeholdersOptions.providers');
    case 'STATES':
      return i18next.t('opsEvalAndLearningOld:stakeholdersOptions.states');
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:stakeholdersOptions.other');
    default:
      return '';
  }
};

export const translateContractorSupportType = (type: string) => {
  switch (type) {
    case 'ONE':
      return i18next.t('opsEvalAndLearningOld:whatContractorsOptions.one');
    case 'MULTIPLE':
      return i18next.t('opsEvalAndLearningOld:whatContractorsOptions.separate');
    case 'NONE':
      return i18next.t(
        'opsEvalAndLearningOld:whatContractorsOptions.noContractor'
      );
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:whatContractorsOptions.other');
    default:
      return '';
  }
};

export const translateMonitoringFileType = (type: string) => {
  switch (type) {
    case 'BENEFICIARY':
      return i18next.t('opsEvalAndLearningOld:fileTypesOptions.beneficiary');
    case 'PROVIDER':
      return i18next.t('opsEvalAndLearningOld:fileTypesOptions.provider');
    case 'PART_A':
      return i18next.t('opsEvalAndLearningOld:fileTypesOptions.partA');
    case 'PART_B':
      return i18next.t('opsEvalAndLearningOld:fileTypesOptions.partB');
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:fileTypesOptions.other');
    default:
      return '';
  }
};

export const translateDataFullTimeOrIncrementalType = (type: string) => {
  switch (type) {
    case 'FULL_TIME':
      return i18next.t('opsEvalAndLearningOld:fullTime');
    case 'INCREMENTAL':
      return i18next.t('opsEvalAndLearningOld:incremental');
    default:
      return '';
  }
};

export const translateBenchmarkForPerformanceType = (type: string) => {
  switch (type) {
    case 'YES_RECONCILE':
      return i18next.t(
        'opsEvalAndLearningOld:establishBenchmarkOptions.reconcile'
      );
    case 'YES_NO_RECONCILE':
      return i18next.t(
        'opsEvalAndLearningOld:establishBenchmarkOptions.notReconcile'
      );
    case 'NO':
      return i18next.t('opsEvalAndLearningOld:establishBenchmarkOptions.no');
    default:
      return '';
  }
};

export const translateEvaluationApproachType = (type: string) => {
  switch (type) {
    case 'CONTROL_INTERVENTION':
      return i18next.t('opsEvalAndLearningOld:approachOptions.establish');
    case 'COMPARISON_MATCH':
      return i18next.t('opsEvalAndLearningOld:approachOptions.identify');
    case 'INTERRUPTED_TIME':
      return i18next.t('opsEvalAndLearningOld:approachOptions.interrupted');
    case 'NON_MEDICARE_DATA':
      return i18next.t('opsEvalAndLearningOld:approachOptions.leverage');
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:approachOptions.other');
    default:
      return '';
  }
};

export const translateCcmInvolvmentType = (type: string) => {
  switch (type) {
    case 'YES_EVALUATION':
      return i18next.t('opsEvalAndLearningOld:ccwOptions.yesEval');
    case 'YES__IMPLEMENTATION':
      return i18next.t('opsEvalAndLearningOld:ccwOptions.yesImpl');
    case 'NO':
      return i18next.t('opsEvalAndLearningOld:ccwOptions.no');
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:ccwOptions.other');
    default:
      return '';
  }
};

export const translateDataForMonitoringType = (type: string) => {
  switch (type) {
    case 'SITE_VISITS':
      return i18next.t('opsEvalAndLearningOld:dataNeededOptions.siteVisits');
    case 'MEDICARE_CLAIMS':
      return i18next.t(
        'opsEvalAndLearningOld:dataNeededOptions.medicareClaims'
      );
    case 'MEDICAID_CLAIMS':
      return i18next.t(
        'opsEvalAndLearningOld:dataNeededOptions.medicaidClaims'
      );
    case 'ENCOUNTER_DATA':
      return i18next.t('opsEvalAndLearningOld:dataNeededOptions.encounterData');
    case 'NO_PAY_CLAIMS':
      return i18next.t('opsEvalAndLearningOld:dataNeededOptions.noPayClaims');
    case 'QUALITY_CLAIMS_BASED_MEASURES':
      return i18next.t('opsEvalAndLearningOld:dataNeededOptions.qualityClaims');
    case 'QUALITY_REPORTED_MEASURES':
      return i18next.t(
        'opsEvalAndLearningOld:dataNeededOptions.qualityReported'
      );
    case 'CLINICAL_DATA':
      return i18next.t('opsEvalAndLearningOld:dataNeededOptions.clinicalData');
    case 'NON_CLINICAL_DATA':
      return i18next.t('opsEvalAndLearningOld:dataNeededOptions.nonClinical');
    case 'NON_MEDICAL_DATA':
      return i18next.t('opsEvalAndLearningOld:dataNeededOptions.nonMedical');
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:dataNeededOptions.other');
    case 'NOT_PLANNING_TO_COLLECT_DATA':
      return i18next.t(
        'opsEvalAndLearningOld:dataNeededOptions.notPlanningToCollect'
      );
    default:
      return '';
  }
};

export const translateDataToSendParticipantsType = (type: string) => {
  switch (type) {
    case 'BASELINE_HISTORICAL_DATA':
      return i18next.t('opsEvalAndLearningOld:dataToSendOptions.baseline');
    case 'CLAIMS_LEVEL_DATA':
      return i18next.t('opsEvalAndLearningOld:dataToSendOptions.claims');
    case 'BENEFICIARY_LEVEL_DATA':
      return i18next.t('opsEvalAndLearningOld:dataToSendOptions.beneficiary');
    case 'PARTICIPANT_LEVEL_DATA':
      return i18next.t('opsEvalAndLearningOld:dataToSendOptions.participant');
    case 'PROVIDER_LEVEL_DATA':
      return i18next.t('opsEvalAndLearningOld:dataToSendOptions.provider');
    case 'OTHER_MIPS_DATA':
      return i18next.t('opsEvalAndLearningOld:dataToSendOptions.other');
    case 'NOT_PLANNING_TO_SEND_DATA':
      return i18next.t('opsEvalAndLearningOld:dataToSendOptions.notPlanning');
    default:
      return '';
  }
};

export const translateDataStartsType = (type: string) => {
  switch (type) {
    case 'DURING_APPLICATION_PERIOD':
      return i18next.t('opsEvalAndLearningOld:dataSharingOptions.during');
    case 'SHORTLY_BEFORE_THE_START_DATE':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingOptions.shortlyBefore'
      );
    case 'EARLY_IN_THE_FIRST_PERFORMANCE_YEAR':
      return i18next.t('opsEvalAndLearningOld:dataSharingOptions.early');
    case 'LATER_IN_THE_FIRST_PERFORMANCE_YEAR':
      return i18next.t('opsEvalAndLearningOld:dataSharingOptions.later');
    case 'IN_THE_SUBSEQUENT_PERFORMANCE_YEAR':
      return i18next.t('opsEvalAndLearningOld:dataSharingOptions.subsequent');
    case 'AT_SOME_OTHER_POINT_IN_TIME':
      return i18next.t('opsEvalAndLearningOld:dataSharingOptions.somePoint');
    case 'NOT_PLANNING_TO_DO_THIS':
      return i18next.t('opsEvalAndLearningOld:dataSharingOptions.notPlanning');
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:dataSharingOptions.other');
    default:
      return '';
  }
};

export const translateDataFrequencyType = (type: string) => {
  switch (type) {
    case 'ANNUALLY':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.annually'
      );
    case 'BIANNUALLY':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.bianually'
      );
    case 'QUARTERLY':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.quarterly'
      );
    case 'MONTHLY':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.monthly'
      );
    case 'SEMI_MONTHLY':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.semiMonthly'
      );
    case 'WEEKLY':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.weekly'
      );
    case 'DAILY':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.daily'
      );
    case 'OTHER':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.other'
      );
    case 'NOT_PLANNING_TO_DO_THIS':
      return i18next.t(
        'opsEvalAndLearningOld:dataSharingHowOftenOptions.notPlanning'
      );
    default:
      return '';
  }
};

export const translateModelLearningSystemType = (type: string) => {
  switch (type) {
    case 'LEARNING_CONTRACTOR':
      return i18next.t('opsEvalAndLearningOld:learningSystemOptions.connector');
    case 'IT_PLATFORM_CONNECT':
      return i18next.t('opsEvalAndLearningOld:learningSystemOptions.itConnect');
    case 'PARTICIPANT_COLLABORATION':
      return i18next.t(
        'opsEvalAndLearningOld:learningSystemOptions.collaboration'
      );
    case 'EDUCATE_BENEFICIARIES':
      return i18next.t('opsEvalAndLearningOld:learningSystemOptions.educate');
    case 'OTHER':
      return i18next.t('opsEvalAndLearningOld:learningSystemOptions.other');
    case 'NO_LEARNING_SYSTEM':
      return i18next.t('opsEvalAndLearningOld:learningSystemOptions.no');
    default:
      return '';
  }
};

export const translateOpNeedsStatusType = (type: string) => {
  switch (type) {
    case 'NOT_NEEDED':
      return i18next.t('itSolutions:status.notNeeded');
    case 'NOT_ANSWERED':
      return i18next.t('itSolutions:status.notAnswered');
    case 'NOT_STARTED':
      return i18next.t('itSolutions:status.notStarted');
    case 'ONBOARDING':
      return i18next.t('itSolutions:status.onboarding');
    case 'BACKLOG':
      return i18next.t('itSolutions:status.backlog');
    case 'IN_PROGRESS':
      return i18next.t('itSolutions:status.inProgress');
    case 'COMPLETED':
      return i18next.t('itSolutions:status.completed');
    case 'AT_RISK':
      return i18next.t('itSolutions:status.atRisk');
    default:
      return '';
  }
};

export const translateAppealsQuestionType = (type: string) => {
  switch (type) {
    case 'appealPerformance':
      return i18next.t('opsEvalAndLearningOld:performanceScores');
    case 'appealFeedback':
      return i18next.t('opsEvalAndLearningOld:feedbackResults');
    case 'appealPayments':
      return i18next.t('opsEvalAndLearningOld:payments');
    case 'appealOther':
      return i18next.t('opsEvalAndLearningOld:others');
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
    case 'DESIGN_PARAMETERS_MEMO':
      return i18next.t('documents:documentTypes.designParamMemo');
    case 'POLICY_PAPER':
      return i18next.t('documents:documentTypes.policy');
    case 'ICIP_DRAFT':
      return i18next.t('documents:documentTypes.icipDraft');
    case 'MARKET_RESEARCH':
      return i18next.t('documents:documentTypes.marketResearch');
    case 'OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION':
      return i18next.t('documents:documentTypes.adminOfficePresentation');
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

// Used to map MultiSelect options from Enums
export const mapMultiSelectOptions = (
  translationMethod: (key: string) => string,
  type: { [s: number]: string }
) =>
  Object.keys(type)
    .sort(sortOtherEnum)
    .map(key => ({
      value: key,
      label: translationMethod(key)
    }));

// Used to map MultiSelect options from Enums
export const composeMultiSelectOptions = (
  translationObject: Record<string, string>,
  sublabels?: Record<string, string>
) =>
  getKeys(translationObject).map(key => ({
    value: key,
    label: translationObject[key],
    subLabel: sublabels ? sublabels[key] : null
  }));

// Sort mapped enums to be alphabetical and have 'OTHER' come last
export const sortOtherEnum = (a: string, b: string) => {
  if (
    b === 'NA' ||
    b === 'NO' ||
    b === 'NO_SELECTING_PARTICIPANTS' ||
    b === 'NO_COMMUNICATION' ||
    b === 'NO_IDENTIFIERS' ||
    b === 'NOT_APPLICABLE' ||
    b === 'NOT_PLANNING_TO_COLLECT_DATA' ||
    b === 'NOT_PLANNING_TO_SEND_DATA' ||
    b === 'NO_LEARNING_SYSTEM' ||
    b === 'NOT_APM' ||
    b === 'NONE_OF_THE_ABOVE'
  )
    return -1;
  if (a < b || b === 'OTHER') {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

// Sort possible operational needs
export const sortPossibleOperationalNeeds = (
  a: { name: string },
  b: { name: string }
) => {
  if (a.name === 'Other new process') return 1;

  if (b.name === 'Other new process') return -1;

  if (a.name < b.name) return -1;

  if (a.name > b.name) return 1;

  return 0;
};

export const sortPayTypeEnums = (a: string, b: string) => {
  if (a < b || b === 'GRANTS') {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

export const isUUID = (uuid: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  );

/* Takes first letter of first and last name */
/* i.e. Steve Rogers == SR */
export const getUserInitials = (user: string) =>
  user
    ?.split(' ')
    .map(name => returnValidLetter(name?.charAt(0)).toUpperCase())
    .join('');

// Check if a single character is a valid letter
export const returnValidLetter = (str: string) =>
  str.length === 1 && str.match(/[a-z]/i) ? str : '';
