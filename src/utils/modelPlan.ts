import i18next from 'i18next';

import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';
import {
  ComplexityCalculationLevelType,
  DocumentType,
  OperationalSolutionKey,
  OperationalSolutionSubtaskStatus
} from 'types/graphql-global-types';

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
      return i18next.t('generalCharacteristics:newModel');
    case false:
      return i18next.t('generalCharacteristics:newTrack');
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
      return i18next.t('beneficiaries:beneficiariesOptions.na');
    default:
      return '';
  }
};

export const translateTeamRole = (teamRole: string) => {
  switch (teamRole) {
    case 'EVALUATION':
      return i18next.t('modelPlan:teamRoles.evaluation');
    case 'IT_LEAD':
      return i18next.t('modelPlan:teamRoles.itLead');
    case 'LEADERSHIP':
      return i18next.t('modelPlan:teamRoles.leadership');
    case 'LEARNING':
      return i18next.t('modelPlan:teamRoles.learning');
    case 'MODEL_LEAD':
      return i18next.t('modelPlan:teamRoles.modelLead');
    case 'MODEL_TEAM':
      return i18next.t('modelPlan:teamRoles.modelTeam');
    case 'QUALITY':
      return i18next.t('modelPlan:teamRoles.quality');
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
      return i18next.t('basics:cmsComponents.cmmi');
    case 'CENTER_FOR_MEDICARE':
      return i18next.t('basics:cmsComponents.cm');
    case 'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE':
      return i18next.t('basics:cmsComponents.federalCoordinateHealthCare');
    case 'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY':
      return i18next.t('basics:cmsComponents.ccsq');
    case 'CENTER_FOR_PROGRAM_INTEGRITY':
      return i18next.t('basics:cmsComponents.cpi');
    case 'OTHER':
      return i18next.t('basics:cmsComponents.other');
    default:
      return '';
  }
};

