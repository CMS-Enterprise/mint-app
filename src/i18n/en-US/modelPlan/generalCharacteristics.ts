import { TranslationGeneralCharacteristics } from 'types/translation';

import {
  ModelViewFilter,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const generalCharacteristics: TranslationGeneralCharacteristics = {
  isNewModel: {
    gqlField: 'isNewModel',
    goField: 'IsNewModel',
    dbField: 'is_new_model',
    label: 'Is this a new track of an existing model or a new model?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.01,
    options: {
      true: 'New model',
      false: 'New track of an existing model'
    },
    childRelation: {
      false: [() => generalCharacteristics.existingModel]
    },
    filterGroups: [ModelViewFilter.IPC]
  },
  existingModelID: {
    gqlField: 'existingModelID',
    goField: 'ExistingModelID',
    dbField: 'existing_model_id',
    label: 'Which existing model is this a new track of?',
    dataType: TranslationDataType.NUMBER,
    formType: TranslationFormType.TEXT,
    order: 1.02,
    tableReference: TableName.EXISTING_MODEL,
    hideFromReadonly: true
  },
  currentModelPlanID: {
    gqlField: 'currentModelPlanID',
    goField: 'CurrentModelPlanID',
    dbField: 'current_model_plan_id',
    label: 'Which model is this a new track of?',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 1.03,
    tableReference: TableName.MODEL_PLAN,
    hideFromReadonly: true
  },
  existingModel: {
    gqlField: 'existingModel',
    goField: 'ExistingModel',
    dbField: 'existing_model',
    label: 'Which existing model?',
    sublabel: 'Start typing the name of the model',
    exportLabel: 'Which model is this a new track of?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.SELECT,
    order: 1.04,
    parentRelation: () => generalCharacteristics.isNewModel,
    filterGroups: [ModelViewFilter.IPC]
  },
  resemblesExistingModel: {
    gqlField: 'resemblesExistingModel',
    goField: 'ResemblesExistingModel',
    dbField: 'resembles_existing_model',
    label: 'Does your proposed track/model resemble any existing models?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    order: 1.05,
    options: {
      YES: 'Yes',
      NO: 'No',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'resemblesExistingModelOtherSpecify'
    },
    childRelation: {
      YES: [
        () => generalCharacteristics.resemblesExistingModelWhyHow,
        () => generalCharacteristics.resemblesExistingModelWhich,
        () => generalCharacteristics.resemblesExistingModelHow
      ],
      NO: [() => generalCharacteristics.resemblesExistingModelWhyHow]
    },
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.PBG]
  },
  resemblesExistingModelWhyHow: {
    gqlField: 'resemblesExistingModelWhyHow',
    goField: 'ResemblesExistingModelWhyHow',
    dbField: 'resembles_existing_model_why_how',
    label: 'Explain why and how the model made this decision.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.06
  },
  resemblesExistingModelWhich: {
    gqlField: 'resemblesExistingModelWhich',
    goField: 'ResemblesExistingModelWhich',
    dbField: 'resembles_existing_model_which',
    label:
      'Which existing models does your proposed track/model most closely resemble?',
    sublabel: 'Start typing the name of the model',
    multiSelectLabel: 'Selected models',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.MULTISELECT,
    order: 1.07,
    isArray: true,
    isModelLinks: true, // Used to designate if a field is a ExistingModelLinks type with nested fields - ex: names,
    parentRelation: () => generalCharacteristics.resemblesExistingModel,
    options: {
      Other: 'Other'
    },
    optionsRelatedInfo: {
      Other: 'resemblesExistingModelOtherOption'
    },
    filterGroups: [ModelViewFilter.IPC]
  },
  resemblesExistingModelHow: {
    gqlField: 'resemblesExistingModelHow',
    goField: 'ResemblesExistingModelHow',
    dbField: 'resembles_existing_model_how',
    label: 'In what way does the new model resemble the selected model(s)?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.08,
    parentRelation: () => generalCharacteristics.resemblesExistingModel,
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.PBG]
  },
  resemblesExistingModelOtherSpecify: {
    gqlField: 'resemblesExistingModelOtherSpecify',
    goField: 'ResemblesExistingModelOtherSpecify',
    dbField: 'resembles_existing_model_other_specify',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.09,
    isOtherType: true,
    otherParentField: 'resemblesExistingModel'
  },
  resemblesExistingModelOtherOption: {
    gqlField: 'resemblesExistingModelOtherOption',
    goField: 'ResemblesExistingModelOtherOption',
    dbField: 'resembles_existing_model_other_option',
    label: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.1,
    isOtherType: true,
    otherParentField: 'resemblesExistingModelWhich'
  },
  resemblesExistingModelNote: {
    gqlField: 'resemblesExistingModelNote',
    goField: 'ResemblesExistingModelNote',
    dbField: 'resembles_existing_model_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'resemblesExistingModel',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.11
  },
  participationInModelPrecondition: {
    gqlField: 'participationInModelPrecondition',
    goField: 'ParticipationInModelPrecondition',
    dbField: 'participation_in_model_precondition',
    label:
      'Is participation in another model a precondition for participation in this model?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    order: 1.12,
    options: {
      YES: 'Yes',
      NO: 'No',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'participationInModelPreconditionOtherSpecify'
    },
    childRelation: {
      YES: [
        () => generalCharacteristics.participationInModelPreconditionWhich,
        () => generalCharacteristics.participationInModelPreconditionWhyHow
      ]
    }
  },
  participationInModelPreconditionOtherSpecify: {
    gqlField: 'participationInModelPreconditionOtherSpecify',
    goField: 'ParticipationInModelPreconditionOtherSpecify',
    dbField: 'participation_in_model_precondition_other_specify',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.13,
    isOtherType: true,
    otherParentField: 'participationInModelPrecondition'
  },
  participationInModelPreconditionWhich: {
    gqlField: 'participationInModelPreconditionWhich',
    goField: 'ParticipationInModelPreconditionWhich',
    dbField: 'participation_in_model_precondition_which',
    label: 'Which models?',
    sublabel: 'Start typing the name of the model',
    multiSelectLabel: 'Selected models',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.MULTISELECT,
    order: 1.14,
    isArray: true,
    isModelLinks: true, // Used to designate if a field is a ExistingModelLinks type with nested fields - ex: names
    parentRelation: () =>
      generalCharacteristics.participationInModelPrecondition,
    options: {
      Other: 'Other'
    },
    optionsRelatedInfo: {
      Other: 'participationInModelPreconditionOtherOption'
    }
  },
  participationInModelPreconditionOtherOption: {
    gqlField: 'participationInModelPreconditionOtherOption',
    goField: 'ParticipationInModelPreconditionOtherOption',
    dbField: 'participation_in_model_precondition_other_option',
    label: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.15,
    isOtherType: true,
    parentReferencesLabel:
      'Which models require participation as a precondition for participation in this model?'
  },
  participationInModelPreconditionWhyHow: {
    gqlField: 'participationInModelPreconditionWhyHow',
    goField: 'ParticipationInModelPreconditionWhyHow',
    dbField: 'participation_in_model_precondition_why_how',
    label: 'Explain any details including if it is just part of the model.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.16,
    parentRelation: () =>
      generalCharacteristics.participationInModelPrecondition
  },
  participationInModelPreconditionNote: {
    gqlField: 'participationInModelPreconditionNote',
    goField: 'ParticipationInModelPreconditionNote',
    dbField: 'participation_in_model_precondition_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'participationInModelPrecondition',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.17
  },
  hasComponentsOrTracks: {
    gqlField: 'hasComponentsOrTracks',
    goField: 'HasComponentsOrTracks',
    dbField: 'has_components_or_tracks',
    label: 'Are there different components/tracks?',
    readonlyLabel:
      'Are there different components/tracks? If so, how do the tracks differ?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.18,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'hasComponentsOrTracksDiffer'
    },
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.PBG]
  },
  hasComponentsOrTracksDiffer: {
    gqlField: 'hasComponentsOrTracksDiffer',
    goField: 'HasComponentsOrTracksDiffer',
    dbField: 'has_components_or_tracks_differ',
    label: 'How do the tracks differ?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.19,
    isOtherType: true,
    otherParentField: 'hasComponentsOrTracks',
    filterGroups: [ModelViewFilter.IPC]
  },
  hasComponentsOrTracksNote: {
    gqlField: 'hasComponentsOrTracksNote',
    goField: 'HasComponentsOrTracksNote',
    dbField: 'has_components_or_tracks_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'hasComponentsOrTracks',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.2
  },
  agencyOrStateHelp: {
    gqlField: 'agencyOrStateHelp',
    goField: 'AgencyOrStateHelp',
    dbField: 'agency_or_state_help',
    label:
      'Will another Agency or State help design/operate the model? Select all that apply.',
    readonlyLabel:
      'Will another Agency or State help design/operate the model?',
    exportLabel: 'Will another Agency or State help design/operate the model?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 2.01,
    isPageStart: true,
    options: {
      YES_STATE: 'Yes, we will partner with states',
      YES_AGENCY_IDEAS: 'Yes, we will get ideas from another agency',
      YES_AGENCY_IAA:
        'Yes, we will get support from another agency through Inter Agency Agreement (IAA)',
      NO: 'No',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'agencyOrStateHelpOther'
    }
  },
  agencyOrStateHelpOther: {
    gqlField: 'agencyOrStateHelpOther',
    goField: 'AgencyOrStateHelpOther',
    dbField: 'agency_or_state_help_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.02,
    isOtherType: true,
    otherParentField: 'agencyOrStateHelp'
  },
  agencyOrStateHelpNote: {
    gqlField: 'agencyOrStateHelpNote',
    goField: 'AgencyOrStateHelpNote',
    dbField: 'agency_or_state_help_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'agencyOrStateHelp',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.03
  },
  alternativePaymentModelTypes: {
    gqlField: 'alternativePaymentModelTypes',
    goField: 'AlternativePaymentModelTypes',
    dbField: 'alternative_payment_model_types',
    label:
      'What type of Alternative Payment Model (APM) do you think the model could be?',
    sublabel:
      'In order to be considered by the Quality Payment Program (QPP), and to be MIPS or Advanced APM, you will need to collect TINs and NPIs for providers.',
    questionTooltip:
      'In order to be considered by the Quality Payment Program (QPP), and to be MIPS or Advanced APM, you will need to collect TINs and NPIs for providers.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 2.04,
    options: {
      ADVANCED: 'Advanced APM',
      MIPS: 'MIPS APM',
      REGULAR: 'Regular APM',
      NOT_APM: 'It is not an APM'
    },
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.OACT,
      ModelViewFilter.PBG
    ]
  },
  alternativePaymentModelNote: {
    gqlField: 'alternativePaymentModelNote',
    goField: 'AlternativePaymentModelNote',
    dbField: 'alternative_payment_model_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'alternativePaymentModelTypes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.05,
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.OACT]
  },
  keyCharacteristics: {
    gqlField: 'keyCharacteristics',
    goField: 'KeyCharacteristics',
    dbField: 'key_characteristics',
    label: 'What are the model key characteristics? Select all that apply.',
    readonlyLabel: 'What are the model key characteristics?',
    exportLabel: 'What are the model key characteristics?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 2.06,
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
    optionsRelatedInfo: {
      OTHER: 'keyCharacteristicsOther'
    },
    childRelation: {
      PART_C: [
        () => generalCharacteristics.collectPlanBids,
        () => generalCharacteristics.managePartCDEnrollment,
        () => generalCharacteristics.planContractUpdated
      ],
      PART_D: [
        () => generalCharacteristics.collectPlanBids,
        () => generalCharacteristics.managePartCDEnrollment,
        () => generalCharacteristics.planContractUpdated
      ]
    },
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  keyCharacteristicsOther: {
    gqlField: 'keyCharacteristicsOther',
    goField: 'KeyCharacteristicsOther',
    dbField: 'key_characteristics_other',
    label: 'Please describe the other key characteristics',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 2.07,
    isOtherType: true
  },
  keyCharacteristicsNote: {
    gqlField: 'keyCharacteristicsNote',
    goField: 'KeyCharacteristicsNote',
    dbField: 'key_characteristics_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'keyCharacteristics',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.08,
    filterGroups: [
      ModelViewFilter.CMMI,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  collectPlanBids: {
    gqlField: 'collectPlanBids',
    goField: 'CollectPlanBids',
    dbField: 'collect_plan_bids',
    label: 'Will you review and collect plan bids?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 2.09,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => generalCharacteristics.keyCharacteristics
  },
  collectPlanBidsNote: {
    gqlField: 'collectPlanBidsNote',
    goField: 'CollectPlanBidsNote',
    dbField: 'collect_plan_bids_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'collectPlanBids',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.1
  },
  managePartCDEnrollment: {
    gqlField: 'managePartCDEnrollment',
    goField: 'ManagePartCDEnrollment',
    dbField: 'manage_part_c_d_enrollment',
    label: 'Will you manage Part C/D enrollment?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 2.11,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => generalCharacteristics.keyCharacteristics
  },
  managePartCDEnrollmentNote: {
    gqlField: 'managePartCDEnrollmentNote',
    goField: 'ManagePartCDEnrollmentNote',
    dbField: 'manage_part_c_d_enrollment_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'managePartCDEnrollment',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.12
  },
  planContractUpdated: {
    gqlField: 'planContractUpdated',
    goField: 'PlanContractUpdated',
    dbField: 'plan_contract_updated',
    label: 'Have you updated the plan’s contract?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 2.13,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => generalCharacteristics.keyCharacteristics
  },
  planContractUpdatedNote: {
    gqlField: 'planContractUpdatedNote',
    goField: 'PlanContractUpdatedNote',
    dbField: 'plan_contract_updated_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'planContractUpdated',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.14
  },
  careCoordinationInvolved: {
    gqlField: 'careCoordinationInvolved',
    goField: 'CareCoordinationInvolved',
    dbField: 'care_coordination_involved',
    label: 'Is care coordination involved?',
    readonlyLabel: 'Is care coordination involved? How so?',
    sublabel:
      'Examples: Service B cannot be paid until Service A has been paid; Service A cannot be paid without Diagnosis 1; if a certain service or diagnosis exists in history, then Service A cannot be paid.',
    questionTooltip:
      'Examples: Service B cannot be paid until Service A has been paid; Service A cannot be paid without Diagnosis 1; if a certain service or diagnosis exists in history, then Service A cannot be paid.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 3.01,
    isPageStart: true,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'careCoordinationInvolvedDescription'
    },
    filterGroups: [ModelViewFilter.PBG]
  },
  careCoordinationInvolvedDescription: {
    gqlField: 'careCoordinationInvolvedDescription',
    goField: 'CareCoordinationInvolvedDescription',
    dbField: 'care_coordination_involved_description',
    label: 'How so?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.02,
    isOtherType: true,
    otherParentField: 'careCoordinationInvolved'
  },
  careCoordinationInvolvedNote: {
    gqlField: 'careCoordinationInvolvedNote',
    goField: 'CareCoordinationInvolvedNote',
    dbField: 'care_coordination_involved_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'careCoordinationInvolved',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.03
  },
  additionalServicesInvolved: {
    gqlField: 'additionalServicesInvolved',
    goField: 'AdditionalServicesInvolved',
    dbField: 'additional_services_involved',
    label: 'Are additional services involved?',
    readonlyLabel: 'Are additional services involved? How so?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 3.04,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'additionalServicesInvolvedDescription'
    },
    filterGroups: [ModelViewFilter.PBG]
  },
  additionalServicesInvolvedDescription: {
    gqlField: 'additionalServicesInvolvedDescription',
    goField: 'AdditionalServicesInvolvedDescription',
    dbField: 'additional_services_involved_description',
    label: 'How so?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.05,
    isOtherType: true,
    otherParentField: 'additionalServicesInvolved'
  },
  additionalServicesInvolvedNote: {
    gqlField: 'additionalServicesInvolvedNote',
    goField: 'AdditionalServicesInvolvedNote',
    dbField: 'additional_services_involved_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'additionalServicesInvolved',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.06
  },
  communityPartnersInvolved: {
    gqlField: 'communityPartnersInvolved',
    goField: 'CommunityPartnersInvolved',
    dbField: 'community_partners_involved',
    label: 'Are community partners involved?',
    readonlyLabel: 'Are community partners involved? How so?',
    sublabel:
      "Community partners are typically not Medicare enrolled and are organizations in the participant's community. They may be involved with providing care, care coordination, or social services to beneficiaries or provide leadership, design, or implementation at the participant level. Example: Community-based organizations (CBO) like YMCA or United Way",
    questionTooltip:
      "Community partners are typically not Medicare enrolled and are organizations in the participant's community. They may be involved with providing care, care coordination, or social services to beneficiaries or provide leadership, design, or implementation at the participant level. Example: Community-based organizations (CBO) like YMCA or United Way",
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 3.07,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'communityPartnersInvolvedDescription'
    }
  },
  communityPartnersInvolvedDescription: {
    gqlField: 'communityPartnersInvolvedDescription',
    goField: 'CommunityPartnersInvolvedDescription',
    dbField: 'community_partners_involved_description',
    label: 'How so?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.08,
    isOtherType: true,
    otherParentField: 'communityPartnersInvolved'
  },
  communityPartnersInvolvedNote: {
    gqlField: 'communityPartnersInvolvedNote',
    goField: 'CommunityPartnersInvolvedNote',
    dbField: 'community_partners_involved_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'communityPartnersInvolved',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.09
  },
  geographiesTargeted: {
    gqlField: 'geographiesTargeted',
    goField: 'GeographiesTargeted',
    dbField: 'geographies_targeted',
    label: 'Is the model targeted at specific geographies?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.01,
    isPageStart: true,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () => generalCharacteristics.geographiesTargetedTypes,
        () => generalCharacteristics.geographiesTargetedAppliedTo
      ]
    },
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  geographiesTargetedTypes: {
    gqlField: 'geographiesTargetedTypes',
    goField: 'GeographiesTargetedTypes',
    dbField: 'geographies_targeted_types',
    label: 'Geography type is',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 4.02,
    options: {
      STATE: 'States and territories',
      REGION: 'Region',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'geographiesTargetedTypesOther'
    },
    parentRelation: () => generalCharacteristics.geographiesTargeted,
    childRelation: {
      STATE: [() => generalCharacteristics.geographiesStatesAndTerritories],
      REGION: [() => generalCharacteristics.geographiesRegionTypes]
    },
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  geographiesStatesAndTerritories: {
    gqlField: 'geographiesStatesAndTerritories',
    goField: 'GeographiesStatesAndTerritories',
    dbField: 'geographies_states_and_territories',
    label: 'Which states and territories?',
    multiSelectLabel: 'States and territories',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 4.03,
    isOtherType: true,
    otherParentField: 'geographiesTargetedTypes',
    options: {
      AL: 'AL - Alabama',
      AK: 'AK - Alaska',
      AZ: 'AZ - Arizona',
      AR: 'AR - Arkansas',
      CA: 'CA - California',
      CO: 'CO - Colorado',
      CT: 'CT - Connecticut',
      DE: 'DE - Delaware',
      DC: 'DC - District of Columbia',
      FL: 'FL - Florida',
      GA: 'GA - Georgia',
      HI: 'HI - Hawaii',
      ID: 'ID - Idaho',
      IL: 'IL - Illinois',
      IN: 'IN - Indiana',
      IA: 'IA - Iowa',
      KS: 'KS - Kansas',
      KY: 'KY - Kentucky',
      LA: 'LA - Louisiana',
      ME: 'ME - Maine',
      MD: 'MD - Maryland',
      MA: 'MA - Massachusetts',
      MI: 'MI - Michigan',
      MN: 'MN - Minnesota',
      MS: 'MS - Mississippi',
      MO: 'MO - Missouri',
      MT: 'MT - Montana',
      NE: 'NE - Nebraska',
      NV: 'NV - Nevada',
      NH: 'NH - New Hampshire',
      NJ: 'NJ - New Jersey',
      NM: 'NM - New Mexico',
      NY: 'NY - New York',
      NC: 'NC - North Carolina',
      ND: 'ND - North Dakota',
      OH: 'OH - Ohio',
      OK: 'OK - Oklahoma',
      OR: 'OR - Oregon',
      PA: 'PA - Pennsylvania',
      RI: 'RI - Rhode Island',
      SC: 'SC - South Carolina',
      SD: 'SD - South Dakota',
      TN: 'TN - Tennessee',
      TX: 'TX - Texas',
      UT: 'UT - Utah',
      VT: 'VT - Vermont',
      VA: 'VA - Virginia',
      WA: 'WA - Washington',
      WV: 'WV - West Virginia',
      WI: 'WI - Wisconsin',
      WY: 'WY - Wyoming',
      AS: 'AS - American Samoa',
      GU: 'GU - Guam',
      MP: 'MP - Northern Mariana Islands',
      PR: 'PR - Puerto Rico',
      UM: 'UM - U.S. Minor Outlying Islands',
      VI: 'VI - U.S. Virgin Islands'
    },
    readonlyOptions: {
      AL: 'Alabama',
      AK: 'Alaska',
      AZ: 'Arizona',
      AR: 'Arkansas',
      CA: 'California',
      CO: 'Colorado',
      CT: 'Connecticut',
      DE: 'Delaware',
      DC: 'District of Columbia',
      FL: 'Florida',
      GA: 'Georgia',
      HI: 'Hawaii',
      ID: 'Idaho',
      IL: 'Illinois',
      IN: 'Indiana',
      IA: 'Iowa',
      KS: 'Kansas',
      KY: 'Kentucky',
      LA: 'Louisiana',
      ME: 'Maine',
      MD: 'Maryland',
      MA: 'Massachusetts',
      MI: 'Michigan',
      MN: 'Minnesota',
      MS: 'Mississippi',
      MO: 'Missouri',
      MT: 'Montana',
      NE: 'Nebraska',
      NV: 'Nevada',
      NH: 'New Hampshire',
      NJ: 'New Jersey',
      NM: 'New Mexico',
      NY: 'New York',
      NC: 'North Carolina',
      ND: 'North Dakota',
      OH: 'Ohio',
      OK: 'Oklahoma',
      OR: 'Oregon',
      PA: 'Pennsylvania',
      RI: 'Rhode Island',
      SC: 'South Carolina',
      SD: 'South Dakota',
      TN: 'Tennessee',
      TX: 'Texas',
      UT: 'Utah',
      VT: 'Vermont',
      VA: 'Virginia',
      WA: 'Washington',
      WV: 'West Virginia',
      WI: 'Wisconsin',
      WY: 'Wyoming',
      AS: 'American Samoa',
      GU: 'Guam',
      MP: 'Northern Mariana Islands',
      PR: 'Puerto Rico',
      UM: 'U.S. Minor Outlying Islands',
      VI: 'U.S. Virgin Islands'
    },
    parentRelation: () => generalCharacteristics.geographiesTargetedTypes,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  geographiesRegionTypes: {
    gqlField: 'geographiesRegionTypes',
    goField: 'GeographiesRegionTypes',
    dbField: 'geographies_region_types',
    label: 'Geography region types',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 4.04,
    isOtherType: true,
    otherParentField: 'geographiesTargetedTypes',
    options: {
      CBSA: 'Core-based statistical areas (CBSAs)',
      HRR: 'Hospital Referral Regions (HRR)',
      MSA: 'Metropolitan Statistical Areas (MSAs)'
    },
    parentRelation: () => generalCharacteristics.geographiesTargetedTypes,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  geographiesTargetedTypesOther: {
    gqlField: 'geographiesTargetedTypesOther',
    goField: 'GeographiesTargetedTypesOther',
    dbField: 'geographies_targeted_types_other',
    label: 'Please specify what the other geography type is.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 4.05,
    isOtherType: true,
    otherParentField: 'geographiesTargetedTypes',
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  geographiesTargetedAppliedTo: {
    gqlField: 'geographiesTargetedAppliedTo',
    goField: 'GeographiesTargetedAppliedTo',
    dbField: 'geographies_targeted_applied_to',
    label: 'Geographies are applied to',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 4.06,
    options: {
      BENEFICIARIES: 'Beneficiaries',
      PARTICIPANTS: 'Participants',
      PROVIDERS: 'Providers',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'geographiesTargetedAppliedToOther'
    },
    parentRelation: () => generalCharacteristics.geographiesTargeted,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  geographiesTargetedAppliedToOther: {
    gqlField: 'geographiesTargetedAppliedToOther',
    goField: 'GeographiesTargetedAppliedToOther',
    dbField: 'geographies_targeted_applied_to_other',
    label: 'Please specify what the geographies are applied to.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 4.07,
    isOtherType: true,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  geographiesTargetedNote: {
    gqlField: 'geographiesTargetedNote',
    goField: 'GeographiesTargetedNote',
    dbField: 'geographies_targeted_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'geographiesTargeted',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.08,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  participationOptions: {
    gqlField: 'participationOptions',
    goField: 'ParticipationOptions',
    dbField: 'participation_options',
    label: 'Does the model offer different options for participation?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.09,
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  participationOptionsNote: {
    gqlField: 'participationOptionsNote',
    goField: 'ParticipationOptionsNote',
    dbField: 'participation_options_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'participationOptions',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.1,
    filterGroups: [ModelViewFilter.CMMI]
  },
  agreementTypes: {
    gqlField: 'agreementTypes',
    goField: 'AgreementTypes',
    dbField: 'agreement_types',
    label: 'What is the agreement type?',
    sublabel:
      'Note: CMMI writes, Office of General Council (OGC) approves both types of agreements',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 4.11,
    options: {
      COOPERATIVE: 'Co-Operative Agreement/Grant',
      PARTICIPATION: 'Participation Agreement',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'agreementTypesOther'
    },
    childRelation: {
      PARTICIPATION: [
        () => generalCharacteristics.multiplePatricipationAgreementsNeeded
      ]
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  agreementTypesOther: {
    gqlField: 'agreementTypesOther',
    goField: 'AgreementTypesOther',
    dbField: 'agreement_types_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 4.12,
    isOtherType: true,
    otherParentField: 'agreementTypes',
    filterGroups: [ModelViewFilter.CMMI]
  },
  multiplePatricipationAgreementsNeeded: {
    gqlField: 'multiplePatricipationAgreementsNeeded',
    goField: 'MultiplePatricipationAgreementsNeeded',
    dbField: 'multiple_patricipation_agreements_needed',
    label: 'Will more than one participation agreement be needed?',
    sublabel:
      'depending on awardee selections or characteristics such as risk/type/size',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.13,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => generalCharacteristics.agreementTypes,
    filterGroups: [ModelViewFilter.CMMI]
  },
  multiplePatricipationAgreementsNeededNote: {
    gqlField: 'multiplePatricipationAgreementsNeededNote',
    goField: 'MultiplePatricipationAgreementsNeededNote',
    dbField: 'multiple_patricipation_agreements_needed_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'agreementTypes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 4.14,
    filterGroups: [ModelViewFilter.CMMI]
  },
  rulemakingRequired: {
    gqlField: 'rulemakingRequired',
    goField: 'RulemakingRequired',
    dbField: 'rulemaking_required',
    label: 'Is rulemaking required?',
    readonlyLabel:
      'Is rulemaking required? If so, which rule do you anticipate using and what is the target date of display for that regulation?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.01,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'rulemakingRequiredDescription'
    },
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  rulemakingRequiredDescription: {
    gqlField: 'rulemakingRequiredDescription',
    goField: 'RulemakingRequiredDescription',
    dbField: 'rulemaking_required_description',
    label:
      'Which rule do you anticipate using and what is the target date of display for that regulation?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.02,
    isOtherType: true,
    otherParentField: 'rulemakingRequired',
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  rulemakingRequiredNote: {
    gqlField: 'rulemakingRequiredNote',
    goField: 'RulemakingRequiredNote',
    dbField: 'rulemaking_required_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'rulemakingRequired',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.03
  },
  authorityAllowances: {
    gqlField: 'authorityAllowances',
    goField: 'AuthorityAllowances',
    dbField: 'authority_allowances',
    label: 'What authority allows CMMI to test the model?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 5.04,
    options: {
      ACA: '3021 Affordable Care Act (ACA)',
      CONGRESSIONALLY_MANDATED: 'Congressionally Mandated Demonstration',
      SSA_PART_B:
        'Section 1833(e) (Part B services) of the Social Security Act',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'authorityAllowancesOther'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  authorityAllowancesOther: {
    gqlField: 'authorityAllowancesOther',
    goField: 'AuthorityAllowancesOther',
    dbField: 'authority_allowances_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.05,
    isOtherType: true,
    otherParentField: 'authorityAllowances',
    filterGroups: [ModelViewFilter.CMMI]
  },
  authorityAllowancesNote: {
    gqlField: 'authorityAllowancesNote',
    goField: 'AuthorityAllowancesNote',
    dbField: 'authority_allowances_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'authorityAllowances',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.06,
    filterGroups: [ModelViewFilter.CMMI]
  },
  waiversRequired: {
    gqlField: 'waiversRequired',
    goField: 'WaiversRequired',
    dbField: 'waivers_required',
    label: 'Are waivers required?',
    readonlyLabel: 'Are waivers required? If so, which types of waivers?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.07,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'waiversRequiredTypes'
    },
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.PBG]
  },
  waiversRequiredTypes: {
    gqlField: 'waiversRequiredTypes',
    goField: 'WaiversRequiredTypes',
    dbField: 'waivers_required_types',
    label: 'Which types of waivers are required? Select all that apply.',
    readonlyLabel: 'Which types of waivers are required?',
    exportLabel: 'Which types of waivers are required?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 5.08,
    isOtherType: true,
    options: {
      FRAUD_ABUSE: 'Fraud and Abuse',
      MEDICAID: 'Medicaid',
      PROGRAM_PAYMENT: 'Program/payment'
    },
    optionsLabels: {
      FRAUD_ABUSE: 'Note: Federal Waiver team writes',
      MEDICAID: '(1115, other)',
      PROGRAM_PAYMENT:
        '(e.g., SNF 3-day stay, Inpatient-Only rule)\n Note: CMMI writes, Office of General Council (OGC) advises, full clearance process is required'
    },
    tooltips: {
      FRAUD_ABUSE: 'Note: Federal Waiver team writes',
      MEDICAID: '(1115, other)',
      PROGRAM_PAYMENT:
        '(e.g., SNF 3-day stay, Inpatient-Only rule)\n Note: CMMI writes, Office of General Council (OGC) advises, full clearance process is required'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  waiversRequiredNote: {
    gqlField: 'waiversRequiredNote',
    goField: 'WaiversRequiredNote',
    dbField: 'waivers_required_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'waiversRequired',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.09,
    filterGroups: [ModelViewFilter.CMMI]
  },
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label:
      'This section of the Model Plan (General characteristics) is ready for review.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 5.1,
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
    order: 5.11,
    hideFromReadonly: true
  },
  readyForClearanceBy: {
    gqlField: 'readyForClearanceBy',
    goField: 'ReadyForClearanceBy',
    dbField: 'ready_for_clearance_by',
    label:
      'This section of the Model Plan (General characteristics) is ready for clearance.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 5.12,
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
    order: 5.13,
    hideFromReadonly: true
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 5.14,
    options: {
      READY: 'ready',
      IN_PROGRESS: 'in progress',
      READY_FOR_REVIEW: 'ready for review',
      READY_FOR_CLEARANCE: 'ready for clearance'
    },
    hideFromReadonly: true
  }
};

export const generalCharacteristicsMisc: Record<string, string> = {
  heading: 'General characteristics',
  clearanceHeading: 'Review general characteristics',
  breadcrumb: 'General characteristics',
  specificQuestions: 'Key characteristic specific questions'
};

export default generalCharacteristics;
