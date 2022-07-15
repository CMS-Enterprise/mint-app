import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
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
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetRecover from 'queries/Payments/GetRecover';
import {
  GetRecover as GetRecoverType,
  GetRecover_modelPlan_payments as RecoverFormType,
  GetRecoverVariables
} from 'queries/Payments/types/GetRecover';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import { PayType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const Complexity = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<RecoverFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetRecoverType,
    GetRecoverVariables
  >(GetRecover, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    payType,
    willRecoverPayments,
    willRecoverPaymentsNote,
    anticipateReconcilingPaymentsRetrospectively,
    anticipateReconcilingPaymentsRetrospectivelyNote,
    paymentStartDate,
    paymentStartDateNote
  } = data?.modelPlan?.payments || ({} as RecoverFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (
    formikValues: RecoverFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const { id: updateId, __typename, ...changeValues } = formikValues;
    update({
      variables: {
        id: updateId,
        changes: changeValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/payment/recover-payment`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/payment/claims-based-payment`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: RecoverFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    willRecoverPayments: willRecoverPayments ?? null,
    willRecoverPaymentsNote: willRecoverPaymentsNote ?? '',
    anticipateReconcilingPaymentsRetrospectively:
      anticipateReconcilingPaymentsRetrospectively ?? null,
    anticipateReconcilingPaymentsRetrospectivelyNote:
      anticipateReconcilingPaymentsRetrospectivelyNote ?? '',
    paymentStartDate: paymentStartDate ?? '',
    paymentStartDateNote: paymentStartDateNote ?? ''
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
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<RecoverFormType>) => {
          const {
            errors,
            handleSubmit,
            setFieldValue,
            setFieldError,
            setErrors,
            values
          } = formikProps;
          const flatErrors = flattenErrors(errors);

          const handleOnBlur = (e: string, field: string) => {
            if (e === '') {
              return;
            }
            try {
              setFieldValue(field, new Date(e).toISOString());
              delete errors[field as keyof RecoverFormType];
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
                        <FieldErrorMsg>
                          {flatErrors.willRecoverPayments}
                        </FieldErrorMsg>
                        <Fieldset>
                          <Field
                            as={Radio}
                            id="payment-recover-payment-Yes"
                            name="payment-recover-payment"
                            label={h('yes')}
                            value="YES"
                            checked={values.willRecoverPayments === true}
                            onChange={() => {
                              setFieldValue('willRecoverPayments', true);
                            }}
                          />
                          <Field
                            as={Radio}
                            id="payment-recover-payment-No"
                            name="payment-recover-payment"
                            label={h('no')}
                            value="NO"
                            checked={values.willRecoverPayments === false}
                            onChange={() => {
                              setFieldValue('willRecoverPayments', false);
                            }}
                          />
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
                          <Field
                            as={Radio}
                            id="payment-anticipate-reconciling-payment-retro-Yes"
                            name="payment-anticipate-reconciling-payment-retro"
                            label={h('yes')}
                            value="YES"
                            checked={
                              values.anticipateReconcilingPaymentsRetrospectively ===
                              true
                            }
                            onChange={() => {
                              setFieldValue(
                                'anticipateReconcilingPaymentsRetrospectively',
                                true
                              );
                            }}
                          />
                          <Field
                            as={Radio}
                            id="payment-anticipate-reconciling-payment-retro-No"
                            name="payment-anticipate-reconciling-payment-retro"
                            label={h('no')}
                            value="NO"
                            checked={
                              values.anticipateReconcilingPaymentsRetrospectively ===
                              false
                            }
                            onChange={() => {
                              setFieldValue(
                                'anticipateReconcilingPaymentsRetrospectively',
                                false
                              );
                            }}
                          />
                        </Fieldset>
                        <AddNote
                          id="payment-anticipate-reconciling-payment-retro-note"
                          field="anticipateReconcilingPaymentsRetrospectivelyNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-payment-start-date"
                        error={!!flatErrors.paymentStartDate}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-payment-start-date"
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
                        <Field
                          as={DatePicker}
                          error={+!!flatErrors.paymentStartDate}
                          className="width-card-lg"
                          id="payment-payment-start-date"
                          maxLength={50}
                          name="paymentStartDate"
                          defaultValue={values.paymentStartDate}
                          onBlur={(e: any) =>
                            handleOnBlur(e.target.value, 'paymentStartDate')
                          }
                        />
                        <AddNote
                          id="payment-payment-start-date-note"
                          field="paymentStartDateNote"
                        />
                      </FieldGroup>

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
                          {h('next')}
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
            2,
            payType.includes(PayType.CLAIMS_BASED_PAYMENTS),
            payType.includes(PayType.NON_CLAIMS_BASED_PAYMENTS)
          )}
          totalPages={renderTotalPages(
            payType.includes(PayType.CLAIMS_BASED_PAYMENTS),
            payType.includes(PayType.NON_CLAIMS_BASED_PAYMENTS)
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default Complexity;
