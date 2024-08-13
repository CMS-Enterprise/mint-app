import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';
import {
  ClaimsBasedPayType,
  GetRecoverQuery,
  PayType,
  TypedUpdatePaymentsDocument,
  useGetRecoverQuery
} from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FrequencyForm from 'components/FrequencyForm';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import MINTDatePicker from 'components/shared/DatePicker';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

type RecoverFormType = GetRecoverQuery['modelPlan']['payments'];

const Recover = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    willRecoverPayments: willRecoverPaymentsConfig,
    anticipateReconcilingPaymentsRetrospectively: anticipateReconcilingPaymentsRetrospectivelyConfig,
    paymentReconciliationFrequency: paymentReconciliationFrequencyConfig,
    paymentDemandRecoupmentFrequency: paymentDemandRecoupmentFrequencyConfig
  } = usePlanTranslation('payments');

  const { modelID } = useParams<{ modelID: string }>();

  const flags = useFlags();

  // Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
  type InitialValueType = Omit<
    RecoverFormType,
    'readyForReviewByUserAccount' | 'readyForReviewDts'
  >;

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetRecoverQuery({
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
    willRecoverPayments,
    willRecoverPaymentsNote,
    anticipateReconcilingPaymentsRetrospectively,
    anticipateReconcilingPaymentsRetrospectivelyNote,
    paymentReconciliationFrequency,
    paymentReconciliationFrequencyContinually,
    paymentReconciliationFrequencyOther,
    paymentReconciliationFrequencyNote,
    paymentDemandRecoupmentFrequency,
    paymentDemandRecoupmentFrequencyContinually,
    paymentDemandRecoupmentFrequencyOther,
    paymentDemandRecoupmentFrequencyNote,
    paymentStartDate,
    paymentStartDateNote,
    readyForReviewByUserAccount,
    readyForReviewDts,
    status
  } = (data?.modelPlan?.payments || {}) as RecoverFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(TypedUpdatePaymentsDocument, {
    id,
    formikRef
  });

  const initialValues: InitialValueType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    payClaims: payClaims ?? [],
    willRecoverPayments: willRecoverPayments ?? null,
    willRecoverPaymentsNote: willRecoverPaymentsNote ?? '',
    anticipateReconcilingPaymentsRetrospectively:
      anticipateReconcilingPaymentsRetrospectively ?? null,
    anticipateReconcilingPaymentsRetrospectivelyNote:
      anticipateReconcilingPaymentsRetrospectivelyNote ?? '',
    paymentReconciliationFrequency: paymentReconciliationFrequency ?? [],
    paymentReconciliationFrequencyContinually:
      paymentReconciliationFrequencyContinually ?? '',
    paymentReconciliationFrequencyOther:
      paymentReconciliationFrequencyOther ?? '',
    paymentReconciliationFrequencyNote:
      paymentReconciliationFrequencyNote ?? '',
    paymentDemandRecoupmentFrequency: paymentDemandRecoupmentFrequency ?? [],
    paymentDemandRecoupmentFrequencyContinually:
      paymentDemandRecoupmentFrequencyContinually ?? '',
    paymentDemandRecoupmentFrequencyOther:
      paymentDemandRecoupmentFrequencyOther ?? '',
    paymentDemandRecoupmentFrequencyNote:
      paymentDemandRecoupmentFrequencyNote ?? '',
    paymentStartDate: paymentStartDate ?? '',
    paymentStartDateNote: paymentStartDateNote ?? '',
    status
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
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName || ' '} indexTwo
        </Trans>
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(`/models/${modelID}/task-list/it-solutions`);
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<InitialValueType>) => {
          const {
            errors,
            handleSubmit,
            setFieldValue,
            setFieldError,
            setErrors,
            values
          } = formikProps;
          const flatErrors = flattenErrors(errors);

          const handleOnBlur = (
            e: React.ChangeEvent<HTMLInputElement>,
            field: string
          ) => {
            if (e.target.value === '') {
              setFieldValue(field, null);
              return;
            }
            try {
              setFieldValue(field, new Date(e.target.value).toISOString());
              delete errors[field as keyof InitialValueType];
            } catch (err) {
              setFieldError(field, paymentsT('validDate'));
            }
          };

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

              <ConfirmLeave />

              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap>
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="payment-recover-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup
                          scrollElement="willRecoverPayments"
                          error={!!flatErrors.willRecoverPayments}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-recover-payment"
                            className="maxw-none"
                          >
                            {paymentsT('willRecoverPayments.label')}
                          </Label>

                          {itSolutionsStarted && (
                            <ITSolutionsWarning
                              id="payment-recover-payment-warning"
                              onClick={() =>
                                history.push(
                                  `/models/${modelID}/task-list/it-solutions`
                                )
                              }
                            />
                          )}

                          <FieldErrorMsg>
                            {flatErrors.willRecoverPayments}
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="willRecoverPayments"
                            id="payment-recover-payment"
                            value={values.willRecoverPayments}
                            setFieldValue={setFieldValue}
                            options={willRecoverPaymentsConfig.options}
                          />

                          <AddNote
                            id="payment-recover-payment-note"
                            field="willRecoverPaymentsNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payment-anticipate-reconciling-payment-retro"
                          error={
                            !!flatErrors.anticipateReconcilingPaymentsRetrospectively
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-anticipate-reconciling-payment-retro"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'anticipateReconcilingPaymentsRetrospectively.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {
                              flatErrors.anticipateReconcilingPaymentsRetrospectively
                            }
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="anticipateReconcilingPaymentsRetrospectively"
                            id="payment-anticipate-reconciling-payment-retro"
                            value={
                              values.anticipateReconcilingPaymentsRetrospectively
                            }
                            setFieldValue={setFieldValue}
                            options={
                              anticipateReconcilingPaymentsRetrospectivelyConfig.options
                            }
                          />

                          <AddNote
                            id="payment-anticipate-reconciling-payment-retro-note"
                            field="anticipateReconcilingPaymentsRetrospectivelyNote"
                          />
                        </FieldGroup>

                        <FrequencyForm
                          field="paymentReconciliationFrequency"
                          values={values.paymentReconciliationFrequency}
                          config={paymentReconciliationFrequencyConfig}
                          nameSpace="payments"
                          id="payment-reconciliation-frequency"
                          label={paymentsT(
                            'paymentReconciliationFrequency.label'
                          )}
                          disabled={loading}
                        />

                        <FrequencyForm
                          field="paymentDemandRecoupmentFrequency"
                          values={values.paymentDemandRecoupmentFrequency}
                          config={paymentDemandRecoupmentFrequencyConfig}
                          nameSpace="payments"
                          id="payment-demand-recoupment-frequency"
                          label={paymentsT(
                            'paymentDemandRecoupmentFrequency.label'
                          )}
                          disabled={loading}
                        />

                        {!loading && (
                          <>
                            <MINTDatePicker
                              fieldName="paymentStartDate"
                              id="payment-payment-start-date"
                              className="margin-top-6"
                              label={paymentsT('paymentStartDate.label')}
                              subLabel={paymentsT('paymentStartDate.sublabel')}
                              placeHolder
                              handleOnBlur={handleOnBlur}
                              formikValue={values.paymentStartDate}
                              value={paymentStartDate}
                              error={flatErrors.paymentStartDate}
                            />

                            <AddNote
                              id="payment-payment-start-date-note"
                              field="paymentStartDateNote"
                            />
                          </>
                        )}

                        {!loading && values.status && (
                          <ReadyForReview
                            id="payment-status"
                            field="status"
                            sectionName={paymentsMiscT('heading')}
                            status={values.status}
                            setFieldValue={setFieldValue}
                            readyForReviewBy={
                              readyForReviewByUserAccount?.commonName
                            }
                            readyForReviewDts={readyForReviewDts}
                          />
                        )}

                        <div className="margin-top-6 margin-bottom-3">
                          <Button
                            type="button"
                            className="usa-button usa-button--outline margin-bottom-1"
                            onClick={() => {
                              history.push(
                                `/models/${modelID}/task-list/payment/complexity`
                              );
                            }}
                          >
                            {miscellaneousT('back')}
                          </Button>

                          {!flags.hideITLeadExperience && (
                            <Button type="submit" onClick={() => setErrors({})}>
                              {paymentsMiscT('continueToITSolutions')}
                            </Button>
                          )}
                        </div>

                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled"
                          onClick={() =>
                            history.push(`/models/${modelID}/task-list`)
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
            7,
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

export default Recover;
