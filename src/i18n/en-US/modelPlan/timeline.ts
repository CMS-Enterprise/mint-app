import { TranslationTimeline } from 'types/translation';

import {
  ModelViewFilter,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const timeline: TranslationTimeline = {
  completeICIP: {
    gqlField: 'completeICIP',
    goField: 'CompleteICIP',
    dbField: 'complete_icip',
    label: 'Complete ICIP',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.01,
    filterGroups: [ModelViewFilter.IPC]
  },
  clearanceStarts: {
    gqlField: 'clearanceStarts',
    goField: 'ClearanceStarts',
    dbField: 'clearance_starts',
    label: 'Clearance start date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.02,
    filterGroups: [ModelViewFilter.IPC]
  },
  clearanceEnds: {
    gqlField: 'clearanceEnds',
    goField: 'ClearanceEnds',
    dbField: 'clearance_ends',
    label: 'Clearance end date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.03,
    filterGroups: [ModelViewFilter.IPC]
  },
  announced: {
    gqlField: 'announced',
    goField: 'Announced',
    dbField: 'announced',
    label: 'Announce model',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.04,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  applicationsStart: {
    gqlField: 'applicationsStart',
    goField: 'ApplicationsStart',
    dbField: 'applications_starts',
    label: 'Application start date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.05,
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'applicationsEnd'
    },
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  applicationsEnd: {
    gqlField: 'applicationsEnd',
    goField: 'ApplicationsEnd',
    dbField: 'applications_ends',
    label: 'Application end date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.06,
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'applicationsStart'
    },
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  performancePeriodStarts: {
    gqlField: 'performancePeriodStarts',
    goField: 'PerformancePeriodStarts',
    dbField: 'performance_period_starts',
    label: 'Performance start date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.07,
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'performancePeriodEnds'
    },
    groupLabel: 'Performance period',
    groupLabelTooltip:
      'When the model will be active beginning with the go-live date',
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CCW,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  performancePeriodEnds: {
    gqlField: 'performancePeriodEnds',
    goField: 'PerformancePeriodEnds',
    dbField: 'performance_period_ends',
    label: 'Performance end date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.08,
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'performancePeriodStarts'
    },
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CCW,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  highLevelNote: {
    gqlField: 'highLevelNote',
    goField: 'HighLevelNote',
    dbField: 'high_level_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Timeline',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.09
  },
  wrapUpEnds: {
    gqlField: 'wrapUpEnds',
    goField: 'WrapUpEnds',
    dbField: 'wrap_up_ends',
    label: 'Model wrap-up end date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.1,
    filterGroups: [ModelViewFilter.IPC, ModelViewFilter.PBG]
  },
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label: 'This section of the Model Plan (Timeline) is ready for review.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 1.11,
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
    order: 1.12,
    hideFromReadonly: true
  },
  readyForClearanceBy: {
    gqlField: 'readyForClearanceBy',
    goField: 'ReadyForClearanceBy',
    dbField: 'ready_for_clearance_by',
    label: 'This section of the Model Plan (Timeline) is ready for clearance.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 1.13,
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
    order: 1.14,
    hideFromReadonly: true
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 1.15,
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    },
    hideFromReadonly: true
  }
};

// Miscellaneous translations outside scope of individual questions
export const timelineMisc: Record<string, string> = {
  heading: 'Model timeline',
  description:
    'Add all your essential model dates, such as when you anticipate completing your ICIP, going through clearance, announcing the model, and when it will be active. As you iterate on the plans for your model, please be sure to keep this space up-to-date.',
  needHelpDiscussion: 'Need help figuring out dates?',
  clearanceHeading: 'Review model timeline',
  previousNames: 'Previous model names',
  validDate: 'Please use a valid date format',
  highLevelTimeline: 'Anticipated high level timeline',
  clearance: 'Clearance',
  clearanceInfo:
    'When the model anticipates beginning internal (CMMI) clearance through completion of OMB clearance',
  applicationPeriod: 'Application period',
  demonstrationPerformance: 'Performance period',
  demonstrationPerformanceInfo:
    'When the model will be active beginning with the go-live date',
  milestonesInfo:
    'Please be sure that the dates listed here are updated in the clearance calendar, if applicable. Contact the MINT Team at {{-email}} if you have any questions.',
  dontUpdate: 'Don’t update and return to model collaboration area'
};

export default timeline;
