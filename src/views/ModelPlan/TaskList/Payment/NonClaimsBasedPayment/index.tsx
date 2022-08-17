import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
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
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import useScrollElement from 'hooks/useScrollElement';
import GetNonClaimsBasedPayment from 'queries/Payments/GetNonClaimsBasedPayment';
import {
  GetNonClaimsBasedPayment as GetNonClaimsBasedPaymentType,
  GetNonClaimsBasedPayment_modelPlan_payments as NonClaimsBasedPaymentFormType,
  GetNonClaimsBasedPaymentVariables
} from 'queries/Payments/types/GetNonClaimsBasedPayment';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import {
  ClaimsBasedPayType,
  NonClaimsBasedPayType,
  PayType,
  TaskStatus
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  mapMultiSelectOptions,
  translateNonClaimsBasedPayType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const NonClaimsBasedPayment = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<NonClaimsBasedPaymentFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetNonClaimsBasedPaymentType,
    GetNonClaimsBasedPaymentVariables
  >(GetNonClaimsBasedPayment, {
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
    nonClaimsPayments,
    nonClaimsPaymentOther,
    paymentCalculationOwner,
    numberPaymentsPerPayCycle,
    numberPaymentsPerPayCycleNote,
    sharedSystemsInvolvedAdditionalClaimPayment,
    sharedSystemsInvolvedAdditionalClaimPaymentNote,
    planningToUseInnovationPaymentContractor,
    planningToUseInnovationPaymentContractorNote,
    fundingStructure
  } = data?.modelPlan?.payments || ({} as NonClaimsBasedPaymentFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itToolsStarted: boolean =
    data?.modelPlan.itTools.status !== TaskStatus.READY;

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (
    formikValues: NonClaimsBasedPaymentFormType,
    redirect?: 'next' | 'back' | 'task-list' | string
  ) => {
    const { id: updateId, __typename, ...changeValues } = formikValues;
    const hasClaimsBasedPayment = formikValues.payType.includes(
      PayType.CLAIMS_BASED_PAYMENTS
    );
    const hasReductionToCostSharing = formikValues.payClaims.includes(
      ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
    );
    update({
      variables: {
        id: updateId,
        changes: changeValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/payment/complexity`);
          } else if (redirect === 'back') {
            if (hasClaimsBasedPayment) {
              if (hasReductionToCostSharing) {
                history.push(
                  `/models/${modelID}/task-list/payment/beneficiary-cost-sharing`
                );
              } else {
                history.push(
                  `/models/${modelID}/task-list/payment/anticipating-dependencies`
                );
              }
            } else {
              history.push(`/models/${modelID}/task-list/payment`);
            }
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

  const initialValues: NonClaimsBasedPaymentFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    payClaims: payClaims ?? [],
    nonClaimsPayments: nonClaimsPayments ?? [],
    nonClaimsPaymentOther: nonClaimsPaymentOther ?? '',
    paymentCalculationOwner: paymentCalculationOwner ?? '',
    numberPaymentsPerPayCycle: numberPaymentsPerPayCycle ?? '',
    numberPaymentsPerPayCycleNote: numberPaymentsPerPayCycleNote ?? '',
    sharedSystemsInvolvedAdditionalClaimPayment:
      sharedSystemsInvolvedAdditionalClaimPayment ?? null,
    sharedSystemsInvolvedAdditionalClaimPaymentNote:
      sharedSystemsInvolvedAdditionalClaimPaymentNote ?? '',
    planningToUseInnovationPaymentContractor:
      planningToUseInnovationPaymentContractor ?? null,
    planningToUseInnovationPaymentContractorNote:
      planningToUseInnovationPaymentContractorNote ?? '',
    fundingStructure: fundingStructure ?? ''
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
        {(formikProps: FormikProps<NonClaimsBasedPaymentFormType>) => {
          const {
            errors,
            handleSubmit,
            setFieldValue,
            setErrors,
            values
          } = formikProps;
          const flatErrors = flattenErrors(errors);
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
                      data-testid="payment-non-claims-based-payment-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <PageHeading
                        headingLevel="h3"
                        className="margin-bottom-3"
                      >
                        {t('nonClaimsBasedPaymentQuestion')}
                      </PageHeading>

                      <FieldGroup
                        scrollElement="payment-nonclaims-payments"
                        error={!!flatErrors.nonClaimsPayments}
                        className="margin-top-4"
                      >
                        <Label htmlFor="payment-nonclaims-payments">
                          {t('nonClaimsPayments')}
                        </Label>
                        {itToolsStarted && (
                          <ITToolsWarning
                            id="payment-nonclaims-payments-warning"
                            onClick={() =>
                              handleFormSubmit(
                                values,
                                `/models/${modelID}/task-list/it-tools/page-nine`
                              )
                            }
                          />
                        )}
                        <FieldErrorMsg>
                          {flatErrors.nonClaimsPayments}
                        </FieldErrorMsg>

                        <Field
                          as={MultiSelect}
                          id="payment-nonclaims-payments"
                          name="payment-nonclaims-payments"
                          options={mapMultiSelectOptions(
                            translateNonClaimsBasedPayType,
                            NonClaimsBasedPayType
                          )}
                          selectedLabel={t('selectedNonClaimsPayments')}
                          onChange={(value: string[] | []) => {
                            setFieldValue('nonClaimsPayments', value);
                          }}
                          initialValues={initialValues.nonClaimsPayments}
                        />

                        {(values?.nonClaimsPayments || []).includes(
                          NonClaimsBasedPayType.OTHER
                        ) && (
                          <FieldGroup
                            scrollElement="payment-nonclaims-payments-other"
                            error={!!flatErrors.nonClaimsPaymentOther}
                          >
                            <Label
                              htmlFor="nonClaimsPaymentOther"
                              className="text-normal"
                            >
                              {t('selectClaimsOther')}
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors.nonClaimsPaymentOther}
                            </FieldErrorMsg>
                            <Field
                              as={TextField}
                              error={flatErrors.nonClaimsPaymentOther}
                              id="payment-nonclaims-payments-other"
                              data-testid="payment-nonclaims-payments-other"
                              name="nonClaimsPaymentOther"
                            />
                          </FieldGroup>
                        )}
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-nonclaims-payments-owner"
                        error={!!flatErrors.paymentCalculationOwner}
                      >
                        <Label htmlFor="paymentCalculationOwner">
                          {t('paymentCalculationOwner')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.paymentCalculationOwner}
                        </FieldErrorMsg>
                        <Field
                          as={TextField}
                          error={flatErrors.paymentCalculationOwner}
                          id="payment-nonclaims-payments-owner"
                          data-testid="payment-nonclaims-payments-owner"
                          name="paymentCalculationOwner"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-nonclaims-payments-paycycle"
                        error={!!flatErrors.numberPaymentsPerPayCycle}
                      >
                        <Label htmlFor="numberPaymentsPerPayCycle">
                          {t('numberPaymentsPerPayCycle')}
                        </Label>
                        <p className="text-base margin-y-1">
                          {t('numberPaymentsPerPayCycleSubcopy')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.numberPaymentsPerPayCycle}
                        </FieldErrorMsg>
                        <Field
                          as={TextField}
                          error={flatErrors.numberPaymentsPerPayCycle}
                          id="payment-nonclaims-payments-paycycle"
                          data-testid="payment-nonclaims-payments-paycycle"
                          name="numberPaymentsPerPayCycle"
                        />
                        <AddNote
                          id="payment-nonclaims-payments-paycycle-note"
                          field="numberPaymentsPerPayCycleNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-nonclaims-shared-involvement"
                        error={
                          !!flatErrors.sharedSystemsInvolvedAdditionalClaimPayment
                        }
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-nonclaims-shared-involvement"
                          className="maxw-none"
                        >
                          {t('sharedSystemsInvolvedAdditionalClaimPayment')}
                        </Label>
                        <FieldErrorMsg>
                          {
                            flatErrors.sharedSystemsInvolvedAdditionalClaimPayment
                          }
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`payment-nonclaims-shared-involvement-${key}`}
                              data-testid={`payment-nonclaims-shared-involvement-${key}`}
                              name="sharedSystemsInvolvedAdditionalClaimPayment"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={
                                values.sharedSystemsInvolvedAdditionalClaimPayment ===
                                key
                              }
                              onChange={() => {
                                setFieldValue(
                                  'sharedSystemsInvolvedAdditionalClaimPayment',
                                  key
                                );
                              }}
                            />
                          ))}
                        </Fieldset>
                        <AddNote
                          id="payment-nonclaims-shared-involvement-note"
                          field="sharedSystemsInvolvedAdditionalClaimPaymentNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-use-innovation-payment-contractor"
                        error={
                          !!flatErrors.planningToUseInnovationPaymentContractor
                        }
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-use-innovation-payment-contractor"
                          className="maxw-none"
                        >
                          {t('planningToUseInnovationPaymentContractor')}
                        </Label>
                        <p className="text-base margin-y-1">
                          {t('planningToUseInnovationPaymentContractorSubcopy')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.planningToUseInnovationPaymentContractor}
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`payment-use-innovation-payment-contractor-${key}`}
                              data-testid={`payment-use-innovation-payment-contractor-${key}`}
                              name="planningToUseInnovationPaymentContractor"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={
                                values.planningToUseInnovationPaymentContractor ===
                                key
                              }
                              onChange={() => {
                                setFieldValue(
                                  'planningToUseInnovationPaymentContractor',
                                  key
                                );
                              }}
                            />
                          ))}
                        </Fieldset>
                        <AddNote
                          id="payment-use-innovation-payment-contractor-note"
                          field="planningToUseInnovationPaymentContractorNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-funding-structure"
                        error={!!flatErrors.fundingStructure}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-funding-structure"
                          className="maxw-none"
                        >
                          {t('fundingStructure')}
                        </Label>
                        <p className="text-base margin-y-1">
                          {t('fundingStructureSubcopy')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.fundingStructure}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          className="height-15"
                          error={flatErrors.fundingStructure}
                          id="payment-funding-structure"
                          data-testid="payment-funding-structure"
                          name="fundingStructure"
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
            5,
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

export default NonClaimsBasedPayment;
