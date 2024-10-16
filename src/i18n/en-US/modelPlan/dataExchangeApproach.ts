import { TranslationDataExchangeApproach } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const dataExchangeApproach: TranslationDataExchangeApproach = {
  // Page 2
  dataToCollectFromParticipants: {
    gqlField: 'dataToCollectFromParticipants',
    goField: 'DataToCollectFromParticipants',
    dbField: 'data_to_collect_from_participants',
    label: 'What data will you collect from participants?',
    sublabel:
      'Please select all that apply. Depending on your selections, there may be follow-up questions.',
    multiSelectLabel: 'Selected data types',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 1.01,
    options: {
      BANKING_INFORMATION_TO_MAKE_NON_CLAIMS_BASED_PAYMENTS:
        'Banking information to make non-claims-based payments',
      CLINICAL_DATA: 'Clinical data',
      COLLECT_BIDS_AND_PLAN_INFORMATION:
        'Collect bids and plan information (MAPD)',
      COOPERATIVE_AGREEMENT_APPLICATION: 'Cooperative Agreement Application',
      DECARBONIZATION_DATA: 'Decarbonization data',
      EXPANDED_DEMOGRAPHICS_DATA: 'Expanded demographics data',
      FEE_FOR_SERVICE_CLAIMS_AND_APPLY_MODEL_RULES:
        'Fee-for-Service (FFS) claims and apply model rules',
      LEARNING_SYSTEM_METRICS: 'Learning system metrics',
      PARTICIPANT_AGREEMENT: 'Participant Agreement',
      PARTICIPANT_AGREEMENT_LETTER_OF_INTENT:
        'Participant Agreement Letter of Intent',
      PARTICIPANT_AGREEMENT_REQUEST_FOR_APPLICATION:
        'Participant Agreement Request for Application',
      PARTICIPANT_REPORTED_DATA: 'Participant reported data',
      PARTICIPANT_REPORTED_QUALITY_MEASURES:
        'Participant reported quality measures',
      PROVIDER_PARTICIPANT_ROSTER: 'Provider roster / participant roster',
      REPORTS_FROM_PARTICIPANTS: 'Reports from participants (please specify)',
      SOCIAL_DETERMINANTS_OF_HEALTH: 'Social Determinants of Health',
      SURVEY: 'Survey',
      OTHER: 'Other (please specify)'
    },
    optionsLabels: {
      FEE_FOR_SERVICE_CLAIMS_AND_APPLY_MODEL_RULES:
        '(e.g., reduce FFS payment)',
      LEARNING_SYSTEM_METRICS: '(e.g., # of learning events)',
      PARTICIPANT_REPORTED_DATA: '(e.g., unique model metrics)',
      REPORTS_FROM_PARTICIPANTS: '(e.g., health equity report)'
    },
    readonlyOptions: {
      REPORTS_FROM_PARTICIPANTS: 'Reports from participants',
      OTHER: 'Other'
    }
  },
  dataToCollectFromParticipantsReportsDetails: {
    gqlField: 'dataToCollectFromParticipantsReportsDetails',
    goField: 'DataToCollectFromParticipantsReportsDetails',
    dbField: 'data_to_collect_from_participants_reports_details',
    label: 'Please specify what reports you’ll collect from participants.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.02,
    isOtherType: true,
    otherParentField: 'dataToCollectFromParticipants'
  },
  dataToCollectFromParticipantsOther: {
    gqlField: 'dataToCollectFromParticipantsOther',
    goField: 'DataToCollectFromParticipantsOther',
    dbField: 'data_to_collect_from_participants_other',
    label: 'Please specify what other data you’ll collect from participants.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.03,
    isOtherType: true,
    otherParentField: 'dataToCollectFromParticipants'
  },
  dataWillNotBeCollectedFromParticipants: {
    gqlField: 'dataWillNotBeCollectedFromParticipants',
    goField: 'DataWillNotBeCollectedFromParticipants',
    dbField: 'data_will_not_be_collected_from_participants',
    label: 'Data will not be collected from participants',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 1.04,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  dataToCollectFromParticipantsNote: {
    gqlField: 'dataToCollectFromParticipantsNote',
    goField: 'DataToCollectFromParticipantsNote',
    dbField: 'data_to_collect_from_participants_note',
    label: 'Notes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.05
  },
  dataToSendToParticipants: {
    gqlField: 'dataToSendToParticipants',
    goField: 'DataToSendToParticipants',
    dbField: 'data_to_send_to_participants',
    label: 'What data will you send to participants?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 1.06,
    options: {
      DATA_FEEDBACK_DASHBOARD: 'Data feedback dashboard',
      NON_CLAIMS_BASED_PAYMENTS: 'Non-claims based payments',
      OPERATIONS_DATA: 'Operations data',
      PARTIALLY_ADJUSTED_CLAIMS_DATA: 'Partially adjudicated claims data',
      RAW_CLAIMS_DATA: 'Raw claims data',
      DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS:
        'Data will not be sent to participants'
    },
    optionsLabels: {
      OPERATIONS_DATA: '(e.g., attribution file, benchmark file)'
    }
  },
  dataToSendToParticipantsNote: {
    gqlField: 'dataToSendToParticipantsNote',
    goField: 'DataToSendToParticipantsNote',
    dbField: 'data_to_send_to_participants_note',
    label: 'Notes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.07
  },
  //   Page 3
  doesNeedToMakeMultiPayerDataAvailable: {
    gqlField: 'doesNeedToMakeMultiPayerDataAvailable',
    goField: 'DoesNeedToMakeMultiPayerDataAvailable',
    dbField: 'does_need_to_make_multi_payer_data_available',
    label: 'Do you need to make multi-payer data available to participants?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 2.01,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () => dataExchangeApproach.anticipatedMultiPayerDataAvailabilityUseCase
      ]
    }
  },
  anticipatedMultiPayerDataAvailabilityUseCase: {
    gqlField: 'anticipatedMultiPayerDataAvailabilityUseCase',
    goField: 'AnticipatedMultiPayerDataAvailabilityUseCase',
    dbField: 'anticipated_multi_payer_data_availability_use_case',
    label: 'If so, what use case do you anticipate?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 2.02,
    options: {
      MORE_COMPETENT_ALERT_DISCHARGE_TRANSFER_NOTIFICATION:
        'More complete alert/discharge/transfer notification',
      SUPPLY_MULTI_PAYER_CLAIMS_COST_UTIL_AND_QUALITY_REPORTING:
        'Supply multi-payer claims cost, utilization, and quality reporting',
      FILL_GAPS_IN_CARE_ALERTING_AND_REPORTS:
        'Fill gaps in care alerting and reports'
    },
    parentRelation: () =>
      dataExchangeApproach.doesNeedToMakeMultiPayerDataAvailable
  },
  doesNeedToMakeMultiPayerDataAvailableNote: {
    gqlField: 'doesNeedToMakeMultiPayerDataAvailableNote',
    goField: 'DoesNeedToMakeMultiPayerDataAvailableNote',
    dbField: 'does_need_to_make_multi_payer_data_available_note',
    label: 'Notes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 2.03
  },
  doesNeedToCollectAndAggregateMultiSourceData: {
    gqlField: 'doesNeedToCollectAndAggregateMultiSourceData',
    goField: 'DoesNeedToCollectAndAggregateMultiSourceData',
    dbField: 'does_need_to_collect_and_aggregate_multi_source_data',
    label:
      'Do you need to collect and aggregate multi-source data for analyses by the model team and implementation contractor?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 2.04,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [() => dataExchangeApproach.multiSourceDataToCollect]
    }
  },
  multiSourceDataToCollect: {
    gqlField: 'multiSourceDataToCollect',
    goField: 'MultiSourceDataToCollect',
    dbField: 'multi_source_data_to_collect',
    label: 'If so, what data do you need to collect and aggregate?',
    sublabel:
      'Please select all that apply. Depending on your selections, there may be follow-up questions.',
    multiSelectLabel: 'Selected data types',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 2.05,
    options: {
      COMMERCIAL_CLAIMS: 'Commercial claims',
      LAB_DATA: 'Lab data',
      MANUFACTURER: 'Manufacturer',
      MEDICAID_CLAIMS: 'Medicaid claims',
      MEDICARE_CLAIMS: 'Medicare claims',
      PATIENT_REGISTRY: 'Patient registry',
      OTHER: 'Other (please specify)'
    },
    readonlyOptions: {
      OTHER: 'Other'
    },
    parentRelation: () =>
      dataExchangeApproach.doesNeedToCollectAndAggregateMultiSourceData
  },
  multiSourceDataToCollectOther: {
    gqlField: 'multiSourceDataToCollectOther',
    goField: 'MultiSourceDataToCollectOther',
    dbField: 'multi_source_data_to_collect_other',
    label: 'Please specify the other data you need to collect and aggregate.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 2.06,
    isOtherType: true,
    otherParentField: 'multiSourceDataToCollect'
  },
  doesNeedToCollectAndAggregateMultiSourceDataNote: {
    gqlField: 'doesNeedToCollectAndAggregateMultiSourceDataNote',
    goField: 'DoesNeedToCollectAndAggregateMultiSourceDataNote',
    dbField: 'does_need_to_collect_and_aggregate_multi_source_data_note',
    label: 'Notes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 2.07
  },
  // Page 4
  willImplementNewDataExchangeMethods: {
    gqlField: 'willImplementNewDataExchangeMethods',
    goField: 'WillImplementNewDataExchangeMethods',
    dbField: 'will_implement_new_data_exchange_methods',
    label:
      'Do you plan to implement any new or novel data exchange methods based on new technologies or policy initiatives?',
    sublabel:
      'If so, please describe. If you aren’t sure, it is OK to leave blank.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 3.01,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  newDataExchangeMethodsDescription: {
    gqlField: 'newDataExchangeMethodsDescription',
    goField: 'NewDataExchangeMethodsDescription',
    dbField: 'new_data_exchange_methods_description',
    label: 'Please describe',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.02,
    isOtherType: true,
    otherParentField: 'willImplementNewDataExchangeMethods'
  },
  newDataExchangeMethodsNote: {
    gqlField: 'newDataExchangeMethodsNote',
    goField: 'NewDataExchangeMethodsNote',
    dbField: 'new_data_exchange_methods_note',
    label: 'Notes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.03
  },
  additionalDataExchangeConsiderationsDescription: {
    gqlField: 'additionalDataExchangeConsiderationsDescription',
    goField: 'AdditionalDataExchangeConsiderationsDescription',
    dbField: 'additional_data_exchange_considerations_description',
    label: 'Please describe any additional data exchange considerations.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.04
  },
  isDataExchangeApproachComplete: {
    gqlField: 'isDataExchangeApproachComplete',
    goField: 'IsDataExchangeApproachComplete',
    dbField: 'is_data_exchange_approach_complete',
    label: 'Data exchange approach status',
    sublabel:
      'This will alert interested parties about your data exchange approach. You can still edit this after it’s marked complete.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 3.07,
    options: {
      true: 'This data exchange approach is complete.',
      false: 'No'
    }
  },
  markedCompleteBy: {
    gqlField: 'markedCompleteBy',
    goField: 'MarkedCompleteBy',
    dbField: 'marked_complete_by',
    label: 'Completed by',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.05,
    tableReference: TableName.USER_ACCOUNT,
    hideFromReadonly: true
  },
  markedCompleteDts: {
    gqlField: 'markedCompleteDts',
    goField: 'MarkedCompleteDts',
    dbField: 'marked_complete_dts',
    label: 'Completed at',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.06,
    hideFromReadonly: true
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 5.22,
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      COMPLETE: 'Complete'
    },
    hideFromReadonly: true
  }
};

