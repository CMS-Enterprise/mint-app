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
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
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
import { sortOtherEnum, translateClaimsBasedPayType } from 'utils/modelPlan';
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

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (
    formikValues: ClaimsBasedPaymentFormType,
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
              `/models/${modelID}/task-list/payment/anticipating-dependencies`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/payment`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const mappedClaimsBasedPayType = Object.keys(ClaimsBasedPayType)
    .sort(sortOtherEnum)
    .map(key => ({
      value: key,
      label: translateClaimsBasedPayType(key)
    }));

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
        onSubmit={values => {
          handleFormSubmit(values, 'next');
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
                      data-testid="payment-funding-source-form"
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
                        <Label htmlFor="payment-pay-claims">
                          {t('selectClaims')}
                        </Label>
                        <p className="text-base margin-bottom-1 margin-top-05">
                          {t('selectClaimsSubcopy')}
                        </p>
                        <FieldErrorMsg>{flatErrors.payClaims}</FieldErrorMsg>

                        <Field
                          as={MultiSelect}
                          id="payment-pay-claims"
                          name="beneficiaries"
                          options={mappedClaimsBasedPayType}
                          selectedLabel={t('selectedGroup')}
                          onChange={(value: string[] | []) => {
                            setFieldValue('payClaims', value);
                          }}
                          initialValues={initialValues.payClaims}
                        />

                        {(values?.payClaims || []).includes(
                          ClaimsBasedPayType.OTHER
                        ) && (
                          <FieldGroup
                            scrollElement="payment-pay-claims-other"
                            error={!!flatErrors.payClaimsOther}
                          >
                            <Label
                              htmlFor="payment-pay-claims-other"
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
                              name="payment-pay-claims-other"
                            />
                          </FieldGroup>
                        )}

                        <AddNote id="pay-claims-note" field="payClaimsNotes" />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-provider-exclusion-ffs-system"
                        error={
                          !!flatErrors.shouldAnyProvidersExcludedFFSSystems
                        }
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-provider-exclusion-ffs-system"
                          className="maxw-none"
                        >
                          {t('excludedFromPayment')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.shouldAnyProvidersExcludedFFSSystems}
                        </FieldErrorMsg>
                        <Fieldset>
                          <Field
                            as={Radio}
                            id="payment-provider-exclusion-ffs-system-Yes"
                            name="payment-provider-exclusion-ffs-system"
                            label={h('yes')}
                            value="YES"
                            checked={
                              values.shouldAnyProvidersExcludedFFSSystems ===
                              true
                            }
                            onChange={() => {
                              setFieldValue(
                                'shouldAnyProvidersExcludedFFSSystems',
                                true
                              );
                            }}
                          />
                          <Field
                            as={Radio}
                            id="payment-provider-exclusion-ffs-system-No"
                            name="payment-provider-exclusion-ffs-system"
                            label={h('no')}
                            value="FALSE"
                            checked={
                              values.shouldAnyProvidersExcludedFFSSystems ===
                              false
                            }
                            onChange={() => {
                              setFieldValue(
                                'shouldAnyProvidersExcludedFFSSystems',
                                false
                              );
                            }}
                          />
                        </Fieldset>
                        <AddNote
                          id="payment-provider-exclusion-ffs-system-note"
                          field="shouldAnyProviderExcludedFFSSystemsNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-change-medicare-phyisican-fee-schedule"
                        error={!!flatErrors.changesMedicarePhysicianFeeSchedule}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-change-medicare-phyisican-fee-schedule"
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
                          <Field
                            as={Radio}
                            id="payment-change-medicare-phyisican-fee-schedule-Yes"
                            name="payment-change-medicare-phyisican-fee-schedule"
                            label={h('yes')}
                            value="YES"
                            checked={
                              values.changesMedicarePhysicianFeeSchedule ===
                              true
                            }
                            onChange={() => {
                              setFieldValue(
                                'changesMedicarePhysicianFeeSchedule',
                                true
                              );
                            }}
                          />
                          <Field
                            as={Radio}
                            id="payment-change-medicare-phyisican-fee-schedule-No"
                            name="payment-change-medicare-phyisican-fee-schedule"
                            label={h('no')}
                            value="FALSE"
                            checked={
                              values.changesMedicarePhysicianFeeSchedule ===
                              false
                            }
                            onChange={() => {
                              setFieldValue(
                                'changesMedicarePhysicianFeeSchedule',
                                false
                              );
                            }}
                          />
                        </Fieldset>
                        <AddNote
                          id="payment-change-medicare-phyisican-fee-schedule-note"
                          field="changesMedicarePhysicianFeeScheduleNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-affects-medicare-secondary-payer-claims"
                        error={!!flatErrors.affectsMedicareSecondaryPayerClaims}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-affects-medicare-secondary-payer-claims"
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
                            name="payment-affects-medicare-secondary-payer-claims"
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
                                name="payment-affects-medicare-secondary-payer-claims-how"
                              />
                            </FieldGroup>
                          )}
                          <Field
                            as={Radio}
                            id="payment-affects-medicare-secondary-payer-claims-No"
                            name="payment-affects-medicare-secondary-payer-claims"
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
                        scrollElement="payment-affect-current-policy"
                        error={!!flatErrors.payModelDifferentiation}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-affect-current-policy"
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
                          name="payment-affect-current-policy"
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

export default ClaimsBasedPayment;
