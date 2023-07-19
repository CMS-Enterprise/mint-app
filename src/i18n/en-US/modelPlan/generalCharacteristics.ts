import { TranslationGeneralCharacteristics } from 'types/translation';

export const generalCharacteristics: TranslationGeneralCharacteristics = {
  isNewModel: {
    gqlField: 'isNewModel',
    goField: 'IsNewModel',
    dbField: 'is_new_model',
    question: 'Is this a new track of an existing model or a new model?',
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
    question: 'Which existing model?',
    hint: 'Start typing the name of the model',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'New model',
      false: 'New track of an existing model'
    }
  },
  resemblesExistingModel: {
    gqlField: 'resemblesExistingModel',
    goField: 'ResemblesExistingModel',
    dbField: 'resembles_existing_model',
    question: 'Does your proposed track/model resemble any existing models?',
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
    question:
      'Which existing models does your proposed track/model most closely resemble?',
    hint: 'Start typing the name of the model',
    multiSelectLabel: 'Selected models',
    dataType: 'string',
    formType: 'multiSelect',
    isArray: true
  },
  resemblesExistingModelHow: {
    gqlField: 'resemblesExistingModelHow',
    goField: 'ResemblesExistingModelHow',
    dbField: 'resembles_existing_model_how',
    question: 'In what way does the new model resemble the selected model(s)?',
    dataType: 'string',
    formType: 'textarea'
  },
  resemblesExistingModelNote: {
    gqlField: 'resemblesExistingModelNote',
    goField: 'ResemblesExistingModelNote',
    dbField: 'resembles_existing_model_note',
    question: 'Note',
    dataType: 'string',
    formType: 'textarea'
  },
  hasComponentsOrTracks: {
    gqlField: 'hasComponentsOrTracks',
    goField: 'HasComponentsOrTracks',
    dbField: 'has_components_or_tracks',
    question: 'Are there different components/tracks?',
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
    question: 'How do the tracks differ?',
    dataType: 'string',
    formType: 'textarea'
  },
  hasComponentsOrTracksNote: {
    gqlField: 'hasComponentsOrTracksNote',
    goField: 'HasComponentsOrTracksNote',
    dbField: 'has_components_or_tracks_note',
    question: 'Note',
    dataType: 'string',
    formType: 'textarea'
  }
};

export const generalCharacteristicsMisc: Record<string, string> = {
  heading: 'General characteristics',
  clearanceHeading: 'Review general characteristics',
  breadcrumb: 'General characteristics',
  newModel: 'New model',
  selectedKeyCharacteristics: 'Selected key characteristics',
  modelAPM:
    'What type of Alternative Payment Model (APM) do you think the model could be?',
  forQPP: 'For the Quality Payment Program (QPP)',
  keyCharacteristics:
    'What are the model key characteristics? Select all that apply.',
  keyCharacteristicsQuestion: 'What are the model key characteristics?'
  //   modelAPMType: 'What type of APM model?',
  //   apmTypes: {
  //     regularAPM: 'Regular APM',
  //     MIPSAPM: 'MIPS APM',
  //     advancedAPM: 'Advanced APM',
  //     notAPM: 'It is not an APM'
  //   },
  //   MIPSInfo:
  //     'In order to be considered by the Quality Payment Program (QPP), and to be MIPS or Advanced APM, you will need to collect TINs and NPIs for providers.',
  //   keyCharacteristicsTypes: {
  //     episodeBased: 'Episode-Based Model',
  //     partC: 'Medicare-Advantage (Part C) Model',
  //     partD: 'Part D Model',
  //     payment: 'Payment Model',
  //     population: 'Population-based Model',
  //     preventative: 'Preventative Model',
  //     service: 'Service Delivery Model',
  //     shared: 'Shared Savings Model',
  //     other: 'Other'
  //   },
  //   specificQuestions: 'Key characteristic specific questions',
  //   pleaseDescribe: 'Please describe the other key characteristics',
  //   reviewPlanBids: 'Will you review and collect plan bids?',
  //   manageEnrollment: 'Will you manage Part C/D enrollment?',
  //   updatedContract: 'Have you updated the plan’s contract?',
  //   careCoordination: 'Is care coordination involved?',
  //   additionalServices: 'Are additional services involved?',
  //   communityInvolved: 'Are community partners involved?',
  //   specificGeographies: 'Is the model targeted at specific geographies?',
  //   participationOptions:
  //     'Does the model offer different options for participation?',
  //   agreementType: 'What is the agreement type?',
  //   agreementNote:
  //     'Note: CMMI writes, Office of General Council (OGC) approves both types of agreements',
  //   moreParticipation: 'Will more than one participation agreement be needed?',
  //   agreementDepending:
  //     'depending on awardee selections or characteristics such as risk/type/size',
  //   participationAgreement: 'Participation Agreement',
  //   coopAgreement: 'Co-Operative Agreement/Grant',
  //   other: 'Other',
  //   geographyType: 'Geography type is',
  //   geographySpecify: 'Please specify what the other geography type is.',
  //   geoState: 'State',
  //   geoRegion: 'Region (CBSA, MSA, HRR, etc.)',
  //   geographyApplied: 'Geographies are applied to',
  //   geographyAppliedSpecify:
  //     'Please specify what the geographies are applied to.',
  //   geoParticipants: 'Participants',
  //   geoProviders: 'Providers',
  //   geoBeneficiaries: 'Beneficiaries',
  //   rulemakingRequired: 'Is rulemaking required?',
  //   authorityAllowed: 'What authority allows CMMI to test the model?',
  //   ACA3021: '3021 (ACA)',
  //   mandatedDemonstration: 'Congressionally Mandated Demonstration',
  //   section1833: 'Section 1833(e) (Part B services) of the Social Security Act',
  //   waiversRequired: 'Are waivers required?',
  //   ruleMakingInfo:
  //     'Which rule do you anticipate using and what is the target date of display for that regulation?',
  //   waiverTypes: 'Which types of waivers are required? Select all that apply.',
  //   waiverTypesQuestion: 'Which types of waivers are required?',
  //   fraudAndAbuse: 'Fraud and Abuse',
  //   fraudAndAbuseNote: '(Note: Federal Waiver team writes)',
  //   programPayment: 'Program/payment',
  //   programPaymentNote:
  //     '(Note: CMMI writes, Office of General Council (OGC) adivses, full clearance process is required)',
  //   medicaid: 'Medicaid',
  //   medicaidNote: '(1115, other)'
};

export default generalCharacteristics;
