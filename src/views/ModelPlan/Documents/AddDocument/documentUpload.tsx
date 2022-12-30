import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, Fieldset, Label, Radio } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import FileUpload from 'components/FileUpload';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import useMessage from 'hooks/useMessage';
import { UploadNewPlanDocument as UploadNewPlanDocumentType } from 'queries/Documents/types/UploadNewPlanDocument';
import UploadNewPlanDocument from 'queries/Documents/UploadNewPlanDocument';
import { FileUploadForm } from 'types/files';
import { DocumentType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { translateDocumentType } from 'utils/modelPlan';
import { DocumentUploadValidationSchema } from 'validations/documentUploadSchema';

const DocumentUpload = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const history = useHistory();
  const { t } = useTranslation('documents');
  const { t: h } = useTranslation('draftModelPlan');
  const { showMessageOnNextPage } = useMessage();
  const formikRef = useRef<FormikProps<FileUploadForm>>(null);

  const [uploadFile, uploadFileStatus] = useMutation<UploadNewPlanDocumentType>(
    UploadNewPlanDocument
  );

  // Uploads the document to s3 bucket and create document on BE
  const onSubmit = (values: FileUploadForm) => {
    const { file } = values;

    if (file && file.name && file.size >= 0 && file.type) {
      uploadFile({
        variables: {
          input: {
            modelPlanID: modelID,
            fileData: file,
            restricted: values.restricted,
            documentType: values.documentType,
            otherTypeDescription: values.otherTypeDescription,
            optionalNotes: values.optionalNotes
          }
        }
      })
        .then(response => {
          if (!response.errors) {
            showMessageOnNextPage(
              <>
                <Alert
                  type="success"
                  slim
                  data-testid="mandatory-fields-alert"
                  className="margin-y-4"
                >
                  <span className="mandatory-fields-alert__text">
                    {t('documentUploadSuccess', {
                      documentName: file.name
                    })}
                  </span>
                </Alert>
              </>
            );
            history.push(`/models/${modelID}/documents`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          file: null,
          documentType: null,
          restricted: null,
          otherTypeDescription: '',
          optionalNotes: ''
        }}
        onSubmit={onSubmit}
        validationSchema={DocumentUploadValidationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {(formikProps: FormikProps<FileUploadForm>) => {
          const {
            errors,
            setErrors,
            setFieldValue,
            values,
            handleSubmit,
            isSubmitting
          } = formikProps;
          const flatErrors = flattenErrors(errors);
          return (
            <>
              {Object.keys(errors).length > 0 && (
                <ErrorAlert
                  testId="document-upload-errors"
                  classNames="margin-bottom-4 margin-top-4"
                  heading={t('uploadError.heading')}
                >
                  {Object.keys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={key}
                        message={flatErrors[key]}
                      />
                    );
                  })}
                </ErrorAlert>
              )}
              {uploadFileStatus.error && (
                <ErrorAlert heading="Error uploading document">
                  <ErrorAlertMessage
                    message={uploadFileStatus.error.message}
                    errorKey="accessibilityRequest"
                  />
                </ErrorAlert>
              )}
              <div>
                <Form
                  onSubmit={e => {
                    handleSubmit(e);
                    window.scrollTo(0, 0);
                  }}
                >
                  <FieldGroup scrollElement="file" error={!!flatErrors.file}>
                    <Label htmlFor="FileUpload-File">
                      {t('documentUpload')}
                    </Label>
                    <FieldErrorMsg>{flatErrors.file}</FieldErrorMsg>
                    <Field
                      as={FileUpload}
                      id="FileUpload-File"
                      name="file"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('file', e.currentTarget?.files?.[0]);
                      }}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      inputProps={{
                        'aria-expanded': !!values.file,
                        'aria-controls': 'file-type'
                      }}
                    />
                  </FieldGroup>
                  <FieldGroup
                    id="file-type"
                    scrollElement="documentType"
                    error={!!flatErrors.documentType}
                  >
                    <fieldset className="usa-fieldset margin-top-4">
                      <legend className="usa-label">{t('whatType')}</legend>
                      <FieldErrorMsg>{flatErrors.documentType}</FieldErrorMsg>
                      {(Object.keys(DocumentType) as Array<
                        keyof typeof DocumentType
                      >)
                        .filter(documentType => documentType !== 'OTHER') // Filter 'OTHER' to be last in the radio button list
                        .map(documentType => {
                          return (
                            <Field
                              key={`FileUpload-${documentType}`}
                              as={RadioField}
                              checked={values.documentType === documentType}
                              id={`FileUpload-${documentType}`}
                              name="documentType"
                              label={translateDocumentType(
                                documentType as DocumentType
                              )}
                              onChange={() => {
                                setFieldValue('documentType', documentType);
                                setFieldValue('otherTypeDescription', '');
                              }}
                              value={documentType}
                            />
                          );
                        })}
                      <Field
                        as={RadioField}
                        checked={values.documentType === 'OTHER'}
                        id="FileUpload-OTHER"
                        name="documentType"
                        label={translateDocumentType(DocumentType.OTHER)}
                        value="OTHER"
                      />
                      {values.documentType === 'OTHER' && (
                        <div className="width-card-lg margin-left-4 margin-bottom-1">
                          <FieldGroup
                            scrollElement="otherTypeDescription"
                            error={!!flatErrors.otherTypeDescription}
                          >
                            <Label
                              htmlFor="FileUpload-OtherType"
                              className="margin-bottom-1"
                            >
                              {t('documentKind')}
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors.otherTypeDescription}
                            </FieldErrorMsg>
                            <Field
                              as={TextField}
                              error={!!flatErrors.otherTypeDescription}
                              className="margin-top-0"
                              id="FileUpload-OtherTypeDescription"
                              name="otherTypeDescription"
                            />
                          </FieldGroup>
                        </div>
                      )}
                    </fieldset>
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="restricted"
                    error={!!flatErrors.restricted}
                  >
                    <Label
                      htmlFor="document-upload-restricted-yes"
                      className="maxw-none"
                    >
                      {t('costQuestion')}
                    </Label>

                    <p className="margin-0 line-height-body-4">
                      {t('costInfo')}
                    </p>

                    <FieldErrorMsg>{flatErrors.restricted}</FieldErrorMsg>
                    <Fieldset>
                      {[true, false].map(key => (
                        <Field
                          as={Radio}
                          key={key}
                          id={`document-upload-restricted-${key}`}
                          name="restricted"
                          label={key ? h('yes') : h('no')}
                          value={key ? 'YES' : 'NO'}
                          checked={values.restricted === key}
                          onChange={() => {
                            setFieldValue('restricted', key);
                          }}
                        />
                      ))}
                    </Fieldset>

                    {values.restricted !== null && (
                      <Alert type="warning" slim>
                        {values.restricted
                          ? t('costWarningAssessment')
                          : t('costWarningAll')}
                      </Alert>
                    )}
                  </FieldGroup>

                  <FieldGroup
                    id="optional-notes"
                    scrollElement="optionalNotes"
                    error={!!flatErrors.optionalNotes}
                  >
                    <Label
                      htmlFor="ModelPlanDocument-optionalNotes"
                      className="line-height-body-2"
                    >
                      {t('optionalNotes')}
                    </Label>
                    <Field
                      as={TextAreaField}
                      id="ModelPlanDocument-optionalNotes"
                      name="optionalNotes"
                      className="model-plan-document__optional-notes height-10"
                      error={!!flatErrors.optionalNotes}
                      maxLength={2000}
                    />
                  </FieldGroup>

                  <div className="padding-top-2 margin-top-2">
                    <Alert
                      type="info"
                      slim
                      data-testid="mandatory-fields-alert"
                      className="margin-bottom-4"
                    >
                      <span className="mandatory-fields-alert__text">
                        {t('safetyScan')}
                      </span>
                    </Alert>
                    <Button
                      type="submit"
                      onClick={() => setErrors({})}
                      disabled={isSubmitting || !values.file}
                      data-testid="upload-document"
                    >
                      {t('uploadButton')}
                    </Button>
                  </div>
                </Form>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default DocumentUpload;
