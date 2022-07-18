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
import TextField from 'components/shared/TextField';
import GetComplexity from 'queries/Payments/GetComplexity';
import {
  GetComplexity as GetComplexityType,
  GetComplexity_modelPlan_payments as ComplexityFormType,
  GetComplexityVariables
} from 'queries/Payments/types/GetComplexity';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import {
  AnticipatedPaymentFrequencyType,
  ClaimsBasedPayType,
  ComplexityCalculationLevelType,
  PayType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateAnticipatedPaymentFrequencyType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const Complexity = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ComplexityFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetComplexityType,
    GetComplexityVariables
  >(GetComplexity, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    payType,
    payClaims,
    expectedCalculationComplexityLevel,
    expectedCalculationComplexityLevelNote,
    canParticipantsSelectBetweenPaymentMechanisms,
    canParticipantsSelectBetweenPaymentMechanismsHow,
    canParticipantsSelectBetweenPaymentMechanismsNote,
    anticipatedPaymentFrequency,
    anticipatedPaymentFrequencyOther,
    anticipatedPaymentFrequencyNote
  } = data?.modelPlan?.payments || ({} as ComplexityFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (
    formikValues: ComplexityFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const { id: updateId, __typename, ...changeValues } = formikValues;
    const hasClaimsBasedPayment = formikValues.payType.includes(
      PayType.CLAIMS_BASED_PAYMENTS
    );
    const hasReductionToCostSharing = formikValues.payClaims.includes(
      ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
    );
    const hasNonClaimBasedPayment = formikValues.payType.includes(
      PayType.NON_CLAIMS_BASED_PAYMENTS
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
            history.push(
              `/models/${modelID}/task-list/payment/recover-payment`
            );
          } else if (redirect === 'back') {
            if (hasNonClaimBasedPayment) {
              history.push(
                `/models/${modelID}/task-list/payment/non-claims-based-payment`
              );
            } else if (hasClaimsBasedPayment) {
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
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const mappedAnticipatedPaymentFrequencyType = Object.keys(
    AnticipatedPaymentFrequencyType
  )
    .sort(sortOtherEnum)
    .map(key => ({
      value: key,
      label: translateAnticipatedPaymentFrequencyType(key)
    }));

  const initialValues: ComplexityFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    payClaims: payClaims ?? [],
    expectedCalculationComplexityLevel:
      expectedCalculationComplexityLevel ?? null,
    expectedCalculationComplexityLevelNote:
      expectedCalculationComplexityLevelNote ?? '',
    canParticipantsSelectBetweenPaymentMechanisms:
      canParticipantsSelectBetweenPaymentMechanisms ?? null,
    canParticipantsSelectBetweenPaymentMechanismsHow:
      canParticipantsSelectBetweenPaymentMechanismsHow ?? '',
    canParticipantsSelectBetweenPaymentMechanismsNote:
      canParticipantsSelectBetweenPaymentMechanismsNote ?? '',
    anticipatedPaymentFrequency: anticipatedPaymentFrequency ?? [],
    anticipatedPaymentFrequencyOther: anticipatedPaymentFrequencyOther ?? '',
    anticipatedPaymentFrequencyNote: anticipatedPaymentFrequencyNote ?? ''
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
        {(formikProps: FormikProps<ComplexityFormType>) => {
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
                      data-testid="payment-complexity-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <FieldGroup
                        scrollElement="payment-complexity"
                        error={!!flatErrors.expectedCalculationComplexityLevel}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-complexity"
                          className="maxw-none"
                        >
                          {t('expectedCalculationComplexityLevel')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.expectedCalculationComplexityLevel}
                        </FieldErrorMsg>
                        <Fieldset>
                          <Field
                            as={Radio}
                            id="payment-complexity-low"
                            name="payment-complexity"
                            label={t('complexityLevel.low')}
                            value={ComplexityCalculationLevelType.LOW}
                            checked={
                              values.expectedCalculationComplexityLevel ===
                              ComplexityCalculationLevelType.LOW
                            }
                            onChange={() => {
                              setFieldValue(
                                'expectedCalculationComplexityLevel',
                                ComplexityCalculationLevelType.LOW
                              );
                            }}
                          />
                          <Field
                            as={Radio}
                            id="payment-complexity-middle"
                            name="payment-complexity"
                            label={t('complexityLevel.middle')}
                            value={ComplexityCalculationLevelType.MIDDLE}
                            checked={
                              values.expectedCalculationComplexityLevel ===
                              ComplexityCalculationLevelType.MIDDLE
                            }
                            onChange={() => {
                              setFieldValue(
                                'expectedCalculationComplexityLevel',
                                ComplexityCalculationLevelType.MIDDLE
                              );
                            }}
                          />
                          <Field
                            as={Radio}
                            id="payment-complexity-high"
                            name="payment-complexity"
                            label={t('complexityLevel.high')}
                            value={ComplexityCalculationLevelType.HIGH}
                            checked={
                              values.expectedCalculationComplexityLevel ===
                              ComplexityCalculationLevelType.HIGH
                            }
                            onChange={() => {
                              setFieldValue(
                                'expectedCalculationComplexityLevel',
                                ComplexityCalculationLevelType.HIGH
                              );
                            }}
                          />
                        </Fieldset>
                        <AddNote
                          id="payment-complexity-note"
                          field="expectedCalculationComplexityLevelNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-complexity"
                        error={
                          !!flatErrors.canParticipantsSelectBetweenPaymentMechanisms
                        }
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="payment-multiple-payments"
                          className="maxw-none"
                        >
                          {t('canParticipantsSelectBetweenPaymentMechanisms')}
                        </Label>
                        <FieldErrorMsg>
                          {
                            flatErrors.canParticipantsSelectBetweenPaymentMechanisms
                          }
                        </FieldErrorMsg>
                        <Fieldset>
                          <Field
                            as={Radio}
                            id="payment-multiple-payments-Yes"
                            name="payment-multiple-payments"
                            label={h('yes')}
                            value="YES"
                            checked={
                              values.canParticipantsSelectBetweenPaymentMechanisms ===
                              true
                            }
                            onChange={() => {
                              setFieldValue(
                                'canParticipantsSelectBetweenPaymentMechanisms',
                                true
                              );
                            }}
                          />
                          {values.canParticipantsSelectBetweenPaymentMechanisms && (
                            <FieldGroup
                              className="margin-left-4 margin-y-1"
                              scrollElement="canParticipantsSelectBetweenPaymentMechanismsHow"
                              error={
                                !!flatErrors.canParticipantsSelectBetweenPaymentMechanismsHow
                              }
                            >
                              <Label
                                htmlFor="payment-multiple-payments-how"
                                className="text-normal"
                              >
                                {t(
                                  'canParticipantsSelectBetweenPaymentMechanismsHow'
                                )}
                              </Label>
                              <FieldErrorMsg>
                                {
                                  flatErrors.canParticipantsSelectBetweenPaymentMechanismsHow
                                }
                              </FieldErrorMsg>
                              <Field
                                as={TextField}
                                error={
                                  flatErrors.canParticipantsSelectBetweenPaymentMechanismsHow
                                }
                                id="payment-multiple-payments-how"
                                data-testid="payment-multiple-payments-how"
                                name="canParticipantsSelectBetweenPaymentMechanismsHow"
                              />
                            </FieldGroup>
                          )}
                          <Field
                            as={Radio}
                            id="payment-multiple-payments-No"
                            name="payment-multiple-payments"
                            label={h('no')}
                            value="NO"
                            checked={
                              values.canParticipantsSelectBetweenPaymentMechanisms ===
                              false
                            }
                            onChange={() => {
                              setFieldValue(
                                'canParticipantsSelectBetweenPaymentMechanisms',
                                false
                              );
                            }}
                          />
                        </Fieldset>
                        <AddNote
                          id="payment-multiple-payments-note"
                          field="canParticipantsSelectBetweenPaymentMechanismsNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="payment-frequency-payments"
                        error={!!flatErrors.anticipatedPaymentFrequency}
                        className="margin-top-4"
                      >
                        <Label htmlFor="payment-frequency-payments">
                          {t('anticipatedPaymentFrequency')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.anticipatedPaymentFrequency}
                        </FieldErrorMsg>

                        <Field
                          as={MultiSelect}
                          id="payment-frequency-payments"
                          name="payment-frequency-payments"
                          options={mappedAnticipatedPaymentFrequencyType}
                          selectedLabel={t(
                            'selectedAnticipatedPaymentFrequency'
                          )}
                          onChange={(value: string[] | []) => {
                            setFieldValue('anticipatedPaymentFrequency', value);
                          }}
                          initialValues={
                            initialValues.anticipatedPaymentFrequency
                          }
                        />

                        {(values?.anticipatedPaymentFrequency || []).includes(
                          AnticipatedPaymentFrequencyType.OTHER
                        ) && (
                          <FieldGroup
                            scrollElement="payment-frequency-payments-other"
                            error={
                              !!flatErrors.anticipatedPaymentFrequencyOther
                            }
                          >
                            <Label
                              htmlFor="anticipatedPaymentFrequencyOther"
                              className="text-normal"
                            >
                              {t('selectClaimsOther')}
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors.anticipatedPaymentFrequencyOther}
                            </FieldErrorMsg>
                            <Field
                              as={TextField}
                              error={
                                flatErrors.anticipatedPaymentFrequencyOther
                              }
                              id="payment-frequency-payments-other"
                              data-testid="payment-frequency-payments-other"
                              name="nonClaimsPaymentOther"
                            />
                          </FieldGroup>
                        )}
                        <AddNote
                          id="payment-frequency-payments-note"
                          field="anticipatedPaymentFrequencyNote"
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