export const translateCmmiGroups = (category: string) => {
  switch (category) {
    case 'PATIENT_CARE_MODELS_GROUP':
      return i18next.t('basics:cmmiGroups.pcmg');
    case 'POLICY_AND_PROGRAMS_GROUP':
      return i18next.t('basics:cmmiGroups.ppg');
    case 'SEAMLESS_CARE_MODELS_GROUP':
      return i18next.t('basics:cmmiGroups.scmg');
    case 'STATE_AND_POPULATION_HEALTH_GROUP':
      return i18next.t('basics:cmmiGroups.sphg');
    case 'TBD':
      return i18next.t('basics:cmmiGroups.tbd');
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
    case 'PAUSED':
      return i18next.t('modelPlan:planStatuses.paused');
    case 'CANCELED':
      return i18next.t('modelPlan:planStatuses.canceled');
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
    case 'NOT_APM':
      return i18next.t('generalCharacteristics:apmTypes.notAPM');
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

export const translateWaiverTypesLabel = (type: string) => {
  switch (type) {
    case 'FRAUD_ABUSE':
      return i18next.t('generalCharacteristics:fraudAndAbuseNote');
    case 'PROGRAM_PAYMENT':
      return i18next.t('generalCharacteristics:programPaymentNote');
    case 'MEDICAID':
      return i18next.t('generalCharacteristics:medicaidNote');
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

export const translateBeneficiariesType = (type: string) => {
  switch (type) {
    case 'DISEASE_SPECIFIC':
      return i18next.t('beneficiaries:beneficiariesOptions.diseaseSpecific');
    case 'DUALLY_ELIGIBLE':
      return i18next.t('beneficiaries:beneficiariesOptions.duallyEligible');
    case 'MEDICAID':
      return i18next.t('beneficiaries:beneficiariesOptions.medicaid');
    case 'MEDICARE_ADVANTAGE':
      return i18next.t('beneficiaries:beneficiariesOptions.medicareAdvantage');
    case 'MEDICARE_FFS':
      return i18next.t('beneficiaries:beneficiariesOptions.medicareFfs');
    case 'MEDICARE_PART_D':
      return i18next.t('beneficiaries:beneficiariesOptions.medicarePartD');
    case 'OTHER':
      return i18next.t('beneficiaries:beneficiariesOptions.other');
    case 'NA':
      return i18next.t('beneficiaries:beneficiariesOptions.na');
    default:
      return '';
  }
};

export const translateSelectionMethodType = (type: string) => {
  switch (type) {
    case 'HISTORICAL':
      return i18next.t('beneficiaries:selectionMethod.historical');
    case 'PROSPECTIVE':
      return i18next.t('beneficiaries:selectionMethod.prospective');
    case 'PROVIDER_SIGN_UP':
      return i18next.t('beneficiaries:selectionMethod.retrospective');
    case 'RETROSPECTIVE':
      return i18next.t('beneficiaries:selectionMethod.voluntary');
    case 'VOLUNTARY':
      return i18next.t('beneficiaries:selectionMethod.providerSignUp');
    case 'OTHER':
      return i18next.t('beneficiaries:selectionMethod.other');
    case 'NA':
      return i18next.t('beneficiaries:selectionMethod.na');
    default:
      return '';
  }
};

export const translateModelType = (type: string) => {
  switch (type) {
    case 'VOLUNTARY':
      return i18next.t('basics:voluntary');
    case 'MANDATORY':
      return i18next.t('basics:mandatory');
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
    case 'APPLICATION_COLLECTION_TOOL':
      return i18next.t(
        'participantsAndProviders:recruitOptions.appCollectionTool'
      );
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
      return i18next.t('participantsAndProviders:selectOtions.other');
    case 'NO_SELECTING_PARTICIPANTS':
      return i18next.t('participantsAndProviders:selectOtions.notApplicable');
    default:
      return '';
  }
};

export const translateCommunicationType = (type: string) => {
  switch (type) {
    case 'MASS_EMAIL':
      return i18next.t(
        'participantsAndProviders:participantCommunicationOptions.sendEmails'
      );
    case 'IT_TOOL':
      return i18next.t(
        'participantsAndProviders:participantCommunicationOptions.itTool'
      );
    case 'NO_COMMUNICATION':
      return i18next.t(
        'participantsAndProviders:participantCommunicationOptions.noCommunication'
      );
    case 'OTHER':
      return i18next.t(
        'participantsAndProviders:participantCommunicationOptions.other'
      );
    default:
      return '';
  }
};

export const translateRiskType = (type: string) => {
  switch (type) {
    case 'TWO_SIDED':
      return i18next.t('participantsAndProviders:riskTypeOptions.twoSided');
    case 'ONE_SIDED':
      return i18next.t('participantsAndProviders:riskTypeOptions.oneSided');
    case 'CAPITATION':
      return i18next.t(
        'participantsAndProviders:riskTypeOptions.capitalization'
      );
    case 'OTHER':
      return i18next.t('participantsAndProviders:riskTypeOptions.other');
    default:
      return '';
  }
};

export const translateParticipantIDType = (type: string) => {
  switch (type) {
    case 'TINS':
      return i18next.t('participantsAndProviders:collectTINsOptions.tins');
    case 'NPIS':
      return i18next.t('participantsAndProviders:collectTINsOptions.npis');
    case 'CCNS':
      return i18next.t('participantsAndProviders:collectTINsOptions.ccns');
    case 'OTHER':
      return i18next.t('participantsAndProviders:collectTINsOptions.other');
    case 'NO_IDENTIFIERS':
      return i18next.t('participantsAndProviders:collectTINsOptions.no');
    default:
      return '';
  }
};

export const translateFrequencyType = (type: string) => {
  switch (type) {
    case 'ANNUALLY':
      return i18next.t('participantsAndProviders:frequencyOptions.annually');
    case 'BIANNUALLY':
      return i18next.t('participantsAndProviders:frequencyOptions.biannually');
    case 'QUARTERLY':
      return i18next.t('participantsAndProviders:frequencyOptions.quarterly');
    case 'MONTHLY':
      return i18next.t('participantsAndProviders:frequencyOptions.monthly');
    case 'ROLLING':
      return i18next.t('participantsAndProviders:frequencyOptions.rolling');
    case 'OTHER':
      return i18next.t('participantsAndProviders:frequencyOptions.other');
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
        'participantsAndProviders:decideProvidersOptions.prospectively'
      );
    case 'RETROSPECTIVELY':
      return i18next.t(
        'participantsAndProviders:decideProvidersOptions.retrospectively'
      );
    case 'VOLUNTARILY':
      return i18next.t(
        'participantsAndProviders:decideProvidersOptions.voluntarily'
      );
    case 'MANDATORILY':
      return i18next.t(
        'participantsAndProviders:decideProvidersOptions.manditorily'
      );
    case 'ONLINE_TOOLS':
      return i18next.t(
        'participantsAndProviders:decideProvidersOptions.onlineTools'
      );
    case 'OTHER':
      return i18next.t('participantsAndProviders:decideProvidersOptions.other');
    case 'NA':
      return i18next.t('participantsAndProviders:decideProvidersOptions.na');
    default:
      return '';
  }
};

export const translateProviderLeaveType = (type: string) => {
  switch (type) {
    case 'VOLUNTARILY_WITHOUT_IMPLICATIONS':
      return i18next.t(
        'participantsAndProviders:canProvidersLeaveOptions.voluntarily'
      );
    case 'AFTER_A_CERTAIN_WITH_IMPLICATIONS':
      return i18next.t(
        'participantsAndProviders:canProvidersLeaveOptions.certainDate'
      );
    case 'VARIES_BY_TYPE_OF_PROVIDER':
      return i18next.t(
        'participantsAndProviders:canProvidersLeaveOptions.varies'
      );
    case 'NOT_ALLOWED_TO_LEAVE':
      return i18next.t(
        'participantsAndProviders:canProvidersLeaveOptions.notAllowed'
      );
    case 'OTHER':
      return i18next.t(
        'participantsAndProviders:canProvidersLeaveOptions.other'
      );
    case 'NOT_APPLICABLE':
      return i18next.t(
        'participantsAndProviders:canProvidersLeaveOptions.notApplicable'
      );
    default:
      return '';
  }
};

export const translateOverlapType = (type: string) => {
  switch (type) {
    case 'YES_NEED_POLICIES':
      return i18next.t('participantsAndProviders:overlapOptions.yes');
    case 'YES_NO_ISSUES':
      return i18next.t('participantsAndProviders:overlapOptions.yesNoIssue');
    case 'NO':
      return i18next.t('participantsAndProviders:overlapOptions.no');
    default:
      return '';
  }
};

export const translateAgencyOrStateHelpType = (type: string) => {
  switch (type) {
    case 'YES_STATE':
      return i18next.t(
        'operationsEvaluationAndLearning:anotherAgencyOptions.withState'
      );
    case 'YES_AGENCY_IDEAS':
      return i18next.t(
        'operationsEvaluationAndLearning:anotherAgencyOptions.getIdeas'
      );
    case 'YES_AGENCY_IAA':
      return i18next.t(
        'operationsEvaluationAndLearning:anotherAgencyOptions.getSupport'
      );
    case 'NO':
      return i18next.t(
        'operationsEvaluationAndLearning:anotherAgencyOptions.no'
      );
    case 'OTHER':
      return i18next.t(
        'operationsEvaluationAndLearning:anotherAgencyOptions.other'
      );
    default:
      return '';
  }
};

export const translateStakeholdersType = (type: string) => {
  switch (type) {
    case 'BENEFICIARIES':
      return i18next.t(
        'operationsEvaluationAndLearning:stakeholdersOptions.beneficiaries'
      );
    case 'COMMUNITY_ORGANIZATIONS':
      return i18next.t(
        'operationsEvaluationAndLearning:stakeholdersOptions.communityOrganizations'
      );
    case 'PARTICIPANTS':
      return i18next.t(
        'operationsEvaluationAndLearning:stakeholdersOptions.participants'
      );
    case 'PROFESSIONAL_ORGANIZATIONS':
      return i18next.t(
        'operationsEvaluationAndLearning:stakeholdersOptions.professionalOrganizations'
      );
    case 'PROVIDERS':
      return i18next.t(
        'operationsEvaluationAndLearning:stakeholdersOptions.providers'
      );
    case 'STATES':
      return i18next.t(
        'operationsEvaluationAndLearning:stakeholdersOptions.states'
      );
    case 'OTHER':
      return i18next.t(
        'operationsEvaluationAndLearning:stakeholdersOptions.other'
      );
    default:
      return '';
  }
};

export const translateContractorSupportType = (type: string) => {
  switch (type) {
    case 'ONE':
      return i18next.t(
        'operationsEvaluationAndLearning:whatContractorsOptions.one'
      );
    case 'MULTIPLE':
      return i18next.t(
        'operationsEvaluationAndLearning:whatContractorsOptions.separate'
      );
    case 'NONE':
      return i18next.t(
        'operationsEvaluationAndLearning:whatContractorsOptions.noContractor'
      );
    case 'OTHER':
      return i18next.t(
        'operationsEvaluationAndLearning:whatContractorsOptions.other'
      );
    default:
      return '';
  }
};

export const translateMonitoringFileType = (type: string) => {
  switch (type) {
    case 'BENEFICIARY':
      return i18next.t(
        'operationsEvaluationAndLearning:fileTypesOptions.beneficiary'
      );
    case 'PROVIDER':
      return i18next.t(
        'operationsEvaluationAndLearning:fileTypesOptions.provider'
      );
    case 'PART_A':
      return i18next.t(
        'operationsEvaluationAndLearning:fileTypesOptions.partA'
      );
    case 'PART_B':
      return i18next.t(
        'operationsEvaluationAndLearning:fileTypesOptions.partB'
      );
    case 'OTHER':
      return i18next.t(
        'operationsEvaluationAndLearning:fileTypesOptions.other'
      );
    default:
      return '';
  }
};

export const translateDataFullTimeOrIncrementalType = (type: string) => {
  switch (type) {
    case 'FULL_TIME':
      return i18next.t('operationsEvaluationAndLearning:fullTime');
    case 'INCREMENTAL':
      return i18next.t('operationsEvaluationAndLearning:incremental');
    default:
      return '';
  }
};

export const translateBenchmarkForPerformanceType = (type: string) => {
  switch (type) {
    case 'YES_RECONCILE':
      return i18next.t(
        'operationsEvaluationAndLearning:establishBenchmarkOptions.reconcile'
      );
    case 'YES_NO_RECONCILE':
      return i18next.t(
        'operationsEvaluationAndLearning:establishBenchmarkOptions.notReconcile'
      );
    case 'NO':
      return i18next.t(
        'operationsEvaluationAndLearning:establishBenchmarkOptions.no'
      );
    default:
      return '';
  }
};

export const translateEvaluationApproachType = (type: string) => {
  switch (type) {
    case 'CONTROL_INTERVENTION':
      return i18next.t(
        'operationsEvaluationAndLearning:approachOptions.establish'
      );
    case 'COMPARISON_MATCH':
      return i18next.t(
        'operationsEvaluationAndLearning:approachOptions.identify'
      );
    case 'INTERRUPTED_TIME':
      return i18next.t(
        'operationsEvaluationAndLearning:approachOptions.interrupted'
      );
    case 'NON_MEDICARE_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:approachOptions.leverage'
      );
    case 'OTHER':
      return i18next.t('operationsEvaluationAndLearning:approachOptions.other');
    default:
      return '';
  }
};

export const translateCcmInvolvmentType = (type: string) => {
  switch (type) {
    case 'YES_EVALUATION':
      return i18next.t('operationsEvaluationAndLearning:ccwOptions.yesEval');
    case 'YES__IMPLEMENTATION':
      return i18next.t('operationsEvaluationAndLearning:ccwOptions.yesImpl');
    case 'NO':
      return i18next.t('operationsEvaluationAndLearning:ccwOptions.no');
    case 'OTHER':
      return i18next.t('operationsEvaluationAndLearning:ccwOptions.other');
    default:
      return '';
  }
};

export const translateDataForMonitoringType = (type: string) => {
  switch (type) {
    case 'SITE_VISITS':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.siteVisits'
      );
    case 'MEDICARE_CLAIMS':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.medicareClaims'
      );
    case 'MEDICAID_CLAIMS':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.medicaidClaims'
      );
    case 'ENCOUNTER_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.encounterData'
      );
    case 'NO_PAY_CLAIMS':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.noPayClaims'
      );
    case 'QUALITY_CLAIMS_BASED_MEASURES':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.qualityClaims'
      );
    case 'QUALITY_REPORTED_MEASURES':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.qualityReported'
      );
    case 'CLINICAL_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.clinicalData'
      );
    case 'NON_CLINICAL_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.nonClinical'
      );
    case 'NON_MEDICAL_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.nonMedical'
      );
    case 'OTHER':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.other'
      );
    case 'NOT_PLANNING_TO_COLLECT_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataNeededOptions.notPlanningToCollect'
      );
    default:
      return '';
  }
};

