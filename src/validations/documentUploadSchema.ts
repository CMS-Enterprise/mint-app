import i18next from 'i18next';
import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const DocumentUploadValidationSchema: any = Yup.object().shape({
  file: Yup.mixed().nullable().required(i18next.t('documents:validation.file')),
  documentType: Yup.string()
    .nullable()
    .required(i18next.t('documents:validation.documentType')),
  restricted: Yup.bool()
    .nullable()
    .required(i18next.t('documents:validation.restricted')),
  otherTypeDescription: Yup.string().when('documentType', {
    is: 'OTHER',
    then: schema =>
      schema.trim().required(i18next.t('documents:validation.otherDescr'))
  })
});
