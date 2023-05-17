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
import useScrollElement from 'hooks/useScrollElement';
import GetClaimsBasedPayment from 'queries/Payments/GetClaimsBasedPayment';
import {
  GetClaimsBasedPayment as GetClaimsBasedPaymentType,
  GetClaimsBasedPayment_modelPlan_payments as ClaimsBasedPaymentFormType,
  GetClaimsBasedPaymentVariables
} from 'queries/Payments/types/GetClaimsBasedPayment';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import { ClaimsBasedPayType, PayType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  mapMultiSelectOptions,
  translateClaimsBasedPayType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const ClaimsBasedPayment = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
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

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

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
                      data-testid="payment-claims-based-payment-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <PageHeading
                        headingLevel="h3"
                        className="margin-bottom-3"
                      >
                        {t('claimSpecificQuestions')}
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
                          {t('selectClaims')}
                        </Label>
                        <p className="text-base margin-bottom-1 margin-top-05">
                          {t('selectClaimsSubcopy')}
                        </p>
                        <FieldErrorMsg>{flatErrors.payClaims}</FieldErrorMsg>

                        <Field
                          as={MultiSelect}
                          id="payment-pay-claims"
                          name="payClaims"
                          ariaLabel="label-payment-pay-claims"
                          options={mapMultiSelectOptions(
                            translateClaimsBasedPayType,
                            ClaimsBasedPayType
                          )}
                          selectedLabel={t('selectedClaimsOptions')}
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
                              {t('selectClaimsOther')}
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
                          {t('excludedFromPayment')}
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
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`payment-provider-exclusion-ffs-system-${key}`}
                              data-testid={`payment-provider-exclusion-ffs-system-${key}`}
                              name="shouldAnyProvidersExcludedFFSSystems"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={
                                values.shouldAnyProvidersExcludedFFSSystems ===
                                key
                              }
                              onChange={() => {
                                setFieldValue(
                                  'shouldAnyProvidersExcludedFFSSystems',
                                  key
                                );
                              }}
                            />
                          ))}
                        </Fieldset>
                        <AddNote
                          id="payment-provider-exclusion-ffs-system-note"
                          field="shouldAnyProviderExcludedFFSSystemsNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="changesMedicarePhysicianFeeSchedule"
                        error={!!flatErrors.changesMedicarePhysicianFeeSchedule}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="changesMedicarePhysicianFeeSchedule"
                          className="maxw-none"
                        >
                          {t('chageMedicareFeeSchedule')}
                        </Label>
                        <p className="text-base margin-y-1">
                          {t('chageMedicareFeeScheduleSubcopy')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.changesMedicarePhysicianFeeSchedule}
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`payment-change-medicare-phyisican-fee-schedule-${key}`}
                              data-testid={`payment-change-medicare-phyisican-fee-schedule-${key}`}
                              name="changesMedicarePhysicianFeeSchedule"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={
                                values.changesMedicarePhysicianFeeSchedule ===
                                key
                              }
                              onChange={() => {
                                setFieldValue(
                                  'changesMedicarePhysicianFeeSchedule',
                                  key
                                );
                              }}
                            />
                          ))}
                        </Fieldset>
                        <AddNote
                          id="payment-change-medicare-phyisican-fee-schedule-note"
                          field="changesMedicarePhysicianFeeScheduleNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="affectsMedicareSecondaryPayerClaims"
                        error={!!flatErrors.affectsMedicareSecondaryPayerClaims}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="affectsMedicareSecondaryPayerClaims"
                          className="maxw-none"
                        >
                          {t('affectMedicareSecondaryPayerClaim')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.affectsMedicareSecondaryPayerClaims}
                        </FieldErrorMsg>
                        <Fieldset>
                          <Field
                            as={Radio}
                            id="payment-affects-medicare-secondary-payer-claims-Yes"
                            name="affectsMedicareSecondaryPayerClaims"
                            label={h('yes')}
                            value="YES"
                            checked={
                              values.affectsMedicareSecondaryPayerClaims ===
                              true
                            }
                            onChange={() => {
                              setFieldValue(
                                'affectsMedicareSecondaryPayerClaims',
                                true
                              );
                            }}
                          />
                          {values.affectsMedicareSecondaryPayerClaims && (
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
                                {h('howSo')}
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
                          )}
                          <Field
                            as={Radio}
                            id="payment-affects-medicare-secondary-payer-claims-No"
                            name="affectsMedicareSecondaryPayerClaims"
                            label={h('no')}
                            value="FALSE"
                            checked={
                              values.affectsMedicareSecondaryPayerClaims ===
                              false
                            }
                            onChange={() => {
                              setFieldValue(
                                'affectsMedicareSecondaryPayerClaims',
                                false
                              );
                            }}
                          />
                        </Fieldset>
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
                          {t('affectCurrentPolicy')}
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
                          {h('back')}
                        </Button>
                        <Button type="submit" onClick={() => setErrors({})}>
                          {h('next')}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => handleFormSubmit('task-list')}
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
