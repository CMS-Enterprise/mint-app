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
  IconArrowBack
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import ITToolsSummary from 'components/ITToolsSummary';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetITToolsPageNine from 'queries/ITTools/GetITToolsPageNine';
import {
  GetITToolPageNine as GetITToolPageNineType,
  GetITToolPageNine_modelPlan as ModelPlanType,
  GetITToolPageNine_modelPlan_itTools as ITToolsPageNineFormType,
  GetITToolPageNine_modelPlan_payments as PaymentsType,
  GetITToolPageNineVariables
} from 'queries/ITTools/types/GetITToolPageNine';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  NonClaimsBasedPayType,
  PayType,
  PNonClaimsBasedPaymentsType,
  PRecoverPaymentsType,
  PSharedSavingsPlanType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  translateBoolean,
  translateNonClaimsBasedPayType,
  translatePayType,
  translatePNonClaimsBasedPaymentsType,
  translatePRecoverPaymentsType,
  translatePSharedSavingsPlanType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { ITToolsFormComponent } from '..';

const initialFormValues: ITToolsPageNineFormType = {
  __typename: 'PlanITTools',
  id: '',
  pNonClaimsBasedPayments: [],
  pNonClaimsBasedPaymentsOther: '',
  pNonClaimsBasedPaymentsNote: '',
  pSharedSavingsPlan: [],
  pSharedSavingsPlanOther: '',
  pSharedSavingsPlanNote: '',
  pRecoverPayments: [],
  pRecoverPaymentsOther: '',
  pRecoverPaymentsNote: ''
};

const initialPaymentValues: PaymentsType = {
  __typename: 'PlanPayments',
  id: '',
  payType: [],
  nonClaimsPayments: [],
  willRecoverPayments: null
};

const initialModelPlanValues: ModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  payments: initialPaymentValues,
  itTools: initialFormValues
};

const ITToolsPageNine = () => {
  const { t } = useTranslation('itTools');
  const { t: p } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();
  const formikRef = useRef<FormikProps<ITToolsPageNineFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolPageNineType,
    GetITToolPageNineVariables
  >(GetITToolsPageNine, {
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || initialModelPlanValues;

  const {
    modelName,
    itTools,
    payments: { payType, nonClaimsPayments, willRecoverPayments }
  } = modelPlan;

  /**
   * Identifying if each question requires tooling as well as rending answers
   * Checkbox answers will not be checked despite a store truthy boolean
   * 'Specify other' answer will not be rendered even if OTHER value is true
   */
  const questionOneNeedsTools: boolean = payType.includes(
    PayType.NON_CLAIMS_BASED_PAYMENTS
  );

  const questionTwoNeedsTools: boolean = nonClaimsPayments.includes(
    NonClaimsBasedPayType.SHARED_SAVINGS
  );

  const questionThreeNeedsTools: boolean = willRecoverPayments === true;

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageNineFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const { id, __typename, ...changes } = formikValues;
    update({
      variables: {
        id,
        changes
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/it-tools/page-eight`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  if ((!loading && error) || (!loading && !modelPlan)) {
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
      <p className="margin-bottom-2 font-body-md line-hNine-sans-4">
        {t('subheading')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={itTools}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ITToolsPageNineFormType>) => {
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

              <Grid row gap>
                <Grid desktop={{ col: 6 }}>
                  <Form
                    className="margin-top-6"
                    data-testid="oit-tools-page-nine-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <Fieldset disabled={loading}>
                      {/* Question One: What will you pay? */}
                      <FieldGroup
                        scrollElement="pNonClaimsBasedPayments"
                        error={!!flatErrors.pNonClaimsBasedPayments}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('nonClaimsTools')}
                        </legend>

                        <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                          {t('nonClaimsToolsInfo')}
                        </p>

                        <FieldErrorMsg>
                          {flatErrors.pNonClaimsBasedPayments}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={p('whatWillYouPay')}
                          answers={payType.map(type =>
                            translatePayType(type || '')
                          )}
                          redirect={`/models/${modelID}/task-list/payments`}
                          answered={payType.length > 0}
                          needsTool={questionOneNeedsTools}
                          subtext={t('nonClaimsNeedsAnswer')}
                          scrollElememnt="payType"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.pNonClaimsBasedPayments}
                          fieldName="pNonClaimsBasedPayments"
                          needsTool={questionOneNeedsTools}
                          htmlID="p-non-claims-payments"
                          EnumType={PNonClaimsBasedPaymentsType}
                          translation={translatePNonClaimsBasedPaymentsType}
                        />
                      </FieldGroup>

                      {/* Question Two: Select which non-claims-based payments will you pay. */}

                      <FieldGroup
                        scrollElement="pSharedSavingsPlan"
                        error={!!flatErrors.pSharedSavingsPlan}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('sharedSavingsTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.pSharedSavingsPlan}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={p('selectNonClaims')}
                          answers={nonClaimsPayments.map(type =>
                            translateNonClaimsBasedPayType(type || '')
                          )}
                          redirect={`/models/${modelID}/task-list/payments`}
                          answered={nonClaimsPayments.length > 0}
                          needsTool={questionTwoNeedsTools}
                          subtext={t('sharedSavingsNeedsAnswer')}
                          scrollElememnt="nonClaimsPayments"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.pSharedSavingsPlan}
                          fieldName="pSharedSavingsPlan"
                          needsTool={questionTwoNeedsTools}
                          htmlID="p-shared-savings"
                          EnumType={PSharedSavingsPlanType}
                          translation={translatePSharedSavingsPlanType}
                        />
                      </FieldGroup>

                      {/* Question Three: Will you recover the payments? */}

                      <FieldGroup
                        scrollElement="pRecoverPayments"
                        error={!!flatErrors.pRecoverPayments}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('recoverTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.pRecoverPayments}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={p('reoverPayments')}
                          answers={[
                            translateBoolean(willRecoverPayments || false)
                          ]}
                          redirect={`/models/${modelID}/task-list/payments`}
                          answered={willRecoverPayments !== null}
                          needsTool={questionThreeNeedsTools}
                          subtext={t('yesFFSNeedsAnswer')}
                          scrollElememnt="willRecoverPayments"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.pRecoverPayments}
                          fieldName="pRecoverPayments"
                          needsTool={questionThreeNeedsTools}
                          htmlID="p-recover-payments"
                          EnumType={PRecoverPaymentsType}
                          translation={translatePRecoverPaymentsType}
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
                          {h('saveAndStartNext')}
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
                    </Fieldset>
                  </Form>
                </Grid>
              </Grid>

              {itTools.id && !loading && (
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
      <PageNumber currentPage={9} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageNine;
