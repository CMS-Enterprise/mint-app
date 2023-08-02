import { TranslationBeneficiaries } from 'types/translation';

export const beneficiaries: TranslationBeneficiaries = {
  beneficiaries: {
    gqlField: 'participantsCurrentlyInModels',
    goField: 'ParticipantsCurrentlyInModels',
    dbField: 'beneficiaries',
    question: 'Who are the beneficiaries of this model? Select all that apply.',
    readonlyQuestion: 'Who are the beneficiaries of this model?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected groups',
    options: {
      DISEASE_SPECIFIC: 'Disease-specific',
      DUALLY_ELIGIBLE: 'Dually-eligible beneficiaries',
      MEDICAID: 'Medicaid',
      MEDICARE_ADVANTAGE: 'Medicare Advantage',
      MEDICARE_FFS: 'Medicare FFS beneficiaries',
      MEDICARE_PART_D: 'Medicare Part D',
      NA: 'Not applicable',
      OTHER: 'Other'
    },
    optionsLabels: {
      DISEASE_SPECIFIC:
        '(based on a diagnosis, procedure code, condition, etc.)',
      DUALLY_ELIGIBLE: '',
      MEDICAID: '',
      MEDICARE_ADVANTAGE: '',
      MEDICARE_FFS: '',
      MEDICARE_PART_D: '',
      NA: '',
      OTHER: ''
    },
    filterGroups: ['mdm']
  },
  beneficiariesOther: {
    gqlField: 'beneficiariesOther',
    goField: 'BeneficiariesOther',
    dbField: 'beneficiaries_other',
    question: 'Please describe the other groups this model will impact.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['mdm']
  },
  beneficiariesNote: {
    gqlField: 'beneficiariesNote',
    goField: 'BeneficiariesNote',
    dbField: 'beneficiaries_other',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['mdm']
  },
  treatDualElligibleDifferent: {
    gqlField: 'treatDualElligibleDifferent',
    goField: 'TreatDualElligibleDifferent',
    dbField: 'treat_dual_elligible_different',
    question:
      'Should dually-eligible beneficiaries be treated differently than non-dually eligibles?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      YES: 'Yes',
      NO: 'No',
      TBD: 'Not applicable'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  treatDualElligibleDifferentHow: {
    gqlField: 'treatDualElligibleDifferentHow',
    goField: 'TreatDualElligibleDifferentHow',
    dbField: 'treat_dual_elligible_different',
    question: 'How so?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  treatDualElligibleDifferentNote: {
    gqlField: 'treatDualElligibleDifferentNote',
    goField: 'TreatDualElligibleDifferentNote',
    dbField: 'treat_dual_elligible_different_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  excludeCertainCharacteristics: {
    gqlField: 'excludeCertainCharacteristics',
    goField: 'ExcludeCertainCharacteristics',
    dbField: 'exclude_certain_characteristics',
    question:
      'Should beneficiaries with certain characteristics or enrollments be excluded?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      YES: 'Yes',
      NO: 'No',
      TBD: 'Not applicable'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  excludeCertainCharacteristicsCriteria: {
    gqlField: 'excludeCertainCharacteristicsCriteria',
    goField: 'ExcludeCertainCharacteristicsCriteria',
    dbField: 'exclude_certain_characteristics_criteria',
    question: 'What are the exclusionary criteria?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  excludeCertainCharacteristicsNote: {
    gqlField: 'excludeCertainCharacteristicsNote',
    goField: 'ExcludeCertainCharacteristicsNote',
    dbField: 'exclude_certain_characteristics_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  numberPeopleImpacted: {
    gqlField: 'numberPeopleImpacted',
    goField: 'NumberPeopleImpacted',
    dbField: 'number_people_impacted',
    question: 'How many people do you think will be impacted by this model?',
    dataType: 'number',
    formType: 'rangeInput',
    filterGroups: ['mdm']
  },
  estimateConfidence: {
    gqlField: 'estimateConfidence',
    goField: 'EstimateConfidence',
    dbField: 'estimate_confidence',
    question: 'What is your level of confidence on this estimate?',
    dataType: 'enum',
    formType: 'radio',
    options: {
      NOT_AT_ALL: 'Not at all confident',
      SLIGHTLY: 'Slightly confident',
      FAIRLY: 'Fairly confident',
      COMPLETELY: 'Completely confident'
    },
    filterGroups: ['cbosc', 'ccw', 'dfsdm', 'ipc', 'mdm']
  },
  confidenceNote: {
    gqlField: 'confidenceNote',
    goField: 'ConfidenceNote',
    dbField: 'confidence_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'ccw', 'dfsdm', 'ipc']
  },
  beneficiarySelectionMethod: {
    gqlField: 'beneficiarySelectionMethod',
    goField: 'BeneficiarySelectionMethod',
    dbField: 'beneficiary_selection_method',
    question: 'How will you choose beneficiaries?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected methods',
    options: {
      HISTORICAL: 'Historical claims',
      PROSPECTIVE: 'Assign/capture - prospective',
      RETROSPECTIVE: 'Assign/capture - retrospective',
      VOLUNTARY: 'Voluntary alignment',
      PROVIDER_SIGN_UP: 'Beneficiary will sign up through their provider',
      OTHER: 'Other',
      NA: 'Not applicable'
    },
    filterGroups: ['cmmi']
  },
  beneficiarySelectionOther: {
    gqlField: 'beneficiarySelectionOther',
    goField: 'BeneficiarySelectionOther',
    dbField: 'beneficiary_selection_other',
    question: 'Please describe the other method for choosing beneficiaries.',
    dataType: 'string',
    formType: 'textarea'
  },
  beneficiarySelectionNote: {
    gqlField: 'beneficiarySelectionNote',
    goField: 'BeneficiarySelectionNote',
    dbField: 'beneficiary_selection_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  }
};

export const beneficiariesMisc = {
  heading: 'Beneficiaries',
  clearanceHeading: 'Review beneficiciaries',
  breadcrumb: 'Beneficiaries',
  beneficiariesNA:
    'If you will not have beneficiaries, you can skip the rest of the questions in this section. Feel free to add any additional notes or details that would be helpful to others.',
  numberOfPeopleImpacted: 'Number of people',
  zero: '0',
  tenThousand: '10,000+'
};

export default beneficiaries;
