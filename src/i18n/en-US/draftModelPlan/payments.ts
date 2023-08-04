const payments = {
  heading: 'Payment',
  clearanceHeading: 'Review payment',
  breadcrumb: 'Payment',
  description:
    'If there’s a question or field that is not applicable to your model or you don’t currently know the answer, you may leave it blank. If you need help, ask a question below.',
  fundingSource:
    'What will be the funding source for payments? Select all that apply.',
  fundingSourceQuestion: 'What will be the funding source for payments?',
  sourceOptions: {
    ppaca: 'Patient Protection Affordable Care Act (Sec 3021)',
    trustFund: 'Trust Fund',
    other: 'Other'
  },
  whichType: 'Which type?',
  whichFundingType: 'Which type of trust fund?',
  validDate: 'Please use a valid date format',
  otherSourceOption: 'Please describe the funding source.',
  reconciliation:
    'What is the funding source for reconciliation or other expenditures? Select all that apply.',
  reconciliationQuestion:
    'What is the funding source for reconciliation or other expenditures?',
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
  whoWillYouPayQuestion: 'Who will you pay?',
  whoWillYouPayOptions: {
    providers: 'Providers',
    beneficiaries: 'Beneficiaries',
    participants: 'Participants',
    states: 'States',
    other: 'Other'
  },
  otherPayOption: 'Please specify who you will pay.',
  modelAffect: 'Does the model affect Medicare Secondary Payer claims?',
  whatWillYouPay: 'What will you pay?',
  whatWillYouPaySubCopy:
    'If you select claims-based payments or non-claims-based payments, there will be additional questions to answer.',
  whatWillYouPayOptions: {
    claims: 'Claims-Based Payments',
    nonClaims: 'Non-Claims-Based Payments',
    grants: 'Grants'
  },
  claimSpecificQuestions: 'Claims-based payment questions',
  claimSpecificQuestionsContinued: 'Claims-based payment questions continued',
  selectClaims: 'Select which claims-based payments will you pay.',
  selectClaimsSubcopy:
    'If you select reductions to beneficiary cost-sharing or other, there will be additional questions to answer.',
  selectedClaimsOptions: 'Selected claims-based payments',
  selectClaimsOptions: {
    ffsPayments: 'Adjustments to FFS payments',
    homeVisits: 'Payments for care management home visits',
    snfClaims: 'Payments for SNF claims without 3-day hospital admissions',
    reduction: 'Reductions to beneficiary cost-sharing',
    telehealth:
      'Payments for telehealth services not covered through Traditional Medicare',
    servicesNotCovered:
      'Payments for services not covered through Traditional Medicare',
    other: 'Other'
  },
  selectClaimsOther: 'Please describe the other payment frequency.',
  excludedFromPayment:
    'Should any model providers be excluded from existing Fee-for-Service payment systems?',
  howSo: 'How so?',
  chageMedicareFeeSchedule:
    'Will the model change the Medicare Physician Fee Schedule?',
  chageMedicareFeeScheduleSubcopy:
    'If so, it might impact Critical Access Hospitals paid under Method II.',
  affectMedicareSecondaryPayerClaim:
    'Does the model affect Medicare Secondary Payer claims?',
  affectCurrentPolicy:
    'How does the model differ from current policy, especially in terms of payment rates and periodicity of payment?',
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
  reconilingPayments: 'Do you anticipate reconciling payments retrospectively?',
  paymentsStart: 'When will payments start? (Enter approximate)',
  paymentStartInfo:
    'Note: If you are unsure of an approximate date, please select the first day of the approximate month.',
  ancitipateCreatingDependencies:
    'Are you anticipating creating dependencies between services?',
  ancitipateCreatingDependenciesSubcopy:
    'Examples: Service B cannot be paid until Service A has been paid; Service A cannot be paid without Diagnosis 1; If a certain service or diagnosis exists in history, then Service A cannot be paid.',
  needsClaimsDataCollection:
    'Will any additional data need to be collected for claims?',
  needsClaimsDataCollectionSubcopy:
    'If you are not sure what current data is collected via provider billing, please ask Provider Billing Group (PBG)',
  thirdParty:
    'Will your contractor be providing data (a Third Party File) that will be used in claims processing?',
  alert:
    'Make sure your contractor is aware of the Electronic File Transfer process if they’re connected to the Baltimore Data Center (BDC).',
  isContractorAwareTestDataRequirements:
    'Is your contractor aware that test data will be needed, and when that test data must be available? ',
  beneficaryCostSharingQuestions: 'Beneficiary cost-sharing questions',
  beneficiaryCostSharingLevelAndHandling:
    'What is the intended level of beneficiary cost-sharing and how will it be handled?',
  waiveBeneficiaryCostSharingForAnyServices:
    'Will you waive beneficiary cost-sharing (coinsurance and/or deductible) for any services in the model?',
  waiveBeneficiaryCostSharingServiceSpecification:
    'Please specify which services.',
  waiverOnlyAppliesPartOfPayment:
    'Would the waiver only apply for part of the payment?',
  waiverOnlyAppliesPartOfPaymentSubcopy:
    'For example, we would assess cost-sharing for the service itself, but not for an add-on payment',
  nonClaimsBasedPaymentQuestion: 'Non-claims-based payment questions',
  nonClaimsPayments: 'Select which non-claims-based payments will you pay.',
  nonClaimsPaymentsOptions: {
    advancedPayment: 'Advanced Payment',
    bundledEpisodeOfCare: 'Bundled/Episode of Care',
    capitationPopulationBasedFull: 'Capitation/Population Based - Full',
    capitationPopulationBasedPartial: 'Capitation/Population Based - Partial',
    careCoordinationManagementFee: 'Care Coordination/Management Fee',
    globalBudget: 'Global Budget',
    grants: 'Grants',
    incentivePayment: 'Incentive Payment',
    mapdSharedSavings:
      'Medicare Advantage Prescription Drug (MAPD) Shared Savings',
    sharedSavings: 'Shared Savings',
    other: 'Other'
  },
  selectedNonClaimsPayments: 'Selected non-claims-based payments',
  nonClaimsPaymentOther:
    'Please describe the other non-claims-based payments you will pay.',
  paymentCalculationOwner: 'Who will calculate the non-claims based payments?',
  numberPaymentsPerPayCycle: 'Number of payments per payment cycle',
  numberPaymentsPerPayCycleSubcopy:
    'This only applies if you are making non-claims-based payments',
  sharedSystemsInvolvedAdditionalClaimPayment:
    'Will the Shared Systems be involved for additional payment of claims?',
  planningToUseInnovationPaymentContractor:
    'Are you planning to use the Innovation Payment Contractor?',
  planningToUseInnovationPaymentContractorSubcopy:
    'Note: If there will be 30+ payees we recommend a contractor. ',
  expectedCalculationComplexityLevel:
    'What level of complexity do you expect calculations to be?',
  complexityLevel: {
    low: 'Low level',
    middle: 'Middle level',
    high: 'High level'
  },
  canParticipantsSelectBetweenPaymentMechanisms:
    'Will participants be allowed to select between multiple payment mechanisms?',
  canParticipantsSelectBetweenPaymentMechanismsHow: 'Please describe',
  anticipatedPaymentFrequency: 'How often do you anticipate making payments?',
  selectedAnticipatedPaymentFrequency: 'Selected payment frequency',
  anticipatedPaymentFrequencyOptions: {
    annually: 'Annually',
    biannually: 'Biannually',
    daily: 'Daily',
    monthly: 'Monthly',
    other: 'Other',
    quarterly: 'Quarterly',
    semimonthly: 'Semi-monthly',
    weekly: 'Weekly'
  },
  anticipatedPaymentFrequencyOther:
    'How often do you anticipate making payments?',
  willRecoverPayments: 'Will you recover the payments?',
  anticipateReconcilingPaymentsRetrospectively:
    'Do you anticipate reconciling payments retrospectively?',
  anticipateReconcilingPaymentsRetrospectivelyNote: '',
  paymentStartDate: 'When will payments start? (Enter an approximate date)',
  paymentStartDateQuestion: 'When will payments start?',
  paymentStartDateSubcopy:
    'Note: If you are unsure of an approximate date, please select the first day of the approximate month.',
  continueToITSolutions: 'Continue to IT solutions and implementation status'
};

export default payments;
