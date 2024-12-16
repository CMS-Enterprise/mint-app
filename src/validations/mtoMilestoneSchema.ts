import {
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator
} from 'gql/generated/graphql';
import i18next from 'i18next';
import * as Yup from 'yup';

const mtoMilestoneSchema = Yup.object().shape({
  isDraft: Yup.boolean().required(),
  name: Yup.string().required(),
  categories: Yup.object().shape({
    category: Yup.object().shape({
      id: Yup.string()
        .trim()
        .required()
        .notOneOf(
          ['default'],
          i18next.t('modelToOperationsMisc:validation.fillOut')
        )
    }),
    subCategory: Yup.object().shape({
      id: Yup.string()
        .trim()
        .required()
        .notOneOf(
          ['default'],
          i18next.t('modelToOperationsMisc:validation.fillOut')
        )
    })
  }),
  facilitatedBy: Yup.array().of(Yup.mixed<MtoFacilitator>().required()),
  needBy: Yup.string().optional(),
  status: Yup.mixed<MtoMilestoneStatus>().required(
    i18next.t('modelToOperationsMisc:validation.fillOut')
  ),
  riskIndicator: Yup.mixed<MtoRiskIndicator>().required(
    i18next.t('modelToOperationsMisc:validation.fillOut')
  )
});

export default mtoMilestoneSchema;
