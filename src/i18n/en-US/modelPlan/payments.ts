import { TranslationPayments } from 'types/translation';

export const payments: TranslationPayments = {
  fundingSource: {
    gqlField: 'fundingSource',
    goField: 'FundingSource',
    dbField: 'funding_source',
    label:
      'What will be the funding source for payments? Select all that apply.',
    readonlyLabel: 'What will be the funding source for payments?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      PATIENT_PROTECTION_AFFORDABLE_CARE_ACT:
        'Patient Protection Affordable Care Act (Sec 3021)',
      TRUST_FUND: 'Trust Fund',
      OTHER: 'Other'
    },
    filterGroups: ['dfsdm', 'ipc', 'oact']
  },
  fundingSourceTrustFundType: {
    gqlField: 'fundingSourceTrustFundType',
    goField: 'FundingSourceTrustFundType',
    dbField: 'funding_source_trust_fund',
    label: 'Which type(s)?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      MEDICARE_PART_A_HI_TRUST_FUND: 'Medicare Part A (HI) Trust Fund',
      MEDICARE_PART_B_SMI_TRUST_FUND: 'Medicare Part B (SMI) Trust Fund'
    },
    optionsLabels: {
      MEDICARE_PART_A_HI_TRUST_FUND:
        'Also known as the Hospital Insurance (HI) Trust Fund, this covers inpatient hospital care, skilled nursing facility care, home healthcare, and hospice care.',
      MEDICARE_PART_B_SMI_TRUST_FUND:
        'Also known as the Supplementary Medical Insurance (SMI) Trust Fund, this covers physician services, outpatient care, medical supplies, preventive services, and other healthcare services not covered by Part A.'
    },
    filterGroups: ['dfsdm', 'ipc', 'oact']
  },
  fundingSourceOther: {
    gqlField: 'fundingSourceOther',
    goField: 'FundingSourceOther',
    dbField: 'funding_source_other',
    label: 'Please describe the funding source.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['dfsdm', 'ipc', 'oact']
  },
  fundingSourceNote: {
    gqlField: 'fundingSourceNote',
    goField: 'FundingSourceNote',
    dbField: 'funding_source_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['dfsdm', 'ipc', 'oact']
  },
  fundingSourceR: {
    gqlField: 'fundingSourceR',
    goField: 'FundingSourceR',
    dbField: 'funding_source_r',
    label:
      'What is the funding source for reconciliation or other expenditures? Select all that apply.',
    readonlyLabel:
      'What is the funding source for reconciliation or other expenditures?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      PATIENT_PROTECTION_AFFORDABLE_CARE_ACT:
        'Patient Protection Affordable Care Act (Sec 3021)',
      TRUST_FUND: 'Trust Fund',
      OTHER: 'Other'
    },
    filterGroups: ['dfsdm', 'ipc', 'oact']
  },
  fundingSourceRTrustFundType: {
    gqlField: 'fundingSourceRTrustFundType',
    goField: 'FundingSourceRTrustFundType',
    dbField: 'funding_source_r_trust_fund',
    label: 'Which type(s)?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      MEDICARE_PART_A_HI_TRUST_FUND: 'Medicare Part A (HI) Trust Fund',
      MEDICARE_PART_B_SMI_TRUST_FUND: 'Medicare Part B (SMI) Trust Fund'
    },
    optionsLabels: {
      MEDICARE_PART_A_HI_TRUST_FUND:
        'Also known as the Hospital Insurance (HI) Trust Fund, this covers inpatient hospital care, skilled nursing facility care, home healthcare, and hospice care.',
      MEDICARE_PART_B_SMI_TRUST_FUND:
        'Also known as the Supplementary Medical Insurance (SMI) Trust Fund, this covers physician services, outpatient care, medical supplies, preventive services, and other healthcare services not covered by Part A.'
    },
    filterGroups: ['dfsdm', 'ipc', 'oact']
  },
  fundingSourceROther: {
    gqlField: 'fundingSourceROther',
    goField: 'FundingSourceROther',
    dbField: 'funding_source_r_other',
    label: 'Please describe the funding source.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['dfsdm', 'ipc', 'oact']
  },
  fundingSourceRNote: {
    gqlField: 'fundingSourceRNote',
    goField: 'FundingSourceRNote',
    dbField: 'funding_source_r_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['dfsdm', 'ipc', 'oact']
  },
  payRecipients: {
    gqlField: 'payRecipients',
    goField: 'PayRecipients',
    dbField: 'pay_recipients',
    label: 'Who will you pay? Select all that apply.',
    readonlyLabel: 'Who will you pay?',
    dataType: 'enum',
    formType: 'checkbox',
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
    dataType: 'string',
    formType: 'textarea'
  },
  payRecipientsNote: {
    gqlField: 'payRecipientsNote',
    goField: 'PayRecipientsNote',
    dbField: 'pay_recipients_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  payType: {
    gqlField: 'payType',
    goField: 'PayType',
    dbField: 'pay_type',
    label: 'What will you pay?',
    sublabel:
      'If you select claims-based payments or non-claims-based payments, there will be additional questions to answer.',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      CLAIMS_BASED_PAYMENTS: 'Claims-Based Payments',
      NON_CLAIMS_BASED_PAYMENTS: 'Non-Claims-Based Payments',
      GRANTS: 'Grants'
    },
    filterGroups: ['cmmi', 'ipc']
  },
  payTypeNote: {
    gqlField: 'payTypeNote',
    goField: 'PayTypeNote',
    dbField: 'pay_type_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'ipc']
  },
  payClaims: {
    gqlField: 'payClaims',
    goField: 'PayClaims',
    dbField: 'pay_claims',
    label: 'Select which claims-based payments will you pay.',
    sublabel:
      'If you select reductions to beneficiary cost-sharing or other, there will be additional questions to answer.',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected claims-based payments',
    options: {
      ADJUSTMENTS_TO_FFS_PAYMENTS: 'Adjustments to FFS payments',
      CARE_MANAGEMENT_HOME_VISITS: 'Payments for care management home visits',
      REDUCTIONS_TO_BENEFICIARY_COST_SHARING:
        'Reductions to beneficiary cost-sharing',
      SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS:
        'Payments for SNF claims without 3-day hospital admissions',
      TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE:
        'Payments for telehealth services not covered through Traditional Medicare',
      SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE:
        'Payments for services not covered through Traditional Medicare',
      OTHER: 'Other'
    },
    filterGroups: ['cmmi', 'oact']
  },
  payClaimsOther: {
    gqlField: 'payClaimsOther',
    goField: 'PayClaimsOther',
    dbField: 'pay_claims_other',
    label: 'Please describe the other payment frequency..',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'oact']
  },
  payClaimsNote: {
    gqlField: 'payClaimsNote',
    goField: 'PayClaimsNote',
    dbField: 'pay_claims_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'oact']
  },
  shouldAnyProvidersExcludedFFSSystems: {
    gqlField: 'shouldAnyProvidersExcludedFFSSystems',
    goField: 'ShouldAnyProvidersExcludedFFSSystems',
    dbField: 'should_any_providers_excluded_ffs_systems',
    label:
      'Should any model providers be excluded from existing Fee-for-Service payment systems?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  shouldAnyProviderExcludedFFSSystemsNote: {
    gqlField: 'shouldAnyProviderExcludedFFSSystemsNote',
    goField: 'ShouldAnyProviderExcludedFFSSystemsNote',
    dbField: 'should_any_providers_excluded_ffs_systems_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  changesMedicarePhysicianFeeSchedule: {
    gqlField: 'changesMedicarePhysicianFeeSchedule',
    goField: 'ChangesMedicarePhysicianFeeSchedule',
    dbField: 'changes_medicare_physician_fee_schedule',
    label: 'Will the model change the Medicare Physician Fee Schedule?',
    sublabel:
      'If so, it might impact Critical Access Hospitals paid under Method II.',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  changesMedicarePhysicianFeeScheduleNote: {
    gqlField: 'changesMedicarePhysicianFeeScheduleNote',
    goField: 'ChangesMedicarePhysicianFeeScheduleNote',
    dbField: 'changes_medicare_physician_fee_schedule_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  affectsMedicareSecondaryPayerClaims: {
    gqlField: 'affectsMedicareSecondaryPayerClaims',
    goField: 'AffectsMedicareSecondaryPayerClaims',
    dbField: 'affects_medicare_secondary_payer_claims',
    label: 'Does the model affect Medicare Secondary Payer claims?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  affectsMedicareSecondaryPayerClaimsHow: {
    gqlField: 'affectsMedicareSecondaryPayerClaimsHow',
    goField: 'AffectsMedicareSecondaryPayerClaimsHow',
    dbField: 'affects_medicare_secondary_payer_claims_how',
    label: 'How so?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  affectsMedicareSecondaryPayerClaimsNote: {
    gqlField: 'affectsMedicareSecondaryPayerClaimsNote',
    goField: 'AffectsMedicareSecondaryPayerClaimsNote',
    dbField: 'affects_medicare_secondary_payer_claims_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  payModelDifferentiation: {
    gqlField: 'payModelDifferentiation',
    goField: 'PayModelDifferentiation',
    dbField: 'pay_model_differentiation',
    label:
      'How does the model differ from current policy, especially in terms of payment rates and periodicity of payment?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  }
};

export const paymentsMisc = {
  heading: 'Payment',
  clearanceHeading: 'Review payment',
  breadcrumb: 'Payment',
  description:
    'If there’s a question or field that is not applicable to your model or you don’t currently know the answer, you may leave it blank. If you need help, ask a question below.',
  claimSpecificQuestions: 'Claims-based payment questions',
  claimSpecificQuestionsContinued: 'Claims-based payment questions continued'
};

export default payments;
