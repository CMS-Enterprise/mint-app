import { TranslationBeneficiaries } from 'types/translation';

import {
  ModelViewFilter,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

import { frequencyOptions } from './miscellaneous';

export const beneficiaries: TranslationBeneficiaries = {
  beneficiaries: {
    gqlField: 'beneficiaries',
    goField: 'Beneficiaries',
    dbField: 'beneficiaries',
    label: 'Who are the beneficiaries of this model? Select all that apply.',
    readonlyLabel: 'Who are the beneficiaries of this model?',
    exportLabel: 'Who are the beneficiaries of this model?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 1.01,
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
        '(based on a diagnosis, procedure code, condition, etc.)'
    },
    optionsRelatedInfo: {
      DISEASE_SPECIFIC: 'diseaseSpecificGroup',
      OTHER: 'beneficiariesOther'
    },
    filterGroups: [ModelViewFilter.MDM, ModelViewFilter.PBG]
  },
  diseaseSpecificGroup: {
    gqlField: 'diseaseSpecificGroup',
    goField: 'DiseaseSpecificGroup',
    dbField: 'disease_specific_group',
    label:
      'Please describe the disease-specific groups this model will impact.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.02,
    isOtherType: true,
    otherParentField: 'beneficiaries',
    filterGroups: [ModelViewFilter.MDM]
  },
  beneficiariesOther: {
    gqlField: 'beneficiariesOther',
    goField: 'BeneficiariesOther',
    dbField: 'beneficiaries_other',
    label: 'Please describe the other groups this model will impact.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.03,
    isOtherType: true,
    otherParentField: 'beneficiaries',
    filterGroups: [ModelViewFilter.MDM]
  },
  beneficiariesNote: {
    gqlField: 'beneficiariesNote',
    goField: 'BeneficiariesNote',
    dbField: 'beneficiaries_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'beneficiaries',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.04,
    filterGroups: [ModelViewFilter.MDM]
  },
  treatDualElligibleDifferent: {
    gqlField: 'treatDualElligibleDifferent',
    goField: 'TreatDualElligibleDifferent',
    dbField: 'treat_dual_elligible_different',
    label:
      'Should dually-eligible beneficiaries be treated differently than non-dually eligibles?',
    readonlyLabel:
      'Should dually-eligible beneficiaries be treated differently than non-dually eligibles? How so?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.05,
    options: {
      YES: 'Yes',
      NO: 'No',
      TBD: 'Not applicable'
    },
    optionsRelatedInfo: {
      YES: 'treatDualElligibleDifferentHow'
    },
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  treatDualElligibleDifferentHow: {
    gqlField: 'treatDualElligibleDifferentHow',
    goField: 'TreatDualElligibleDifferentHow',
    dbField: 'treat_dual_elligible_different_how',
    label: 'How so?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.06,
    isOtherType: true,
    otherParentField: 'treatDualElligibleDifferent',
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  treatDualElligibleDifferentNote: {
    gqlField: 'treatDualElligibleDifferentNote',
    goField: 'TreatDualElligibleDifferentNote',
    dbField: 'treat_dual_elligible_different_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'treatDualElligibleDifferent',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.07,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  excludeCertainCharacteristics: {
    gqlField: 'excludeCertainCharacteristics',
    goField: 'ExcludeCertainCharacteristics',
    dbField: 'exclude_certain_characteristics',
    label:
      'Should beneficiaries with certain characteristics or enrollments be excluded?',
    readonlyLabel:
      'Should beneficiaries with certain characteristics or enrollments be excluded? How so, what are the exclusionary criteria?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.08,
    options: {
      YES: 'Yes',
      NO: 'No',
      TBD: 'Not applicable'
    },
    optionsRelatedInfo: {
      YES: 'excludeCertainCharacteristicsCriteria'
    },
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  excludeCertainCharacteristicsCriteria: {
    gqlField: 'excludeCertainCharacteristicsCriteria',
    goField: 'ExcludeCertainCharacteristicsCriteria',
    dbField: 'exclude_certain_characteristics_criteria',
    label: 'What are the exclusionary criteria?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.09,
    isOtherType: true,
    otherParentField: 'excludeCertainCharacteristics',
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  excludeCertainCharacteristicsNote: {
    gqlField: 'excludeCertainCharacteristicsNote',
    goField: 'ExcludeCertainCharacteristicsNote',
    dbField: 'exclude_certain_characteristics_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'excludeCertainCharacteristics',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.1,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  numberPeopleImpacted: {
    gqlField: 'numberPeopleImpacted',
    goField: 'NumberPeopleImpacted',
    dbField: 'number_people_impacted',
    label: 'How many people do you think will be impacted by this model?',
    dataType: TranslationDataType.NUMBER,
    formType: TranslationFormType.RANGEINPUT,
    order: 2.01,
    isPageStart: true,
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'estimateConfidence'
    },
    filterGroups: [ModelViewFilter.MDM]
  },
  estimateConfidence: {
    gqlField: 'estimateConfidence',
    goField: 'EstimateConfidence',
    dbField: 'estimate_confidence',
    label: 'What is your level of confidence on this estimate?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    order: 2.02,
    options: {
      NOT_AT_ALL: 'Not at all confident',
      SLIGHTLY: 'Slightly confident',
      FAIRLY: 'Fairly confident',
      COMPLETELY: 'Completely confident'
    },
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'numberPeopleImpacted'
    },
    filterGroups: [ModelViewFilter.MDM]
  },
  confidenceNote: {
    gqlField: 'confidenceNote',
    goField: 'ConfidenceNote',
    dbField: 'confidence_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'numberPeopleImpacted',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.03,
    filterGroups: [ModelViewFilter.MDM]
  },
  beneficiarySelectionMethod: {
    gqlField: 'beneficiarySelectionMethod',
    goField: 'BeneficiarySelectionMethod',
    dbField: 'beneficiary_selection_method',
    label: 'How will you choose beneficiaries? Select all that apply.',
    readonlyLabel: 'How will you choose beneficiaries?',
    exportLabel: 'How will you choose beneficiaries?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 2.04,
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
    optionsRelatedInfo: {
      OTHER: 'beneficiarySelectionOther'
    },
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.PBG]
  },
  beneficiarySelectionOther: {
    gqlField: 'beneficiarySelectionOther',
    goField: 'BeneficiarySelectionOther',
    dbField: 'beneficiary_selection_other',
    label: 'Please describe the other method for choosing beneficiaries.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.05,
    isOtherType: true,
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiarySelectionNote: {
    gqlField: 'beneficiarySelectionNote',
    goField: 'BeneficiarySelectionNote',
    dbField: 'beneficiary_selection_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'beneficiarySelectionMethod',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.06,
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiarySelectionFrequency: {
    gqlField: 'beneficiarySelectionFrequency',
    goField: 'BeneficiarySelectionFrequency',
    dbField: 'beneficiary_selection_frequency',
    label: 'How frequently are beneficiaries added?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 3.01,
    isPageStart: true,
    options: frequencyOptions,
    optionsRelatedInfo: {
      ANNUALLY: '',
      SEMIANNUALLY: '',
      QUARTERLY: '',
      MONTHLY: '',
      CONTINUALLY: 'beneficiarySelectionFrequencyContinually',
      OTHER: 'beneficiarySelectionFrequencyOther'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiarySelectionFrequencyContinually: {
    gqlField: 'beneficiarySelectionFrequencyContinually',
    goField: 'BeneficiarySelectionFrequencyContinually',
    dbField: 'beneficiary_selection_frequency_continually',
    label: 'Please specify',
    exportLabel: 'Please specify continually',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.02,
    isOtherType: true,
    otherParentField: 'beneficiarySelectionFrequency',
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiarySelectionFrequencyOther: {
    gqlField: 'beneficiarySelectionFrequencyOther',
    goField: 'BeneficiarySelectionFrequencyOther',
    dbField: 'beneficiary_selection_frequency_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.03,
    isOtherType: true,
    otherParentField: 'beneficiarySelectionFrequency',
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiarySelectionFrequencyNote: {
    gqlField: 'beneficiarySelectionFrequencyNote',
    goField: 'BeneficiarySelectionFrequencyNote',
    dbField: 'beneficiary_selection_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'beneficiarySelectionFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.04,
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiaryRemovalFrequency: {
    gqlField: 'beneficiaryRemovalFrequency',
    goField: 'BeneficiaryRemovalFrequency',
    dbField: 'beneficiary_removal_frequency',
    label: 'How frequently are beneficiaries removed?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 3.05,
    options: frequencyOptions,
    optionsRelatedInfo: {
      ANNUALLY: '',
      SEMIANNUALLY: '',
      QUARTERLY: '',
      MONTHLY: '',
      CONTINUALLY: 'beneficiaryRemovalFrequencyContinually',
      OTHER: 'beneficiaryRemovalFrequencyOther'
    }
  },
  beneficiaryRemovalFrequencyContinually: {
    gqlField: 'beneficiaryRemovalFrequencyContinually',
    goField: 'BeneficiaryRemovalFrequencyContinually',
    dbField: 'beneficiary_removal_frequency_continually',
    label: 'Please specify',
    exportLabel: 'Please specify continually',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.06,
    isOtherType: true,
    otherParentField: 'beneficiaryRemovalFrequency',
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiaryRemovalFrequencyOther: {
    gqlField: 'beneficiaryRemovalFrequencyOther',
    goField: 'BeneficiaryRemovalFrequencyOther',
    dbField: 'beneficiary_removal_frequency_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.07,
    isOtherType: true,
    otherParentField: 'beneficiaryRemovalFrequency',
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiaryRemovalFrequencyNote: {
    gqlField: 'beneficiaryRemovalFrequencyNote',
    goField: 'BeneficiaryRemovalFrequencyNote',
    dbField: 'beneficiary_removal_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'beneficiaryRemovalFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.08,
    filterGroups: [ModelViewFilter.CMMI]
  },
  beneficiaryOverlap: {
    gqlField: 'beneficiaryOverlap',
    goField: 'BeneficiaryOverlap',
    dbField: 'beneficiary_overlap',
    label: 'Will the beneficiaries overlap with other models?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    order: 3.09,
    options: {
      YES_NEED_POLICIES:
        'Yes, we expect to develop policies to manage the overlaps',
      YES_NO_ISSUES: 'Yes, and the overlaps would not be an issue',
      NO: 'No'
    },
    filterGroups: [ModelViewFilter.MDM]
  },
  beneficiaryOverlapNote: {
    gqlField: 'beneficiaryOverlapNote',
    goField: 'BeneficiaryOverlapNote',
    dbField: 'beneficiary_overlap_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'beneficiaryOverlap',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.1,
    filterGroups: [ModelViewFilter.MDM]
  },
  precedenceRules: {
    gqlField: 'precedenceRules',
    goField: 'PrecedenceRules',
    dbField: 'precedence_rules',
    label: 'Are there precedence rules between this model and other model(s)?',
    sublabel:
      'i.e. other models have precedence over you (e.g. mandatory or statutory models running at the same time as yours)',
    questionTooltip:
      'i.e. other models have precedence over you (e.g. mandatory or statutory models running at the same time as yours)',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 3.11,
    options: {
      YES: 'Yes',
      NO: 'No'
    },
    optionsRelatedInfo: {
      YES: 'precedenceRulesYes',
      NO: 'precedenceRulesNo'
    },
    filterGroups: [ModelViewFilter.MDM, ModelViewFilter.OACT]
  },
  precedenceRulesYes: {
    gqlField: 'precedenceRulesYes',
    goField: 'PrecedenceRulesYes',
    dbField: 'precedence_rules_yes',
    label: 'Please describe',
    exportLabel: 'Please describe yes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.121,
    isOtherType: true,
    otherParentField: 'precedenceRules',
    filterGroups: [ModelViewFilter.MDM, ModelViewFilter.OACT]
  },
  precedenceRulesNo: {
    gqlField: 'precedenceRulesNo',
    goField: 'PrecedenceRulesNo',
    dbField: 'precedence_rules_no',
    label: 'Please describe',
    exportLabel: 'Please describe no',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.13,
    isOtherType: true,
    otherParentField: 'precedenceRules',
    filterGroups: [ModelViewFilter.MDM, ModelViewFilter.OACT]
  },
  precedenceRulesNote: {
    gqlField: 'precedenceRulesNote',
    goField: 'PrecedenceRulesNote',
    dbField: 'precedence_rules_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'precedenceRules',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.14,
    filterGroups: [ModelViewFilter.MDM, ModelViewFilter.OACT]
  },
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label:
      'This section of the Model Plan (Beneficiaries) is ready for review.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 3.15,
    tableReference: TableName.USER_ACCOUNT,
    hideFromReadonly: true
  },
  readyForReviewDts: {
    gqlField: 'readyForReviewDts',
    goField: 'ReadyForReviewDts',
    dbField: 'ready_for_review_dts',
    label: 'Ready for review date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.16,
    hideFromReadonly: true
  },
  readyForClearanceBy: {
    gqlField: 'readyForClearanceBy',
    goField: 'ReadyForClearanceBy',
    dbField: 'ready_for_clearance_by',
    label:
      'This section of the Model Plan (Beneficiaries) is ready for clearance.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 3.17,
    tableReference: TableName.USER_ACCOUNT,
    hideFromReadonly: true
  },
  readyForClearanceDts: {
    gqlField: 'readyForClearanceDts',
    goField: 'ReadyForClearanceDts',
    dbField: 'ready_for_clearance_dts',
    label: 'Ready for clearance date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.18,
    hideFromReadonly: true
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 3.19,
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    },
    hideFromReadonly: true
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
