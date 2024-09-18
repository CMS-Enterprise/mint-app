import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  ClaimsBasedPayType,
  GetClaimsBasedPaymentQuery,
  PayType,
  TypedUpdatePaymentsDocument,
  useGetClaimsBasedPaymentQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import TextField from 'components/TextField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { composeMultiSelectOptions } from 'utils/modelPlan';

import { renderCurrentPage, renderTotalPages } from '..';

type ClaimsBasedPaymentFormType =
  GetClaimsBasedPaymentQuery['modelPlan']['payments'];

const ClaimsBasedPayment = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    payClaims: payClaimsConfig,
    shouldAnyProvidersExcludedFFSSystems:
      shouldAnyProvidersExcludedFFSSystemsConfig,
    changesMedicarePhysicianFeeSchedule:
      changesMedicarePhysicianFeeScheduleConfig,
    affectsMedicareSecondaryPayerClaims:
      affectsMedicareSecondaryPayerClaimsConfig
  } = usePlanTranslation('payments');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ClaimsBasedPaymentFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetClaimsBasedPaymentQuery({
    variables: {
      id: modelID
    }
  });

  // If redirected from Operational Solutions, scrolls to the relevant question
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
  } = (data?.modelPlan?.payments || {}) as ClaimsBasedPaymentFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  const { mutationError } = useHandleMutation(TypedUpdatePaymentsDocument, {
    id,
    formikRef
  });

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
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.PAYMENTS
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-2">
        {paymentsMiscT('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {miscellaneousT('for')} {modelName}
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(
            `/models/${modelID}/collaboration-area/task-list/payment/anticipating-dependencies`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ClaimsBasedPaymentFormType>) => {
          const { handleSubmit, setFieldValue, setErrors, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

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

                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="payment-pay-claims"
                            id="label-payment-pay-claims"
                          >
                            {paymentsT('payClaims.label')}
                          </Label>

                          <p className="text-base margin-bottom-1 margin-top-05">
                            {paymentsT('payClaims.sublabel')}
                          </p>

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
                            <FieldGroup>
                              <Label
                                htmlFor="payClaimsOther"
                                className="text-normal"
                              >
                                {paymentsT('payClaimsOther.label')}
                              </Label>

                              <Field
                                as={TextField}
                                id="payment-pay-claims-other"
                                data-testid="payment-pay-claims-other"
                                name="payClaimsOther"
                              />
                            </FieldGroup>
                          )}

                          <AddNote id="pay-claims-note" field="payClaimsNote" />
                        </FieldGroup>

                        <FieldGroup className="margin-top-4">
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
                                history.push(
                                  `/models/${modelID}/collaboration-area/task-list/it-solutions`
                                )
                              }
                            />
                          )}

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

                        <FieldGroup className="margin-top-4">
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

                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="affectsMedicareSecondaryPayerClaims"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'affectsMedicareSecondaryPayerClaims.label'
                            )}
                          </Label>

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
                              <FieldGroup className="margin-left-4 margin-y-1">
                                <Label
                                  htmlFor="payment-affects-medicare-secondary-payer-claims-how"
                                  className="text-normal"
                                >
                                  {paymentsT(
                                    'affectsMedicareSecondaryPayerClaimsHow.label'
                                  )}
                                </Label>

                                <Field
                                  as={TextAreaField}
                                  className="height-15"
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

                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="payModelDifferentiation"
                            className="maxw-none"
                          >
                            {paymentsT('payModelDifferentiation.label')}
                          </Label>

                          <Field
                            as={TextAreaField}
                            className="height-15"
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
                              history.push(
                                `/models/${modelID}/collaboration-area/task-list/payment`
                              );
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
                          onClick={() =>
                            history.push(
                              `/models/${modelID}/collaboration-area/task-list`
                            )
                          }
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
