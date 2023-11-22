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
  Icon,
  Label
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextField from 'components/shared/TextField';
import usePlanTranslation from 'hooks/usePlanTranslation';
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
  PayType
} from 'types/graphql-global-types';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const NonClaimsBasedPayment = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    nonClaimsPayments: nonClaimsPaymentsConfig,
    sharedSystemsInvolvedAdditionalClaimPayment: sharedSystemsInvolvedAdditionalClaimPaymentConfig,
    planningToUseInnovationPaymentContractor: planningToUseInnovationPaymentContractorConfig
  } = usePlanTranslation('payments');

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

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const {
    id,
    payType,
    payClaims,
    nonClaimsPayments,
    nonClaimsPaymentsNote,
    nonClaimsPaymentOther,
    paymentCalculationOwner,
    numberPaymentsPerPayCycle,
    numberPaymentsPerPayCycleNote,
    sharedSystemsInvolvedAdditionalClaimPayment,
    sharedSystemsInvolvedAdditionalClaimPaymentNote,
    planningToUseInnovationPaymentContractor,
    planningToUseInnovationPaymentContractorNote
  } = data?.modelPlan?.payments || ({} as NonClaimsBasedPaymentFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (
    redirect?: 'next' | 'back' | 'task-list' | string
  ) => {
    const hasClaimsBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.CLAIMS_BASED_PAYMENTS
    );
    const hasReductionToCostSharing = formikRef?.current?.values.payClaims.includes(
      ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
    );
    update({
      variables: {
        id,
        changes: dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        )
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
    nonClaimsPaymentsNote: nonClaimsPaymentsNote ?? '',
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
      planningToUseInnovationPaymentContractorNote ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{miscellaneousT('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{miscellaneousT('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{paymentsMiscT('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>

      <PageHeading className="margin-top-4 margin-bottom-2">
        {paymentsMiscT('heading')}
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
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          handleFormSubmit('next');
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
              {getKeys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={miscellaneousT('checkAndFix')}
                >
                  {getKeys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={`${key}`}
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
                      <Fieldset disabled={!!error || loading}>
                        <PageHeading
                          headingLevel="h3"
                          className="margin-bottom-3"
                        >
                          {paymentsMiscT('nonClaimsBasedPaymentQuestion')}
                        </PageHeading>

                        <FieldGroup
                          scrollElement="nonClaimsPayments"
                          error={!!flatErrors.nonClaimsPayments}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-nonclaims-payments"
                            id="label-payment-nonclaims-payments"
                          >
                            {paymentsT('nonClaimsPayments.label')}
                          </Label>

                          {itSolutionsStarted && (
                            <ITSolutionsWarning
                              id="payment-nonclaims-payments-warning"
                              onClick={() =>
                                handleFormSubmit(
                                  `/models/${modelID}/task-list/it-solutions`
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
                            ariaLabel="label-payment-nonclaims-payments"
                            options={composeMultiSelectOptions(
                              nonClaimsPaymentsConfig.options
                            )}
                            selectedLabel={paymentsT(
                              'nonClaimsPayments.multiSelectLabel'
                            )}
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
                                {paymentsT('nonClaimsPaymentOther.label')}
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

                          <AddNote
                            id="payment-nonclaims-payments-note"
                            field="nonClaimsPaymentsNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payment-nonclaims-payments-owner"
                          error={!!flatErrors.paymentCalculationOwner}
                        >
                          <Label htmlFor="paymentCalculationOwner">
                            {paymentsT('paymentCalculationOwner.label')}
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
                            {paymentsT('numberPaymentsPerPayCycle.label')}
                          </Label>

                          <p className="text-base margin-y-1">
                            {paymentsT('numberPaymentsPerPayCycle.sublabel')}
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
                            {paymentsT(
                              'sharedSystemsInvolvedAdditionalClaimPayment.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {
                              flatErrors.sharedSystemsInvolvedAdditionalClaimPayment
                            }
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="sharedSystemsInvolvedAdditionalClaimPayment"
                            id="payment-nonclaims-shared-involvement"
                            value={
                              values.sharedSystemsInvolvedAdditionalClaimPayment
                            }
                            setFieldValue={setFieldValue}
                            options={
                              sharedSystemsInvolvedAdditionalClaimPaymentConfig.options
                            }
                          />

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
                            {paymentsT(
                              'planningToUseInnovationPaymentContractor.label'
                            )}
                          </Label>

                          <p className="text-base margin-y-1">
                            {paymentsT(
                              'planningToUseInnovationPaymentContractor.sublabel'
                            )}
                          </p>

                          <FieldErrorMsg>
                            {
                              flatErrors.planningToUseInnovationPaymentContractor
                            }
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="planningToUseInnovationPaymentContractor"
                            id="payment-use-innovation-payment-contractor"
                            value={
                              values.planningToUseInnovationPaymentContractor
                            }
                            setFieldValue={setFieldValue}
                            options={
                              planningToUseInnovationPaymentContractorConfig.options
                            }
                          />

                          <AddNote
                            id="payment-use-innovation-payment-contractor-note"
                            field="planningToUseInnovationPaymentContractorNote"
                          />
                        </FieldGroup>

                        <div className="margin-top-6 margin-bottom-3">
                          <Button
                            type="button"
                            className="usa-button usa-button--outline margin-bottom-1"
                            onClick={() => {
                              handleFormSubmit('back');
                            }}
                          >
                            {miscellaneousT('back')}
                          </Button>

                          <Button type="submit" onClick={() => setErrors({})}>
                            {miscellaneousT('next')}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled"
                          onClick={() => handleFormSubmit('task-list')}
                        >
                          <Icon.ArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />

                          {miscellaneousT('saveAndReturn')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>

              {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit();
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
