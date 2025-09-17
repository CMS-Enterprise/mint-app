import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Label } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  DocumentType,
  useUploadNewPlanDocumentMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import BooleanRadio from 'components/BooleanRadioForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import FileUpload from 'components/FileUpload';
import { RadioField } from 'components/RadioField';
import RequiredAsterisk from 'components/RequiredAsterisk';
import TextAreaField from 'components/TextAreaField';
import TextField from 'components/TextField';
import toastSuccess from 'components/ToastSuccess';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { FileUploadForm, LinkingDocumentFormTypes } from 'types/files';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { DocumentUploadValidationSchema } from 'validations/documentUploadSchema';

const DocumentUpload = ({
  solutionDetailsLink,
  solutionID
}: {
  solutionDetailsLink?: string;
  solutionID?: string;
}) => {
  const { modelID = '' } = useParams<{ modelID: string }>();
  const navigate = useNavigate();
  const { t: documentsT } = useTranslation('documents');
  const { t: documentsMiscT } = useTranslation('documentsMisc');

  const { documentType: documentTypeConfig, restricted: restrictedConfig } =
    usePlanTranslation('documents');

  const { modelName } = useContext(ModelInfoContext);

  const [uploadFile, uploadFileStatus] = useUploadNewPlanDocumentMutation();

  // Uploads the document to s3 bucket and create document on BE
  const onSubmit = (values: FileUploadForm | LinkingDocumentFormTypes) => {
    const { file } = values as FileUploadForm;

    if (file && file.name && file.size >= 0 && file.type) {
      uploadFile({
        variables: {
          input: {
            modelPlanID: modelID,
            fileData: file,
            restricted: values.restricted!,
            documentType: values.documentType!,
            otherTypeDescription: values.otherTypeDescription,
            optionalNotes: values.optionalNotes
          }
        }
      }).then(response => {
        if (!response.errors) {
          toastSuccess(
            documentsMiscT('documentUploadSuccess', {
              documentName: file.name,
              modelName
            })
          );

          if (solutionDetailsLink) {
            navigate(solutionDetailsLink);
          } else {
            navigate(`/models/${modelID}/collaboration-area/documents`);
          }
        }
      });
    }
  };

  // Cast to any to avoid type errors. This is a common pattern for resolving React 19 compatibility issues with third-party libraries that haven't been updated yet.
  const MINTForm = Form as any;

  return (
    <div>
      <Formik
        initialValues={{
          file: null,
          url: null,
          name: null,
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
        {/* Formik types conflict with React 19 types */}
        {/* @ts-ignore */}
        {(formikProps: FormikProps<FileUploadForm>): React.ReactNode => {
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
                  heading={documentsMiscT('uploadError.heading')}
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
                <MINTForm
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    handleSubmit(e);
                    window.scrollTo(0, 0);
                  }}
                >
                  <FieldGroup scrollElement="file" error={!!flatErrors.file}>
                    <Label htmlFor="FileUpload-File">
                      {documentsMiscT('documentUpload')}
                      <RequiredAsterisk />
                    </Label>

                    <Label
                      htmlFor="FileUpload-File"
                      hint
                      className="text-normal text-base margin-y-1"
                    >
                      {documentsMiscT('fileTypes')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.file}</FieldErrorMsg>

                    <Field
                      as={FileUpload}
                      id="FileUpload-File"
                      name="file"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('file', e.currentTarget?.files?.[0]);
                      }}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      inputProps={{
                        'aria-expanded': !!values.file,
                        'aria-label':
                          values.file &&
                          `${documentsMiscT('documentUpload')} ${documentsMiscT(
                            'ariaLabelChangeFile'
                          )}`,
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
                      <legend className="usa-label">
                        {documentsT('documentType.label')}
                        <RequiredAsterisk />
                      </legend>

                      <FieldErrorMsg>{flatErrors.documentType}</FieldErrorMsg>
                      {getKeys(documentTypeConfig.options).map(documentType => {
                        return (
                          <Field
                            key={`FileUpload-${documentType}`}
                            as={RadioField}
                            checked={values.documentType === documentType}
                            id={`FileUpload-${documentType}`}
                            name="documentType"
                            label={documentTypeConfig.options[documentType]}
                            onChange={() => {
                              setFieldValue('documentType', documentType);
                              setFieldValue('otherTypeDescription', '');
                            }}
                            value={documentType}
                          />
                        );
                      })}
                      {values.documentType === DocumentType.OTHER && (
                        <div className="margin-left-4 margin-bottom-1">
                          <FieldGroup
                            scrollElement="otherTypeDescription"
                            error={!!flatErrors.otherTypeDescription}
                          >
                            <Label
                              htmlFor="FileUpload-OtherType"
                              className="margin-bottom-1"
                            >
                              {documentsT('otherType.label')}
                              <RequiredAsterisk />
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
                      {documentsT('restricted.label')}
                      <RequiredAsterisk />
                    </Label>

                    <p className="margin-0 line-height-body-4">
                      {documentsT('restricted.sublabel')}
                    </p>

                    <FieldErrorMsg>{flatErrors.restricted}</FieldErrorMsg>

                    <BooleanRadio
                      field="restricted"
                      id="document-upload-restricted"
                      value={values.restricted}
                      setFieldValue={setFieldValue}
                      options={restrictedConfig.options}
                    />

                    {values.restricted !== null && (
                      <Alert type="warning" slim>
                        {values.restricted
                          ? documentsMiscT('costWarningAssessment')
                          : documentsMiscT('costWarningAll')}
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
                      {documentsT('optionalNotes.label')}
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
                        {documentsMiscT('safetyScan')}
                      </span>
                    </Alert>
                    <Button
                      type="submit"
                      onClick={() => setErrors({})}
                      disabled={
                        isSubmitting ||
                        !values.file ||
                        !values.documentType ||
                        values.restricted === null ||
                        (values.documentType === DocumentType.OTHER &&
                          !values.otherTypeDescription.trim())
                      }
                      data-testid="upload-document"
                    >
                      {documentsMiscT('submitButton')}
                    </Button>
                  </div>
                </MINTForm>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default DocumentUpload;
