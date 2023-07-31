import { TranslationParticipantsAndProviders } from 'types/translation';

export const participantsAndProviders: TranslationParticipantsAndProviders = {
  participants: {
    gqlField: 'participants',
    goField: 'Participants',
    dbField: 'participants',
    question: 'Who are the participants? Select all that apply.',
    readonlyQuestion: 'Who are the participants?',
    multiSelectLabel: 'Selected participants',
    dataType: 'enum',
    formType: 'multiSelect',
    options: {
      COMMERCIAL_PAYERS: 'Commercial payers',
      COMMUNITY_BASED_ORGANIZATIONS: 'Community-based organizations',
      CONVENER: 'Convener',
      ENTITIES: 'Entities (e.g., ACO, Direct Contracting Entity)',
      MEDICAID_MANAGED_CARE_ORGANIZATIONS:
        'Medicaid Managed Care organizations',
      MEDICAID_PROVIDERS: 'Medicaid providers',
      MEDICARE_ADVANTAGE_PLANS: 'Medicare Advantage plans',
      MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS:
        'Medicare Advantage Prescription Drug (MAPD) plans',
      MEDICARE_PROVIDERS: 'Medicare providers',
      NON_PROFIT_ORGANIZATIONS: 'Non-profit organizations',
      STANDALONE_PART_D_PLANS: 'Standalone Part D plans',
      STATES: 'States',
      STATE_MEDICAID_AGENCIES: 'State Medicaid agencies',
      OTHER: 'OTher'
    },
    filterGroups: ['cbosc', 'cmmi', 'ipc', 'iddoc', 'pbg']
  },
  medicareProviderType: {
    gqlField: 'medicareProviderType',
    goField: 'MedicareProviderType',
    dbField: 'medicare_provider_type',
    question: 'Which type of medicare providers?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'cmmi', 'ipc', 'iddoc', 'pbg']
  },
  statesEngagement: {
    gqlField: 'statesEngagement',
    goField: 'StatesEngagement',
    dbField: 'states_engagement',
    question: 'Please describe how states will engage with your model.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'cmmi', 'ipc', 'iddoc', 'pbg']
  },
  participantsOther: {
    gqlField: 'participantsOther',
    goField: 'ParticipantsOther',
    dbField: 'participantsOther',
    question: 'Please describe the other participants engaging with this model',
    dataType: 'string',
    formType: 'textarea'
  },
  participantsNote: {
    gqlField: 'participantsNote',
    goField: 'ParticipantsNote',
    dbField: 'participantsNote',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  participantsCurrentlyInModels: {
    gqlField: 'participantsCurrentlyInModels',
    goField: 'ParticipantsCurrentlyInModels',
    dbField: 'participants_currently_in_models_note',
    question: 'Are the participants in CMMI models now?',
    hint:
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
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  modelApplicationLevel: {
    gqlField: 'modelApplicationLevel',
    goField: 'ModelApplicationLevel',
    dbField: 'modelApplicationLevel',
    question: 'At what level will the model apply?',
    hint:
      '(e.g., all services identified at the CPT or ICD-10 code level, epsiode of care for a specific span of time, all hospitals unpaid under the Inpatient Prospective Payment System in a certain state)',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },

  expectedNumberOfParticipants: {
    gqlField: 'expectedNumberOfParticipants',
    goField: 'ExpectedNumberOfParticipants',
    dbField: 'expected_number_of_participants',
    question: 'How many participants do you expect?',
    hint:
      'Note: Sometimes RRCEG provides a minimum for the power calculation. Other times stakeholder research may inform the team about who are good candidates or might be interested in participating.',
    dataType: 'number',
    formType: 'rangeInput'
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
    }
  },
  confidenceNote: {
    gqlField: 'confidenceNote',
    goField: 'ConfidenceNote',
    dbField: 'confidence_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  recruitmentMethod: {
    gqlField: 'recruitmentMethod',
    goField: 'RecruitmentMethod',
    dbField: 'recruitment_method',
    question: 'How will you recruit the participants?',
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
    question: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  recruitmentNote: {
    gqlField: 'recruitmentNote',
    goField: 'RecruitmentNote',
    dbField: 'recruitment_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  selectionMethod: {
    gqlField: 'selectionMethod',
    goField: 'SelectionMethod',
    dbField: 'selection_method',
    question: 'How will you select participants? Select all that appy.',
    readonlyQuestion: 'How will you select participants?',
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
    }
  },
  selectionOther: {
    gqlField: 'selectionOther',
    goField: 'SelectionOther',
    dbField: 'selection_other',
    question: 'Please describe the other participants engaging with this model',
    dataType: 'string',
    formType: 'textarea'
  },
  selectionNote: {
    gqlField: 'selectionNote',
    goField: 'SelectionNote',
    dbField: 'selection_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  }
};

export const participantsAndProvidersMisc: Record<string, string> = {
  heading: 'Participants and Providers',
  clearanceHeading: 'Review participants and providers',
  breadcrumb: 'Participants and Providers',
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
