import { TranslationParticipantsAndProviders } from 'types/translation';

import {
  ModelViewFilter,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

import { frequencyOptions } from './miscellaneous';

export const participantsAndProviders: TranslationParticipantsAndProviders = {
  participants: {
    gqlField: 'participants',
    goField: 'Participants',
    dbField: 'participants',
    label: 'Who are the participants? Select all that apply.',
    readonlyLabel: 'Who are the participants?',
    multiSelectLabel: 'Selected participants',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    options: {
      ACCOUNTABLE_CARE_ORGANIZATION: 'Accountable Care Organization (ACO)',
      COMMERCIAL_PAYERS: 'Commercial payers',
      COMMUNITY_BASED_ORGANIZATIONS: 'Community-based organizations (CBO)',
      CONVENER: 'Convener',
      ENTITIES: 'Legal Entities',
      MEDICAID_MANAGED_CARE_ORGANIZATIONS:
        'Medicaid Managed Care organizations',
      MEDICAID_PROVIDERS: 'Medicaid providers',
      MEDICARE_ADVANTAGE_PLANS: 'Medicare Advantage plans',
      MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS:
        'Medicare Advantage Prescription Drug (MAPD) plans',
      MEDICARE_PROVIDERS: 'Medicare providers/suppliers',
      NON_PROFIT_ORGANIZATIONS: 'Non-profit organizations',
      STANDALONE_PART_D_PLANS: 'Standalone Part D plans',
      STATES: 'States',
      STATE_MEDICAID_AGENCIES: 'State Medicaid agencies',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      MEDICARE_PROVIDERS: 'medicareProviderType',
      STATES: 'statesEngagement',
      OTHER: 'participantsOther'
    },
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CMMI,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  medicareProviderType: {
    gqlField: 'medicareProviderType',
    goField: 'MedicareProviderType',
    dbField: 'medicare_provider_type',
    label: 'Which type of Medicare providers/suppliers?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'participants',
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CMMI,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  statesEngagement: {
    gqlField: 'statesEngagement',
    goField: 'StatesEngagement',
    dbField: 'states_engagement',
    label: 'Please describe how states will engage with your model.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CMMI,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  participantsOther: {
    gqlField: 'participantsOther',
    goField: 'ParticipantsOther',
    dbField: 'participants_other',
    label: 'Please describe the other participants engaging with this model',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CMMI,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  participantsNote: {
    gqlField: 'participantsNote',
    goField: 'ParticipantsNote',
    dbField: 'participants_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'participants',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CMMI,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  participantsCurrentlyInModels: {
    gqlField: 'participantsCurrentlyInModels',
    goField: 'ParticipantsCurrentlyInModels',
    dbField: 'participants_currently_in_models',
    label: 'Are the participants in CMMI models now?',
    sublabel:
      'If you have selected more than one participant in the questions above, specify which participants already participate in CMMI models.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  participantsCurrentlyInModelsNote: {
    gqlField: 'participantsCurrentlyInModelsNote',
    goField: 'ParticipantsCurrentlyInModelsNote',
    dbField: 'participants_currently_in_models_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'participantsCurrentlyInModels',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  modelApplicationLevel: {
    gqlField: 'modelApplicationLevel',
    goField: 'ModelApplicationLevel',
    dbField: 'model_application_level',
    label: 'At what level will the model apply?',
    sublabel:
      '(e.g., all services identified at the CPT or ICD-10 code level, epsiode of care for a specific span of time, all hospitals unpaid under the Inpatient Prospective Payment System in a certain state)',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },

  expectedNumberOfParticipants: {
    gqlField: 'expectedNumberOfParticipants',
    goField: 'ExpectedNumberOfParticipants',
    dbField: 'expected_number_of_participants',
    label: 'How many participants do you expect?',
    sublabel:
      'Note: Sometimes RRCEG provides a minimum for the power calculation. Other times stakeholder research may inform the team about who are good candidates or might be interested in participating.',
    dataType: TranslationDataType.NUMBER,
    formType: TranslationFormType.RANGEINPUT,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CCW,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC
    ],
    isPageStart: true,
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'estimateConfidence'
    }
  },
  estimateConfidence: {
    gqlField: 'estimateConfidence',
    goField: 'EstimateConfidence',
    dbField: 'estimate_confidence',
    label: 'What is your level of confidence on this estimate?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    options: {
      NOT_AT_ALL: 'Not at all confident',
      SLIGHTLY: 'Slightly confident',
      FAIRLY: 'Fairly confident',
      COMPLETELY: 'Completely confident'
    },
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CCW,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC
    ],
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'expectedNumberOfParticipants'
    }
  },
  confidenceNote: {
    gqlField: 'confidenceNote',
    goField: 'ConfidenceNote',
    dbField: 'confidence_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'estimateConfidence',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CCW,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC
    ]
  },
  recruitmentMethod: {
    gqlField: 'recruitmentMethod',
    goField: 'RecruitmentMethod',
    dbField: 'recruitment_method',
    label: 'How will you recruit the participants?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    options: {
      APPLICATION_COLLECTION_TOOL: 'Use an application collection tool',
      LOI: 'LOI (Letter of intent)',
      NOFO:
        'NOFO (Notice of funding opportunity for grants/cooperative agreements)',
      OTHER: 'Other',
      NA: 'Not applicable'
    },
    optionsLabels: {
      NOFO: 'CMMI writes, Office of General Council (OGC) reviews and approves'
    },
    optionsRelatedInfo: {
      OTHER: 'recruitmentOther'
    }
  },
  recruitmentOther: {
    gqlField: 'recruitmentOther',
    goField: 'RecruitmentOther',
    dbField: 'recruitment_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'recruitmentMethod'
  },
  recruitmentNote: {
    gqlField: 'recruitmentNote',
    goField: 'RecruitmentNote',
    dbField: 'recruitment_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'recruitmentMethod',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  selectionMethod: {
    gqlField: 'selectionMethod',
    goField: 'SelectionMethod',
    dbField: 'selection_method',
    label: 'How will you select participants? Select all that apply.',
    readonlyLabel: 'How will you select participants?',
    multiSelectLabel: 'Selected participants',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    options: {
      APPLICATION_REVIEW_AND_SCORING_TOOL:
        'Use an application review and scoring tool',
      APPLICATION_SUPPORT_CONTRACTOR: 'Get an application support contractor',
      BASIC_CRITERIA:
        'We have a basic set of criteria and plan to accept any participant that meets them',
      CMS_COMPONENT_OR_PROCESS:
        'Another CMS component or process will provide support',
      MODEL_TEAM_REVIEW_APPLICATIONS: 'Model team will review applications',
      SUPPORT_FROM_CMMI: 'Solicit support for CMII staff',
      OTHER: 'Other',
      NO_SELECTING_PARTICIPANTS: 'We won’t be selecting participants'
    },
    optionsRelatedInfo: {
      OTHER: 'selectionOther'
    },
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  selectionOther: {
    gqlField: 'selectionOther',
    goField: 'SelectionOther',
    dbField: 'selection_other',
    label: 'Please describe the other participants engaging with this model',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  selectionNote: {
    gqlField: 'selectionNote',
    goField: 'SelectionNote',
    dbField: 'selection_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'selectionMethod',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  participantAddedFrequency: {
    gqlField: 'participantAddedFrequency',
    goField: 'ParticipantAddedFrequency',
    dbField: 'participant_added_frequency',
    label: 'How frequently are participants added?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'participantAddedFrequencyContinually',
      OTHER: 'participantAddedFrequencyOther'
    },
    filterGroups: [ModelViewFilter.IPC],
    isPageStart: true
  },
  participantAddedFrequencyContinually: {
    gqlField: 'participantAddedFrequencyContinually',
    goField: 'ParticipantAddedFrequencyContinually',
    dbField: 'participant_added_frequency_continually',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'participantAddedFrequency',
    filterGroups: [ModelViewFilter.IPC]
  },
  participantAddedFrequencyOther: {
    gqlField: 'participantAddedFrequencyOther',
    goField: 'ParticipantAddedFrequencyOther',
    dbField: 'participant_added_frequency_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'participantAddedFrequency',
    filterGroups: [ModelViewFilter.IPC]
  },
  participantAddedFrequencyNote: {
    gqlField: 'participantAddedFrequencyNote',
    goField: 'ParticipantAddedFrequencyNote',
    dbField: 'participant_added_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'participantAddedFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    filterGroups: [ModelViewFilter.IPC]
  },
  participantRemovedFrequency: {
    gqlField: 'participantRemovedFrequency',
    goField: 'ParticipantRemovedFrequency',
    dbField: 'participant_removed_frequency',
    label: 'How frequently are participants removed?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'participantRemovedFrequencyContinually',
      OTHER: 'participantRemovedFrequencyOther'
    },
    filterGroups: [ModelViewFilter.IPC]
  },
  participantRemovedFrequencyContinually: {
    gqlField: 'participantRemovedFrequencyContinually',
    goField: 'ParticipantRemovedFrequencyContinually',
    dbField: 'participant_removed_frequency_continually',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'participantRemovedFrequency',
    filterGroups: [ModelViewFilter.IPC]
  },
  participantRemovedFrequencyOther: {
    gqlField: 'participantRemovedFrequencyOther',
    goField: 'ParticipantRemovedFrequencyOther',
    dbField: 'participant_removed_frequency_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'participantRemovedFrequency',
    filterGroups: [ModelViewFilter.IPC]
  },
  participantRemovedFrequencyNote: {
    gqlField: 'participantRemovedFrequencyNote',
    goField: 'ParticipantRemovedFrequencyNote',
    dbField: 'participant_removed_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'participantRemovedFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    filterGroups: [ModelViewFilter.IPC]
  },
  communicationMethod: {
    gqlField: 'communicationMethod',
    goField: 'CommunicationMethod',
    dbField: 'communication_method',
    label: 'How will you communicate with participants?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      IT_TOOL:
        'Manage ongoing communications with participants using an IT tool',
      MASS_EMAIL: 'Send mass emails to new participants',
      OTHER: 'Other',
      NO_COMMUNICATION: 'We are not planning to communicate'
    },
    optionsRelatedInfo: {
      OTHER: 'communicationMethodOther'
    },
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  communicationMethodOther: {
    gqlField: 'communicationMethodOther',
    goField: 'CommunicationMethodOther',
    dbField: 'communication_method_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'communicationMethod',
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  communicationNote: {
    gqlField: 'communicationNote',
    goField: 'CommunicationNote',
    dbField: 'communication_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'communicationMethod',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  riskType: {
    gqlField: 'riskType',
    goField: 'RiskType',
    dbField: 'risk_type',
    label: 'What type of risk will the participant assume?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      TWO_SIDED: 'Two-sided',
      ONE_SIDED: 'One-sided',
      CAPITATION: 'Capitation',
      NOT_RISK_BASED: 'Not risk-based',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'riskOther'
    }
  },
  riskOther: {
    gqlField: 'riskOther',
    goField: 'RiskOther',
    dbField: 'risk_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'riskType'
  },
  riskNote: {
    gqlField: 'riskNote',
    goField: 'RiskNote',
    dbField: 'risk_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'riskType',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  willRiskChange: {
    gqlField: 'willRiskChange',
    goField: 'WillRiskChange',
    dbField: 'will_risk_change',
    label: 'Will the risk arrangement change as the model progresses?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  willRiskChangeNote: {
    gqlField: 'willRiskChangeNote',
    goField: 'WillRiskChangeNote',
    dbField: 'will_risk_change_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'willRiskChange',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  participantRequireFinancialGuarantee: {
    gqlField: 'participantRequireFinancialGuarantee',
    goField: 'ParticipantRequireFinancialGuarantee',
    dbField: 'participant_require_financial_guarantee',
    label: 'Are participants required to retain a financial guarantee?',
    sublabel:
      'Note: Remember to include financial guarantee requirements when drafting your Participation Agreement.',
    questionTooltip:
      'Financial guarantees are commitments made by one party, typically a financial institution or a company, to assume responsibility for the payment of a debt or the performance of an obligation if the debtor or obligor fails to fulfill their obligations.',
    readonlyLabel:
      'Are participants required to retain a financial guarantee? If so, are there any limitations on the type?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    isPageStart: true,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'participantRequireFinancialGuaranteeType'
    },
    filterGroups: [ModelViewFilter.IPC]
  },
  participantRequireFinancialGuaranteeType: {
    gqlField: 'participantRequireFinancialGuaranteeType',
    goField: 'ParticipantRequireFinancialGuaranteeType',
    dbField: 'participant_require_financial_guarantee_type',
    label: 'If so, are there any limitations on the type?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      SURETY_BOND: 'Surety Bond',
      LETTER_OF_CREDIT: 'Letter of Credit',
      ESCROW: 'Escrow',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'participantRequireFinancialGuaranteeOther'
    },
    isOtherType: true,
    filterGroups: [ModelViewFilter.IPC]
  },
  participantRequireFinancialGuaranteeOther: {
    gqlField: 'participantRequireFinancialGuaranteeOther',
    goField: 'ParticipantRequireFinancialGuaranteeOther',
    dbField: 'participant_require_financial_guarantee_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    filterGroups: [ModelViewFilter.IPC]
  },
  participantRequireFinancialGuaranteeNote: {
    gqlField: 'participantRequireFinancialGuaranteeNote',
    goField: 'ParticipantRequireFinancialGuaranteeNote',
    dbField: 'participant_require_financial_guarantee_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'participantRequireFinancialGuaranteeType',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IPC]
  },
  coordinateWork: {
    gqlField: 'coordinateWork',
    goField: 'CoordinateWork',
    dbField: 'coordinate_work',
    label: 'Will the participants coordinate the work of others?',
    sublabel: '(e.g. conveners)',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  coordinateWorkNote: {
    gqlField: 'coordinateWorkNote',
    goField: 'CoordinateWorkNote',
    dbField: 'coordinate_work_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'coordinateWork',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  gainsharePayments: {
    gqlField: 'gainsharePayments',
    goField: 'GainsharePayments',
    dbField: 'gainshare_payments',
    label: 'Will there be gainsharing payments?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () => participantsAndProviders.gainsharePaymentsTrack,
        () => participantsAndProviders.gainsharePaymentsEligibility
      ]
    },
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'gainsharePaymentsTrack'
    }
  },
  gainsharePaymentsTrack: {
    gqlField: 'gainsharePaymentsTrack',
    goField: 'GainsharePaymentsTrack',
    dbField: 'gainshare_payments_track',
    label: 'Will you track gainsharing payments?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => participantsAndProviders.gainsharePayments,
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'gainsharePayments'
    }
  },
  gainsharePaymentsEligibility: {
    gqlField: 'gainsharePaymentsEligibility',
    goField: 'GainsharePaymentsEligibility',
    dbField: 'gainshare_payments_eligibility',
    label: 'Are providers eligible to participate in gainsharing arrangements?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      ALL_PROVIDERS: 'All providers',
      SOME_PROVIDERS: 'Some providers',
      OTHER: 'Other',
      NO: 'No'
    },
    optionsRelatedInfo: {
      OTHER: 'gainsharePaymentsEligibilityOther'
    },
    parentRelation: () => participantsAndProviders.gainsharePayments
  },
  gainsharePaymentsEligibilityOther: {
    gqlField: 'gainsharePaymentsEligibilityOther',
    goField: 'GainsharePaymentsEligibilityOther',
    dbField: 'gainshare_payments_eligibility_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'gainsharePaymentsEligibility'
  },
  gainsharePaymentsNote: {
    gqlField: 'gainsharePaymentsNote',
    goField: 'GainsharePaymentsNote',
    dbField: 'gainshare_payments_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'gainsharePaymentsEligibility',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  participantsIds: {
    gqlField: 'participantsIds',
    goField: 'ParticipantsIds',
    dbField: 'participants_ids',
    label: 'Will you collect participant IDs? If so, select which types.',
    sublabel:
      'Note: If this will be a MIPS or Advanced APM, you need to collect provider TIN-NPIs for participants to benefit from QPP. In addition, CPI vetting needs to be preformed.',
    readonlyLabel: 'Will you collect participant IDs?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      CCNS: 'CCNs',
      NPIS: 'NPIs',
      TINS: 'TINs',
      OTHER: 'Other',
      NO_IDENTIFIERS: 'No, we will not collect provider identifiers'
    },
    optionsRelatedInfo: {
      OTHER: 'participantsIdsOther'
    },
    filterGroups: [ModelViewFilter.IDDOC]
  },
  participantsIdsOther: {
    gqlField: 'participantsIdsOther',
    goField: 'ParticipantsIdsOther',
    dbField: 'participants_ids_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'participantsIds',
    filterGroups: [ModelViewFilter.IDDOC]
  },
  participantsIDSNote: {
    gqlField: 'participantsIDSNote',
    goField: 'ParticipantsIDSNote',
    dbField: 'participants_ids_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'participantsIds',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  providerAdditionFrequency: {
    gqlField: 'providerAdditionFrequency',
    goField: 'ProviderAdditionFrequency',
    dbField: 'provider_addition_frequency',
    label: 'How frequently are providers added?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'providerAdditionFrequencyContinually',
      OTHER: 'providerAdditionFrequencyOther'
    },
    filterGroups: [ModelViewFilter.OACT, ModelViewFilter.IPC],
    isPageStart: true
  },
  providerAdditionFrequencyContinually: {
    gqlField: 'providerAdditionFrequencyContinually',
    goField: 'ProviderAdditionFrequencyContinually',
    dbField: 'provide_addition_frequency_continually',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'providerAdditionFrequency',
    filterGroups: [ModelViewFilter.OACT, ModelViewFilter.IPC]
  },
  providerAdditionFrequencyOther: {
    gqlField: 'providerAdditionFrequencyOther',
    goField: 'ProviderAdditionFrequencyOther',
    dbField: 'provider_addition_frequency_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'providerAdditionFrequency',
    filterGroups: [ModelViewFilter.OACT, ModelViewFilter.IPC]
  },
  providerAdditionFrequencyNote: {
    gqlField: 'providerAdditionFrequencyNote',
    goField: 'ProviderAdditionFrequencyNote',
    dbField: 'provider_addition_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'providerAdditionFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.OACT, ModelViewFilter.IPC]
  },
  providerAddMethod: {
    gqlField: 'providerAddMethod',
    goField: 'ProviderAddMethod',
    dbField: 'provider_add_method',
    label: 'How will you decide to add providers? Select all that apply.',
    sublabel:
      'Please include details on decision points, timing, and implications of adding them to the model in an additional note.',
    readonlyLabel: 'How will you decide to add providers?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    multiSelectLabel: 'How will you add providers?',
    options: {
      PROSPECTIVELY:
        'Add prospectively (based on previous year’s interactions)',
      RETROSPECTIVELY:
        'Add retrospectively (once an interaction happens this year)',
      VOLUNTARILY: 'Add voluntarily',
      MANDATORILY: 'Add mandatorily',
      ONLINE_TOOLS:
        'Use online tools to view what types of participant files and data have been uploaded and downloaded',
      OTHER: 'Other',
      NA: 'Not applicable'
    },
    optionsRelatedInfo: {
      OTHER: 'providerAddMethodOther'
    },
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.OACT]
  },
  providerAddMethodOther: {
    gqlField: 'providerAddMethodOther',
    goField: 'ProviderAddMethodOther',
    dbField: 'provider_add_method_other',
    label:
      'Please describe the other method for deciding which providers to add.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.OACT]
  },
  providerAddMethodNote: {
    gqlField: 'providerAddMethodNote',
    goField: 'ProviderAddMethodNote',
    dbField: 'provider_add_method_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'providerAddMethod',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.OACT]
  },
  providerLeaveMethod: {
    gqlField: 'providerLeaveMethod',
    goField: 'ProviderLeaveMethod',
    dbField: 'provider_leave_method',
    label: 'Can providers leave the model? Select all that apply.',
    readonlyLabel: 'Can providers leave the model?',
    sublabel:
      'Please include details on decision points, timing, and implications of leaving the model in an additional note.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      VARIES_BY_TYPE_OF_PROVIDER: 'It varies by type of provider',
      NOT_ALLOWED_TO_LEAVE: 'They are not allowed to leave',
      AFTER_A_CERTAIN_WITH_IMPLICATIONS:
        'They can leave after a certain date but there are implications',
      VOLUNTARILY_WITHOUT_IMPLICATIONS:
        'They can leave voluntarily at any time without implications',
      OTHER: 'Other',
      NOT_APPLICABLE: 'Not applicable'
    },
    optionsRelatedInfo: {
      OTHER: 'providerLeaveMethodOther'
    },
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.OACT]
  },
  providerLeaveMethodOther: {
    gqlField: 'providerLeaveMethodOther',
    goField: 'ProviderLeaveMethodOther',
    dbField: 'provider_leave_method_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    isOtherType: true,
    otherParentField: 'providerLeaveMethod',
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.OACT]
  },
  providerLeaveMethodNote: {
    gqlField: 'providerLeaveMethodNote',
    goField: 'ProviderLeaveMethodNote',
    dbField: 'provider_leave_method_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'providerLeaveMethod',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.OACT]
  },
  providerRemovalFrequency: {
    gqlField: 'providerRemovalFrequency',
    goField: 'ProviderRemovalFrequency',
    dbField: 'provider_removal_frequency',
    label: 'How frequently are providers removed?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'providerRemovalFrequencyContinually',
      OTHER: 'providerRemovalFrequencyOther'
    }
  },
  providerRemovalFrequencyContinually: {
    gqlField: 'providerRemovalFrequencyContinually',
    goField: 'ProviderRemovalFrequencyContinually',
    dbField: 'provide_removal_frequency_continually',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'providerRemovalFrequency'
  },
  providerRemovalFrequencyOther: {
    gqlField: 'providerRemovalFrequencyOther',
    goField: 'ProviderRemovalFrequencyOther',
    dbField: 'provider_removal_frequency_other',
    label: 'Please specify',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    isOtherType: true,
    otherParentField: 'providerRemovalFrequency'
  },
  providerRemovalFrequencyNote: {
    gqlField: 'providerRemovalFrequencyNote',
    goField: 'ProviderRemovalFrequencyNote',
    dbField: 'provider_removal_frequency_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'providerRemovalFrequency',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  providerOverlap: {
    gqlField: 'providerOverlap',
    goField: 'ProviderOverlap',
    dbField: 'provider_overlap',
    label: 'Will the providers overlap with other models?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    options: {
      YES_NEED_POLICIES:
        'Yes, we expect to develop policies to manage the overlaps',
      YES_NO_ISSUES: 'Yes, and the overlaps would not be an issue',
      NO: 'No'
    },
    childRelation: {
      YES_NEED_POLICIES: [
        () => participantsAndProviders.providerOverlapHierarchy
      ],
      YES_NO_ISSUES: [() => participantsAndProviders.providerOverlapHierarchy]
    },
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  providerOverlapHierarchy: {
    gqlField: 'providerOverlapHierarchy',
    goField: 'ProviderOverlapHierarchy',
    dbField: 'provider_overlap_hierarchy',
    label:
      'If model providers can be in multiple models that may interact, please note the desired hierarchy of how any payment changes or edits should be applied.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    parentRelation: () => participantsAndProviders.providerOverlap,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  providerOverlapNote: {
    gqlField: 'providerOverlapNote',
    goField: 'ProviderOverlapNote',
    dbField: 'provider_overlap_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'providerOverlap',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    }
  }
};

export const participantsAndProvidersMisc: Record<string, string> = {
  heading: 'Participants and providers',
  clearanceHeading: 'Review participants and providers',
  breadcrumb: 'Participants and providers',
  participantsDifferenceHeading:
    'What’s the difference between participants and providers?',
  participantsDifferenceInfo:
    'Participants are <strong>organizations/individuals</strong> that have contracts with CMMI to participate in a model or demonstration. Participants may or may not be Medicare‐enrolled providers.',
  participantsDifferenceInfo2:
    'Providers are <strong>organizations/individuals</strong> that work with the Participants and deliver care or services to the beneficiaries impacted by the model.',
  participantInfo:
    'Participants are organizations/individuals that have contracts with CMMI to participate in a model or demonstration. Participants may or may not be Medicare-enrolled providers.',
  providerInfo:
    'Providers are organizations/indviduals that work with the Participants and deliver care or services to the beneficiaries impacted by our model.',
  participantQuestions: 'Participant specific questions',
  numberOfParticipants: 'Number of participants',
  zero: '0',
  tenThousand: '10,000+'
};

export default participantsAndProviders;