export const translateDataToSendParticipantsType = (type: string) => {
  switch (type) {
    case 'BASELINE_HISTORICAL_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataToSendOptions.baseline'
      );
    case 'CLAIMS_LEVEL_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataToSendOptions.claims'
      );
    case 'BENEFICIARY_LEVEL_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataToSendOptions.beneficiary'
      );
    case 'PARTICIPANT_LEVEL_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataToSendOptions.participant'
      );
    case 'PROVIDER_LEVEL_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataToSendOptions.provider'
      );
    case 'OTHER_MIPS_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataToSendOptions.other'
      );
    case 'NOT_PLANNING_TO_SEND_DATA':
      return i18next.t(
        'operationsEvaluationAndLearning:dataToSendOptions.notPlanning'
      );
    default:
      return '';
  }
};

export const translateDataStartsType = (type: string) => {
  switch (type) {
    case 'DURING_APPLICATION_PERIOD':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingOptions.during'
      );
    case 'SHORTLY_BEFORE_THE_START_DATE':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingOptions.shortlyBefore'
      );
    case 'EARLY_IN_THE_FIRST_PERFORMANCE_YEAR':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingOptions.early'
      );
    case 'LATER_IN_THE_FIRST_PERFORMANCE_YEAR':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingOptions.later'
      );
    case 'IN_THE_SUBSEQUENT_PERFORMANCE_YEAR':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingOptions.subsequent'
      );
    case 'AT_SOME_OTHER_POINT_IN_TIME':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingOptions.somePoint'
      );
    case 'NOT_PLANNING_TO_DO_THIS':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingOptions.notPlanning'
      );
    case 'OTHER':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingOptions.other'
      );
    default:
      return '';
  }
};

