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
  }
};

export const paymentsMisc = {
  heading: 'Payment',
  clearanceHeading: 'Review payment',
  breadcrumb: 'Payment',
  description:
    'If there’s a question or field that is not applicable to your model or you don’t currently know the answer, you may leave it blank. If you need help, ask a question below.'
};

export default payments;
