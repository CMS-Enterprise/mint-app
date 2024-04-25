import { TranslationPayments } from 'types/translation';

import {
  ModelViewFilter,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

import { frequencyOptions } from './miscellaneous';

export const payments: TranslationPayments = {
  fundingSource: {
    gqlField: 'fundingSource',
    goField: 'FundingSource',
    dbField: 'funding_source',
    label:
      'What will be the funding source for payments? Select all that apply.',
    readonlyLabel: 'What will be the funding source for payments?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      PATIENT_PROTECTION_AFFORDABLE_CARE_ACT:
        'Patient Protection Affordable Care Act (Sec 3021)',
      MEDICARE_PART_A_HI_TRUST_FUND: 'Medicare Part A (HI) Trust Fund',
      MEDICARE_PART_B_SMI_TRUST_FUND: 'Medicare Part B (SMI) Trust Fund',
      OTHER: 'Other'
    },
    tooltips: {
      MEDICARE_PART_A_HI_TRUST_FUND:
        'Also known as the Hospital Insurance (HI) Trust Fund, this covers inpatient hospital care, skilled nursing facility care, home healthcare, and hospice care.',
      MEDICARE_PART_B_SMI_TRUST_FUND:
        'Also known as the Supplementary Medical Insurance (SMI) Trust Fund, this covers physician services, outpatient care, medical supplies, preventive services, and other healthcare services not covered by Part A.',
      OTHER: ''
    },
    optionsRelatedInfo: {
      MEDICARE_PART_A_HI_TRUST_FUND: 'fundingSourceMedicareAInfo',
      MEDICARE_PART_B_SMI_TRUST_FUND: 'fundingSourceMedicareBInfo',
      OTHER: 'fundingSourceOther'
    },
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceMedicareAInfo: {
    gqlField: 'fundingSourceMedicareAInfo',
    goField: 'FundingSourceMedicareAInfo',
    dbField: 'funding_source_medicare_a_info',
    label: 'Additional details',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'fundingSource',
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceMedicareBInfo: {
    gqlField: 'fundingSourceMedicareBInfo',
    goField: 'FundingSourceMedicareBInfo',
    dbField: 'funding_source_medicare_b_info',
    label: 'Additional details',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'fundingSource',
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceOther: {
    gqlField: 'fundingSourceOther',
    goField: 'FundingSourceOther',
    dbField: 'funding_source_other',
    label: 'Please describe the funding source.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceNote: {
    gqlField: 'fundingSourceNote',
    goField: 'FundingSourceNote',
    dbField: 'funding_source_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'fundingSource',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceR: {
    gqlField: 'fundingSourceR',
    goField: 'FundingSourceR',
    dbField: 'funding_source_r',
    label:
      'What is the funding source for reconciliation or other expenditures? Select all that apply.',
    readonlyLabel:
      'What is the funding source for reconciliation or other expenditures?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      PATIENT_PROTECTION_AFFORDABLE_CARE_ACT:
        'Patient Protection Affordable Care Act (Sec 3021)',
      MEDICARE_PART_A_HI_TRUST_FUND: 'Medicare Part A (HI) Trust Fund',
      MEDICARE_PART_B_SMI_TRUST_FUND: 'Medicare Part B (SMI) Trust Fund',
      OTHER: 'Other'
    },
    tooltips: {
      MEDICARE_PART_A_HI_TRUST_FUND:
        'Also known as the Hospital Insurance (HI) Trust Fund, this covers inpatient hospital care, skilled nursing facility care, home healthcare, and hospice care.',
      MEDICARE_PART_B_SMI_TRUST_FUND:
        'Also known as the Supplementary Medical Insurance (SMI) Trust Fund, this covers physician services, outpatient care, medical supplies, preventive services, and other healthcare services not covered by Part A.',
      OTHER: ''
    },
    optionsRelatedInfo: {
      MEDICARE_PART_A_HI_TRUST_FUND: 'fundingSourceRMedicareAInfo',
      MEDICARE_PART_B_SMI_TRUST_FUND: 'fundingSourceRMedicareBInfo',
      OTHER: 'fundingSourceROther'
    },
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceRMedicareAInfo: {
    gqlField: 'fundingSourceRMedicareAInfo',
    goField: 'FundingSourceRMedicareAInfo',
    dbField: 'funding_source_r_medicare_a_info',
    label: 'Additional details',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'fundingSourceR',
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceRMedicareBInfo: {
    gqlField: 'fundingSourceRMedicareBInfo',
    goField: 'FundingSourceRMedicareBInfo',
    dbField: 'funding_source_r_medicare_b_info',
    label: 'Additional details',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'fundingSourceR',
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceROther: {
    gqlField: 'fundingSourceROther',
    goField: 'FundingSourceROther',
    dbField: 'funding_source_r_other',
    label: 'Please describe the funding source.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  fundingSourceRNote: {
    gqlField: 'fundingSourceRNote',
    goField: 'FundingSourceRNote',
    dbField: 'funding_source_r_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'fundingSourceR',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  payRecipients: {
    gqlField: 'payRecipients',
    goField: 'PayRecipients',
    dbField: 'pay_recipients',
    label: 'Who will you pay? Select all that apply.',
    readonlyLabel: 'Who will you pay?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      PROVIDERS: 'Providers',
      BENEFICIARIES: 'Beneficiaries',
      PARTICIPANTS: 'Participants',
      STATES: 'States',
      OTHER: 'Other'
    }
  },
  payRecipientsOtherSpecification: {
    gqlField: 'payRecipientsOtherSpecification',
    goField: 'PayRecipientsOtherSpecification',
    dbField: 'pay_recipients_other_specification',
    label: 'Please specify who you will pay.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  payRecipientsNote: {
    gqlField: 'payRecipientsNote',
    goField: 'PayRecipientsNote',
    dbField: 'pay_recipients_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'payRecipients',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  payType: {
    gqlField: 'payType',
    goField: 'PayType',
    dbField: 'pay_type',
    label: 'What will you pay?',
    sublabel:
      'If you select claims-based payments or non-claims-based payments, there will be additional questions to answer.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    hideRelatedQuestionAlert: true,
    options: {
      CLAIMS_BASED_PAYMENTS: 'Claims-Based Payments',
      NON_CLAIMS_BASED_PAYMENTS: 'Non-Claims-Based Payments',
      GRANTS: 'Grants'
    },
    childRelation: {
      CLAIMS_BASED_PAYMENTS: [
        () => payments.payClaims,
        () => payments.shouldAnyProvidersExcludedFFSSystems,
        () => payments.changesMedicarePhysicianFeeSchedule,
        () => payments.affectsMedicareSecondaryPayerClaims,
        () => payments.payModelDifferentiation,
        () => payments.creatingDependenciesBetweenServices,
        () => payments.needsClaimsDataCollection,
        () => payments.providingThirdPartyFile,
        () => payments.isContractorAwareTestDataRequirements
      ],
      NON_CLAIMS_BASED_PAYMENTS: [
        () => payments.nonClaimsPayments,
        () => payments.paymentCalculationOwner,
        () => payments.numberPaymentsPerPayCycle,
        () => payments.sharedSystemsInvolvedAdditionalClaimPayment,
        () => payments.planningToUseInnovationPaymentContractor
      ]
    },
    disconnectedChildren: true,
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IPC]
  },
  payTypeNote: {
    gqlField: 'payTypeNote',
    goField: 'PayTypeNote',
    dbField: 'pay_type_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'payType',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IPC]
  },
  payClaims: {
    gqlField: 'payClaims',
    goField: 'PayClaims',
    dbField: 'pay_claims',
    label: 'Select which claims-based payments will you pay.',
    sublabel:
      'If you select reductions to beneficiary cost-sharing or other, there will be additional questions to answer.',
    disconnectedLabel: `questionNotApplicableBeneficiary`,
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    multiSelectLabel: 'Selected claims-based payments',
    hideRelatedQuestionAlert: true,
    disconnectedChildren: true,
    options: {
      ADJUSTMENTS_TO_FFS_PAYMENTS: 'Adjustments to FFS payments',
      CARE_MANAGEMENT_HOME_VISITS: 'Payments for care management home visits',
      PAYMENTS_FOR_POST_DISCHARGE_HOME_VISITS:
        'Payments for post-discharge home visits',
      SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE:
        'Payments for services not covered through Traditional Medicare',
      SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS:
        'Payments for SNF claims without 3-day hospital admissions',
      TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE:
        'Payments for telehealth services not covered through Traditional Medicare',
      REDUCTIONS_TO_BENEFICIARY_COST_SHARING:
        'Reductions to beneficiary cost-sharing',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'payClaimsOther'
    },
    childRelation: {
      REDUCTIONS_TO_BENEFICIARY_COST_SHARING: [
        () => payments.beneficiaryCostSharingLevelAndHandling,
        () => payments.waiveBeneficiaryCostSharingForAnyServices,
        () => payments.waiverOnlyAppliesPartOfPayment
      ]
    },
    parentRelation: () => payments.payType,
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IPC,
      ModelViewFilter.OACT
    ]
  },
  payClaimsOther: {
    gqlField: 'payClaimsOther',
    goField: 'PayClaimsOther',
    dbField: 'pay_claims_other',
    label: 'Please describe the other claims-based payments you will pay',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.OACT]
  },
  payClaimsNote: {
    gqlField: 'payClaimsNote',
    goField: 'PayClaimsNote',
    dbField: 'pay_claims_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'payClaims',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.OACT]
  },
  shouldAnyProvidersExcludedFFSSystems: {
    gqlField: 'shouldAnyProvidersExcludedFFSSystems',
    goField: 'ShouldAnyProvidersExcludedFFSSystems',
    dbField: 'should_any_providers_excluded_ffs_systems',
    label:
      'Should any model providers be excluded from existing Fee-for-Service payment systems?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  shouldAnyProviderExcludedFFSSystemsNote: {
    gqlField: 'shouldAnyProviderExcludedFFSSystemsNote',
    goField: 'ShouldAnyProviderExcludedFFSSystemsNote',
    dbField: 'should_any_providers_excluded_ffs_systems_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'shouldAnyProvidersExcludedFFSSystems',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  changesMedicarePhysicianFeeSchedule: {
    gqlField: 'changesMedicarePhysicianFeeSchedule',
    goField: 'ChangesMedicarePhysicianFeeSchedule',
    dbField: 'changes_medicare_physician_fee_schedule',
    label: 'Will the model change the Medicare Physician Fee Schedule?',
    sublabel:
      'If so, it might impact Critical Access Hospitals paid under Method II.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  changesMedicarePhysicianFeeScheduleNote: {
    gqlField: 'changesMedicarePhysicianFeeScheduleNote',
    goField: 'ChangesMedicarePhysicianFeeScheduleNote',
    dbField: 'changes_medicare_physician_fee_schedule_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'changesMedicarePhysicianFeeSchedule',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  affectsMedicareSecondaryPayerClaims: {
    gqlField: 'affectsMedicareSecondaryPayerClaims',
    goField: 'AffectsMedicareSecondaryPayerClaims',
    dbField: 'affects_medicare_secondary_payer_claims',
    label: 'Does the model affect Medicare Secondary Payer claims?',
    readonlyLabel:
      'Does the model affect Medicare Secondary Payer claims? How so?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'affectsMedicareSecondaryPayerClaimsHow'
    },
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  affectsMedicareSecondaryPayerClaimsHow: {
    gqlField: 'affectsMedicareSecondaryPayerClaimsHow',
    goField: 'AffectsMedicareSecondaryPayerClaimsHow',
    dbField: 'affects_medicare_secondary_payer_claims_how',
    label: 'How so?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'affectsMedicareSecondaryPayerClaims',
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  affectsMedicareSecondaryPayerClaimsNote: {
    gqlField: 'affectsMedicareSecondaryPayerClaimsNote',
    goField: 'AffectsMedicareSecondaryPayerClaimsNote',
    dbField: 'affects_medicare_secondary_payer_claims_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'affectsMedicareSecondaryPayerClaims',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  payModelDifferentiation: {
    gqlField: 'payModelDifferentiation',
    goField: 'PayModelDifferentiation',
    dbField: 'pay_model_differentiation',
    label:
      'How does the model differ from current policy, especially in terms of payment rates and periodicity of payment?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  creatingDependenciesBetweenServices: {
    gqlField: 'creatingDependenciesBetweenServices',
    goField: 'CreatingDependenciesBetweenServices',
    dbField: 'creating_dependencies_between_services',
    label: 'Are you anticipating creating dependencies between services?',
    sublabel:
      'Examples: Service B cannot be paid until Service A has been paid; Service A cannot be paid without Diagnosis 1; If a certain service or diagnosis exists in history, then Service A cannot be paid.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  creatingDependenciesBetweenServicesNote: {
    gqlField: 'creatingDependenciesBetweenServicesNote',
    goField: 'CreatingDependenciesBetweenServicesNote',
    dbField: 'creating_dependencies_between_services_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'creatingDependenciesBetweenServices',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  needsClaimsDataCollection: {
    gqlField: 'needsClaimsDataCollection',
    goField: 'NeedsClaimsDataCollection',
    dbField: 'needs_claims_data_collection',
    label: 'Will any additional data need to be collected for claims?',
    sublabel:
      'If you are not sure what current data is collected via provider billing, please ask Provider Billing Group (PBG)',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  needsClaimsDataCollectionNote: {
    gqlField: 'needsClaimsDataCollectionNote',
    goField: 'NeedsClaimsDataCollectionNote',
    dbField: 'needs_claims_data_collection_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'needsClaimsDataCollection',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  providingThirdPartyFile: {
    gqlField: 'providingThirdPartyFile',
    goField: 'ProvidingThirdPartyFile',
    dbField: 'providing_third_party_file',
    label:
      'Will your contractor be providing data (a Third Party File) that will be used in claims processing?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  isContractorAwareTestDataRequirements: {
    gqlField: 'isContractorAwareTestDataRequirements',
    goField: 'IsContractorAwareTestDataRequirements',
    dbField: 'is_contractor_aware_test_data_requirements',
    label:
      'Is your contractor aware that test data will be needed, and when that test data must be available?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payType,
    filterGroups: [
      ModelViewFilter.IDDOC,
      ModelViewFilter.OACT,
      ModelViewFilter.PBG
    ]
  },
  beneficiaryCostSharingLevelAndHandling: {
    gqlField: 'beneficiaryCostSharingLevelAndHandling',
    goField: 'BeneficiaryCostSharingLevelAndHandling',
    dbField: 'beneficiary_cost_sharing_level_and_handling',
    label:
      'What is the intended level of beneficiary cost-sharing and how will it be handled?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    parentRelation: () => payments.payClaims,
    filterGroups: [
      ModelViewFilter.IDDOC,
      ModelViewFilter.OACT,
      ModelViewFilter.PBG
    ]
  },
  waiveBeneficiaryCostSharingForAnyServices: {
    gqlField: 'waiveBeneficiaryCostSharingForAnyServices',
    goField: 'WaiveBeneficiaryCostSharingForAnyServices',
    dbField: 'waive_beneficiary_cost_sharing_for_any_services',
    label:
      'Will you waive beneficiary cost-sharing (coinsurance and/or deductible) for any services in the model?',
    readonlyLabel:
      'Will you waive beneficiary cost-sharing (coinsurance and/or deductible) for any services in the model? If so, please specify which services.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'waiveBeneficiaryCostSharingServiceSpecification'
    },
    parentRelation: () => payments.payClaims,
    filterGroups: [
      ModelViewFilter.IDDOC,
      ModelViewFilter.OACT,
      ModelViewFilter.PBG
    ]
  },
  waiveBeneficiaryCostSharingServiceSpecification: {
    gqlField: 'waiveBeneficiaryCostSharingServiceSpecification',
    goField: 'WaiveBeneficiaryCostSharingServiceSpecification',
    dbField: 'waive_beneficiary_cost_sharing_service_specification',
    label: 'Please specify which services.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'waiveBeneficiaryCostSharingForAnyServices',
    filterGroups: [
      ModelViewFilter.IDDOC,
      ModelViewFilter.OACT,
      ModelViewFilter.PBG
    ]
  },
  waiverOnlyAppliesPartOfPayment: {
    gqlField: 'waiverOnlyAppliesPartOfPayment',
    goField: 'WaiverOnlyAppliesPartOfPayment',
    dbField: 'waiver_only_applies_part_of_payment',
    label: 'Would the waiver only apply for part of the payment?',
    sublabel:
      'For example, we would assess cost-sharing for the service itself, but not for an add-on payment',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payClaims,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  waiveBeneficiaryCostSharingNote: {
    gqlField: 'waiveBeneficiaryCostSharingNote',
    goField: 'WaiveBeneficiaryCostSharingNote',
    dbField: 'waive_beneficiary_cost_sharing_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Beneficiary cost-sharing questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.IDDOC,
      ModelViewFilter.OACT,
      ModelViewFilter.PBG
    ]
  },
  nonClaimsPayments: {
    gqlField: 'nonClaimsPayments',
    goField: 'NonClaimsPayments',
    dbField: 'non_claims_payments',
    label: 'Select which non-claims-based payments will you pay.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    multiSelectLabel: 'Selected non-claims-based payments',
    options: {
      ADVANCED_PAYMENT: 'Advanced Payment',
      BUNDLED_EPISODE_OF_CARE: 'Bundled/Episode of Care',
      CAPITATION_POPULATION_BASED_FULL: 'Capitation/Population Based - Full',
      CAPITATION_POPULATION_BASED_PARTIAL:
        'Capitation/Population Based - Partial',
      CARE_COORDINATION_MANAGEMENT_FEE: 'Care Coordination/Management Fee',
      GLOBAL_BUDGET: 'Global Budget',
      INCENTIVE_PAYMENT: 'Incentive Payment',
      MAPD_SHARED_SAVINGS:
        'Medicare Advantage Prescription Drug (MAPD) Shared Savings',
      SHARED_SAVINGS: 'Shared Savings',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'nonClaimsPaymentOther'
    },
    parentRelation: () => payments.payType,
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  nonClaimsPaymentOther: {
    gqlField: 'nonClaimsPaymentOther',
    goField: 'NonClaimsPaymentOther',
    dbField: 'non_claims_payments_other',
    label: 'Please describe the other non-claims-based payments you will pay.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  nonClaimsPaymentsNote: {
    gqlField: 'nonClaimsPaymentsNote',
    goField: 'NonClaimsPaymentsNote',
    dbField: 'non_claims_payments_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'nonClaimsPayments',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  paymentCalculationOwner: {
    gqlField: 'paymentCalculationOwner',
    goField: 'PaymentCalculationOwner',
    dbField: 'payment_calculation_owner',
    label: 'Who will calculate the non-claims based payments?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    parentRelation: () => payments.payType
  },
  numberPaymentsPerPayCycle: {
    gqlField: 'numberPaymentsPerPayCycle',
    goField: 'NumberPaymentsPerPayCycle',
    dbField: 'number_payments_per_pay_cycle',
    label: 'Number of payments per payment cycle',
    sublabel: 'This only applies if you are making non-claims-based payments',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.DFSDM, ModelViewFilter.IPC]
  },
  numberPaymentsPerPayCycleNote: {
    gqlField: 'numberPaymentsPerPayCycleNote',
    goField: 'NumberPaymentsPerPayCycleNote',
    dbField: 'number_payments_per_pay_cycle_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'numberPaymentsPerPayCycle',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.DFSDM, ModelViewFilter.IPC]
  },
  sharedSystemsInvolvedAdditionalClaimPayment: {
    gqlField: 'sharedSystemsInvolvedAdditionalClaimPayment',
    goField: 'SharedSystemsInvolvedAdditionalClaimPayment',
    dbField: 'shared_systems_involved_additional_claim_payment',
    label:
      'Will the Shared Systems be involved for additional payment of claims?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payType,
    filterGroups: [ModelViewFilter.CCW]
  },
  sharedSystemsInvolvedAdditionalClaimPaymentNote: {
    gqlField: 'sharedSystemsInvolvedAdditionalClaimPaymentNote',
    goField: 'SharedSystemsInvolvedAdditionalClaimPaymentNote',
    dbField: 'shared_systems_involved_additional_claim_payment_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'sharedSystemsInvolvedAdditionalClaimPayment',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.CCW]
  },
  planningToUseInnovationPaymentContractor: {
    gqlField: 'planningToUseInnovationPaymentContractor',
    goField: 'PlanningToUseInnovationPaymentContractor',
    dbField: 'planning_to_use_innovation_payment_contractor',
    label: 'Are you planning to use the Innovation Payment Contractor?',
    sublabel: 'Note: If there will be 30+ payees we recommend a contractor.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => payments.payType,
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  planningToUseInnovationPaymentContractorNote: {
    gqlField: 'planningToUseInnovationPaymentContractorNote',
    goField: 'PlanningToUseInnovationPaymentContractorNote',
    dbField: 'planning_to_use_innovation_payment_contractor_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'planningToUseInnovationPaymentContractor',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  expectedCalculationComplexityLevel: {
    gqlField: 'expectedCalculationComplexityLevel',
    goField: 'ExpectedCalculationComplexityLevel',
    dbField: 'expected_calculation_complexity_level',
    label: 'What level of complexity do you expect calculations to be?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    isPageStart: true,
    options: {
      LOW: 'Low level',
      MIDDLE: 'Middle level',
      HIGH: 'High level'
    }
  },
  expectedCalculationComplexityLevelNote: {
    gqlField: 'expectedCalculationComplexityLevelNote',
    goField: 'ExpectedCalculationComplexityLevelNote',
    dbField: 'expected_calculation_complexity_level_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'expectedCalculationComplexityLevel',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  claimsProcessingPrecedence: {
    gqlField: 'claimsProcessingPrecedence',
    goField: 'ClaimsProcessingPrecedence',
    dbField: 'claims_processing_precedence',
    label:
      'Are there any business requirement(s) that address claims processing precedence order with the other model(s)?',
    readonlyLabel:
      'Are there any business requirement(s) that address claims processing precedence order with the other model(s)? If so, please specify.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'claimsProcessingPrecedenceOther'
    }
  },
  claimsProcessingPrecedenceOther: {
    gqlField: 'claimsProcessingPrecedenceOther',
    goField: 'ClaimsProcessingPrecedenceOther',
    dbField: 'claims_processing_precedence_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'claimsProcessingPrecedence'
  },
  claimsProcessingPrecedenceNote: {
    gqlField: 'claimsProcessingPrecedenceNote',
    goField: 'ClaimsProcessingPrecedenceNote',
    dbField: 'claims_processing_precedence_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'claimsProcessingPrecedence',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT
  },
  canParticipantsSelectBetweenPaymentMechanisms: {
    gqlField: 'canParticipantsSelectBetweenPaymentMechanisms',
    goField: 'CanParticipantsSelectBetweenPaymentMechanisms',
    dbField: 'can_participants_select_between_payment_mechanisms',
    label:
      'Will participants be allowed to select between multiple payment mechanisms?',
    readonlyLabel:
      'Will participants be allowed to select between multiple payment mechanisms? If so, please describe.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'canParticipantsSelectBetweenPaymentMechanismsHow'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  canParticipantsSelectBetweenPaymentMechanismsHow: {
    gqlField: 'canParticipantsSelectBetweenPaymentMechanismsHow',
    goField: 'CanParticipantsSelectBetweenPaymentMechanismsHow',
    dbField: 'can_participants_select_between_payment_mechanisms_how',
    label: 'Please describe',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'canParticipantsSelectBetweenPaymentMechanisms',
    filterGroups: [ModelViewFilter.CMMI]
  },
  canParticipantsSelectBetweenPaymentMechanismsNote: {
    gqlField: 'canParticipantsSelectBetweenPaymentMechanismsNote',
    goField: 'CanParticipantsSelectBetweenPaymentMechanismsNote',
    dbField: 'can_participants_select_between_payment_mechanisms_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'canParticipantsSelectBetweenPaymentMechanisms',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.CMMI]
  },
  anticipatedPaymentFrequency: {
    gqlField: 'anticipatedPaymentFrequency',
    goField: 'AnticipatedPaymentFrequency',
    dbField: 'anticipated_payment_frequency',
    label: 'How often do you anticipate making payments?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'anticipatedPaymentFrequencyContinually',
      OTHER: 'anticipatedPaymentFrequencyOther'
    },
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC
    ]
  },
  anticipatedPaymentFrequencyContinually: {
    gqlField: 'anticipatedPaymentFrequencyContinually',
    goField: 'AnticipatedPaymentFrequencyContinually',
    dbField: 'anticipated_payment_frequency_continually',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'anticipatedPaymentFrequency',
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC
    ]
  },
  anticipatedPaymentFrequencyOther: {
    gqlField: 'anticipatedPaymentFrequencyOther',
    goField: 'AnticipatedPaymentFrequencyOther',
    dbField: 'anticipated_payment_frequency_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'anticipatedPaymentFrequency',
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC
    ]
  },
  anticipatedPaymentFrequencyNote: {
    gqlField: 'anticipatedPaymentFrequencyNote',
    goField: 'AnticipatedPaymentFrequencyNote',
    dbField: 'anticipated_payment_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'anticipatedPaymentFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC
    ]
  },
  willRecoverPayments: {
    gqlField: 'willRecoverPayments',
    goField: 'WillRecoverPayments',
    dbField: 'will_recover_payments',
    label: 'Will you recover the payments?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    isPageStart: true,
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IPC]
  },
  willRecoverPaymentsNote: {
    gqlField: 'willRecoverPaymentsNote',
    goField: 'WillRecoverPaymentsNote',
    dbField: 'will_recover_payments_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'willRecoverPayments',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IPC]
  },
  anticipateReconcilingPaymentsRetrospectively: {
    gqlField: 'anticipateReconcilingPaymentsRetrospectively',
    goField: 'AnticipateReconcilingPaymentsRetrospectively',
    dbField: 'anticipate_reconciling_payments_retrospectively',
    label: 'Do you anticipate reconciling payments retrospectively?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: [
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  anticipateReconcilingPaymentsRetrospectivelyNote: {
    gqlField: 'anticipateReconcilingPaymentsRetrospectivelyNote',
    goField: 'AnticipateReconcilingPaymentsRetrospectivelyNote',
    dbField: 'anticipate_reconciling_payments_retrospectively_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'anticipateReconcilingPaymentsRetrospectively',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  paymentReconciliationFrequency: {
    gqlField: 'paymentReconciliationFrequency',
    goField: 'PaymentReconciliationFrequency',
    dbField: 'payment_reconciliation_frequency',
    label: 'How often are payments reconciled?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'paymentReconciliationFrequencyContinually',
      OTHER: 'paymentReconciliationFrequencyOther'
    }
  },
  paymentReconciliationFrequencyContinually: {
    gqlField: 'paymentReconciliationFrequencyContinually',
    goField: 'PaymentReconciliationFrequencyContinually',
    dbField: 'payment_reconciliation_frequency_continually',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'paymentReconciliationFrequency'
  },
  paymentReconciliationFrequencyOther: {
    gqlField: 'paymentReconciliationFrequencyOther',
    goField: 'PaymentReconciliationFrequencyOther',
    dbField: 'payment_reconciliation_frequency_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'paymentReconciliationFrequency'
  },
  paymentReconciliationFrequencyNote: {
    gqlField: 'paymentReconciliationFrequencyNote',
    goField: 'PaymentReconciliationFrequencyNote',
    dbField: 'payment_reconciliation_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'paymentReconciliationFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  paymentDemandRecoupmentFrequency: {
    gqlField: 'paymentDemandRecoupmentFrequency',
    goField: 'PaymentDemandRecoupmentFrequency',
    dbField: 'payment_demand_recoupment_frequency',
    label: 'How frequently do you anticipate making demands/recoupments?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'paymentDemandRecoupmentFrequencyContinually',
      OTHER: 'paymentDemandRecoupmentFrequencyOther'
    }
  },
  paymentDemandRecoupmentFrequencyContinually: {
    gqlField: 'paymentDemandRecoupmentFrequencyContinually',
    goField: 'PaymentDemandRecoupmentFrequencyContinually',
    dbField: 'payment_demand_recoupment_frequency_continually',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'paymentDemandRecoupmentFrequency'
  },
  paymentDemandRecoupmentFrequencyOther: {
    gqlField: 'paymentDemandRecoupmentFrequencyOther',
    goField: 'PaymentReconciliationFrequencyOther',
    dbField: 'payment_demand_recoupment_frequency_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'paymentDemandRecoupmentFrequency'
  },
  paymentDemandRecoupmentFrequencyNote: {
    gqlField: 'paymentDemandRecoupmentFrequencyNote',
    goField: 'PaymentReconciliationFrequencyNote',
    dbField: 'payment_demand_recoupment_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'paymentDemandRecoupmentFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  paymentStartDate: {
    gqlField: 'paymentStartDate',
    goField: 'PaymentStartDate',
    dbField: 'payment_start_date',
    label: 'When will payments start? (Enter an approximate date)',
    readonlyLabel: 'When will payments start?',
    sublabel:
      'Note: If you are unsure of an approximate date, please select the first day of the approximate month.',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    filterGroups: [ModelViewFilter.DFSDM, ModelViewFilter.IPC]
  },
  paymentStartDateNote: {
    gqlField: 'paymentStartDateNote',
    goField: 'PaymentStartDateNote',
    dbField: 'payment_start_date_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'paymentStartDate',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label: 'This section of the Model Plan (Payment) is ready for review.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    tableReference: 'user_account'
  },
  readyForReviewDts: {
    gqlField: 'readyForReviewDts',
    goField: 'ReadyForReviewDts',
    dbField: 'ready_for_review_dts',
    label: 'Ready for review date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER
  },
  readyForClearanceBy: {
    gqlField: 'readyForClearanceBy',
    goField: 'ReadyForClearanceBy',
    dbField: 'ready_for_clearance_by',
    label: 'This section of the Model Plan (Payment) is ready for clearance.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    tableReference: 'user_account'
  },
  readyForClearanceDts: {
    gqlField: 'readyForClearanceDts',
    goField: 'ReadyForClearanceDts',
    dbField: 'ready_for_clearance_dts',
    label: 'Ready for clearance date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    }
  }
};

export const paymentsMisc = {
  heading: 'Payment',
  clearanceHeading: 'Review payment',
  breadcrumb: 'Payment',
  description:
    'If there’s a question or field that is not applicable to your model or you don’t currently know the answer, you may leave it blank. If you need help, ask a question below.',
  claimSpecificQuestions: 'Claims-based payment questions',
  claimSpecificQuestionsContinued: 'Claims-based payment questions continued',
  alert:
    'Make sure your contractor is aware of the Electronic File Transfer process if they’re connected to the Baltimore Data Center (BDC).',
  beneficaryCostSharingQuestions: 'Beneficiary cost-sharing questions',
  nonClaimsBasedPaymentQuestion: 'Non-claims-based payment questions',
  claims: 'Claims-Based Payments',
  nonClaims: 'Non-Claims-Based Payments',
  beneficiaryCostSharing: 'Beneficiary cost-sharing',
  grants: 'Grants',
  continueToITSolutions: 'Continue to operational solutions tracker'
};

export default payments;