export const translateDataFrequencyType = (type: string) => {
  switch (type) {
    case 'ANNUALLY':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.annually'
      );
    case 'BIANNUALLY':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.bianually'
      );
    case 'QUARTERLY':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.quarterly'
      );
    case 'MONTHLY':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.monthly'
      );
    case 'SEMI_MONTHLY':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.semiMonthly'
      );
    case 'WEEKLY':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.weekly'
      );
    case 'DAILY':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.daily'
      );
    case 'OTHER':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.other'
      );
    case 'NOT_PLANNING_TO_DO_THIS':
      return i18next.t(
        'operationsEvaluationAndLearning:dataSharingHowOftenOptions.notPlanning'
      );
    default:
      return '';
  }
};

export const translateModelLearningSystemType = (type: string) => {
  switch (type) {
    case 'LEARNING_CONTRACTOR':
      return i18next.t(
        'operationsEvaluationAndLearning:learningSystemOptions.connector'
      );
    case 'IT_PLATFORM_CONNECT':
      return i18next.t(
        'operationsEvaluationAndLearning:learningSystemOptions.itConnect'
      );
    case 'PARTICIPANT_COLLABORATION':
      return i18next.t(
        'operationsEvaluationAndLearning:learningSystemOptions.collaboration'
      );
    case 'EDUCATE_BENEFICIARIES':
      return i18next.t(
        'operationsEvaluationAndLearning:learningSystemOptions.educate'
      );
    case 'OTHER':
      return i18next.t(
        'operationsEvaluationAndLearning:learningSystemOptions.other'
      );
    case 'NO_LEARNING_SYSTEM':
      return i18next.t(
        'operationsEvaluationAndLearning:learningSystemOptions.no'
      );
    default:
      return '';
  }
};

