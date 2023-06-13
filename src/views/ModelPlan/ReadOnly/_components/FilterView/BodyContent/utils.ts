const allPossibleFilterViews = {
  mdm: {
    basics: ['nameHistory'],
    beneficiaries: [
      'beneficiaries',
      'beneficiariesOther',
      'beneficiariesNote',
      'numberPeopleImpacted',
      'estimateConfidence',
      'beneficiaryOverlap',
      'beneficiaryOverlapNote',
      'precedenceRules'
    ]
  },
  filler: {
    basics: ['nameHistory']
  }
};

export default allPossibleFilterViews;
