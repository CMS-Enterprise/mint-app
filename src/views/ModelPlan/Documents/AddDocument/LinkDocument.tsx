import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  Fieldset,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { RadioField } from 'components/shared/RadioField';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import useMessage from 'hooks/useMessage';
import LinkNewPlanDocument from 'queries/Documents/LinkNewPlanDocument';
import { LinkNewPlanDocument as LinkNewPlanDocumentType } from 'queries/Documents/types/LinkNewPlanDocument';
// import CreateDocumentSolutionLinks from 'queries/ITSolutions/CreateDocumentSolutionLinks';
// import { CreateDocumentSolutionLinksVariables } from 'queries/ITSolutions/types/CreateDocumentSolutionLinks';
import { LinkingDocumentFormTypes } from 'types/files';
import { DocumentType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { translateDocumentType } from 'utils/modelPlan';
import { DocumentLinkValidationSchema } from 'validations/documentUploadSchema';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

const LinkDocument = ({
  solutionDetailsLink,
  solutionID
}: {
  solutionDetailsLink?: string;
  solutionID?: string;
}) => {
  const { modelID } = useParams<{ modelID: string }>();
  const history = useHistory();
  const { t } = useTranslation('documents');
  const { t: h } = useTranslation('draftModelPlan');

  const { showMessageOnNextPage } = useMessage();
  const formikRef = useRef<FormikProps<LinkingDocumentFormTypes>>(null);

  const { modelName } = useContext(ModelInfoContext);
  // State management for mutation errors
  // const [mutationError, setMutationError] = useState<boolean>(false);

  const [linkFile] = useMutation<LinkNewPlanDocumentType>(LinkNewPlanDocument);

  const messageOnNextPage = (message: string, fileName: string) =>
    showMessageOnNextPage(
      <Alert type="success" slim className="margin-y-4" aria-live="assertive">
        <span className="mandatory-fields-alert__text">
          {t(message, {
            documentName: fileName,
            modelName
          })}
        </span>
      </Alert>
    );

  // const [
  //   createSolutionLinks
  // ] = useMutation<CreateDocumentSolutionLinksVariables>(
  //   CreateDocumentSolutionLinks
  // );

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
          documentType,
          restricted,
          otherTypeDescription,
          optionalNotes
        }
      }
    })
      .then(response => {
        if (!response.errors) {
          messageOnNextPage('documentUploadSuccess', name);

          history.push(`/models/${modelID}/documents`);
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  return (
    <div>
      {/* {mutationError && (
        <Alert type="error" slim>
          {t('documentLinkError')}
        </Alert>
      )} */}

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
              <div>
                <Form
                  onSubmit={e => {
                    handleSubmit(e);
                    window.scrollTo(0, 0);
                  }}
                >
                  <FieldGroup scrollElement="url" error={!!flatErrors.url}>
                    <Label htmlFor="FileUpload-LinkDocument">
                      {t('linkDocument.linkLabel')}
                      <RequiredAsterisk />
                    </Label>

                    <Label
                      htmlFor="FileUpload-LinkDocument"
                      hint
                      className="text-normal text-base margin-y-1"
                    >
                      {t('linkDocument.linkHelpText')}
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
                      {t('linkDocument.fileNameLabel')}
                      <RequiredAsterisk />
                    </Label>

                    <Label
                      htmlFor="FileUpload-LinkFileName"
                      hint
                      className="text-normal text-base margin-y-1"
                    >
                      {t('linkDocument.fileNameHelpText')}
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
                        {t('whatType')}
                        <RequiredAsterisk />
                      </legend>
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
                        <div className="margin-left-4 margin-bottom-1">
                          <FieldGroup
                            scrollElement="otherTypeDescription"
                            error={!!flatErrors.otherTypeDescription}
                          >
                            <Label
                              htmlFor="FileUpload-OtherType"
                              className="margin-bottom-1"
                            >
                              {t('documentKind')}
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
                      {t('costQuestion')}
                      <RequiredAsterisk />
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
                      {t('submitButton')}
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
