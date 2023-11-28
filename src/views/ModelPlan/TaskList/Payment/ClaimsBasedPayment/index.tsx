import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
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
import { useUpdatePaymentsMutation } from 'gql/gen/graphql';

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
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import GetClaimsBasedPayment from 'queries/Payments/GetClaimsBasedPayment';
import {
  GetClaimsBasedPayment as GetClaimsBasedPaymentType,
  GetClaimsBasedPayment_modelPlan_payments as ClaimsBasedPaymentFormType,
  GetClaimsBasedPaymentVariables
} from 'queries/Payments/types/GetClaimsBasedPayment';
import { ClaimsBasedPayType, PayType } from 'types/graphql-global-types';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const ClaimsBasedPayment = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    payClaims: payClaimsConfig,
    shouldAnyProvidersExcludedFFSSystems: shouldAnyProvidersExcludedFFSSystemsConfig,
    changesMedicarePhysicianFeeSchedule: changesMedicarePhysicianFeeScheduleConfig,
    affectsMedicareSecondaryPayerClaims: affectsMedicareSecondaryPayerClaimsConfig
  } = usePlanTranslation('payments');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ClaimsBasedPaymentFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetClaimsBasedPaymentType,
    GetClaimsBasedPaymentVariables
  >(GetClaimsBasedPayment, {
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
    payClaimsOther,
    payClaimsNote,
    shouldAnyProvidersExcludedFFSSystems,
    shouldAnyProviderExcludedFFSSystemsNote,
    changesMedicarePhysicianFeeSchedule,
    changesMedicarePhysicianFeeScheduleNote,
    affectsMedicareSecondaryPayerClaims,
    affectsMedicareSecondaryPayerClaimsHow,
    affectsMedicareSecondaryPayerClaimsNote,
    payModelDifferentiation
  } = data?.modelPlan?.payments || ({} as ClaimsBasedPaymentFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  const [update] = useUpdatePaymentsMutation();

  const handleFormSubmit = (
    redirect?: 'next' | 'back' | 'task-list' | string
  ) => {
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
            history.push(
              `/models/${modelID}/task-list/payment/anticipating-dependencies`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/payment`);
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

  const initialValues: ClaimsBasedPaymentFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    payClaims: payClaims ?? [],
    payClaimsOther: payClaimsOther ?? '',
    payClaimsNote: payClaimsNote ?? '',
    shouldAnyProvidersExcludedFFSSystems:
      shouldAnyProvidersExcludedFFSSystems ?? null,
    shouldAnyProviderExcludedFFSSystemsNote:
      shouldAnyProviderExcludedFFSSystemsNote ?? '',
    changesMedicarePhysicianFeeSchedule:
      changesMedicarePhysicianFeeSchedule ?? null,
    changesMedicarePhysicianFeeScheduleNote:
      changesMedicarePhysicianFeeScheduleNote ?? '',
    affectsMedicareSecondaryPayerClaims:
      affectsMedicareSecondaryPayerClaims ?? null,
    affectsMedicareSecondaryPayerClaimsHow:
      affectsMedicareSecondaryPayerClaimsHow ?? '',
    affectsMedicareSecondaryPayerClaimsNote:
      affectsMedicareSecondaryPayerClaimsNote ?? '',
    payModelDifferentiation: payModelDifferentiation ?? ''
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
        {(formikProps: FormikProps<ClaimsBasedPaymentFormType>) => {
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
                      data-testid="payment-claims-based-payment-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <PageHeading
                          headingLevel="h3"
                          className="margin-bottom-3"
                        >
                          {paymentsMiscT('claimSpecificQuestions')}
                        </PageHeading>

                        <FieldGroup
                          scrollElement="payClaims"
                          error={!!flatErrors.payClaims}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-pay-claims"
                            id="label-payment-pay-claims"
                          >
                            {paymentsT('payClaims.label')}
                          </Label>

                          <p className="text-base margin-bottom-1 margin-top-05">
                            {paymentsT('payClaims.sublabel')}
                          </p>

                          <FieldErrorMsg>{flatErrors.payClaims}</FieldErrorMsg>

                          <Field
                            as={MultiSelect}
                            id="payment-pay-claims"
                            name="payClaims"
                            ariaLabel="label-payment-pay-claims"
                            options={composeMultiSelectOptions(
                              payClaimsConfig.options
                            )}
                            selectedLabel={paymentsT(
                              'payClaims.multiSelectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue('payClaims', value);
                            }}
                            initialValues={initialValues.payClaims}
                          />

                          {(values?.payClaims || []).includes(
                            ClaimsBasedPayType.OTHER
                          ) && (
                            <FieldGroup
                              scrollElement="payClaimsOther"
                              error={!!flatErrors.payClaimsOther}
                            >
                              <Label
                                htmlFor="payClaimsOther"
                                className="text-normal"
                              >
                                {paymentsT('payClaimsOther.label')}
                              </Label>

                              <FieldErrorMsg>
                                {flatErrors.payClaimsOther}
                              </FieldErrorMsg>

                              <Field
                                as={TextField}
                                error={flatErrors.payClaimsOther}
                                id="payment-pay-claims-other"
                                data-testid="payment-pay-claims-other"
                                name="payClaimsOther"
                              />
                            </FieldGroup>
                          )}

                          <AddNote id="pay-claims-note" field="payClaimsNote" />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="shouldAnyProvidersExcludedFFSSystems"
                          error={
                            !!flatErrors.shouldAnyProvidersExcludedFFSSystems
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="shouldAnyProvidersExcludedFFSSystems"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'shouldAnyProvidersExcludedFFSSystems.label'
                            )}
                          </Label>

                          {itSolutionsStarted && (
                            <ITSolutionsWarning
                              id="payment-provider-exclusion-ffs-system-warning"
                              className="margin-top-neg-5"
                              onClick={() =>
                                handleFormSubmit(
                                  `/models/${modelID}/task-list/it-solutions`
                                )
                              }
                            />
                          )}

                          <FieldErrorMsg>
                            {flatErrors.shouldAnyProvidersExcludedFFSSystems}
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="shouldAnyProvidersExcludedFFSSystems"
                            id="payment-provider-exclusion-ffs-system"
                            value={values.shouldAnyProvidersExcludedFFSSystems}
                            setFieldValue={setFieldValue}
                            options={
                              shouldAnyProvidersExcludedFFSSystemsConfig.options
                            }
                          />

                          <AddNote
                            id="payment-provider-exclusion-ffs-system-note"
                            field="shouldAnyProviderExcludedFFSSystemsNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="changesMedicarePhysicianFeeSchedule"
                          error={
                            !!flatErrors.changesMedicarePhysicianFeeSchedule
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="changesMedicarePhysicianFeeSchedule"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'changesMedicarePhysicianFeeSchedule.label'
                            )}
                          </Label>

                          <p className="text-base margin-y-1">
                            {paymentsT(
                              'changesMedicarePhysicianFeeSchedule.sublabel'
                            )}
                          </p>

                          <FieldErrorMsg>
                            {flatErrors.changesMedicarePhysicianFeeSchedule}
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="changesMedicarePhysicianFeeSchedule"
                            id="payment-change-medicare-phyisican-fee-schedule"
                            value={values.changesMedicarePhysicianFeeSchedule}
                            setFieldValue={setFieldValue}
                            options={
                              changesMedicarePhysicianFeeScheduleConfig.options
                            }
                          />

                          <AddNote
                            id="payment-change-medicare-phyisican-fee-schedule-note"
                            field="changesMedicarePhysicianFeeScheduleNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="affectsMedicareSecondaryPayerClaims"
                          error={
                            !!flatErrors.affectsMedicareSecondaryPayerClaims
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="affectsMedicareSecondaryPayerClaims"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'affectsMedicareSecondaryPayerClaims.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.affectsMedicareSecondaryPayerClaims}
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="affectsMedicareSecondaryPayerClaims"
                            id="payment-affects-medicare-secondary-payer-claims"
                            value={values.affectsMedicareSecondaryPayerClaims}
                            setFieldValue={setFieldValue}
                            options={
                              affectsMedicareSecondaryPayerClaimsConfig.options
                            }
                            childName="affectsMedicareSecondaryPayerClaimsHow"
                          >
                            {values.affectsMedicareSecondaryPayerClaims ? (
                              <FieldGroup
                                className="margin-left-4 margin-y-1"
                                scrollElement="affectsMedicareSecondaryPayerClaimsHow"
                                error={
                                  !!flatErrors.affectsMedicareSecondaryPayerClaimsHow
                                }
                              >
                                <Label
                                  htmlFor="payment-affects-medicare-secondary-payer-claims-how"
                                  className="text-normal"
                                >
                                  {paymentsT(
                                    'affectsMedicareSecondaryPayerClaimsHow.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {
                                    flatErrors.affectsMedicareSecondaryPayerClaimsHow
                                  }
                                </FieldErrorMsg>

                                <Field
                                  as={TextAreaField}
                                  className="height-15"
                                  error={
                                    flatErrors.affectsMedicareSecondaryPayerClaimsHow
                                  }
                                  id="payment-affects-medicare-secondary-payer-claims-how"
                                  data-testid="payment-affects-medicare-secondary-payer-claims-how"
                                  name="affectsMedicareSecondaryPayerClaimsHow"
                                />
                              </FieldGroup>
                            ) : (
                              <></>
                            )}
                          </BooleanRadio>

                          <AddNote
                            id="payment-affects-medicare-secondary-payer-claims-note"
                            field="affectsMedicareSecondaryPayerClaimsNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payModelDifferentiation"
                          error={!!flatErrors.payModelDifferentiation}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payModelDifferentiation"
                            className="maxw-none"
                          >
                            {paymentsT('payModelDifferentiation.label')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.payModelDifferentiation}
                          </FieldErrorMsg>

                          <Field
                            as={TextAreaField}
                            className="height-15"
                            error={flatErrors.payModelDifferentiation}
                            id="payment-affect-current-policy"
                            data-testid="payment-affect-current-policy"
                            name="payModelDifferentiation"
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
            2,
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

export default ClaimsBasedPayment;
