import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  DatePicker,
  Fieldset,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsWarning from 'components/ITToolsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import AutoSave from 'components/shared/AutoSave';
import DatePickerWarning from 'components/shared/DatePickerWarning';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import useScrollElement from 'hooks/useScrollElement';
import GetRecover from 'queries/Payments/GetRecover';
import {
  GetRecover as GetRecoverType,
  GetRecover_modelPlan_payments as RecoverFormType,
  GetRecoverVariables
} from 'queries/Payments/types/GetRecover';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import {
  ClaimsBasedPayType,
  PayType,
  TaskStatus
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const Recover = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();
  const [dateInPast, setDateInPast] = useState(false);
  const [dateLoaded, setDateLoaded] = useState(false);

  // Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
  type InitialValueType = Omit<
    RecoverFormType,
    'readyForReviewBy' | 'readyForReviewDts'
  >;

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetRecoverType,
    GetRecoverVariables
  >(GetRecover, {
    variables: {
      id: modelID
    }
  });

  // If redirected from IT Tools, scrolls to the relevant question
  useScrollElement(!loading);

  const {
    id,
    payType,
    payClaims,
    willRecoverPayments,
    willRecoverPaymentsNote,
    anticipateReconcilingPaymentsRetrospectively,
    anticipateReconcilingPaymentsRetrospectivelyNote,
    paymentStartDate,
    paymentStartDateNote,
    readyForReviewBy,
    readyForReviewDts,
    status
  } = data?.modelPlan?.payments || ({} as RecoverFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itToolsStarted: boolean =
    data?.modelPlan.itTools.status !== TaskStatus.READY;

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (
    formikValues: InitialValueType,
    redirect?: 'back' | 'task-list' | string
  ) => {
    const {
      id: updateId,
      __typename,
      status: inputStatus,
      ...changeValues
    } = formikValues;
    update({
      variables: {
        id: updateId,
        changes: { ...changeValues, status: sanitizeStatus(inputStatus) }
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/payment/complexity`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list/`);
          } else if (redirect) {
            history.push(redirect);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  // TODO: Figure out why the form doesn't rerender once a date value is fetched - delay works for now
  // Loading var passed from GQL does not seem to accurately identify a completed payload for date
  useEffect(() => {
    setTimeout(() => {
      setDateLoaded(true);
      if (paymentStartDate && new Date() > new Date(paymentStartDate)) {
        setDateInPast(true);
      } else {
        setDateInPast(false);
      }
    }, 250);
  }, [paymentStartDate]);

  const initialValues: InitialValueType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    payClaims: payClaims ?? [],
    willRecoverPayments: willRecoverPayments ?? null,
    willRecoverPaymentsNote: willRecoverPaymentsNote ?? '',
    anticipateReconcilingPaymentsRetrospectively:
      anticipateReconcilingPaymentsRetrospectively ?? null,
    anticipateReconcilingPaymentsRetrospectivelyNote:
      anticipateReconcilingPaymentsRetrospectivelyNote ?? '',
    paymentStartDate: paymentStartDate ?? '',
    paymentStartDateNote: paymentStartDateNote ?? '',
    status
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {t('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          handleFormSubmit(values, 'task-list');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<InitialValueType>) => {
          const {
            errors,
            handleSubmit,
            setFieldValue,
            setFieldError,
            setErrors,
            values
          } = formikProps;
          const flatErrors = flattenErrors(errors);

          const handleOnBlur = (
            e: React.ChangeEvent<HTMLInputElement>,
            field: string
          ) => {
            if (e.target.value === '') {
              setFieldValue(field, null);
              if (e.target.id !== '') {
                setDateInPast(false);
              }
              return;
            }
            try {
              setFieldValue(field, new Date(e.target.value).toISOString());
              if (new Date() > new Date(e.target.value)) {
                setDateInPast(true);
              } else {
                setDateInPast(false);
              }
              delete errors[field as keyof InitialValueType];
            } catch (err) {
              setFieldError(field, t('validDate'));
            }
          };

          return (
            <>
              {Object.keys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={h('checkAndFix')}
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
              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap>
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="payment-recover-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <FieldGroup
                        scrollElement="payment-recover-payment"
                        error={!!flatErrors.willRecoverPayments}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-recover-payment"
                          className="maxw-none"
                        >
                          {t('willRecoverPayments')}
                        </Label>

                        {itToolsStarted && (
                          <ITToolsWarning
                            id="payment-recover-payment-warning"
                            onClick={() =>
                              handleFormSubmit(
                                values,
                                `/models/${modelID}/task-list/it-tools/page-nine`
                              )
                            }
                          />
                        )}

                        <FieldErrorMsg>
                          {flatErrors.willRecoverPayments}
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`payment-recover-payment-${key}`}
                              data-testid={`payment-recover-payment-${key}`}
                              name="willRecoverPayments"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={values.willRecoverPayments === key}
                              onChange={() => {
                                setFieldValue('willRecoverPayments', key);
                              }}
                            />
                          ))}
                        </Fieldset>
                        <AddNote
                          id="payment-recover-payment-note"
                          field="willRecoverPaymentsNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-anticipate-reconciling-payment-retro"
                        error={
                          !!flatErrors.anticipateReconcilingPaymentsRetrospectively
                        }
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-anticipate-reconciling-payment-retro"
                          className="maxw-none"
                        >
                          {t('anticipateReconcilingPaymentsRetrospectively')}
                        </Label>
                        <FieldErrorMsg>
                          {
                            flatErrors.anticipateReconcilingPaymentsRetrospectively
                          }
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`payment-anticipate-reconciling-payment-retro-${key}`}
                              data-testid={`payment-anticipate-reconciling-payment-retro-${key}`}
                              name="anticipateReconcilingPaymentsRetrospectively"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={
                                values.anticipateReconcilingPaymentsRetrospectively ===
                                key
                              }
                              onChange={() => {
                                setFieldValue(
                                  'anticipateReconcilingPaymentsRetrospectively',
                                  key
                                );
                              }}
                            />
                          ))}
                        </Fieldset>
                        <AddNote
                          id="payment-anticipate-reconciling-payment-retro-note"
                          field="anticipateReconcilingPaymentsRetrospectivelyNote"
                        />
                      </FieldGroup>

                      {!loading && dateLoaded && (
                        <FieldGroup
                          scrollElement="paymentStartDate"
                          error={!!flatErrors.paymentStartDate}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="paymentStartDate"
                            className="maxw-none"
                          >
                            {t('paymentStartDate')}
                          </Label>
                          <p className="text-normal margin-bottom-1 margin-top-0">
                            {t('paymentStartDateSubcopy')}
                          </p>
                          <div className="usa-hint" id="appointment-date-hint">
                            {h('datePlaceholder')}
                          </div>
                          <FieldErrorMsg>
                            {flatErrors.paymentStartDate}
                          </FieldErrorMsg>
                          <div className="width-card-lg position-relative">
                            <Field
                              as={DatePicker}
                              error={!!flatErrors.paymentStartDate}
                              id="payment-payment-start-date"
                              maxLength={50}
                              name="paymentStartDate"
                              defaultValue={values.paymentStartDate}
                              onBlur={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                handleOnBlur(e, 'paymentStartDate');
                              }}
                            />
                            {dateInPast && (
                              <DatePickerWarning label={h('dateWarning')} />
                            )}
                          </div>
                          {dateInPast && (
                            <Alert type="warning" className="margin-top-4">
                              {h('dateWarning')}
                            </Alert>
                          )}

                          <AddNote
                            id="payment-payment-start-date-note"
                            field="paymentStartDateNote"
                          />
                        </FieldGroup>
                      )}

                      <ReadyForReview
                        id="payment-status"
                        field="status"
                        sectionName={t('heading')}
                        status={values.status}
                        setFieldValue={setFieldValue}
                        readyForReviewBy={readyForReviewBy}
                        readyForReviewDts={readyForReviewDts}
                      />

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="button"
                          className="usa-button usa-button--outline margin-bottom-1"
                          onClick={() => {
                            handleFormSubmit(values, 'back');
                          }}
                        >
                          {h('back')}
                        </Button>
                        <Button type="submit" onClick={() => setErrors({})}>
                          {h('saveAndStartNext')}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => handleFormSubmit(values, 'task-list')}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {h('saveAndReturn')}
                      </Button>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
              {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit(formikRef.current!.values);
                  }}
                  debounceDelay={3000}
                />
              )}
            </>
          );
        }}
      </Formik>
      {data && (
        <PageNumber
          currentPage={renderCurrentPage(
            7,
            payType.includes(PayType.CLAIMS_BASED_PAYMENTS),
            payType.includes(PayType.NON_CLAIMS_BASED_PAYMENTS),
            payClaims.includes(
              ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
            )
          )}
          totalPages={renderTotalPages(
            payType.includes(PayType.CLAIMS_BASED_PAYMENTS),
            payType.includes(PayType.NON_CLAIMS_BASED_PAYMENTS),
            payClaims.includes(
              ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
            )
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default Recover;
