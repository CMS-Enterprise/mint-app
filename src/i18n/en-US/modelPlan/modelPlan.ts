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
  abbreviation: {
    gqlField: 'abbreviation',
    goField: 'abbreviation',
    dbField: 'abbreviation',
    label: 'Short name',
    sublabel:
      'The abbreviation, acronym, or other common name used for the model.',
    dataType: 'string',
    formType: 'text'
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'What is the status of your Model Plan?',
    dataType: 'enum',
    formType: 'select',
    options: {
      PLAN_DRAFT: 'Draft model plan',
      PLAN_COMPLETE: 'Model plan complete',
      ICIP_COMPLETE: 'ICIP complete',
      INTERNAL_CMMI_CLEARANCE: 'Internal (CMMI) clearance',
      CMS_CLEARANCE: 'CMS clearance',
      HHS_CLEARANCE: 'HHS clearance',
      OMB_ASRF_CLEARANCE: 'OMB/ASRF clearance',
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
  heading: 'Update status',
  copy:
    'After you’ve iterated on your Model Plan, update the status so others know what stage it’s at in the design and clearance process.',
  updateButton: 'Update status',
  return: 'Don’t update status and return to task list'
};

export default modelPlan;
