import { TranslationModelPlanMTOTemplateLinkCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const modelPlanMtoTemplateLink: TranslationModelPlanMTOTemplateLinkCustom =
  {
    modelPlanID: {
      gqlField: 'modelPlanID',
      goField: 'ModelPlanID',
      dbField: 'model_plan_id',
      label: 'Model Plan',
      dataType: TranslationDataType.UUID,
      formType: TranslationFormType.SELECT,
      order: 1.01,
      tableReference: TableName.MODEL_PLAN
    },
    templateID: {
      gqlField: 'templateID',
      goField: 'TemplateID',
      dbField: 'template_id',
      label: 'MTO Template',
      sublabel: 'The template that was applied to this model plan',
      dataType: TranslationDataType.UUID,
      formType: TranslationFormType.SELECT,
      order: 1.02,
      tableReference: TableName.MTO_TEMPLATE
    },
    appliedDate: {
      gqlField: 'appliedDate',
      goField: 'AppliedDate',
      dbField: 'applied_date',
      label: 'Applied Date',
      sublabel: 'Date when this template was applied to the model plan',
      dataType: TranslationDataType.DATE,
      formType: TranslationFormType.DATEPICKER,
      order: 1.03
    }
  };

export const modelPlanMtoTemplateLinkMisc = {
  applyTemplate: {
    title: 'Apply MTO Template',
    subtitle: 'Select a template to apply to this model plan',
    cta: 'Apply template',
    success:
      'You successfully applied the <bold>{{-templateName}}</bold> template to this model plan.',
    error: 'There was an issue applying the template to this model plan.'
  },
  removeTemplate: {
    title: 'Remove MTO Template',
    subtitle:
      'Are you sure you want to remove this template from the model plan?',
    text: 'This will remove the template link but will not delete any milestones or solutions that were created from the template.',
    cta: 'Remove template',
    success:
      'You successfully removed the <bold>{{-templateName}}</bold> template from this model plan.',
    error: 'There was an issue removing the template from this model plan.'
  },
  templateApplied: 'Template applied on {{-date}}',
  noTemplateApplied: 'No template has been applied to this model plan',
  cancel: 'Cancel'
};

export default modelPlanMtoTemplateLink;
