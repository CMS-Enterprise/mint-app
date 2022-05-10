import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Label } from '@trussworks/react-uswds';
import axios from 'axios';
import { Field, Form, Formik, FormikProps } from 'formik';
import { isUndefined } from 'lodash';

import FileUpload from 'components/FileUpload';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { RadioField } from 'components/shared/RadioField';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import TextField from 'components/shared/TextField';
import { useMessage } from 'hooks/useMessage';
import flattenErrors from 'utils/flattenErrors';
import { translateDocumentCommonType } from 'utils/modelPlan';
import { DocumentUploadValidationSchema } from 'validations/documentUploadSchema';

const NewUpload = () => {
  const history = useHistory();
  const { t } = useTranslation('documents');

  const { showMessageOnNextPage } = useMessage();

  const documentTypes = t('documentTypes', {
    returnObjects: true
  });

  //   const { accessibilityRequestId } = useParams<{
  //     accessibilityRequestId: string;
  //   }>();
  //   const { loading, error, data } = useQuery<GetAccessibilityRequest>(
  //     GetAccessibilityRequestQuery,
  //     {
  //       variables: {
  //         id: accessibilityRequestId
  //       }
  //     }
  //   );

  //   const [s3URL, setS3URL] = useState('');
  //   const [
  //     generateURL,
  //     generateURLStatus
  //   ] = useMutation<GeneratePresignedUploadURL>(GeneratePresignedUploadURLQuery);
  //   const [createDocument, createDocumentStatus] = useMutation<
  //     CreateAccessibilityRequestDocument,
  //     CreateAccessibilityRequestDocumentVariables
  //   >(CreateAccessibilityRequestDocumentQuery);

  //   const [
  //     isErrorGeneratingPresignedUrl,
  //     setErrorGeneratingPresignedUrl
  //   ] = useState(false);

  //   if (loading) {
  //     return <PageLoading />;
  //   }

  //   if (error) {
  //     return <div>{error.message}</div>;
  //   }

  //   if (!data) {
  //     return (
  //       <div>{`No request found matching id: ${accessibilityRequestId}`}</div>
  //     );
  //   }

  //   if (data.accessibilityRequest?.statusRecord.status === 'DELETED') {
  //     return <RequestDeleted />;
  //   }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const file = event?.currentTarget?.files?.[0];
    // if (!file) {
    //   return;
    // }
    // generateURL({
    //   variables: {
    //     input: {
    //       fileName: file?.name,
    //       mimeType: file?.type,
    //       size: file?.size
    //     }
    //   }
    // })
    //   .then(result => {
    //     const url = result.data?.generatePresignedUploadURL?.url;
    //     if (
    //       generateURLStatus.error ||
    //       result.data?.generatePresignedUploadURL?.userErrors ||
    //       isUndefined(url)
    //     ) {
    //       // eslint-disable-next-line
    //     console.error('Could not fetch presigned S3 URL');
    //     } else {
    //       setS3URL(url || '');
    //     }
    //   })
    //   .catch(() => {
    //     setErrorGeneratingPresignedUrl(true);
    //   });
  };

  const onSubmit = (values: FileUploadForm) => {
    // const { file } = values;
    // if (file && file.name && file.size >= 0 && file.type) {
    //   const options = {
    //     headers: {
    //       'Content-Type': file.type
    //     }
    //   };
    //   axios.put(s3URL, values.file, options).then(() => {
    //     createDocument({
    //       variables: {
    //         input: {
    //           mimeType: file.type,
    //           size: file.size,
    //           name: file.name,
    //           url: s3URL,
    //           requestID: accessibilityRequestId,
    //           commonDocumentType: values.documentType
    //             .commonType as AccessibilityRequestDocumentCommonType,
    //           otherDocumentTypeDescription: values.documentType.otherType
    //         }
    //       }
    //     })
    //       .then(response => {
    //         if (!response.errors) {
    //           showMessageOnNextPage(
    //             `${file.name} uploaded to ${data?.accessibilityRequest?.name}`
    //           );
    //           history.push(`/508/requests/${accessibilityRequestId}/documents`);
    //         }
    //       })
    //       .catch(() => {
    //         setErrorGeneratingPresignedUrl(true);
    //       });
    //   });
    // }
  };

  return (
    <div>
      <Formik
        initialValues={{
          file: null,
          documentType: {
            commonType: null,
            otherType: ''
          }
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
                  heading="There is a problem"
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
              {/* {isErrorGeneratingPresignedUrl && (
                  <Alert
                    type="error"
                    heading={t('uploadDocument.presignedUrlErrorHeader')}
                  >
                    {t('uploadDocument.presignedUrlErrorBody')}
                  </Alert>
                )}
                {createDocumentStatus.error && (
                  <ErrorAlert heading="Error uploading document">
                    <ErrorAlertMessage
                      message={createDocumentStatus.error.message}
                      errorKey="accessibilityRequest"
                    />
                  </ErrorAlert>
                )}
                <PageHeading>
                  Upload a document to {data?.accessibilityRequest?.name}
                </PageHeading> */}
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
                        onChange(e);
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
                    scrollElement="documentType.commonType"
                    error={!!flatErrors['documentType.commonType']}
                  >
                    <fieldset className="usa-fieldset margin-top-4">
                      <legend className="usa-label">{t('whatType')}</legend>
                      <FieldErrorMsg>
                        {flatErrors['documentType.commonType']}
                      </FieldErrorMsg>
                      {[
                        'CONCEPT_PAPER',
                        'POLICY_PAPER',
                        'ICIP_DRAFT',
                        'MARKET_RESEARCH',
                        'OTHER'
                      ].map(documentType => {
                        return (
                          <Field
                            key={`FileUpload-CommonType${documentType}`}
                            as={RadioField}
                            checked={
                              values.documentType.commonType === documentType
                            }
                            id={`FileUpload-CommonType${documentType}`}
                            name="documentType.commonType"
                            label={translateDocumentCommonType(documentType)}
                            onChange={() => {
                              setFieldValue(
                                'documentType.commonType',
                                documentType
                              );
                              setFieldValue('documentType.otherType', '');
                            }}
                            value={documentType}
                          />
                        );
                      })}
                      {values.documentType.commonType === 'OTHER' && (
                        <div className="width-card-lg margin-left-4 margin-bottom-1">
                          <FieldGroup
                            scrollElement="documentType.otherType"
                            error={!!flatErrors['documentType.otherType']}
                          >
                            <Label
                              htmlFor="FileUpload-OtherType"
                              className="margin-bottom-1"
                            >
                              Document name
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors['documentType.otherType']}
                            </FieldErrorMsg>
                            <Field
                              as={TextField}
                              error={!!flatErrors['documentType.otherType']}
                              className="margin-top-0"
                              id="FileUpload-OtherType"
                              name="documentType.otherType"
                            />
                          </FieldGroup>
                        </div>
                      )}
                    </fieldset>
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
                      // disabled={
                      //   isSubmitting ||
                      //   generateURLStatus.loading ||
                      //   createDocumentStatus.loading
                      // }
                      data-testid="upload-document"
                    >
                      Upload document
                    </Button>
                  </div>
                </Form>
              </div>
            </>
          );
        }}
      </Formik>

      {/* <p className="padding-top-2">
          <Link to={`/508/requests/${accessibilityRequestId}`}>
            Don&apos;t upload and return to request page
          </Link>
        </p> */}
    </div>
  );
};

export default NewUpload;