export const translateGcPartCDType = (type: string) => {
  switch (type) {
    case 'MARX':
      return i18next.t('itTools:partCDTypes.marx');
    case 'OTHER':
      return i18next.t('itTools:partCDTypes.other');
    default:
      return '';
  }
};

export const translateGcCollectBidsType = (type: string) => {
  switch (type) {
    case 'HPMS':
      return i18next.t('itTools:collectBidsTypes.hpms');
    case 'OTHER':
      return i18next.t('itTools:collectBidsTypes.other');
    default:
      return '';
  }
};

export const translateGcUpdateContractType = (type: string) => {
  switch (type) {
    case 'HPMS':
      return i18next.t('itTools:updateContractTypes.hpms');
    case 'OTHER':
      return i18next.t('itTools:updateContractTypes.other');
    default:
      return '';
  }
};

export const translatePpToAdvertiseType = (type: string) => {
  switch (type) {
    case 'SALESFORCE':
      return i18next.t('itTools:ppToAdvertiseOptions.salesforce');
    case 'GRANT_SOLUTIONS':
      return i18next.t('itTools:ppToAdvertiseOptions.grantSolutions');
    case 'OTHER':
      return i18next.t('itTools:ppToAdvertiseOptions.other');
    default:
      return '';
  }
};

export const translatePpCollectScoreReviewType = (type: string) => {
  switch (type) {
    case 'RFA':
      return i18next.t('itTools:ppCollectScoreReviewOptions.rfa');
    case 'ARS':
      return i18next.t('itTools:ppCollectScoreReviewOptions.ars');
    case 'GRANT_SOLUTIONS':
      return i18next.t('itTools:ppCollectScoreReviewOptions.grant');
    case 'OTHER':
      return i18next.t('itTools:ppCollectScoreReviewOptions.other');
    default:
      return '';
  }
};

