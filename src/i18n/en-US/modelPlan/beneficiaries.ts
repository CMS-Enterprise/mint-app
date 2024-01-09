import { TranslationBeneficiaries } from 'types/translation';

import { frequencyOptions } from './miscellaneous';

export const beneficiaries: TranslationBeneficiaries = {
  beneficiaries: {
    gqlField: 'participantsCurrentlyInModels',
    goField: 'ParticipantsCurrentlyInModels',
    dbField: 'beneficiaries',
    label: 'Who are the beneficiaries of this model? Select all that apply.',
    readonlyLabel: 'Who are the beneficiaries of this model?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected groups',
    options: {
      DISEASE_SPECIFIC: 'Disease-specific',
      DUALLY_ELIGIBLE: 'Dually-eligible beneficiaries',
      MEDICAID: `Medicaid/Children's Health Insurance Program (CHIP)`,
      MEDICARE_ADVANTAGE: 'Medicare Advantage',
      MEDICARE_FFS: 'Medicare FFS beneficiaries',
      MEDICARE_PART_D: 'Prescription Drug (Medicare Part D)',
      UNDERSERVED: 'Underserved',
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
      UNDERSERVED: '',
      NA: '',
      OTHER: ''
    },
    filterGroups: ['mdm']
  },
  diseaseSpecificGroup: {
    gqlField: 'diseaseSpecificGroup',
    goField: 'DiseaseSpecificGroup',
    dbField: 'disease_specific_group',
    label:
      'Please describe the disease-specific groups this model will impact.',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['mdm']
  },
  beneficiariesOther: {
    gqlField: 'beneficiariesOther',
    goField: 'BeneficiariesOther',
    dbField: 'beneficiaries_other',
    label: 'Please describe the other groups this model will impact.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['mdm']
  },
  beneficiariesNote: {
    gqlField: 'beneficiariesNote',
    goField: 'BeneficiariesNote',
    dbField: 'beneficiaries_other',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['mdm']
  },
  treatDualElligibleDifferent: {
    gqlField: 'treatDualElligibleDifferent',
    goField: 'TreatDualElligibleDifferent',
    dbField: 'treat_dual_elligible_different',
    label:
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
    label: 'How so?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  treatDualElligibleDifferentNote: {
    gqlField: 'treatDualElligibleDifferentNote',
    goField: 'TreatDualElligibleDifferentNote',
    dbField: 'treat_dual_elligible_different_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  excludeCertainCharacteristics: {
    gqlField: 'excludeCertainCharacteristics',
    goField: 'ExcludeCertainCharacteristics',
    dbField: 'exclude_certain_characteristics',
    label:
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
    label: 'What are the exclusionary criteria?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  excludeCertainCharacteristicsNote: {
    gqlField: 'excludeCertainCharacteristicsNote',
    goField: 'ExcludeCertainCharacteristicsNote',
    dbField: 'exclude_certain_characteristics_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  numberPeopleImpacted: {
    gqlField: 'numberPeopleImpacted',
    goField: 'NumberPeopleImpacted',
    dbField: 'number_people_impacted',
    label: 'How many people do you think will be impacted by this model?',
    dataType: 'number',
    formType: 'rangeInput',
    filterGroups: ['mdm']
  },
  estimateConfidence: {
    gqlField: 'estimateConfidence',
    goField: 'EstimateConfidence',
    dbField: 'estimate_confidence',
    label: 'What is your level of confidence on this estimate?',
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
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'ccw', 'dfsdm', 'ipc']
  },
  beneficiarySelectionMethod: {
    gqlField: 'beneficiarySelectionMethod',
    goField: 'BeneficiarySelectionMethod',
    dbField: 'beneficiary_selection_method',
    label: 'How will you choose beneficiaries? Select all that apply.',
    readonlyLabel: 'How will you choose beneficiaries?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected methods',
    options: {
      HISTORICAL: 'Historical claims',
      PROSPECTIVE: 'Prospective selection',
      RETROSPECTIVE: 'Retrospective selection',
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
    label: 'Please describe the other method for choosing beneficiaries.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  beneficiarySelectionNote: {
    gqlField: 'beneficiarySelectionNote',
    goField: 'BeneficiarySelectionNote',
    dbField: 'beneficiary_selection_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  beneficiarySelectionFrequency: {
    gqlField: 'beneficiarySelectionFrequency',
    goField: 'BeneficiarySelectionFrequency',
    dbField: 'beneficiary_selection_frequency',
    label: 'How frequently are beneficiaries added?',
    dataType: 'enum',
    formType: 'checkbox',
    options: frequencyOptions,
    optionsRelatedInfo: {
      ANNUALLY: '',
      SEMIANUALLY: '',
      QUARTERLY: '',
      MONTHLY: '',
      CONTINUALLY: 'beneficiarySelectionFrequencyContinually',
      OTHER: 'beneficiarySelectionFrequencyOther'
    },
    filterGroups: ['cmmi']
  },
  beneficiarySelectionFrequencyContinually: {
    gqlField: 'beneficiarySelectionFrequencyContinually',
    goField: 'BeneficiarySelectionFrequencyContinually',
    dbField: 'beneficiary_selection_frequency_continually',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['cmmi']
  },
  beneficiarySelectionFrequencyOther: {
    gqlField: 'beneficiarySelectionFrequencyOther',
    goField: 'BeneficiarySelectionFrequencyOther',
    dbField: 'beneficiary_selection_frequency_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['cmmi']
  },
  beneficiarySelectionFrequencyNote: {
    gqlField: 'beneficiarySelectionFrequencyNote',
    goField: 'BeneficiarySelectionFrequencyNote',
    dbField: 'beneficiary_selection_frequency_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['cmmi']
  },
  beneficiaryRemovalFrequency: {
    gqlField: 'beneficiaryRemovalFrequency',
    goField: 'BeneficiaryRemovalFrequency',
    dbField: 'beneficiary_removal_frequency',
    label: 'How frequently are beneficiaries removed?',
    dataType: 'enum',
    formType: 'checkbox',
    options: frequencyOptions,
    optionsRelatedInfo: {
      ANNUALLY: '',
      SEMIANUALLY: '',
      QUARTERLY: '',
      MONTHLY: '',
      CONTINUALLY: 'beneficiaryRemovalFrequencyContinually',
      OTHER: 'beneficiaryRemovalFrequencyOther'
    },
    filterGroups: ['cmmi']
  },
  beneficiaryRemovalFrequencyContinually: {
    gqlField: 'beneficiaryRemovalFrequencyContinually',
    goField: 'BeneficiaryRemovalFrequencyContinually',
    dbField: 'beneficiary_removal_frequency_continually',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['cmmi']
  },
  beneficiaryRemovalFrequencyOther: {
    gqlField: 'beneficiaryRemovalFrequencyOther',
    goField: 'BeneficiaryRemovalFrequencyOther',
    dbField: 'beneficiary_removal_frequency_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['cmmi']
  },
  beneficiaryRemovalFrequencyNote: {
    gqlField: 'beneficiaryRemovalFrequencyNote',
    goField: 'BeneficiaryRemovalFrequencyNote',
    dbField: 'beneficiary_removal_frequency_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['cmmi']
  },
  beneficiaryOverlap: {
    gqlField: 'beneficiaryOverlap',
    goField: 'BeneficiaryOverlap',
    dbField: 'beneficiary_overlap',
    label: 'Will the beneficiaries overlap with other models?',
    dataType: 'enum',
    formType: 'radio',
    options: {
      YES_NEED_POLICIES:
        'Yes, we expect to develop policies to manage the overlaps',
      YES_NO_ISSUES: 'Yes, and the overlaps would not be an issue',
      NO: 'No'
    },
    filterGroups: ['mdm']
  },
  beneficiaryOverlapNote: {
    gqlField: 'beneficiaryOverlapNote',
    goField: 'BeneficiaryOverlapNote',
    dbField: 'beneficiary_overlap_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['mdm']
  },
  precedenceRules: {
    gqlField: 'precedenceRules',
    goField: 'PrecedenceRules',
    dbField: 'precedence_rules',
    label: 'Are there precedence rules between this model and other model(s)?',
    sublabel:
      'i.e. other models have precedence over you (e.g. mandatory or statutory models running at the same time as yours)',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      YES: 'Yes',
      NO: 'No'
    },
    optionsRelatedInfo: {
      YES: 'precedenceRulesYes',
      NO: 'precedenceRulesNo'
    },
    filterGroups: ['mdm', 'oact']
  },
  precedenceRulesYes: {
    gqlField: 'precedenceRulesYes',
    goField: 'PrecedenceRulesYes',
    dbField: 'precedence_rules_yes',
    label: 'Please describe',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['mdm', 'oact']
  },
  precedenceRulesNo: {
    gqlField: 'precedenceRulesNo',
    goField: 'PrecedenceRulesNo',
    dbField: 'precedence_rules_no',
    label: 'Please describe',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['mdm', 'oact']
  },
  precedenceRulesNote: {
    gqlField: 'precedenceRulesNote',
    goField: 'PrecedenceRulesNote',
    dbField: 'precedence_rules_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['mdm', 'oact']
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    }
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
