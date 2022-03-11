import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button
} from '@trussworks/react-uswds';
import {
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikProps
} from 'formik';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import {
  NoteByline,
  NoteContent,
  NoteListItem,
  NotesList
} from 'components/NotesList';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading/index';
import Alert from 'components/shared/Alert';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import TextAreaField from 'components/shared/TextAreaField';
import TestDateCard from 'components/TestDateCard';
import useMessage from 'hooks/useMessage';
import CreateAccessibilityRequestNoteQuery from 'queries/CreateAccessibilityRequestNoteQuery';
import DeleteAccessibilityRequestQuery from 'queries/DeleteAccessibilityRequestQuery';
import DeleteTestDateQuery from 'queries/DeleteTestDateQuery';
import GetAccessibilityRequestAccessibilityTeamOnlyQuery from 'queries/GetAccessibilityRequestAccessibilityTeamOnlyQuery';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import {
  CreateAccessibilityRequestNote,
  CreateAccessibilityRequestNote_createAccessibilityRequestNote_userErrors as noteUserErrors,
  CreateAccessibilityRequestNoteVariables
} from 'queries/types/CreateAccessibilityRequestNote';
import {
  DeleteAccessibilityRequest,
  DeleteAccessibilityRequestVariables
} from 'queries/types/DeleteAccessibilityRequest';
import { DeleteTestDate } from 'queries/types/DeleteTestDate';
import { GetAccessibilityRequest_accessibilityRequest_testDates as TestDateType } from 'queries/types/GetAccessibilityRequest';
import {
  GetAccessibilityRequestAccessibilityTeamOnly as GetAccessibilityRequest,
  GetAccessibilityRequestAccessibilityTeamOnlyVariables as GetAccessibilityRequestPayload
} from 'queries/types/GetAccessibilityRequestAccessibilityTeamOnly';
import { AppState } from 'reducers/rootReducer';
import {
  CreateNoteForm,
  DeleteAccessibilityRequestForm
} from 'types/accessibility';
import { AccessibilityRequestDeletionReason } from 'types/graphql-global-types';
import { accessibilityRequestStatusMap } from 'utils/accessibilityRequest';
import { formatDate } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import user from 'utils/user';
import accessibilitySchema from 'validations/accessibilitySchema';
import { NotFoundPartial } from 'views/NotFound';

import RequestDeleted from './RequestDeleted';

import './index.scss';