export const dataExchangeApproachMisc = {
  heading: 'Data Exchange Approach',
  forModel: 'for {{ modelName }}',
  description:
    'Exchanging data is an essential component of model operations and can take many forms depending on policy goals, implementation needs, and participants in the model. Examples of data that are typically exchanged include CMS sharing data with participants (for example, claims data) or participants sharing quality data (for example, a new measure or patient-reported outcome). We often collect health-related social needs data, such as socio-demographic data. Some models may have more complex needs or could be avenues to explore broader HHS policy initiatives around data exchange. ',
  needHelpDiscussion: 'Need help with your data exchange approach?',
  aboutCompletingDataExchange: {
    heading: 'About completing the data exchange approach',
    description:
      'This set of questions aims to introduce data exchange early into model design and serve as a starting point for conversations with CMMI operational teams, recognizing that data exchange needs will evolve throughout model design and implementation. You may not be able to answer all of these questions immediately, but continuing to add and update any content as you continue iterating on your model will help with data exchange approach considerations.',
    whyDoINeedThisForm: 'Why do I need to complete this form?',
    whyDoINeedThisFormItems: [
      'In the past, models have encountered difficulty with approaches for exchanging data with participants. Considering data approaches earlier in the process can help identify concerns, mitigate risks, and save costs.',
      'Considering approaches for data exchange will help prepare for complicated data exchange scenarios once the model is active.',
      'Completing these questions will help BSG and CMMI identify any novel data exchange approaches in order to have feasibility conversations and/or prepare for considerations during clearance.',
      'Examining data exchange approaches will help determine IT and technology needs.'
    ],
    whosInvolved: 'Who’s involved',
    whosInvolvedDescription:
      'Work with your IT Lead or a Solution Architect from the Business Services Group (BSG) to determine how you’ll exchange data so that BSG and CMMI can help with new policy or technology opportunities. Reach out to the MINT Team or BSG if your model does not have an assigned IT Lead or Solution Architect. If you have questions about this form, please reach out to William Gordon or Todd Couts.',
    modelTeam: 'Model team',
    modelTeamDescription:
      'Model leads or model team members responsible for data-centric activities should work with the IT Lead or Solution Architect to complete the questions in this approach.',
    itLead: 'IT Lead/Solution Architect',
    email: 'Email the MINT Team',
    noLeadAssigned: 'No IT Lead or Solution Architect assigned',
    pleaseContactBSG:
      'Please contact BSG to work with a Solution Architect or assign an IT Lead.'
  },
  collectingAndSendingData: {
    heading: 'Collecting and sending data',
    dataSpecific: 'Data-specific questions'
  },
  collectionAndAggregation: {
    heading: 'Multi-payer data and multi-source collection and aggregation',
    dataSpecific: 'Data-specific questions'
  },
  newMethodologiesAndConsiderations: {
    heading: 'New methodologies and additional considerations',
    dataSpecific: 'Data-specific questions',
    additionalDetails: {
      heading: 'Additional details',
      examplesInclude: 'Examples of novel data exchange methodologies include:',
      examples: [
        '<link1>Privacy-preserving record linkage (PPRL) [cdcfoundation.org]<link1>',
        'Utilizing the <link1>Trusted Exchange Framework and Common Agreement (TEFCA) [healthit.gov]<link1>',
        'Enabling an additional data stream not previously used at CMMI'
      ]
    },
    alert:
      'Once you feel your data exchange approach is in a good place, update the status to "Complete" below, and someone from BSG will contact you to discuss it.'
  }
};

export default dataExchangeApproach;
