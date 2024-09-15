import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, Label, TextInput } from '@trussworks/react-uswds';
import { ModelInfoContext } from 'contexts-wrappers/ModelInfoWrapper';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  DocumentType,
  useCreateDocumentSolutionLinksMutation
} from 'gql/generated/graphql';
import LinkNewPlanDocument from 'gql/operations/Documents/LinkNewPlanDocument';

import Alert from 'components/Alert';
import BooleanRadio from 'components/BooleanRadioForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import { RadioField } from 'components/RadioField';
import RequiredAsterisk from 'components/RequiredAsterisk';
import TextAreaField from 'components/TextAreaField';
import TextField from 'components/TextField';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { LinkingDocumentFormTypes } from 'types/files';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { DocumentLinkValidationSchema } from 'validations/documentUploadSchema';

const LinkDocument = ({
  solutionDetailsLink,
  solutionID
}: {
  solutionDetailsLink?: string;
  solutionID?: string;
}) => {
  const { t: documentsT } = useTranslation('documents');
  const { t: documentsMiscT } = useTranslation('documentsMisc');

  const { documentType: documentTypeConfig, restricted: restrictedConfig } =
    usePlanTranslation('documents');

  const { modelID } = useParams<{ modelID: string }>();
  const history = useHistory();

  const { showMessageOnNextPage } = useMessage();
  const formikRef = useRef<FormikProps<LinkingDocumentFormTypes>>(null);

  const { modelName } = useContext(ModelInfoContext);
  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);
  const [fileNameError, setFileNameError] = useState('');

  const [linkFile] = useMutation(LinkNewPlanDocument);

  const messageOnNextPage = (message: string, fileName: string) =>
    showMessageOnNextPage(
      <Alert type="success" slim className="margin-y-4" aria-live="assertive">
        <span className="mandatory-fields-alert__text">
          {documentsMiscT(message, {
            documentName: fileName,
            modelName
          })}
        </span>
      </Alert>
    );

  const [createSolutionLinks] = useCreateDocumentSolutionLinksMutation();

  // Uploads the document to s3 bucket and create document on BE
  const onSubmit = ({
    name,
    url,
    restricted,
    documentType,
    otherTypeDescription,
    optionalNotes
  }: LinkingDocumentFormTypes) => {
    linkFile({
      variables: {
        input: {
          modelPlanID: modelID,
          name,
          url,
          documentType: documentType!,
          restricted: restricted!,
          otherTypeDescription,
          optionalNotes
        }
      }
    })
      .then(response => {
        if (!response.errors) {
          // Checking if need to link new doc to existing solution
          if (
            solutionID &&
            solutionDetailsLink &&
            response?.data?.linkNewPlanDocument?.id
          ) {
            createSolutionLinks({
              variables: {
                solutionID,
                documentIDs: [response?.data?.linkNewPlanDocument?.id]
              }
            })
              .then(res => {
                if (res && !res.errors) {
                  messageOnNextPage('documentUploadSolutionSuccess', name);
                  history.push(solutionDetailsLink);
                } else if (response.errors) {
                  setFileNameError(name);
                  setMutationError(true);
                }
              })
              .catch(() => {
                setFileNameError(name);
                setMutationError(true);
                window.scrollTo(0, 0);
              });
          } else {
            messageOnNextPage('documentUploadSuccess', name);

            if (solutionDetailsLink) {
              history.push(solutionDetailsLink);
            } else {
              history.push(`/models/${modelID}/collaboration-area/documents`);
            }
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
        window.scrollTo(0, 0);
      });
  };

  return (
    <div>
      {mutationError && (
        <Alert type="error" slim>
          {documentsMiscT('documentLinkError', { fileName: fileNameError })}
        </Alert>
      )}

      <Formik
        initialValues={{
          url: '',
          name: '',
          documentType: null,
          restricted: null,
          otherTypeDescription: '',
          optionalNotes: ''
        }}
        onSubmit={onSubmit}
        validationSchema={DocumentLinkValidationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {(formikProps: FormikProps<LinkingDocumentFormTypes>) => {
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
              <div>
                <Form onSubmit={e => handleSubmit(e)}>
                  <FieldGroup scrollElement="url" error={!!flatErrors.url}>
                    <Label htmlFor="FileUpload-LinkDocument">
                      {documentsT('url.label')}
                      <RequiredAsterisk />
                    </Label>

                    <Label
                      htmlFor="FileUpload-LinkDocument"
                      hint
                      className="text-normal text-base margin-y-1"
                    >
                      {documentsT('url.sublabel')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.url}</FieldErrorMsg>

                    <Field
                      as={TextInput}
                      id="FileUpload-LinkDocument"
                      name="url"
                    />
                  </FieldGroup>

                  <FieldGroup scrollElement="name" error={!!flatErrors.name}>
                    <Label htmlFor="FileUpload-LinkFileName">
                      {documentsT('fileName.label')}
                      <RequiredAsterisk />
                    </Label>

                    <Label
                      htmlFor="FileUpload-LinkFileName"
                      hint
                      className="text-normal text-base margin-y-1"
                    >
                      {documentsT('fileName.sublabel')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.name}</FieldErrorMsg>

                    <Field
                      as={TextInput}
                      id="FileUpload-LinkFileName"
                      name="name"
                    />
                  </FieldGroup>

                  <FieldGroup
                    id="file-type"
                    scrollElement="documentType"
                    error={!!flatErrors.documentType}
                  >
                    <fieldset className="usa-fieldset margin-top-4">
                      <legend className="usa-label">
                        {documentsMiscT('whatType')}
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
                        !values.name ||
                        !values.url ||
                        !values.documentType ||
                        values.restricted === null ||
                        (values.documentType === DocumentType.OTHER &&
                          !values.otherTypeDescription.trim())
                      }
                      data-testid="link-document"
                    >
                      {documentsMiscT('submitButton')}
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

export default LinkDocument;