export const translatePpAppSupportContractorType = (type: string) => {
  switch (type) {
    case 'RMDA':
      return i18next.t('itTools:ppAppSupportContractorOptions.rmda');
    case 'OTHER':
      return i18next.t('itTools:ppAppSupportContractorOptions.other');
    default:
      return '';
  }
};

export const translatePpCommunicateWithParticipantType = (type: string) => {
  switch (type) {
    case 'OUTLOOK_MAILBOX':
      return i18next.t('itTools:ppCommunicateWithParticipantOptions.outlook');
    case 'GOV_DELIVERY':
      return i18next.t(
        'itTools:ppCommunicateWithParticipantOptions.govDelivery'
      );
    case 'SALESFORCE_PORTAL':
      return i18next.t(
        'itTools:ppCommunicateWithParticipantOptions.salesforce'
      );
    case 'OTHER':
      return i18next.t('itTools:ppCommunicateWithParticipantOptions.other');
    default:
      return '';
  }
};

export const translatePpManageProviderOverlapType = (type: string) => {
  switch (type) {
    case 'MDM':
      return i18next.t('itTools:ppManageProviderOverlapOptions.mdm');
    case 'OTHER':
      return i18next.t('itTools:ppManageProviderOverlapOptions.other');
    case 'NA':
      return i18next.t('itTools:ppManageProviderOverlapOptions.na');
    default:
      return '';
  }
};

export const translateBManageBeneficiaryOverlapType = (type: string) => {
  switch (type) {
    case 'MDM':
      return i18next.t('itTools:bManageBeneficiaryOverlapOptions.mdm');
    case 'OTHER':
      return i18next.t('itTools:bManageBeneficiaryOverlapOptions.other');
    case 'NA':
      return i18next.t('itTools:bManageBeneficiaryOverlapOptions.na');
    default:
      return '';
  }
};

export const translateOelHelpdeskSupportType = (type: string) => {
  switch (type) {
    case 'CBOSC':
      return i18next.t('itTools:oelHelpdeskSupportOptions.cbosc');
    case 'CONTRACTOR':
      return i18next.t('itTools:oelHelpdeskSupportOptions.contractor');
    case 'OTHER':
      return i18next.t('itTools:oelHelpdeskSupportOptions.other');
    default:
      return '';
  }
};

export const translateOelManageAcoType = (type: string) => {
  switch (type) {
    case 'ACO_OS':
      return i18next.t('itTools:oelManageAcoOptions.acoOS');
    case 'ACO_UI':
      return i18next.t('itTools:oelManageAcoOptions.acoUI');
    case 'INNOVATION':
      return i18next.t('itTools:oelManageAcoOptions.innovation');
    case 'OTHER':
      return i18next.t('itTools:oelManageAcoOptions.other');
    default:
      return '';
  }
};

