import { TranslationGeneralCharacteristics } from 'types/translation';

export const generalCharacteristics: TranslationGeneralCharacteristics = {
  isNewModel: {
    gqlField: 'isNewModel',
    goField: 'IsNewModel',
    dbField: 'is_new_model',
    label: 'Is this a new track of an existing model or a new model?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'New model',
      false: 'New track of an existing model'
    }
  },
  existingModel: {
    gqlField: 'existingModel',
    goField: 'ExistingModel',
    dbField: 'existing_model',
    label: 'Which existing model?',
    sublabel: 'Start typing the name of the model',
    dataType: 'string',
    formType: 'select'
  },
  resemblesExistingModel: {
    gqlField: 'resemblesExistingModel',
    goField: 'ResemblesExistingModel',
    dbField: 'resembles_existing_model',
    label: 'Does your proposed track/model resemble any existing models?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  // This value doesn't really live in generalCharacteristics, but has
  // it's own query to pull in linked model plans
  existingModelLinks: {
    gqlField: 'existingModelLinks',
    goField: 'ExistingModelLinks',
    dbField: 'existing_model_links',
    label:
      'Which existing models does your proposed track/model most closely resemble?',
    sublabel: 'Start typing the name of the model',
    multiSelectLabel: 'Selected models',
    dataType: 'string',
    formType: 'multiSelect',
    isArray: true
  },
  resemblesExistingModelHow: {
    gqlField: 'resemblesExistingModelHow',
    goField: 'ResemblesExistingModelHow',
    dbField: 'resembles_existing_model_how',
    label: 'In what way does the new model resemble the selected model(s)?',
    dataType: 'string',
    formType: 'textarea'
  },
  resemblesExistingModelNote: {
    gqlField: 'resemblesExistingModelNote',
    goField: 'ResemblesExistingModelNote',
    dbField: 'resembles_existing_model_note',
    label: 'Note',
    dataType: 'string',
    formType: 'textarea'
  },
  hasComponentsOrTracks: {
    gqlField: 'hasComponentsOrTracks',
    goField: 'HasComponentsOrTracks',
    dbField: 'has_components_or_tracks',
    label: 'Are there different components/tracks?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  hasComponentsOrTracksDiffer: {
    gqlField: 'hasComponentsOrTracksDiffer',
    goField: 'HasComponentsOrTracksDiffer',
    dbField: 'has_components_or_tracks_differ',
    label: 'How do the tracks differ?',
    dataType: 'string',
    formType: 'textarea'
  },
  hasComponentsOrTracksNote: {
    gqlField: 'hasComponentsOrTracksNote',
    goField: 'HasComponentsOrTracksNote',
    dbField: 'has_components_or_tracks_note',
    label: 'Note',
    dataType: 'string',
    formType: 'textarea'
  },
  agencyOrStateHelp: {
    gqlField: 'agencyOrStateHelp',
    goField: 'AgencyOrStateHelp',
    dbField: 'agency_or_state_help',
    label:
      'Will another Agency or State help design/operate the model? Select all that apply.',
    readonlyLabel:
      'Will another Agency or State help design/operate the model?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      YES_STATE: 'Yes, we will partner with states',
      YES_AGENCY_IDEAS: 'Yes, we will get ideas from another agency',
      YES_AGENCY_IAA:
        'Yes, we will get support from another agency through Inter Agency Agreement (IAA)',
      NO: 'No',
      OTHER: 'Other'
    }
  },
  agencyOrStateHelpOther: {
    gqlField: 'agencyOrStateHelpOther',
    goField: 'AgencyOrStateHelpOther',
    dbField: 'agency_or_state_help_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  agencyOrStateHelpNote: {
    gqlField: 'agencyOrStateHelpNote',
    goField: 'AgencyOrStateHelpNote',
    dbField: 'agency_or_state_help_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  alternativePaymentModelTypes: {
    gqlField: 'alternativePaymentModelTypes',
    goField: 'AlternativePaymentModelTypes',
    dbField: 'alternative_payment_model_types',
    label:
      'What type of Alternative Payment Model (APM) do you think the model could be?',
    sublabel:
      'In order to be considered by the Quality Payment Program (QPP), and to be MIPS or Advanced APM, you will need to collect TINs and NPIs for providers.',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      ADVANCED: 'Advanced APM',
      MIPS: 'MIPS APM',
      REGULAR: 'Regular APM',
      NOT_APM: 'It is not an APM'
    },
    filterGroups: ['cmmi', 'oact']
  },
  alternativePaymentModelNote: {
    gqlField: 'alternativePaymentModelNote',
    goField: 'AlternativePaymentModelNote',
    dbField: 'alternative_payment_model_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'oact']
  },
  keyCharacteristics: {
    gqlField: 'keyCharacteristics',
    goField: 'KeyCharacteristics',
    dbField: 'key_characteristics',
    label: 'What are the model key characteristics? Select all that apply.',
    readonlyLabel: 'What are the model key characteristics?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected key characteristics',
    options: {
      EPISODE_BASED: 'Episode-Based Model',
      MEDICAID_MODEL: 'Medicaid Model',
      PART_C: 'Medicare-Advantage (Part C) Model',
      MEDICARE_FFS_MODEL: 'Medicare Fee-for-Service (FFS) Model',
      PART_D: 'Medicare Prescription Drug (Part D) Model',
      PAYMENT: 'Payment Model',
      POPULATION_BASED: 'Population-based Model',
      PREVENTATIVE: 'Preventative Model',
      SERVICE_DELIVERY: 'Service Delivery Model',
      SHARED_SAVINGS: 'Shared Savings Model',
      OTHER: 'Other'
    },
    filterGroups: ['cmmi', 'iddoc', 'pbg']
  },
  keyCharacteristicsNote: {
    gqlField: 'keyCharacteristicsNote',
    goField: 'KeyCharacteristicsNote',
    dbField: 'key_characteristics_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'iddoc', 'pbg']
  },
  keyCharacteristicsOther: {
    gqlField: 'keyCharacteristicsOther',
    goField: 'KeyCharacteristicsOther',
    dbField: 'key_characteristics_other',
    label: 'Please describe the other key characteristics',
    dataType: 'string',
    formType: 'text'
  },
  collectPlanBids: {
    gqlField: 'collectPlanBids',
    goField: 'CollectPlanBids',
    dbField: 'collect_plan_bids',
    label: 'Will you review and collect plan bids?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  collectPlanBidsNote: {
    gqlField: 'collectPlanBidsNote',
    goField: 'CollectPlanBidsNote',
    dbField: 'collect_plan_bids_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  managePartCDEnrollment: {
    gqlField: 'managePartCDEnrollment',
    goField: 'ManagePartCDEnrollment',
    dbField: 'manage_part_c_d_enrollment',
    label: 'Will you manage Part C/D enrollment?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  managePartCDEnrollmentNote: {
    gqlField: 'managePartCDEnrollmentNote',
    goField: 'ManagePartCDEnrollmentNote',
    dbField: 'manage_part_c_d_enrollment_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  planContractUpdated: {
    gqlField: 'planContractUpdated',
    goField: 'PlanContractUpdated',
    dbField: 'plan_contract_updated',
    label: 'Have you updated the plan’s contract?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  planContractUpdatedNote: {
    gqlField: 'planContractUpdatedNote',
    goField: 'PlanContractUpdatedNote',
    dbField: 'plan_contract_updated_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  careCoordinationInvolved: {
    gqlField: 'careCoordinationInvolved',
    goField: 'CareCoordinationInvolved',
    dbField: 'care_coordination_involved',
    label: 'Is care coordination involved?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  careCoordinationInvolvedDescription: {
    gqlField: 'careCoordinationInvolvedDescription',
    goField: 'CareCoordinationInvolvedDescription',
    dbField: 'care_coordination_involved_description',
    label: 'How so?',
    dataType: 'string',
    formType: 'textarea'
  },
  careCoordinationInvolvedNote: {
    gqlField: 'careCoordinationInvolvedNote',
    goField: 'CareCoordinationInvolvedNote',
    dbField: 'care_coordination_involved_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  additionalServicesInvolved: {
    gqlField: 'additionalServicesInvolved',
    goField: 'AdditionalServicesInvolved',
    dbField: 'additional_services_involved',
    label: 'Are additional services involved?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  additionalServicesInvolvedDescription: {
    gqlField: 'additionalServicesInvolvedDescription',
    goField: 'AdditionalServicesInvolvedDescription',
    dbField: 'additional_services_involved_description',
    label: 'How so?',
    dataType: 'string',
    formType: 'textarea'
  },
  additionalServicesInvolvedNote: {
    gqlField: 'additionalServicesInvolvedNote',
    goField: 'AdditionalServicesInvolvedNote',
    dbField: 'additional_services_involved_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  communityPartnersInvolved: {
    gqlField: 'communityPartnersInvolved',
    goField: 'CommunityPartnersInvolved',
    dbField: 'community_partners_involved',
    label: 'Are community partners involved?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  communityPartnersInvolvedDescription: {
    gqlField: 'communityPartnersInvolvedDescription',
    goField: 'CommunityPartnersInvolvedDescription',
    dbField: 'community_partners_involved',
    label: 'How so?',
    dataType: 'string',
    formType: 'textarea'
  },
  communityPartnersInvolvedNote: {
    gqlField: 'communityPartnersInvolvedNote',
    goField: 'CommunityPartnersInvolvedNote',
    dbField: 'community_partners_involved_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  geographiesTargeted: {
    gqlField: 'geographiesTargeted',
    goField: 'GeographiesTargeted',
    dbField: 'geographies_targeted',
    label: 'Is the model targeted at specific geographies?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  geographiesTargetedTypes: {
    gqlField: 'geographiesTargetedTypes',
    goField: 'GeographiesTargetedTypes',
    dbField: 'geographies_targeted_types',
    label: 'Geography type is',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      REGION: 'Region (CBSA, MSA, HRR, etc.)',
      STATE: 'State',
      OTHER: 'Other'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  geographiesTargetedTypesOther: {
    gqlField: 'geographiesTargetedTypesOther',
    goField: 'GeographiesTargetedTypesOther',
    dbField: 'geographies_targeted_types_other',
    label: 'Please specify what the other geography type is.',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc', 'pbg']
  },
  geographiesTargetedAppliedTo: {
    gqlField: 'geographiesTargetedAppliedTo',
    goField: 'GeographiesTargetedAppliedTo',
    dbField: 'geographies_targeted_applied_to',
    label: 'Geographies are applied to',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      BENEFICIARIES: 'Beneficiaries',
      PARTICIPANTS: 'Participants',
      PROVIDERS: 'Providers',
      OTHER: 'Other'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  geographiesTargetedAppliedToOther: {
    gqlField: 'geographiesTargetedAppliedToOther',
    goField: 'GeographiesTargetedAppliedToOther',
    dbField: 'geographies_targeted_applied_to_other',
    label: 'Please specify what the geographies are applied to.',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc', 'pbg']
  },
  geographiesTargetedNote: {
    gqlField: 'geographiesTargetedNote',
    goField: 'GeographiesTargetedNote',
    dbField: 'geographies_targeted_note',
    label: 'Notes',
    dataType: 'boolean',
    formType: 'radio',
    filterGroups: ['iddoc', 'pbg']
  },
  participationOptions: {
    gqlField: 'participationOptions',
    goField: 'ParticipationOptions',
    dbField: 'participation_options',
    label: 'Does the model offer different options for participation?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  participationOptionsNote: {
    gqlField: 'participationOptionsNote',
    goField: 'ParticipationOptionsNote',
    dbField: 'participation_options_note',
    label: 'Notes',
    dataType: 'boolean',
    formType: 'radio',
    filterGroups: ['cmmi']
  },
  agreementTypes: {
    gqlField: 'agreementTypes',
    goField: 'AgreementTypes',
    dbField: 'agreement_types',
    label: 'What is the agreement type?',
    sublabel:
      'Note: CMMI writes, Office of General Council (OGC) approves both types of agreements',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      COOPERATIVE: 'Co-Operative Agreement/Grant',
      PARTICIPATION: 'Participation Agreement',
      OTHER: 'Other'
    },
    filterGroups: ['cmmi']
  },
  agreementTypesOther: {
    gqlField: 'agreementTypesOther',
    goField: 'AgreementTypesOther',
    dbField: 'agreement_types_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['cmmi']
  },
  multiplePatricipationAgreementsNeeded: {
    gqlField: 'multiplePatricipationAgreementsNeeded',
    goField: 'MultiplePatricipationAgreementsNeeded',
    dbField: 'multiple_patricipation_agreements_needed',
    label: 'Will more than one participation agreement be needed?',
    sublabel:
      'depending on awardee selections or characteristics such as risk/type/size',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  multiplePatricipationAgreementsNeededNote: {
    gqlField: 'multiplePatricipationAgreementsNeededNote',
    goField: 'MultiplePatricipationAgreementsNeededNote',
    dbField: 'multiple_patricipation_agreements_needed_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  rulemakingRequired: {
    gqlField: 'rulemakingRequired',
    goField: 'RulemakingRequired',
    dbField: 'rulemaking_required',
    label: 'Is rulemaking required?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc', 'ipc', 'pbg']
  },
  rulemakingRequiredDescription: {
    gqlField: 'multiplePatricipationAgreementsNeeded',
    goField: 'MultiplePatricipationAgreementsNeeded',
    dbField: 'multiple_patricipation_agreements_needed',
    label:
      'Which rule do you anticipate using and what is the target date of display for that regulation?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'ipc', 'pbg']
  },
  rulemakingRequiredNote: {
    gqlField: 'rulemakingRequiredNote',
    goField: 'RulemakingRequiredNote',
    dbField: 'rulemaking_required_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  authorityAllowances: {
    gqlField: 'authorityAllowances',
    goField: 'AuthorityAllowances',
    dbField: 'authority_allowances',
    label: 'What authority allows CMMI to test the model?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      ACA: '3021 Affordable Care Act (ACA)',
      CONGRESSIONALLY_MANDATED: 'Congressionally Mandated Demonstration',
      SSA_PART_B:
        'Section 1833(e) (Part B services) of the Social Security Act',
      OTHER: 'Other'
    },
    filterGroups: ['cmmi']
  },
  authorityAllowancesOther: {
    gqlField: 'authorityAllowancesOther',
    goField: 'AuthorityAllowancesOther',
    dbField: 'authority_allowances_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  authorityAllowancesNote: {
    gqlField: 'authorityAllowancesNote',
    goField: 'AuthorityAllowancesNote',
    dbField: 'authority_allowances_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  waiversRequired: {
    gqlField: 'waiversRequired',
    goField: 'WaiversRequired',
    dbField: 'waivers_required',
    label: 'Are waivers required?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  waiversRequiredTypes: {
    gqlField: 'waiversRequiredTypes',
    goField: 'WaiversRequiredTypes',
    dbField: 'waivers_required_types',
    label: 'Which types of waivers are required? Select all that apply.',
    readonlyLabel: 'Which types of waivers are required?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      FRAUD_ABUSE: 'Fraud and Abuse',
      MEDICAID: 'Medicaid',
      PROGRAM_PAYMENT: 'Program/payment'
    },
    optionsLabels: {
      FRAUD_ABUSE: '(Note: Federal Waiver team writes)',
      MEDICAID: '(1115, other)',
      PROGRAM_PAYMENT:
        '(Note: CMMI writes, Office of General Council (OGC) adivses, full clearance process is required)'
    },
    filterGroups: ['cmmi']
  },
  waiversRequiredNote: {
    gqlField: 'waiversRequiredNote',
    goField: 'WaiversRequiredNote',
    dbField: 'waivers_required_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
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

export const generalCharacteristicsMisc: Record<string, string> = {
  heading: 'General characteristics',
  clearanceHeading: 'Review general characteristics',
  breadcrumb: 'General characteristics',
  specificQuestions: 'Key characteristic specific questions'
};

export default generalCharacteristics;
