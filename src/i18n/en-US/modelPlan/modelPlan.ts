import { ModelViewFilter } from 'gql/gen/graphql';

import { TranslationModelPlan } from 'types/translation';

export const modelPlan: TranslationModelPlan = {
  modelName: {
    gqlField: 'modelName',
    goField: 'ModelName',
    dbField: 'model_name',
    label: 'Model name',
    dataType: 'string',
    formType: 'text'
  },
  previousName: {
    gqlField: 'previousName',
    goField: 'PreviousName',
    dbField: 'previous_name',
    label: 'Previous names',
    dataType: 'string',
    formType: 'text'
  },
  nameHistory: {
    gqlField: 'nameHistory',
    goField: 'NameHistory',
    dbField: 'name_history',
    label: 'Previous names',
    dataType: 'string',
    isArray: true,
    formType: 'text',
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
    dataType: 'string',
    formType: 'text'
  },
  archived: {
    gqlField: 'archived',
    goField: 'Archived',
    dbField: 'archived',
    label: 'Archived',
    dataType: 'boolean',
    formType: 'radio',
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
    dataType: 'enum',
    formType: 'select',
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
  copy:
    'After you’ve iterated on your Model Plan, update the status so others know what stage it’s at in the design and clearance process.',
  updateButton: 'Update status',
  return: 'Don’t update status and return to task list'
};

export default modelPlan;
