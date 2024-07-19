import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
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
import { Form, Formik, FormikProps } from 'formik';
import {
  ClaimsBasedPayType,
  GetAnticipateDependenciesQuery,
  PayType,
  useGetAnticipateDependenciesQuery,
  useUpdatePaymentsMutation
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

type AnticipateDependenciesFormType = GetAnticipateDependenciesQuery['modelPlan']['payments'];

const AnticipateDependencies = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    creatingDependenciesBetweenServices: creatingDependenciesBetweenServicesConfig,
    needsClaimsDataCollection: needsClaimsDataCollectionConfig,
    providingThirdPartyFile: providingThirdPartyFileConfig,
    isContractorAwareTestDataRequirements: isContractorAwareTestDataRequirementsConfig
  } = usePlanTranslation('payments');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<AnticipateDependenciesFormType>>(null);
  const history = useHistory();

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

  const [update] = useUpdatePaymentsMutation();

  const handleFormSubmit = (redirect?: 'next' | 'back' | 'task-list') => {
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
            if (hasReductionToCostSharing) {
              history.push(
                `/models/${modelID}/task-list/payment/beneficiary-cost-sharing`
              );
            } else if (hasNonClaimBasedPayment) {
              history.push(
                `/models/${modelID}/task-list/payment/non-claims-based-payment`
              );
            } else {
              history.push(`/models/${modelID}/task-list/payment/complexity`);
            }
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/payment/claims-based-payment`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
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
          handleFormSubmit('next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<AnticipateDependenciesFormType>) => {
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
                      data-testid="payment-anticipate-dependencies-form"
                      onSubmit={e => {
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

                        <FieldGroup
                          scrollElement="creatingDependenciesBetweenServices"
                          error={
                            !!flatErrors.creatingDependenciesBetweenServices
                          }
                          className="margin-top-4"
                        >
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

                          <FieldErrorMsg>
                            {flatErrors.creatingDependenciesBetweenServices}
                          </FieldErrorMsg>

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

                        <FieldGroup
                          scrollElement="needsClaimsDataCollection"
                          error={!!flatErrors.needsClaimsDataCollection}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="needsClaimsDataCollection"
                            className="maxw-none"
                          >
                            {paymentsT('needsClaimsDataCollection.label')}
                          </Label>

                          <p className="text-base margin-y-1">
                            {paymentsT('needsClaimsDataCollection.sublabel')}
                          </p>

                          <FieldErrorMsg>
                            {flatErrors.needsClaimsDataCollection}
                          </FieldErrorMsg>

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

                        <FieldGroup
                          scrollElement="providingThirdPartyFile"
                          error={!!flatErrors.providingThirdPartyFile}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="providingThirdPartyFile"
                            className="maxw-none"
                          >
                            {paymentsT('providingThirdPartyFile.label')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.providingThirdPartyFile}
                          </FieldErrorMsg>

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

                        <FieldGroup
                          scrollElement="isContractorAwareTestDataRequirements"
                          error={
                            !!flatErrors.isContractorAwareTestDataRequirements
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="isContractorAwareTestDataRequirements"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'isContractorAwareTestDataRequirements.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.isContractorAwareTestDataRequirements}
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="isContractorAwareTestDataRequirements"
                            id="payment-contractor-aware-test-data-requirements"
                            value={values.isContractorAwareTestDataRequirements}
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
    </>
  );
};
export default AnticipateDependencies;