const AccessibilityRequestDetailPage = () => {
  const { t } = useTranslation('accessibility');
  const [isModalOpen, setModalOpen] = useState(false);
  const [formikErrors, setFormikErrors] = useState<FormikErrors<any>>({});
  const [returnedUserErrors, setReturnedUserErrors] = useState<any>(null);
  const { message, showMessage, showMessageOnNextPage } = useMessage();
  const flags = useFlags();
  const history = useHistory();
  const existingNotesHeading = useRef<HTMLHeadingElement>(null);
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const { pathname } = useLocation();

  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isAccessibilityTeam = user.isAccessibilityTeam(userGroups, flags);

  const requestQuery = isAccessibilityTeam
    ? GetAccessibilityRequestAccessibilityTeamOnlyQuery
    : GetAccessibilityRequestQuery;

  const flatFormikErrors = flattenErrors(formikErrors);

  // TODO: typechecking is off because of conditional query
  const { loading, error, data, refetch } = useQuery<
    GetAccessibilityRequest,
    GetAccessibilityRequestPayload
  >(requestQuery, {
    fetchPolicy: 'network-only',
    variables: {
      id: accessibilityRequestId
    }
  });

  const [mutateDeleteRequest] = useMutation<
    DeleteAccessibilityRequest,
    DeleteAccessibilityRequestVariables
  >(DeleteAccessibilityRequestQuery);

  const [mutateCreateNote, { error: noteMutationError }] = useMutation<
    CreateAccessibilityRequestNote,
    CreateAccessibilityRequestNoteVariables
  >(CreateAccessibilityRequestNoteQuery);

  const userEuaId = useSelector((state: AppState) => state.auth.euaId);

  const removeRequest = (values: DeleteAccessibilityRequestForm) => {
    mutateDeleteRequest({
      variables: {
        input: {
          id: accessibilityRequestId,
          reason: values.deletionReason as AccessibilityRequestDeletionReason
        }
      }
    }).then(response => {
      if (!response.errors) {
        showMessageOnNextPage(
          t('requestDetails.removeConfirmationText', {
            requestName
          })
        );
        history.push('/');
      }
    });
  };

  const resetAlerts = () => {
    showMessage(undefined);
    setFormikErrors({});
    setReturnedUserErrors(null);
  };

  const createNote = (
    values: CreateNoteForm,
    { resetForm }: FormikHelpers<CreateNoteForm>
  ) => {
    mutateCreateNote({
      variables: {
        input: {
          requestID: accessibilityRequestId,
          note: values.noteText,
          shouldSendEmail: values.shouldSendEmail
        }
      }
    })
      .then(response => {
        const userErrors =
          response.data?.createAccessibilityRequestNote?.userErrors;
        if (userErrors) {
          resetAlerts();
          setReturnedUserErrors(userErrors);
        }
        if (!userErrors) {
          refetch();
          resetAlerts();
          showMessage(t('requestDetails.notes.confirmation', { requestName }));
          resetForm({});
        }
      })
      .catch(() => {});
  };

  const [deleteTestDateMutation] = useMutation<DeleteTestDate>(
    DeleteTestDateQuery,
    {
      errorPolicy: 'all'
    }
  );

  const deleteTestDate = (testDate: TestDateType) => {
    deleteTestDateMutation({
      variables: {
        input: {
          id: testDate.id
        }
      }
    }).then(() => {
      refetch();
      showMessage(
        t('removeTestDate.confirmation', {
          date: formatDate(testDate.date),
          requestName
        })
      );
    });
  };

  const requestName = data?.accessibilityRequest?.name || '';
  const requestOwnerEuaId = data?.accessibilityRequest?.euaUserId || '';
  const systemName = data?.accessibilityRequest?.system.name || '';
  const submittedAt = data?.accessibilityRequest?.submittedAt || '';
  const lcid = data?.accessibilityRequest?.system.lcid;
  const businessOwnerName =
    data?.accessibilityRequest?.system?.businessOwner?.name;
  const businessOwnerComponent =
    data?.accessibilityRequest?.system?.businessOwner?.component;
  const documents = data?.accessibilityRequest?.documents || [];
  const testDates = data?.accessibilityRequest?.testDates || [];

  const hasDocuments = documents.length > 0;
  const statusEnum = data?.accessibilityRequest?.statusRecord.status;
  const requestStatus = accessibilityRequestStatusMap[`${statusEnum}`];

  const uploadDocumentLink = (
    <UswdsReactLink
      className="usa-button"
      variant="unstyled"
      to={`/508/requests/${accessibilityRequestId}/documents/new`}
      data-testid="upload-new-document"
    >
      {t('requestDetails.documentUpload')}
    </UswdsReactLink>
  );

  const bodyWithDocumentsTable = (
    <div data-testid="body-with-doc-table">
      <p className="usa-sr-only" aria-live="polite">
        {t('requestDetails.activeDocumentTab')}
      </p>
      <h2 className="margin-top-0">{t('requestDetails.documents.label')}</h2>
      {uploadDocumentLink}
    </div>
  );

  const bodyNoDocumentsBusinessOwner = (
    <>
      <div className="margin-bottom-3">
        <p className="usa-sr-only" aria-live="polite">
          {t('requestDetails.activeDocumentTab')}
        </p>
        <h2 className="margin-y-0 font-heading-lg">
          {t('requestDetails.documents.noDocs.heading')}
        </h2>
        <p className="line-height-body-4">
          <UswdsReactLink
            className="display-inline-block"
            to="/508/templates"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('accessibility:requestDetails.documents.noDocs.description')}
          </UswdsReactLink>
        </p>
      </div>
      {uploadDocumentLink}
    </>
  );
  const documentsTab = hasDocuments
    ? bodyWithDocumentsTable
    : bodyNoDocumentsBusinessOwner;

  const notes = data?.accessibilityRequest?.notes || [];
  const notesTab = (
    <>
      <h3 className="usa-sr-only">
        {t('requestDetails.notes.existingNotesCount', {
          notesLength: notes.length
        })}{' '}
        {notes.length > 0 &&
          t('requestDetails.notes.mostRecentNote', {
            authorName: notes[0]?.authorName,
            createdAt: formatDate(notes[0]?.createdAt)
          })}
      </h3>
      <p className="usa-sr-only" aria-live="polite">
        {t('requestDetails.activeNoteTab')}
      </p>
      <Button
        className="accessibility-request__add-note-btn"
        type="button"
        onClick={() => {
          existingNotesHeading.current?.focus();
        }}
      >
        {t('requestDetails.notes.skipToExistingNotes')}
      </Button>
      <div role="region" aria-label="add new note" id="notes-form">
        <Formik
          initialValues={{
            noteText: '',
            shouldSendEmail: false
          }}
          onSubmit={createNote}
          validationSchema={accessibilitySchema.noteForm}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<CreateNoteForm>) => {
            const {
              values,
              errors,
              setFieldValue,
              validateForm,
              submitForm
            } = formikProps;
            const flatErrors = flattenErrors(errors);
            return (
              <>
                <Form className="usa-form maxw-full">
                  <FieldGroup className="margin-top-0">
                    <Label htmlFor="CreateAccessibilityRequestNote-NoteText">
                      {t('requestDetails.notes.form.note')}
                    </Label>
                    <FieldErrorMsg>{flatErrors.noteText}</FieldErrorMsg>
                    <Field
                      as={TextAreaField}
                      id="CreateAccessibilityRequestNote-NoteText"
                      name="noteText"
                      className="accessibility-request__note-field"
                      error={!!flatErrors.noteText}
                      maxLength={2000}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Field
                      as={CheckboxField}
                      checked={values.shouldSendEmail}
                      id="CreateAccessibilityRequestNote-ShouldSendEmail"
                      name="shouldSendEmail"
                      label={t('requestDetails.notes.form.sendEmail')}
                      value="ShouldSendEmail"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue(`shouldSendEmail`, e.target.checked);
                      }}
                    />
                  </FieldGroup>
                  <Button
                    className="margin-top-2"
                    type="button"
                    onClick={() =>
                      validateForm().then(err => {
                        if (Object.keys(err).length > 0) {
                          resetAlerts();
                          setFormikErrors(err);
                        } else {
                          submitForm();
                        }
                      })
                    }
                  >
                    {t('requestDetails.notes.submit')}
                  </Button>
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
      <div
        role="region"
        aria-label="existing notes"
        className="margin-top-6 margin-x-1"
      >
        <h3 id="NoteListLabel" ref={existingNotesHeading} tabIndex={-1}>
          {t('requestDetails.notes.existingNotes', {
            notesLength: notes.length
          })}
        </h3>
        <NotesList aria-labelledby="NoteListLabel">
          {notes.map(note => (
            <NoteListItem key={note.id}>
              <NoteContent>{note.note}</NoteContent>
              <NoteByline>
                {`by ${note.authorName}`}
                <span className="padding-x-1">|</span>
                {formatDate(note.createdAt)}
              </NoteByline>
            </NoteListItem>
          ))}
        </NotesList>
      </div>
    </>
  );

  if (loading) {
    return <PageLoading />;
  }

  if (!data) {
    return (
      <div className="grid-container">
        <NotFoundPartial />
      </div>
    );
  }

  const selectedTabContent = pathname.endsWith('/notes')
    ? notesTab
    : bodyWithDocumentsTable;

  if (data?.accessibilityRequest?.statusRecord?.status === 'DELETED') {
    return <RequestDeleted />;
  }
  // What type of errors can we get/return?
  // How can we actually use the errors?
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }
  return (
    <div data-testid="accessibility-request-detail-page">
      <div className="bg-primary-lighter">
        <div className="grid-container padding-x-5 padding-bottom-3 padding-top-5">
          <BreadcrumbBar variant="wrap" className="bg-transparent">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>Home</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{requestName}</Breadcrumb>
          </BreadcrumbBar>
          {message && (
            <Alert
              className="margin-top-4"
              type="success"
              role="alert"
              heading="Success"
            >
              {message}
            </Alert>
          )}
          {noteMutationError && (
            <Alert
              className="margin-top-4"
              type="error"
              role="alert"
              heading="There is a problem"
            >
              {t('requestDetails.notes.formErrorMessage')}
            </Alert>
          )}
          {returnedUserErrors && (
            <ErrorAlert
              testId="create-accessibility-note-errors"
              classNames="margin-bottom-4 margin-top-4"
              heading="There is a problem"
            >
              {returnedUserErrors.map((err: noteUserErrors) => {
                return <p key={err.message}>{err.message}</p>;
              })}
            </ErrorAlert>
          )}
          {Object.keys(flatFormikErrors).length > 0 && (
            <ErrorAlert
              testId="508-request-details-error"
              classNames="margin-bottom-4 margin-top-4"
              heading="There is a problem"
            >
              {Object.keys(flatFormikErrors).map(key => {
                return (
                  <ErrorAlertMessage
                    key={`Error.${key}`}
                    errorKey={key}
                    message={flatFormikErrors[key]}
                  />
                );
              })}
            </ErrorAlert>
          )}
          <PageHeading
            aria-label={`${requestName} current status ${requestStatus}`}
          >
            {requestName}
          </PageHeading>
          <dl>
            <dt data-testid="current-status-dt">Current status</dt>
            <dd
              data-testid="current-status-dd"
              className="bg-warning-lighter padding-05 display-inline-block margin-top-1 margin-left-0"
            >
              {requestStatus}
            </dd>
          </dl>
          {isAccessibilityTeam && (
            <UswdsReactLink
              to={`/508/requests/${accessibilityRequestId}/change-status`}
              aria-label="Change status"
            >
              Change
            </UswdsReactLink>
          )}
        </div>
      </div>
      {isAccessibilityTeam && (
        <SecondaryNav>
          <NavLink to={`/508/requests/${accessibilityRequestId}/documents`}>
            Documents
          </NavLink>
          <NavLink to={`/508/requests/${accessibilityRequestId}/notes`}>
            Notes
          </NavLink>
        </SecondaryNav>
      )}
      <div className="grid-container padding-top-6 padding-top">
        <div className="grid-row grid-gap-lg">
          <div className="grid-col-8">
            {isAccessibilityTeam ? selectedTabContent : documentsTab}
          </div>
          <div className="grid-col-1" />
          <div className="grid-col-3">
            <div className="accessibility-request__side-nav">
              <div>
                <h2 className="margin-top-2 margin-bottom-3">
                  Test Dates and Scores
                </h2>
                {[...testDates]
                  .sort(
                    (a, b) =>
                      DateTime.fromISO(a.date).toMillis() -
                      DateTime.fromISO(b.date).toMillis()
                  )
                  .map((testDate, index) => (
                    <TestDateCard
                      key={testDate.id}
                      testDate={testDate}
                      testIndex={index + 1}
                      requestName={requestName}
                      requestId={accessibilityRequestId}
                      isEditableDeletable={isAccessibilityTeam}
                      handleDeleteTestDate={deleteTestDate}
                    />
                  ))}
                {isAccessibilityTeam && (
                  <Link
                    to={`/508/requests/${accessibilityRequestId}/test-date`}
                    className="margin-bottom-3 display-block"
                    aria-label="Add a test date"
                  >
                    Add a date
                  </Link>
                )}
              </div>
              <div className="accessibility-request__other-details">
                <h3>{t('requestDetails.other')}</h3>
                <dl>
                  <dt className="margin-bottom-1">
                    {t('intake:fields.submissionDate')}
                  </dt>
                  <dd className="margin-0 margin-bottom-2">
                    {formatDate(submittedAt)}
                  </dd>
                  <dt className="margin-bottom-1">
                    {t('intake:fields.businessOwner')}
                  </dt>
                  <dd className="margin-0 margin-bottom-2">
                    {businessOwnerName}, {businessOwnerComponent}
                  </dd>
                  <dt className="margin-bottom-1">
                    {t('intake:fields:projectName')}
                  </dt>
                  <dd className="margin-0 margin-bottom-3">{systemName}</dd>
                  <dt className="margin-bottom-1">{t('intake:lifecycleId')}</dt>
                  <dd className="margin-0 margin-bottom-3">{lcid}</dd>
                </dl>
              </div>
              <UswdsReactLink
                className="display-inline-block margin-top-3"
                target="_blank"
                rel="noopener noreferrer"
                to="/508/templates"
              >
                {t('requestDetails.testingTemplates')}
              </UswdsReactLink>
              <UswdsReactLink
                className="display-inline-block margin-top-3"
                target="_blank"
                rel="noopener noreferrer"
                to="/508/testing-overview"
              >
                {t('requestDetails.testingSteps')}
              </UswdsReactLink>
              {userEuaId === requestOwnerEuaId && (
                <button
                  type="button"
                  className="accessibility-request__remove-request"
                  onClick={() => setModalOpen(true)}
                >
                  {t('requestDetails.remove')}
                </button>
              )}
              <Modal
                isOpen={isModalOpen}
                closeModal={() => setModalOpen(false)}
              >
                <PageHeading
                  headingLevel="h2"
                  className="margin-top-0 line-height-heading-2 margin-bottom-2"
                >
                  {t('requestDetails.modal.header', {
                    requestName
                  })}
                </PageHeading>
                <span>{t('requestDetails.modal.subhead')}</span>

                <Formik
                  initialValues={{
                    deletionReason: ''
                  }}
                  onSubmit={removeRequest}
                  validationSchema={accessibilitySchema.deleteForm}
                  validateOnBlur={false}
                  validateOnChange={false}
                  validateOnMount={false}
                >
                  {(
                    formikProps: FormikProps<DeleteAccessibilityRequestForm>
                  ) => {
                    const { errors, values } = formikProps;
                    const flatErrors = flattenErrors(errors);
                    return (
                      <>
                        {Object.keys(errors).length > 0 && (
                          <ErrorAlert
                            testId="remove-accessibility-request-errors"
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
                        <Form className="usa-form usa-form--large">
                          <FieldGroup
                            scrollElement="deletionReason"
                            error={!!flatErrors.deletionReason}
                          >
                            <fieldset className="usa-fieldset margin-top-4">
                              <legend className="usa-label">
                                {t('removeAccessibilityRequest.reason')}
                              </legend>
                              <FieldErrorMsg>
                                {flatErrors.deletionReason}
                              </FieldErrorMsg>
                              {([
                                'INCORRECT_APPLICATION_AND_LIFECYCLE_ID',
                                'NO_TESTING_NEEDED',
                                'OTHER'
                              ] as AccessibilityRequestDeletionReason[]).map(
                                reason => {
                                  return (
                                    <Field
                                      key={`RemoveAccessibilityRequest-${reason}`}
                                      as={RadioField}
                                      checked={values.deletionReason === reason}
                                      id={`RemoveAccessibilityRequest-${reason}`}
                                      name="deletionReason"
                                      label={t(
                                        `removeAccessibilityRequest.${reason}`
                                      )}
                                      value={reason}
                                    />
                                  );
                                }
                              )}
                            </fieldset>
                          </FieldGroup>

                          <div className="display-flex margin-top-2">
                            <Button type="submit" className="margin-right-5">
                              {t('requestDetails.modal.confirm')}
                            </Button>
                            <Button
                              type="button"
                              unstyled
                              onClick={() => setModalOpen(false)}
                            >
                              {t('requestDetails.modal.cancel')}
                            </Button>
                          </div>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityRequestDetailPage;
