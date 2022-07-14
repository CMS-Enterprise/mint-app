import React, { Fragment, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import getFunding from 'queries/Payments/getFunding';
import {
  GetFunding as GetFundingType,
  GetFunding_modelPlan_payments as FundingFormType,
  GetFundingVariables
} from 'queries/Payments/types/GetFunding';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import {
  FundingSource as FundingSourceEnum,
  PayRecipient,
  PayType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  sortPayTypeEnums,
  translatePayRecipient,
  translatePayType,
  translateSourceOptions
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const FundingSource = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<FundingFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetFundingType,
    GetFundingVariables
  >(getFunding, {
    variables: {
      id: modelID
    }
  });

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
    payTypeNote
  } = data?.modelPlan?.payments || ({} as FundingFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (
    formikValues: FundingFormType,
    redirect?: 'next' | 'back'
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
            // *  Claims-based payments triggers 2 extra pages of questions. Non-claims-based payments triggers 1 extra page of questions.
            // todo: conditionally direct people if those options are selected

            history.push(`/models/${modelID}/task-list/payments/page-TBD`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/`);
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
    payTypeNote: payTypeNote ?? ''
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
        {(formikProps: FormikProps<FundingFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
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
                      <FieldArray
                        name="fundingSource"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('fundingSource')}
                            </legend>
                            <FieldErrorMsg>
                              {flatErrors.fundingSource}
                            </FieldErrorMsg>

                            {Object.keys(FundingSourceEnum)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      id={`payment-funding-source-${type}`}
                                      name="fundingSource"
                                      label={translateSourceOptions(type)}
                                      value={type}
                                      checked={values.fundingSource?.includes(
                                        type as FundingSourceEnum
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.fundingSource!.indexOf(
                                            e.target.value as FundingSourceEnum
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
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
                                            htmlFor="payment-funding-source-other"
                                            className="text-normal"
                                          >
                                            {t('whichType')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.fundingSourceTrustFund}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            id="payment-funding-source-other"
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
                                          error={
                                            !!flatErrors.fundingSourceOther
                                          }
                                        >
                                          <Label
                                            htmlFor="payment-funding-source-other"
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
                          </>
                        )}
                      />

                      <AddNote
                        id="payment-funding-source-note"
                        field="fundingSourceNote"
                      />

                      <FieldArray
                        name="fundingSourceR"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('reconciliation')}
                            </legend>
                            <FieldErrorMsg>
                              {flatErrors.fundingSourceR}
                            </FieldErrorMsg>

                            {Object.keys(FundingSourceEnum)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      id={`payment-funding-source-reconciliation-${type}`}
                                      name="fundingSourceR"
                                      label={translateSourceOptions(type)}
                                      value={type}
                                      checked={values.fundingSourceR?.includes(
                                        type as FundingSourceEnum
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.fundingSourceR!.indexOf(
                                            e.target.value as FundingSourceEnum
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === 'TRUST_FUND' &&
                                      values.fundingSourceR.includes(
                                        type as FundingSourceEnum
                                      ) && (
                                        <FieldGroup
                                          className="margin-left-4 margin-top-2 margin-bottom-4"
                                          error={
                                            !!flatErrors.fundingSourceRTrustFund
                                          }
                                        >
                                          <Label
                                            htmlFor="payment-funding-source-reconciliation-trust-fund"
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
                                          error={
                                            !!flatErrors.fundingSourceROther
                                          }
                                        >
                                          <Label
                                            htmlFor="payment-funding-source-reconciliation-other"
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
                          </>
                        )}
                      />

                      <AddNote
                        id="payment-funding-source-reconciliation-note"
                        field="fundingSourceRNote"
                      />

                      <FieldArray
                        name="payRecipients"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('whatWillYouPay')}
                            </legend>
                            <FieldErrorMsg>
                              {flatErrors.payRecipients}
                            </FieldErrorMsg>

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
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.payRecipients.indexOf(
                                            e.target.value as PayRecipient
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
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
                                            htmlFor="payment-pay-recipients-other"
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
                                            id="payment-pay-recipients-other"
                                            maxLength={50}
                                            name="payRecipientsOtherSpecification"
                                          />
                                        </FieldGroup>
                                      )}
                                  </Fragment>
                                );
                              })}
                          </>
                        )}
                      />

                      <AddNote
                        id="payment-pay-recipients-note"
                        field="payRecipientsNote"
                      />

                      <FieldArray
                        name="payType"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('whatWillYouPay')}
                            </legend>
                            <p className="text-base margin-y-1 margin-top-2">
                              {t('whatWillYouPaySubCopy')}
                            </p>
                            <FieldErrorMsg>{flatErrors.payType}</FieldErrorMsg>

                            {Object.keys(PayType)
                              .sort(sortPayTypeEnums)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      id={`payment-pay-type-${type}`}
                                      name="payType"
                                      label={translatePayType(type)}
                                      value={type}
                                      checked={values.payType.includes(
                                        type as PayType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.payType.indexOf(
                                            e.target.value as PayType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                  </Fragment>
                                );
                              })}
                          </>
                        )}
                      />

                      <AddNote id="payment-pay-type-note" field="payTypeNote" />

                      <div className="margin-top-6 margin-bottom-3">
                        <Button type="submit" onClick={() => setErrors({})}>
                          {h('next')}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => handleFormSubmit(values, 'back')}
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
      <PageNumber currentPage={1} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default FundingSource;
