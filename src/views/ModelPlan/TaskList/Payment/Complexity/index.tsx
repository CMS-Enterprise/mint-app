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
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { useUpdatePaymentsMutation } from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import usePlanTranslation from 'hooks/usePlanTranslation';
import GetComplexity from 'queries/Payments/GetComplexity';
import {
  GetComplexity as GetComplexityType,
  GetComplexity_modelPlan_payments as ComplexityFormType,
  GetComplexityVariables
} from 'queries/Payments/types/GetComplexity';
import {
  AnticipatedPaymentFrequencyType,
  ClaimsBasedPayType,
  PayType
} from 'types/graphql-global-types';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const Complexity = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    expectedCalculationComplexityLevel: expectedCalculationComplexityLevelConfig,
    canParticipantsSelectBetweenPaymentMechanisms: canParticipantsSelectBetweenPaymentMechanismsConfig,
    anticipatedPaymentFrequency: anticipatedPaymentFrequencyConfig
  } = usePlanTranslation('payments');

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

  const [update] = useUpdatePaymentsMutation();

  const handleFormSubmit = (redirect?: 'next' | 'back' | 'task-list') => {
    const hasClaimsBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.CLAIMS_BASED_PAYMENTS
    );
    const hasReductionToCostSharing = formikRef?.current?.values.payClaims.includes(
      ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
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
                      data-testid="payment-complexity-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup
                          scrollElement="expectedCalculationComplexityLevel"
                          error={
                            !!flatErrors.expectedCalculationComplexityLevel
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="expectedCalculationComplexityLevel"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'expectedCalculationComplexityLevel.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.expectedCalculationComplexityLevel}
                          </FieldErrorMsg>

                          <Fieldset>
                            {getKeys(
                              expectedCalculationComplexityLevelConfig.options
                            ).map(key => (
                              <Field
                                as={Radio}
                                key={key}
                                id={`payment-complexity-${key}`}
                                data-testid={`payment-complexity-${key}`}
                                name="expectedCalculationComplexityLevel"
                                label={
                                  expectedCalculationComplexityLevelConfig
                                    .options[key]
                                }
                                value={key}
                                checked={
                                  values.expectedCalculationComplexityLevel ===
                                  key
                                }
                                onChange={() => {
                                  setFieldValue(
                                    'expectedCalculationComplexityLevel',
                                    key
                                  );
                                }}
                              />
                            ))}
                          </Fieldset>

                          <AddNote
                            id="payment-complexity-note"
                            field="expectedCalculationComplexityLevelNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="canParticipantsSelectBetweenPaymentMechanisms"
                          error={
                            !!flatErrors.canParticipantsSelectBetweenPaymentMechanisms
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="canParticipantsSelectBetweenPaymentMechanisms"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'canParticipantsSelectBetweenPaymentMechanisms.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {
                              flatErrors.canParticipantsSelectBetweenPaymentMechanisms
                            }
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="canParticipantsSelectBetweenPaymentMechanisms"
                            id="payment-multiple-payments"
                            value={
                              values.canParticipantsSelectBetweenPaymentMechanisms
                            }
                            setFieldValue={setFieldValue}
                            options={
                              canParticipantsSelectBetweenPaymentMechanismsConfig.options
                            }
                            childName="canParticipantsSelectBetweenPaymentMechanismsHow"
                          >
                            {values.canParticipantsSelectBetweenPaymentMechanisms ? (
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
                                  {paymentsT(
                                    'canParticipantsSelectBetweenPaymentMechanismsHow.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {
                                    flatErrors.canParticipantsSelectBetweenPaymentMechanismsHow
                                  }
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  error={
                                    flatErrors.canParticipantsSelectBetweenPaymentMechanismsHow
                                  }
                                  id="payment-multiple-payments-how"
                                  data-testid="payment-multiple-payments-how"
                                  name="canParticipantsSelectBetweenPaymentMechanismsHow"
                                />
                              </FieldGroup>
                            ) : (
                              <></>
                            )}
                          </BooleanRadio>

                          <AddNote
                            id="payment-multiple-payments-note"
                            field="canParticipantsSelectBetweenPaymentMechanismsNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="anticipatedPaymentFrequency"
                          error={!!flatErrors.anticipatedPaymentFrequency}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="anticipatedPaymentFrequency"
                            id="label-anticipatedPaymentFrequency"
                          >
                            {paymentsT('anticipatedPaymentFrequency.label')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.anticipatedPaymentFrequency}
                          </FieldErrorMsg>

                          <Field
                            as={MultiSelect}
                            id="payment-frequency-payments"
                            name="anticipatedPaymentFrequency"
                            ariaLabel="label-anticipatedPaymentFrequency"
                            options={composeMultiSelectOptions(
                              anticipatedPaymentFrequencyConfig.options
                            )}
                            selectedLabel={paymentsT(
                              'anticipatedPaymentFrequency.multiSelectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue(
                                'anticipatedPaymentFrequency',
                                value
                              );
                            }}
                            initialValues={
                              initialValues.anticipatedPaymentFrequency
                            }
                          />

                          {(values?.anticipatedPaymentFrequency || []).includes(
                            AnticipatedPaymentFrequencyType.OTHER
                          ) && (
                            <FieldGroup
                              scrollElement="anticipatedPaymentFrequencyOther"
                              error={
                                !!flatErrors.anticipatedPaymentFrequencyOther
                              }
                            >
                              <Label
                                htmlFor="anticipatedPaymentFrequencyOther"
                                className="text-normal"
                              >
                                {paymentsT(
                                  'anticipatedPaymentFrequencyOther.label'
                                )}
                              </Label>

                              <FieldErrorMsg>
                                {flatErrors.anticipatedPaymentFrequencyOther}
                              </FieldErrorMsg>

                              <Field
                                as={TextInput}
                                error={
                                  flatErrors.anticipatedPaymentFrequencyOther
                                }
                                id="payment-frequency-payments-other"
                                data-testid="payment-frequency-payments-other"
                                name="anticipatedPaymentFrequencyOther"
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
            6,
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

export default Complexity;
