import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Formik, FormikProps } from 'formik';
import {
  ClaimsBasedPayType,
  GetAnticipateDependenciesQuery,
  PayType,
  TypedUpdatePaymentsDocument,
  useGetAnticipateDependenciesQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import Alert from 'components/Alert';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';

import { renderCurrentPage, renderTotalPages } from '..';

type AnticipateDependenciesFormType =
  GetAnticipateDependenciesQuery['modelPlan']['payments'];

const AnticipateDependencies = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    creatingDependenciesBetweenServices:
      creatingDependenciesBetweenServicesConfig,
    needsClaimsDataCollection: needsClaimsDataCollectionConfig,
    providingThirdPartyFile: providingThirdPartyFileConfig,
    isContractorAwareTestDataRequirements:
      isContractorAwareTestDataRequirementsConfig
  } = usePlanTranslation('payments');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<AnticipateDependenciesFormType>>(null);
  const navigate = useNavigate();

  const { data, loading, error } = useGetAnticipateDependenciesQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    payType,
    payClaims,
    willBePaymentAdjustments,
    willBePaymentAdjustmentsNote,
    creatingDependenciesBetweenServices,
    creatingDependenciesBetweenServicesNote,
    needsClaimsDataCollection,
    needsClaimsDataCollectionNote,
    providingThirdPartyFile,
    isContractorAwareTestDataRequirements
  } = (data?.modelPlan?.payments || {}) as AnticipateDependenciesFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(TypedUpdatePaymentsDocument, {
    id,
    formikRef: formikRef as any
  });

  const nextPage = () => {
    const hasReductionToCostSharing =
      formikRef?.current?.values.payClaims.includes(
        ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
      );
    const hasNonClaimBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.NON_CLAIMS_BASED_PAYMENTS
    );

    if (hasReductionToCostSharing) {
      navigate(
        `/models/${modelID}/collaboration-area/task-list/payment/beneficiary-cost-sharing`
      );
    } else if (hasNonClaimBasedPayment) {
      navigate(
        `/models/${modelID}/collaboration-area/task-list/payment/non-claims-based-payment`
      );
    } else {
      navigate(
        `/models/${modelID}/collaboration-area/task-list/payment/complexity`
      );
    }
  };

  const initialValues: AnticipateDependenciesFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    payClaims: payClaims ?? [],
    willBePaymentAdjustments: willBePaymentAdjustments ?? null,
    willBePaymentAdjustmentsNote: willBePaymentAdjustmentsNote ?? '',
    creatingDependenciesBetweenServices:
      creatingDependenciesBetweenServices ?? null,
    creatingDependenciesBetweenServicesNote:
      creatingDependenciesBetweenServicesNote ?? '',
    needsClaimsDataCollection: needsClaimsDataCollection ?? null,
    needsClaimsDataCollectionNote: needsClaimsDataCollectionNote ?? '',
    providingThirdPartyFile: providingThirdPartyFile ?? null,
    isContractorAwareTestDataRequirements:
      isContractorAwareTestDataRequirements ?? null
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="payment-anticipate-dependencies">
      <GridContainer>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={mutationError.closeModal}
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
            nextPage();
          }}
          enableReinitialize
          innerRef={formikRef}
        >
          {(formikProps: FormikProps<AnticipateDependenciesFormType>) => {
            const { handleSubmit, setFieldValue, setErrors, values } =
              formikProps;

            return (
              <GridContainer>
                <ConfirmLeave />

                <GridContainer className="padding-left-0 padding-right-0">
                  <Grid row gap>
                    <Grid desktop={{ col: 6 }}>
                      <MINTForm
                        className="margin-top-6"
                        data-testid="payment-anticipate-dependencies-form"
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                          handleSubmit(e);
                        }}
                      >
                        <Fieldset disabled={!!error || loading}>
                          <PageHeading
                            headingLevel="h3"
                            className="margin-bottom-3"
                          >
                            {paymentsMiscT('claimSpecificQuestionsContinued')}
                          </PageHeading>

                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="willBePaymentAdjustments"
                              className="maxw-none"
                            >
                              {paymentsT('willBePaymentAdjustments.label')}
                            </Label>

                            <p className="text-base margin-y-1">
                              {paymentsT('willBePaymentAdjustments.sublabel')}
                            </p>

                            <BooleanRadio
                              field="willBePaymentAdjustments"
                              id="payment-will-be-payment-adjustments"
                              value={values.willBePaymentAdjustments}
                              setFieldValue={setFieldValue}
                              options={
                                creatingDependenciesBetweenServicesConfig.options
                              }
                            />

                            <AddNote
                              id="payment-will-be-payment-adjustments-note"
                              field="willBePaymentAdjustmentsNote"
                            />
                          </FieldGroup>

                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="creatingDependenciesBetweenServices"
                              className="maxw-none"
                            >
                              {paymentsT(
                                'creatingDependenciesBetweenServices.label'
                              )}
                            </Label>

                            <p className="text-base margin-y-1">
                              {paymentsT(
                                'creatingDependenciesBetweenServices.sublabel'
                              )}
                            </p>

                            <BooleanRadio
                              field="creatingDependenciesBetweenServices"
                              id="payment-creating-dependencies-between-services"
                              value={values.creatingDependenciesBetweenServices}
                              setFieldValue={setFieldValue}
                              options={
                                creatingDependenciesBetweenServicesConfig.options
                              }
                            />

                            <AddNote
                              id="payment-creating-dependencies-between-services-note"
                              field="creatingDependenciesBetweenServicesNote"
                            />
                          </FieldGroup>

                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="needsClaimsDataCollection"
                              className="maxw-none"
                            >
                              {paymentsT('needsClaimsDataCollection.label')}
                            </Label>

                            <p className="text-base margin-y-1">
                              {paymentsT('needsClaimsDataCollection.sublabel')}
                            </p>

                            <BooleanRadio
                              field="needsClaimsDataCollection"
                              id="payment-needs-claims-data-collection"
                              value={values.needsClaimsDataCollection}
                              setFieldValue={setFieldValue}
                              options={needsClaimsDataCollectionConfig.options}
                            />

                            <AddNote
                              id="payment-needs-claims-data-collection-note"
                              field="needsClaimsDataCollectionNote"
                            />
                          </FieldGroup>

                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="providingThirdPartyFile"
                              className="maxw-none"
                            >
                              {paymentsT('providingThirdPartyFile.label')}
                            </Label>

                            <BooleanRadio
                              field="providingThirdPartyFile"
                              id="payment-providing-third-party-file"
                              value={values.providingThirdPartyFile}
                              setFieldValue={setFieldValue}
                              options={providingThirdPartyFileConfig.options}
                            />
                          </FieldGroup>

                          <Alert type="info" slim className="margin-y-6">
                            {paymentsMiscT('alert')}
                          </Alert>

                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="isContractorAwareTestDataRequirements"
                              className="maxw-none"
                            >
                              {paymentsT(
                                'isContractorAwareTestDataRequirements.label'
                              )}
                            </Label>

                            <BooleanRadio
                              field="isContractorAwareTestDataRequirements"
                              id="payment-contractor-aware-test-data-requirements"
                              value={
                                values.isContractorAwareTestDataRequirements
                              }
                              setFieldValue={setFieldValue}
                              options={
                                isContractorAwareTestDataRequirementsConfig.options
                              }
                            />
                          </FieldGroup>

                          <div className="margin-top-6 margin-bottom-3">
                            <Button
                              type="button"
                              className="usa-button usa-button--outline margin-bottom-1"
                              onClick={() => {
                                navigate(
                                  `/models/${modelID}/collaboration-area/task-list/payment/claims-based-payment`
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
                              navigate(
                                `/models/${modelID}/collaboration-area/task-list`
                              )
                            }
                          >
                            <Icon.ArrowBack
                              className="margin-right-1"
                              aria-hidden
                              aria-label="back"
                            />

                            {miscellaneousT('saveAndReturn')}
                          </Button>
                        </Fieldset>
                      </MINTForm>
                    </Grid>
                  </Grid>
                </GridContainer>
              </GridContainer>
            );
          }}
        </Formik>

        {data && (
          <PageNumber
            currentPage={renderCurrentPage(
              3,
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
      </GridContainer>
    </MainContent>
  );
};
export default AnticipateDependencies;
