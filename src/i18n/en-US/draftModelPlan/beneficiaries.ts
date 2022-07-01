const beneficiaries = {
  heading: 'Beneficiaries',
  beneficiaries:
    'Who are the beneficiaries of this model? Select all that apply.',
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
  dualEligibility:
    'Should dual-eligible beneficiaries be treated differently than non-dually eligibles?',
  excluded:
    'Should beneficiaries with certain characteristics or enrollments be excluded?',
  howManyImpacted:
    'How many people do you think will be impacted by this model?',
  levelOfConfidence: 'What is your level of confidence on this estimate?',
  confidenceOptions: {
    not: 'Not at all confident',
    slightly: 'Slightly confident',
    fairly: 'Fairly confident',
    completely: 'Completely confident'
  },
  chooseBeneficiaries:
    'How will you choose beneficiaries? Select all that apply.',
  beneficiaryFrequency: 'How frequently are beneficiaries chosen?',
  beneficiaryFrequencyOptions: {
    annually: 'Annually',
    biannually: 'Biannually',
    quarterly: 'Quarterly',
    monthly: 'Monthly',
    rolling: 'Rolling'
  }
};

export default beneficiaries;
