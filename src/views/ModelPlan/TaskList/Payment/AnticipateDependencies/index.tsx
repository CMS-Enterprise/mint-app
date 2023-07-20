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
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetAnticipateDependencies from 'queries/Payments/GetAnticipateDependencies';
import {
  GetAnticipateDependencies as GetAnticipateDependenciesType,
  GetAnticipateDependencies_modelPlan_payments as AnticipateDependenciesFormType,
  GetAnticipateDependenciesVariables
} from 'queries/Payments/types/GetAnticipateDependencies';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import { ClaimsBasedPayType, PayType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const AnticipateDependencies = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<AnticipateDependenciesFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetAnticipateDependenciesType,
    GetAnticipateDependenciesVariables
  >(GetAnticipateDependencies, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    payType,
    payClaims,
    creatingDependenciesBetweenServices,
    creatingDependenciesBetweenServicesNote,
    needsClaimsDataCollection,
    needsClaimsDataCollectionNote,
    providingThirdPartyFile,
    isContractorAwareTestDataRequirements
  } = data?.modelPlan?.payments || ({} as AnticipateDependenciesFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

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
                      data-testid="payment-anticipate-dependencies-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={loading}>
                        <PageHeading
                          headingLevel="h3"
                          className="margin-bottom-3"
                        >
                          {t('claimSpecificQuestionsContinued')}
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
                            {t('ancitipateCreatingDependencies')}
                          </Label>
                          <p className="text-base margin-y-1">
                            {t('ancitipateCreatingDependenciesSubcopy')}
                          </p>
                          <FieldErrorMsg>
                            {flatErrors.creatingDependenciesBetweenServices}
                          </FieldErrorMsg>
                          <Fieldset>
                            {[true, false].map(key => (
                              <Field
                                as={Radio}
                                key={key}
                                id={`payment-creating-dependencies-between-services-${key}`}
                                data-testid={`payment-creating-dependencies-between-services-${key}`}
                                name="creatingDependenciesBetweenServices"
                                label={key ? h('yes') : h('no')}
                                value={key ? 'YES' : 'NO'}
                                checked={
                                  values.creatingDependenciesBetweenServices ===
                                  key
                                }
                                onChange={() => {
                                  setFieldValue(
                                    'creatingDependenciesBetweenServices',
                                    key
                                  );
                                }}
                              />
                            ))}
                          </Fieldset>
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
                            {t('needsClaimsDataCollection')}
                          </Label>
                          <p className="text-base margin-y-1">
                            {t('needsClaimsDataCollectionSubcopy')}
                          </p>
                          <FieldErrorMsg>
                            {flatErrors.needsClaimsDataCollection}
                          </FieldErrorMsg>
                          <Fieldset>
                            {[true, false].map(key => (
                              <Field
                                as={Radio}
                                key={key}
                                id={`payment-needs-claims-data-collection-${key}`}
                                data-testid={`payment-needs-claims-data-collection-${key}`}
                                name="needsClaimsDataCollection"
                                label={key ? h('yes') : h('no')}
                                value={key ? 'YES' : 'NO'}
                                checked={
                                  values.needsClaimsDataCollection === key
                                }
                                onChange={() => {
                                  setFieldValue(
                                    'needsClaimsDataCollection',
                                    key
                                  );
                                }}
                              />
                            ))}
                          </Fieldset>
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
                            {t('thirdParty')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.providingThirdPartyFile}
                          </FieldErrorMsg>
                          <Fieldset>
                            {[true, false].map(key => (
                              <Field
                                as={Radio}
                                key={key}
                                id={`payment-providing-third-party-file-${key}`}
                                data-testid={`payment-providing-third-party-file-${key}`}
                                name="providingThirdPartyFile"
                                label={key ? h('yes') : h('no')}
                                value={key ? 'YES' : 'NO'}
                                checked={values.providingThirdPartyFile === key}
                                onChange={() => {
                                  setFieldValue('providingThirdPartyFile', key);
                                }}
                              />
                            ))}
                          </Fieldset>
                        </FieldGroup>

                        <Alert type="info" slim className="margin-y-6">
                          {t('alert')}
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
                            {t('isContractorAwareTestDataRequirements')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.isContractorAwareTestDataRequirements}
                          </FieldErrorMsg>
                          <Fieldset>
                            {[true, false].map(key => (
                              <Field
                                as={Radio}
                                key={key}
                                id={`payment-contractor-aware-test-data-requirements-${key}`}
                                data-testid={`payment-contractor-aware-test-data-requirements-${key}`}
                                name="isContractorAwareTestDataRequirements"
                                label={key ? h('yes') : h('no')}
                                value={key ? 'YES' : 'NO'}
                                checked={
                                  values.isContractorAwareTestDataRequirements ===
                                  key
                                }
                                onChange={() => {
                                  setFieldValue(
                                    'isContractorAwareTestDataRequirements',
                                    key
                                  );
                                }}
                              />
                            ))}
                          </Fieldset>
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
                          <IconArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {h('saveAndReturn')}
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