export const translateOelManageAcoSubinfoType = (type: string) => {
  switch (type) {
    case 'ACO_OS':
      return i18next.t('itTools:oelManageAcoSubinfoOptions.acoOS');
    case 'ACO_UI':
      return i18next.t('itTools:oelManageAcoSubinfoOptions.acoUI');
    case 'INNOVATION':
      return i18next.t('itTools:oelManageAcoSubinfoOptions.innovation');
    case 'OTHER':
      return i18next.t('itTools:oelManageAcoSubinfoOptions.other');
    default:
      return '';
  }
};

export const translateOelPerformanceBenchmarkType = (type: string) => {
  switch (type) {
    case 'IDR':
      return i18next.t('itTools:oelPerformanceBenchmarkOptions.idr');
    case 'CCW':
      return i18next.t('itTools:oelPerformanceBenchmarkOptions.ccw');
    case 'OTHER':
      return i18next.t('itTools:oelPerformanceBenchmarkOptions.other');
    default:
      return '';
  }
};

export const translateOelProcessAppealsType = (type: string) => {
  switch (type) {
    case 'MEDICARE_APPEAL_SYSTEM':
      return i18next.t('itTools:oelProcessAppealsOptions.medicare');
    case 'OTHER':
      return i18next.t('itTools:oelProcessAppealsOptions.other');
    default:
      return '';
  }
};

export const translateOelEvaluationContractorType = (type: string) => {
  switch (type) {
    case 'RMDA':
      return i18next.t('itTools:oelEvaluationContractorOptions.rmda');
    case 'OTHER':
      return i18next.t('itTools:oelEvaluationContractorOptions.other');
    default:
      return '';
  }
};

export const translateOelCollectDataType = (type: string) => {
  switch (type) {
    case 'IDR':
      return i18next.t('itTools:oelCollectDataOptions.idr');
    case 'CCW':
      return i18next.t('itTools:oelCollectDataOptions.ccw');
    case 'IDOS':
      return i18next.t('itTools:oelCollectDataOptions.idos');
    case 'ISP':
      return i18next.t('itTools:oelCollectDataOptions.isp');
    case 'CONTRACTOR':
      return i18next.t('itTools:oelCollectDataOptions.contractor');
    case 'OTHER':
      return i18next.t('itTools:oelCollectDataOptions.other');
    default:
      return '';
  }
};

export const translateOelObtainDataType = (type: string) => {
  switch (type) {
    case 'CCW':
      return i18next.t('itTools:oelObtainDataOptions.ccw');
    case 'IDOS':
      return i18next.t('itTools:oelObtainDataOptions.idos');
    case 'ISP':
      return i18next.t('itTools:oelObtainDataOptions.isp');
    case 'OTHER':
      return i18next.t('itTools:oelObtainDataOptions.other');
    default:
      return '';
  }
};

export const translateOelClaimsBasedMeasuresType = (type: string) => {
  switch (type) {
    case 'IDR':
      return i18next.t('itTools:oelClaimsBasedMeasuresOptions.idr');
    case 'CCW':
      return i18next.t('itTools:oelClaimsBasedMeasuresOptions.ccw');
    case 'OTHER':
      return i18next.t('itTools:oelClaimsBasedMeasuresOptions.other');
    default:
      return '';
  }
};

export const translateOelQualityScoresType = (type: string) => {
  switch (type) {
    case 'EXISTING_DATA_AND_PROCESS':
      return i18next.t('itTools:oelQualityScoresOptions.existing');
    case 'NEW_DATA_AND_CMMI_PROCESS':
      return i18next.t('itTools:oelQualityScoresOptions.new');
    case 'OTHER':
      return i18next.t('itTools:oelQualityScoresOptions.other');
    case 'NONE':
      return i18next.t('itTools:oelQualityScoresOptions.none');
    default:
      return '';
  }
};

