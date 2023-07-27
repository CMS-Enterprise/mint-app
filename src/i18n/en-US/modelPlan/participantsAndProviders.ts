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
  participantQuestions: 'Participant specific questions'
};

export default participantsAndProviders;
