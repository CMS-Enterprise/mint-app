import React, { Fragment, useRef } from 'react';
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
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import useScrollElement from 'hooks/useScrollElement';
import GetFunding from 'queries/Payments/GetFunding';
import {
  GetFunding as GetFundingType,
  GetFunding_modelPlan_payments as FundingFormType,
  GetFundingVariables
} from 'queries/Payments/types/GetFunding';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import {
  ClaimsBasedPayType,
  FundingSource as FundingSourceEnum,
  PayRecipient,
  PayType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  sortOtherEnum,
  sortPayTypeEnums,
  translatePayRecipient,
  translatePayType,
  translateSourceOptions
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const FundingSource = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<FundingFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetFundingType,
    GetFundingVariables
  >(GetFunding, {
    variables: {
      id: modelID
    }
  });

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const {
    id,
    fundingSource,
    fundingSourceTrustFund,
    fundingSourceOther,
    fundingSourceNote,
    fundingSourceR,
    fundingSourceRTrustFund,
    fundingSourceROther,
    fundingSourceRNote,
    payRecipients,
    payRecipientsOtherSpecification,
    payRecipientsNote,
    payType,
    payTypeNote,
    payClaims
  } = data?.modelPlan?.payments || ({} as FundingFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (redirect?: 'next' | 'back' | string) => {
    const hasClaimsBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.CLAIMS_BASED_PAYMENTS
    );
    const hasNonClaimBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.NON_CLAIMS_BASED_PAYMENTS
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
            if (hasClaimsBasedPayment) {
              history.push(
                `/models/${modelID}/task-list/payment/claims-based-payment`
              );
            } else if (hasNonClaimBasedPayment) {
              history.push(
                `/models/${modelID}/task-list/payment/non-claims-based-payment`
              );
            } else {
              history.push(`/models/${modelID}/task-list/payment/complexity`);
            }
          } else if (redirect === 'back') {
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

  const initialValues: FundingFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    fundingSource: fundingSource ?? [],
    fundingSourceTrustFund: fundingSourceTrustFund ?? '',
    fundingSourceOther: fundingSourceOther ?? '',
    fundingSourceNote: fundingSourceNote ?? '',
    fundingSourceR: fundingSourceR ?? [],
    fundingSourceRTrustFund: fundingSourceRTrustFund ?? '',
    fundingSourceROther: fundingSourceROther ?? '',
    fundingSourceRNote: fundingSourceRNote ?? '',
    payRecipients: payRecipients ?? [],
    payRecipientsOtherSpecification: payRecipientsOtherSpecification ?? '',
    payRecipientsNote: payRecipientsNote ?? '',
    payType: payType ?? [],
    payTypeNote: payTypeNote ?? '',
    payClaims: payClaims ?? []
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
        {(formikProps: FormikProps<FundingFormType>) => {
          const { errors, handleSubmit, setErrors, values } = formikProps;
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
                      <FieldGroup
                        scrollElement="fundingSource"
                        error={!!flatErrors.fundingSource}
                        className="margin-top-4"
                      >
                        <Label htmlFor="fundingSource" className="maxw-none">
                          {t('fundingSource')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.fundingSource}
                        </FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(FundingSourceEnum)
                            .sort(sortOtherEnum)
                            .map(type => {
                              return (
                                <Fragment key={type}>
                                  <Field
                                    key={type}
                                    as={CheckboxField}
                                    id={`payment-funding-source-${type}`}
                                    name="fundingSource"
                                    label={translateSourceOptions(type)}
                                    value={type}
                                    checked={values.fundingSource?.includes(
                                      type as FundingSourceEnum
                                    )}
                                  />
                                  {type === 'TRUST_FUND' &&
                                    values.fundingSource?.includes(
                                      type as FundingSourceEnum
                                    ) && (
                                      <FieldGroup
                                        className="margin-left-4 margin-top-2 margin-bottom-4"
                                        error={
                                          !!flatErrors.fundingSourceTrustFund
                                        }
                                      >
                                        <Label
                                          htmlFor="fundingSourceTrustFund"
                                          className="text-normal"
                                        >
                                          {t('whichType')}
                                        </Label>
                                        <FieldErrorMsg>
                                          {flatErrors.fundingSourceTrustFund}
                                        </FieldErrorMsg>
                                        <Field
                                          as={TextInput}
                                          id="payment-funding-source-trust-fund"
                                          data-testid="payment-funding-source-trust-fund"
                                          maxLength={50}
                                          name="fundingSourceTrustFund"
                                        />
                                      </FieldGroup>
                                    )}
                                  {type === 'OTHER' &&
                                    values.fundingSource?.includes(
                                      type as FundingSourceEnum
                                    ) && (
                                      <FieldGroup
                                        className="margin-left-4 margin-top-2 margin-bottom-4"
                                        error={!!flatErrors.fundingSourceOther}
                                      >
                                        <Label
                                          htmlFor="fundingSourceOther"
                                          className="text-normal"
                                        >
                                          {t('otherSourceOption')}
                                        </Label>
                                        <FieldErrorMsg>
                                          {flatErrors.fundingSourceOther}
                                        </FieldErrorMsg>
                                        <Field
                                          as={TextInput}
                                          id="payment-funding-source-other"
                                          maxLength={50}
                                          name="fundingSourceOther"
                                        />
                                      </FieldGroup>
                                    )}
                                </Fragment>
                              );
                            })}
                        </Fieldset>
                        <AddNote
                          id="payment-funding-source-note"
                          field="fundingSourceNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="fundingSourceR"
                        error={!!flatErrors.fundingSourceR}
                        className="margin-top-4"
                      >
                        <Label htmlFor="fundingSourceR" className="maxw-none">
                          {t('reconciliation')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.fundingSourceR}
                        </FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(FundingSourceEnum)
                            .sort(sortOtherEnum)
                            .map(type => {
                              return (
                                <Fragment key={type}>
                                  <Field
                                    key={type}
                                    as={CheckboxField}
                                    id={`payment-funding-source-reconciliation-${type}`}
                                    name="fundingSourceR"
                                    label={translateSourceOptions(type)}
                                    value={type}
                                    checked={values.fundingSourceR?.includes(
                                      type as FundingSourceEnum
                                    )}
                                  />
                                  {type === 'TRUST_FUND' &&
                                    values.fundingSourceR?.includes(
                                      type as FundingSourceEnum
                                    ) && (
                                      <FieldGroup
                                        className="margin-left-4 margin-top-2 margin-bottom-4"
                                        error={
                                          !!flatErrors.fundingSourceRTrustFund
                                        }
                                      >
                                        <Label
                                          htmlFor="fundingSourceRTrustFund"
                                          className="text-normal"
                                        >
                                          {t('whichType')}
                                        </Label>
                                        <FieldErrorMsg>
                                          {flatErrors.fundingSourceRTrustFund}
                                        </FieldErrorMsg>
                                        <Field
                                          as={TextInput}
                                          id="payment-funding-source-reconciliation-trust-fund"
                                          data-testid="payment-funding-source-reconciliation-trust-fund"
                                          maxLength={50}
                                          name="fundingSourceRTrustFund"
                                        />
                                      </FieldGroup>
                                    )}
                                  {type === 'OTHER' &&
                                    values.fundingSourceR?.includes(
                                      type as FundingSourceEnum
                                    ) && (
                                      <FieldGroup
                                        className="margin-left-4 margin-top-2 margin-bottom-4"
                                        error={!!flatErrors.fundingSourceROther}
                                      >
                                        <Label
                                          htmlFor="fundingSourceROther"
                                          className="text-normal"
                                        >
                                          {t('otherSourceOption')}
                                        </Label>
                                        <FieldErrorMsg>
                                          {flatErrors.fundingSourceROther}
                                        </FieldErrorMsg>
                                        <Field
                                          as={TextInput}
                                          id="payment-funding-source-reconciliation-other"
                                          maxLength={50}
                                          name="fundingSourceROther"
                                        />
                                      </FieldGroup>
                                    )}
                                </Fragment>
                              );
                            })}
                        </Fieldset>
                        <AddNote
                          id="payment-funding-source-reconciliation-note"
                          field="fundingSourceRNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payRecipients"
                        error={!!flatErrors.payRecipients}
                        className="margin-top-4"
                      >
                        <Label htmlFor="payRecipients" className="maxw-none">
                          {t('whoWillYouPay')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.payRecipients}
                        </FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(PayRecipient)
                            .sort(sortOtherEnum)
                            .map(type => {
                              return (
                                <Fragment key={type}>
                                  <Field
                                    as={CheckboxField}
                                    id={`payment-pay-recipients-${type}`}
                                    name="payRecipients"
                                    label={translatePayRecipient(type)}
                                    value={type}
                                    checked={values.payRecipients.includes(
                                      type as PayRecipient
                                    )}
                                  />
                                  {type === 'OTHER' &&
                                    values.payRecipients.includes(
                                      type as PayRecipient
                                    ) && (
                                      <FieldGroup
                                        className="margin-left-4 margin-top-2 margin-bottom-4"
                                        error={
                                          !!flatErrors.payRecipientsOtherSpecification
                                        }
                                      >
                                        <Label
                                          htmlFor="payRecipientsOtherSpecification"
                                          className="text-normal"
                                        >
                                          {t('otherPayOption')}
                                        </Label>
                                        <FieldErrorMsg>
                                          {
                                            flatErrors.payRecipientsOtherSpecification
                                          }
                                        </FieldErrorMsg>
                                        <Field
                                          as={TextInput}
                                          id="payment-pay-recipients-other-specification"
                                          maxLength={50}
                                          name="payRecipientsOtherSpecification"
                                        />
                                      </FieldGroup>
                                    )}
                                </Fragment>
                              );
                            })}
                        </Fieldset>
                        <AddNote
                          id="payment-pay-recipients-note"
                          field="payRecipientsNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payType"
                        error={!!flatErrors.payType}
                        className="margin-top-4"
                      >
                        <Label htmlFor="payType" className="maxw-none">
                          {t('whatWillYouPay')}
                        </Label>
                        {itSolutionsStarted && (
                          <ITToolsWarning
                            id="payment-pay-recipients-warning"
                            onClick={() =>
                              handleFormSubmit(
                                `/models/${modelID}/task-list/it-solutions`
                              )
                            }
                          />
                        )}
                        <p className="text-base margin-y-1 margin-top-2">
                          {t('whatWillYouPaySubCopy')}
                        </p>
                        <FieldErrorMsg>{flatErrors.payType}</FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(PayType)
                            .sort(sortPayTypeEnums)
                            .map(type => {
                              return (
                                <Field
                                  key={type}
                                  as={CheckboxField}
                                  id={`payment-pay-recipients-${type}`}
                                  name="payType"
                                  label={translatePayType(type)}
                                  value={type}
                                  checked={values.payType.includes(
                                    type as PayType
                                  )}
                                />
                              );
                            })}
                        </Fieldset>
                        <AddNote
                          id="payment-pay-type-note"
                          field="payTypeNote"
                        />
                      </FieldGroup>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button type="submit" onClick={() => setErrors({})}>
                          {h('next')}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => handleFormSubmit('back')}
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
            1,
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

export default FundingSource;
