const payments = {
  heading: 'Payments',
  description:
    'If there’s a question or field that is not applicable to your model or you don’t currently know the answer, you may leave it blank. If you need help, ask a question below.',
  fundingSource:
    'What is the funding source for payments? Select all that apply.',
  fundingSourceOptions: {
    three021: '3021',
    trustFund: 'Trust fund'
  },
  reconciliation:
    'What is the funding source for reconciliation or other expenditures? Select all that apply.',
  reconciliationOptions: {
    ppaca: 'PPACA Sec 3021',
    partB: 'Part B Trust Fund'
  },
  fundingStructure:
    'What is the funding structure? (If possible, attach a copy of the allotment and allowance)',
  attachments: 'Attachments',
  addADocument: 'Add a document',
  documentTable: {
    name: 'File Name',
    type: 'Document Type',
    notes: 'Notes',
    uploadDate: 'Upload date',
    actions: 'Actions',
    noDocuments: 'No documents uploaded'
  },
  paymentRates:
    'How does the model differ from the current policy, especially in terms of payment rates and periodicty of payment?',
  paymentPreference:
    'Is there a preference that model participants be paid outside of or within the existing claims systems?',
  whoWillYouPay: 'Who will you pay? Select all that apply.',
  whoWillYouPayOptions: {
    providers: 'Providers',
    beneficiaries: 'Beneficiaries',
    participants: 'Participants',
    states: 'States'
  },
  modelAffect: 'Does the model affect Medicare Secondary Payer claims?',
  whatWillYouPay: 'What will you pay?',
  whatWillYouPayOptions: {
    claims: 'Claims-Based Payments',
    nonClaims: 'Non-Claims-Based Payments',
    grants: 'Grants'
  },
  claimSpecificQuestions: 'Claims-based payment specific questions',
  selectClaims: 'Select which claims-based payments will you pay.',
  willYouInform:
    'Will you inform Fee-for-Service about participants that this should be waived from a rule?',
  costSharing: 'Are these payments subject to cost-sharing?',
  intendedLevel:
    'What is the intended level of beneficiary cost-sharing and how will it be handled?',
  waiveBeneficiary:
    'Will you waive beneficiary cost-sharing (coinsurance and/or deductible) for any services in the model?',
  partOfPayment: 'Would the waiver only apply for part of the payment?',
  partOfPaymentInfo:
    'For example, we would assess cost-sharing for the service itself, but not for an add-on payment',
  modelValidation: 'Pricing Model Validation:',
  modelValidationInfo: {
    a:
      'a. We normally do a mock pricing run on historical data for a representative set of episode types (predicted spend vs actual FFS)',
    b:
      'b. For example a past period 2013-2015 is used for esitmation with one year held out for validation of pricing accuracy of 2017 bundle costs.',
    c: 'c. Ideally an epsiode level dataset (SAS, CSV, Excel,...)'
  },
  nonClaimSpecificQuestions: 'Non-claims-based payment specific questions',
  slectNonClaims: 'Select which non-claims-based payments will you pay.',
  sharedSystemInvolved:
    'Will the shared systesm be involved for additional payments of claims?',
  reasonableRange:
    'Reasonable range of any assumed gross medical spending reductions relative to FFS',
  reasonableRangeInfo: {
    a: 'a. Preferably developed using comparative effectiveness literature',
    b:
      'b. In past CMMI has picked the assumption and we comment on the reasonableness of it or display a range of outcomes when it is varied.'
  },
  meetingExpectation: 'Expectation of meeting the standard for AAPM',
  expectedOverlap:
    'Expected overlap with other initiatives and reconciliation procedures when this occurs.',
  medicareFFS: 'Are Medicare FFS systems changes needed?',
  medicareFFSInfo:
    'If so, note that such changes are implemented on a quarterly release cycle (January, April, July, and/or October)',
  tableOfExpenditures:
    'Table of expenditures for program operations/admin. Only expenditures required to run model under ’full expansion’ are included in our financial analysis usually.',
  modelImpactsMPFS:
    'If the model impacts Medicare Physician Fee Schedule payments, should it also impact Critical Access Hospitals paid under Method II?',
  describeFactors:
    'Describe the factors that would drive the payment increase/decrease.',
  levelOfComplexity:
    'What do you expect the level of complexity/payment calculation to be?',
  levelOfComplexityOptions: {
    low: 'Low level',
    mid: 'Middle level',
    high: 'High level'
  },
  determiningBasis: 'What is the basis for determining payments?',
  determiningBasisInfo:
    '(cancer diagnostics buckets and any other adjustments to the base rate)',
  trendAnalysis:
    'If we intend to use prospective vs retrospective trend analysis to rates',
  lossGain:
    'Start & Stop loss/gain parameters and discount rates for bundled expenditures',
  hcpcList:
    'The list of HCPC uncluded in the bundle pricing and exclusion criteria (If any)',
  timingPayment:
    'What is the timing of bundle payment or reconciliation relative to episode initiation?',
  timingRebasing:
    'What is the timing of rate rebasing and the weight placed on provider history vs national vs regional data in targets',
  timingRelative:
    'What is the timing of payments relative to episode initiation?',
  selectMultiplePayments:
    'Will participants be allowed to select between multiple payment mechanisms?',
  anticipatePayments: 'How often do you anticipate making payments?',
  anticipatePaymentsOptions: {
    annually: 'Annually',
    monthly: 'Monthly',
    semiMonthly: 'Semi-monthly',
    weekly: 'Weekly',
    daily: 'Daily'
  },
  numberOfPayments: 'Number of payemnts per payment cycle',
  numberOfPaymentsInfo:
    'This only applies if you are making non-claims-based payments',
  paymentFrequency: 'Frequency of payment cycles',
  paymentFrequencyOptions: {
    annually: 'Annually',
    biannually: 'Biannually',
    quarterly: 'Quarterly',
    monthly: 'Monthly'
  },
  desiredHierarchy:
    'If model participants may be included in additional models that may interact, please note the desired hierarchy of how any payment changes or edits should be applied.',
  reoverPayments: 'Will you recover the payments?',
  reconilingPayments: 'Do you anticipate reconciling payments retrospectively?',
  paymentsStart: 'When will payments start? (Enter approximate)',
  paymentStartInfo:
    'Note: If you are unsure of an approximate date, please select the first day of the approximate month.'
};

export default payments;
