import { TranslationModelPlan } from 'types/translation';

import {
  ModelViewFilter,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const modelPlan: TranslationModelPlan = {
  modelName: {
    gqlField: 'modelName',
    goField: 'ModelName',
    dbField: 'model_name',
    label: 'Model name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  previousName: {
    gqlField: 'previousName',
    goField: 'PreviousName',
    dbField: 'previous_name',
    label: 'Previous names',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.02
  },
  nameHistory: {
    gqlField: 'nameHistory',
    goField: 'NameHistory',
    dbField: 'name_history',
    label: 'Previous names',
    dataType: TranslationDataType.STRING,
    isArray: true,
    formType: TranslationFormType.TEXT,
    order: 1.03,
    filterGroups: [
      ModelViewFilter.OACT,
      ModelViewFilter.DFSDM,
      ModelViewFilter.CCW,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG,
      ModelViewFilter.MDM,
      ModelViewFilter.CBOSC
    ]
  },
  abbreviation: {
    gqlField: 'abbreviation',
    goField: 'Abbreviation',
    dbField: 'abbreviation',
    label: 'Short name',
    sublabel:
      'The abbreviation, acronym, or other common name used for the model.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.04
  },
  archived: {
    gqlField: 'archived',
    goField: 'Archived',
    dbField: 'archived',
    label: 'Archived',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.05,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'What is the status of your Model Plan?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 1.06,
    options: {
      PLAN_DRAFT: 'Draft Model Plan',
      PLAN_COMPLETE: 'Model Plan complete',
      ICIP_COMPLETE: 'ICIP complete',
      INTERNAL_CMMI_CLEARANCE: 'In internal (CMMI) clearance',
      CMS_CLEARANCE: 'In CMS clearance',
      HHS_CLEARANCE: 'In HHS clearance',
      OMB_ASRF_CLEARANCE: 'In OMB clearance',
      CLEARED: 'Cleared',
      ANNOUNCED: 'Announced',
      ACTIVE: 'Active',
      ENDED: 'Ended',
      PAUSED: 'Paused',
      CANCELED: 'Canceled'
    }
  },
  mtoReadyForReviewBy: {
    gqlField: 'mtoReadyForReviewBy',
    goField: 'MTOReadyForReviewBy',
    dbField: 'mto_ready_for_review_by',
    label: 'This section of the Model Plan (Model basics) is ready for review.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 3.13,
    tableReference: TableName.USER_ACCOUNT,
    hideFromReadonly: true
  },
  mtoReadyForReviewDts: {
    gqlField: 'mtoReadyForReviewDts',
    goField: 'MTOReadyForReviewDts',
    dbField: 'mto_ready_for_review_dts',
    label: 'Ready for review date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.14,
    hideFromReadonly: true
  }
};

export const modelPlanMisc: Record<string, string> = {
  heading: 'Model name',
  modelID: 'Model ID',
  createdBy: 'Created by',
  createdAt: 'Created at',
  readyForReviewBy: 'Ready for review by',
  readyForReviewAt: 'Ready for review at',
  breadcrumb: 'Start a new Model Plan',
  modeName: 'What is the name of your model?',
  modelNameInfo:
    'This is not a permanent name. If needed, you may update it later.',
  headingStatus: 'Update status',
  copy: 'As you iterate on your Model Plan, update the status of your model so others known what stage it’s at in the design and clearance process.',
  updateButton: 'Update status',
  return: 'Don’t update status and return to model collaboration area'
};

export default modelPlan;
