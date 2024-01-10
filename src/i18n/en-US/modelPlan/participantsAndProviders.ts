import { TranslationParticipantsAndProviders } from 'types/translation';

import { frequencyOptions } from './miscellaneous';

export const participantsAndProviders: TranslationParticipantsAndProviders = {
  participants: {
    gqlField: 'participants',
    goField: 'Participants',
    dbField: 'participants',
    label: 'Who are the participants? Select all that apply.',
    readonlyLabel: 'Who are the participants?',
    multiSelectLabel: 'Selected participants',
    dataType: 'enum',
    formType: 'multiSelect',
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
    filterGroups: ['cbosc', 'cmmi', 'ipc', 'iddoc', 'pbg']
  },
  medicareProviderType: {
    gqlField: 'medicareProviderType',
    goField: 'MedicareProviderType',
    dbField: 'medicare_provider_type',
    label: 'Which type of Medicare providers/suppliers?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'cmmi', 'ipc', 'iddoc', 'pbg']
  },
  statesEngagement: {
    gqlField: 'statesEngagement',
    goField: 'StatesEngagement',
    dbField: 'states_engagement',
    label: 'Please describe how states will engage with your model.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'cmmi', 'ipc', 'iddoc', 'pbg']
  },
  participantsOther: {
    gqlField: 'participantsOther',
    goField: 'ParticipantsOther',
    dbField: 'participantsOther',
    label: 'Please describe the other participants engaging with this model',
    dataType: 'string',
    formType: 'textarea'
  },
  participantsNote: {
    gqlField: 'participantsNote',
    goField: 'ParticipantsNote',
    dbField: 'participantsNote',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  participantsCurrentlyInModels: {
    gqlField: 'participantsCurrentlyInModels',
    goField: 'ParticipantsCurrentlyInModels',
    dbField: 'participants_currently_in_models_note',
    label: 'Are the participants in CMMI models now?',
    sublabel:
      'If you have selected more than one participant in the questions above, specify which participants already participate in CMMI models.',
    dataType: 'boolean',
    formType: 'radio',
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
    dataType: 'string',
    formType: 'textarea'
  },
  modelApplicationLevel: {
    gqlField: 'modelApplicationLevel',
    goField: 'ModelApplicationLevel',
    dbField: 'modelApplicationLevel',
    label: 'At what level will the model apply?',
    sublabel:
      '(e.g., all services identified at the CPT or ICD-10 code level, epsiode of care for a specific span of time, all hospitals unpaid under the Inpatient Prospective Payment System in a certain state)',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },

  expectedNumberOfParticipants: {
    gqlField: 'expectedNumberOfParticipants',
    goField: 'ExpectedNumberOfParticipants',
    dbField: 'expected_number_of_participants',
    label: 'How many participants do you expect?',
    sublabel:
      'Note: Sometimes RRCEG provides a minimum for the power calculation. Other times stakeholder research may inform the team about who are good candidates or might be interested in participating.',
    dataType: 'number',
    formType: 'rangeInput',
    filterGroups: ['cbosc', 'ccw', 'dfsdm', 'ipc']
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
    filterGroups: ['cbosc', 'ccw', 'dfsdm', 'ipc']
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
  recruitmentMethod: {
    gqlField: 'recruitmentMethod',
    goField: 'RecruitmentMethod',
    dbField: 'recruitment_method',
    label: 'How will you recruit the participants?',
    dataType: 'enum',
    formType: 'radio',
    options: {
      APPLICATION_COLLECTION_TOOL: 'Use an application collection tool',
      LOI: 'LOI (Letter of intent)',
      NOFO:
        'NOFO (Notice of funding opportunity for grants/cooperative agreements)',
      OTHER: 'Other',
      NA: 'Not applicable'
    },
    optionsLabels: {
      APPLICATION_COLLECTION_TOOL: '',
      LOI: '',
      NOFO: 'CMMI writes, Office of General Council (OGC) reviews and approves',
      OTHER: '',
      NA: ''
    }
  },
  recruitmentOther: {
    gqlField: 'recruitmentOther',
    goField: 'RecruitmentOther',
    dbField: 'recruitment_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  recruitmentNote: {
    gqlField: 'recruitmentNote',
    goField: 'RecruitmentNote',
    dbField: 'recruitment_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  selectionMethod: {
    gqlField: 'selectionMethod',
    goField: 'SelectionMethod',
    dbField: 'selection_method',
    label: 'How will you select participants? Select all that appy.',
    readonlyLabel: 'How will you select participants?',
    multiSelectLabel: 'Selected participants',
    dataType: 'enum',
    formType: 'multiSelect',
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
    filterGroups: ['cmmi', 'iddoc', 'pbg']
  },
  selectionOther: {
    gqlField: 'selectionOther',
    goField: 'SelectionOther',
    dbField: 'selection_other',
    label: 'Please describe the other participants engaging with this model',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'iddoc', 'pbg']
  },
  selectionNote: {
    gqlField: 'selectionNote',
    goField: 'SelectionNote',
    dbField: 'selection_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'iddoc', 'pbg']
  },
  participantAddedFrequency: {
    gqlField: 'participantAddedFrequency',
    goField: 'ParticipantAddedFrequency',
    dbField: 'participant_added_frequency',
    label: 'How frequently are participants added?',
    dataType: 'enum',
    formType: 'checkbox',
    options: frequencyOptions,
    optionsRelatedInfo: {
      ANNUALLY: '',
      SEMIANUALLY: '',
      QUARTERLY: '',
      MONTHLY: '',
      CONTINUALLY: 'participantAddedFrequencyContinually',
      OTHER: 'participantAddedFrequencyOther'
    }
  },
  participantAddedFrequencyContinually: {
    gqlField: 'participantAddedFrequencyContinually',
    goField: 'ParticipantAddedFrequencyContinually',
    dbField: 'participant_added_frequency_continually',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text'
  },
  participantAddedFrequencyOther: {
    gqlField: 'participantAddedFrequencyOther',
    goField: 'ParticipantAddedFrequencyOther',
    dbField: 'participant_added_frequency_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text'
  },
  participantAddedFrequencyNote: {
    gqlField: 'participantAddedFrequencyNote',
    goField: 'ParticipantAddedFrequencyNote',
    dbField: 'participant_added_frequency_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'text'
  },
  participantRemovedFrequency: {
    gqlField: 'participantRemovedFrequency',
    goField: 'ParticipantRemovedFrequency',
    dbField: 'participant_removed_frequency',
    label: 'How frequently are participants removed?',
    dataType: 'enum',
    formType: 'checkbox',
    options: frequencyOptions,
    optionsRelatedInfo: {
      ANNUALLY: '',
      SEMIANUALLY: '',
      QUARTERLY: '',
      MONTHLY: '',
      CONTINUALLY: 'participantRemovedFrequencyContinually',
      OTHER: 'participantRemovedFrequencyOther'
    }
  },
  participantRemovedFrequencyContinually: {
    gqlField: 'participantRemovedFrequencyContinually',
    goField: 'ParticipantRemovedFrequencyContinually',
    dbField: 'participant_removed_frequency_continually',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text'
  },
  participantRemovedFrequencyOther: {
    gqlField: 'participantRemovedFrequencyOther',
    goField: 'ParticipantRemovedFrequencyOther',
    dbField: 'participant_removed_frequency_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text'
  },
  participantRemovedFrequencyNote: {
    gqlField: 'participantRemovedFrequencyNote',
    goField: 'ParticipantRemovedFrequencyNote',
    dbField: 'participant_removed_frequency_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'text'
  },
  communicationMethod: {
    gqlField: 'communicationMethod',
    goField: 'CommunicationMethod',
    dbField: 'communication_method',
    label: 'How will you communicate with participants?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      IT_TOOL:
        'Manage ongoing communications with participants using an IT tool',
      MASS_EMAIL: 'Send mass emails to new participants',
      OTHER: 'Other',
      NO_COMMUNICATION: 'We are not planning to communicate'
    },
    filterGroups: ['cbosc']
  },
  communicationMethodOther: {
    gqlField: 'communicationMethodOther',
    goField: 'CommunicationMethodOther',
    dbField: 'communication_method',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  communicationNote: {
    gqlField: 'communicationNote',
    goField: 'CommunicationNote',
    dbField: 'communication_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  riskType: {
    gqlField: 'riskType',
    goField: 'RiskType',
    dbField: 'risk_type',
    label: 'What type of risk will the participant assume?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      TWO_SIDED: 'Two-sided',
      ONE_SIDED: 'One-sided',
      CAPITATION: 'Capitation',
      NOT_RISK_BASED: 'Not risk-based',
      OTHER: 'Other'
    }
  },
  riskOther: {
    gqlField: 'riskOther',
    goField: 'RiskOther',
    dbField: 'risk_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  riskNote: {
    gqlField: 'riskNote',
    goField: 'RiskNote',
    dbField: 'risk_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  willRiskChange: {
    gqlField: 'willRiskChange',
    goField: 'WillRiskChange',
    dbField: 'will_risk_change',
    label: 'Will the risk arrangement change as the model progresses?',
    dataType: 'boolean',
    formType: 'radio',
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
    dataType: 'string',
    formType: 'textarea'
  },
  coordinateWork: {
    gqlField: 'coordinateWork',
    goField: 'CoordinateWork',
    dbField: 'coordinate_work',
    label: 'Will the participants coordinate the work of others?',
    sublabel: '(e.g. conveners)',
    dataType: 'boolean',
    formType: 'radio',
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
    dataType: 'string',
    formType: 'textarea'
  },
  gainsharePayments: {
    gqlField: 'gainsharePayments',
    goField: 'GainsharePayments',
    dbField: 'gainshare_payments',
    label: 'Will there be gainsharing payments?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  gainsharePaymentsTrack: {
    gqlField: 'gainsharePaymentsTrack',
    goField: 'GainsharePaymentsTrack',
    dbField: 'gainshare_payments_track',
    label: 'Will you track gainsharing payments?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  gainsharePaymentsEligibility: {
    gqlField: 'gainsharePaymentsEligibility',
    goField: 'GainsharePaymentsEligibility',
    dbField: 'gainshare_payments_eligibility',
    label: 'Are providers eligible to participate in gainsharing arrangements?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      ALL_PROVIDERS: 'All providers',
      SOME_PROVIDERS: 'Some providers',
      OTHER: 'Other',
      NO: 'No'
    }
  },
  gainsharePaymentsEligibilityOther: {
    gqlField: 'gainsharePaymentsEligibilityOther',
    goField: 'GainsharePaymentsEligibilityOther',
    dbField: 'gainshare_payments_eligibility_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text'
  },
  gainsharePaymentsNote: {
    gqlField: 'gainsharePaymentsNote',
    goField: 'GainsharePaymentsNote',
    dbField: 'gainshare_payments_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  participantsIds: {
    gqlField: 'participantsIds',
    goField: 'ParticipantsIds',
    dbField: 'participants_ids',
    label: 'Will you collect participant IDs? If so, select which types.',
    sublabel:
      'Note: If this will be a MIPS or Advanced APM, you need to collect provider TIN-NPIs for participants to benefit from QPP. In addition, CPI vetting needs to be preformed.',
    readonlyLabel: 'Will you collect participant IDs?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      CCNS: 'CCNs',
      NPIS: 'NPIs',
      TINS: 'TINs',
      OTHER: 'Other',
      NO_IDENTIFIERS: 'No, we will not collect provider identifiers'
    },
    filterGroups: ['iddoc']
  },
  participantsIdsOther: {
    gqlField: 'participantsIdsOther',
    goField: 'ParticipantsIdsOther',
    dbField: 'participants_ids_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  participantsIDSNote: {
    gqlField: 'participantsIDSNote',
    goField: 'ParticipantsIDSNote',
    dbField: 'participants_ids_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  providerAdditionFrequency: {
    gqlField: 'providerAdditionFrequency',
    goField: 'ProviderAdditionFrequency',
    dbField: 'provider_addition_frequency',
    label: 'How frequently are providers added?',
    dataType: 'enum',
    formType: 'checkbox',
    options: frequencyOptions,
    optionsRelatedInfo: {
      ANNUALLY: '',
      SEMIANUALLY: '',
      QUARTERLY: '',
      MONTHLY: '',
      CONTINUALLY: 'providerAdditionFrequencyContinually',
      OTHER: 'providerAdditionFrequencyOther'
    },
    filterGroups: ['oact', 'ipc']
  },
  providerAdditionFrequencyContinually: {
    gqlField: 'providerAdditionFrequencyContinually',
    goField: 'ProviderAdditionFrequencyContinually',
    dbField: 'provider_addition_frequency_continually',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['oact', 'ipc']
  },
  providerAdditionFrequencyOther: {
    gqlField: 'providerAdditionFrequencyOther',
    goField: 'ProviderAdditionFrequencyOther',
    dbField: 'provider_addition_frequency_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['oact', 'ipc']
  },
  providerAdditionFrequencyNote: {
    gqlField: 'providerAdditionFrequencyNote',
    goField: 'ProviderAdditionFrequencyNote',
    dbField: 'provider_addition_frequency_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['oact', 'ipc']
  },
  providerAddMethod: {
    gqlField: 'providerAddMethod',
    goField: 'ProviderAddMethod',
    dbField: 'provider_add_method',
    label: 'How will you decide to add providers? Select all that apply.',
    sublabel:
      'Please include details on decision points, timing, and implications of adding them to the model in an additional note.',
    readonlyLabel: 'How will you decide to add providers?',
    dataType: 'enum',
    formType: 'multiSelect',
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
    filterGroups: ['ipc', 'oact']
  },
  providerAddMethodOther: {
    gqlField: 'providerAddMethodOther',
    goField: 'ProviderAddMethodOther',
    dbField: 'provider_add_method_other',
    label:
      'Please describe the other method for deciding which providers to add.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ipc', 'oact']
  },
  providerAddMethodNote: {
    gqlField: 'providerAddMethodNote',
    goField: 'ProviderAddMethodNote',
    dbField: 'provider_add_method_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ipc', 'oact']
  },
  providerLeaveMethod: {
    gqlField: 'providerLeaveMethod',
    goField: 'ProviderLeaveMethod',
    dbField: 'provider_leave_method',
    label: 'Can providers leave the model? Select all that apply.',
    readonlyLabel: 'Can providers leave the model?',
    sublabel:
      'Please include details on decision points, timing, and implications of leaving the model in an additional note.',
    dataType: 'enum',
    formType: 'checkbox',
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
    filterGroups: ['ipc', 'oact']
  },
  providerLeaveMethodOther: {
    gqlField: 'providerLeaveMethodOther',
    goField: 'ProviderLeaveMethodOther',
    dbField: 'provider_leave_method_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ipc', 'oact']
  },
  providerLeaveMethodNote: {
    gqlField: 'providerLeaveMethodNote',
    goField: 'ProviderLeaveMethodNote',
    dbField: 'provider_leave_method_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ipc', 'oact']
  },
  providerOverlap: {
    gqlField: 'providerOverlap',
    goField: 'ProviderOverlap',
    dbField: 'provider_overlap',
    label: 'Will the providers overlap with other models?',
    dataType: 'enum',
    formType: 'radio',
    options: {
      YES_NEED_POLICIES:
        'Yes, we expect to develop policies to manage the overlaps',
      YES_NO_ISSUES: 'Yes, and the overlaps would not be an issue',
      NO: 'No'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  providerOverlapHierarchy: {
    gqlField: 'providerOverlapHierarchy',
    goField: 'ProviderOverlapHierarchy',
    dbField: 'provider_overlap_hierarchy',
    label:
      'If model providers can be in multiple models that may interact, please note the desired hierarchy of how any payment changes or edits should be applied.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  providerOverlapNote: {
    gqlField: 'providerOverlapNote',
    goField: 'ProviderOverlapNote',
    dbField: 'provider_overlap_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
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

export const participantsAndProvidersMisc: Record<string, string> = {
  heading: 'Participants and Providers',
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
