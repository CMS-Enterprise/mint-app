const beneficiaries = {
  heading: 'Beneficiaries',
  clearanceHeading: 'Review beneficiciaries',
  breadcrumb: 'Beneficiaries',
  beneficiaries:
    'Who are the beneficiaries of this model? Select all that apply.',
  diseaseSubLabel: '(based on a diagnosis, procedure code, condition, etc.)',
  beneficiariesQuestion: 'Who are the beneficiaries of this model?',
  beneficiariesOther:
    'Please describe the other groups this model will impact.',
  beneficiariesOptions: {
    diseaseSpecific: 'Disease-specific',
    duallyEligible: 'Dually-eligible beneficiaries',
    medicaid: 'Medicaid',
    medicareAdvantage: 'Medicare Advantage',
    medicareFfs: 'Medicare FFS beneficiaries',
    medicarePartD: 'Medicare Part D',
    na: 'Not applicable',
    other: 'Other'
  },
  selectedGroup: 'Selected groups',
  selectedMethods: 'Selected methods',
  beneficiariesNA:
    'If you will not have beneficiaries, you can skip the rest of the questions in this section. Feel free to add any additional notes or details that would be helpful to others.',
  dualEligibility:
    'Should dually-eligible beneficiaries be treated differently than non-dually eligibles?',
  excluded:
    'Should beneficiaries with certain characteristics or enrollments be excluded?',
  excludedNestedQuestion: 'What are the exclusionary criteria?',
  howManyImpacted:
    'How many people do you think will be impacted by this model?',
  numberOfPeopleImpacted: 'Number of people',
  zero: '0',
  tenThousand: '10,000+',
  levelOfConfidence: 'What is your level of confidence on this estimate?',
  confidenceOptions: {
    not: 'Not at all confident',
    slightly: 'Slightly confident',
    fairly: 'Fairly confident',
    completely: 'Completely confident'
  },
  chooseBeneficiaries:
    'How will you choose beneficiaries? Select all that apply.',
  chooseBeneficiariesQuestion: 'How will you choose beneficiaries?',
  selectionMethod: {
    historical: 'Historical claims',
    prospective: 'Assign/capture - prospective',
    retrospective: 'Assign/capture - retrospective',
    voluntary: 'Voluntary alignment',
    providerSignUp: 'Beneficiary will sign up through their provider',
    other: 'Other',
    na: 'Not applicable'
  },
  selectionMethodOther:
    'Please describe the other method for choosing beneficiaries.',
  beneficiaryFrequency: 'How frequently are beneficiaries chosen?',
  beneficiaryOverlap: 'Will the beneficiaries overlap with other models?',
  benficiaryPrecedence:
    'Are there precedence rules between this model and other model(s)?',
  benficiaryPrecedenceExtra:
    'i.e. other models have precedence over you (e.g. mandatory or statutory models running at the same time as yours)',
  modelPlanStatus: 'Model Plan status',
  readyForReview:
    'This section of the Model Plan (Beneficiaries) is ready for review.'
};

export default beneficiaries;
