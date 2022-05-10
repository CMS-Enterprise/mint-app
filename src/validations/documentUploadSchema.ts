import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const DocumentUploadValidationSchema: any = Yup.object().shape({
  file: Yup.mixed().nullable().required('Choose a document to upload'),
  documentType: Yup.string()
    .nullable()
    .required('Select the type of document you are uploading'),
  otherTypeDescription: Yup.string().when('documentType', {
    is: 'OTHER',
    then: Yup.string().trim().required('Enter a document name')
  })
});