export const translateOelSendReportsType = (type: string) => {
  switch (type) {
    case 'IDOS':
      return i18next.t('itTools:oelSendReportsOptions.idos');
    case 'RMADA':
      return i18next.t('itTools:oelSendReportsOptions.rmda');
    case 'INTERNAL_STAFF':
      return i18next.t('itTools:oelSendReportsOptions.internal');
    case 'OTHER':
      return i18next.t('itTools:oelSendReportsOptions.other');

    default:
      return '';
  }
};

export const translateOelLearningContractorType = (type: string) => {
  switch (type) {
    case 'RMADA':
      return i18next.t('itTools:oelLearningContractorOptions.rmda');
    case 'CROSS_MODEL_CONTRACT':
      return i18next.t('itTools:oelLearningContractorOptions.crossModel');
    case 'OTHER':
      return i18next.t('itTools:oelLearningContractorOptions.other');

    default:
      return '';
  }
};

export const translateOelParticipantCollaborationType = (type: string) => {
  switch (type) {
    case 'CONNECT':
      return i18next.t('itTools:oelParticipantCollaborationOptions.connect');
    case 'OTHER':
      return i18next.t('itTools:oelParticipantCollaborationOptions.other');

    default:
      return '';
  }
};

export const translateOelEducateBeneficiariesType = (type: string) => {
  switch (type) {
    case 'OC':
      return i18next.t('itTools:oelEducateBeneficiariesOptions.oc');
    case 'OTHER':
      return i18next.t('itTools:oelEducateBeneficiariesOptions.other');

    default:
      return '';
  }
};

export const translatePMakeClaimsPaymentsType = (type: string) => {
  switch (type) {
    case 'SHARED_SYSTEMS':
      return i18next.t('itTools:pMakeClaimsPaymentsOptions.sharedSystems');
    case 'HIGLAS':
      return i18next.t('itTools:pMakeClaimsPaymentsOptions.higlas');
    case 'OTHER':
      return i18next.t('itTools:pMakeClaimsPaymentsOptions.other');

    default:
      return '';
  }
};

export const translatePInformFfsType = (type: string) => {
  switch (type) {
    case 'FFS_COMPETENCY_CENTER':
      return i18next.t('itTools:pInformFfsOptions.ffsCompetencyCenter');
    case 'OTHER':
      return i18next.t('itTools:pInformFfsOptions.other');

    default:
      return '';
  }
};

export const translatePNonClaimsBasedPaymentsType = (type: string) => {
  switch (type) {
    case 'APPS':
      return i18next.t('itTools:pNonClaimsBasedPaymentsOptions.apps');
    case 'HIGLAS':
      return i18next.t('itTools:pNonClaimsBasedPaymentsOptions.higlas');
    case 'IPC':
      return i18next.t('itTools:pNonClaimsBasedPaymentsOptions.ipc');
    case 'MAC':
      return i18next.t('itTools:pNonClaimsBasedPaymentsOptions.mac');
    case 'OTHER':
      return i18next.t('itTools:pNonClaimsBasedPaymentsOptions.other');
    default:
      return '';
  }
};

export const translatePSharedSavingsPlanType = (type: string) => {
  switch (type) {
    case 'RMADA':
      return i18next.t('itTools:pSharedSavingsPlanOptions.rmada');
    case 'OTHER':
      return i18next.t('itTools:pSharedSavingsPlanOptions.other');
    default:
      return '';
  }
};

export const translatePRecoverPaymentsType = (type: string) => {
  switch (type) {
    case 'APPS':
      return i18next.t('itTools:pRecoverPaymentsOptions.apps');
    case 'IPC':
      return i18next.t('itTools:pRecoverPaymentsOptions.ipc');
    case 'MAC':
      return i18next.t('itTools:pRecoverPaymentsOptions.mac');
    case 'OTHER':
      return i18next.t('itTools:pRecoverPaymentsOptions.other');
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
      return i18next.t('operationsEvaluationAndLearning:performanceScores');
    case 'appealFeedback':
      return i18next.t('operationsEvaluationAndLearning:feedbackResults');
    case 'appealPayments':
      return i18next.t('operationsEvaluationAndLearning:payments');
    case 'appealOther':
      return i18next.t('operationsEvaluationAndLearning:others');
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
    b === 'NOT_APM'
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
