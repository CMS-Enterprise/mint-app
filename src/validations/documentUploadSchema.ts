import i18next from 'i18next';
import * as Yup from 'yup';

export const DocumentUploadValidationSchema: any = Yup.object().shape({
  file: Yup.mixed()
    .nullable()
    .required(i18next.t('documentsMisc:validation.file')),
  documentType: Yup.string()
    .nullable()
    .required(i18next.t('documentsMisc:validation.documentType')),
  restricted: Yup.bool()
    .nullable()
    .required(i18next.t('documentsMisc:validation.restricted')),
  otherTypeDescription: Yup.string().when('documentType', {
    is: 'OTHER',
    then: schema =>
      schema.trim().required(i18next.t('documentsMisc:validation.otherDescr'))
  })
});

export const DocumentLinkValidationSchema: any = Yup.object().shape({
  url: Yup.string()
    .url(i18next.t('documentsMisc:validation.url'))
    .nullable()
    .required(i18next.t('documentsMisc:validation.link')),
  name: Yup.mixed()
    .nullable()
    .required(i18next.t('documentsMisc:validation.otherDescr')),
  documentType: Yup.string()
    .nullable()
    .required(i18next.t('documentsMisc:validation.documentType')),
  restricted: Yup.bool()
    .nullable()
    .required(i18next.t('documentsMisc:validation.restricted')),
  otherTypeDescription: Yup.string().when('documentType', {
    is: 'OTHER',
    then: schema =>
      schema.trim().required(i18next.t('documentsMisc:validation.otherDescr'))
  })
});
