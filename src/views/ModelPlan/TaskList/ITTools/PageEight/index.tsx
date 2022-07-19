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
import GetITToolsPageEight from 'queries/ITTools/GetITToolsPageEight';
import {
  GetITToolPageEight as GetITToolPageEightType,
  GetITToolPageEight_modelPlan as ModelPlanType,
  GetITToolPageEight_modelPlan_itTools as ITToolsPageEightFormType,
  GetITToolPageEight_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType,
  GetITToolPageEight_modelPlan_payments as PaymentsType,
  GetITToolPageEightVariables
} from 'queries/ITTools/types/GetITToolPageEight';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  ModelLearningSystemType,
  OelEducateBeneficiariesType,
  PayType,
  PInformFfsType,
  PMakeClaimsPaymentsType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  translateBoolean,
  translateModelLearningSystemType,
  translateOelEducateBeneficiariesType,
  translatePayType,
  translatePInformFfsType,
  translatePMakeClaimsPaymentsType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { ITToolsFormComponent } from '..';

const initialFormValues: ITToolsPageEightFormType = {
  __typename: 'PlanITTools',
  id: '',
  oelEducateBeneficiaries: [],
  oelEducateBeneficiariesOther: '',
  oelEducateBeneficiariesNote: '',
  pMakeClaimsPayments: [],
  pMakeClaimsPaymentsOther: '',
  pMakeClaimsPaymentsNote: '',
  pInformFfs: [],
  pInformFfsOther: '',
  pInformFfsNote: ''
};

const initialOpsEvalAndLearningValues: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  modelLearningSystems: []
};

const initialPaymentValues: PaymentsType = {
  __typename: 'PlanPayments',
  id: '',
  payType: [],
  shouldAnyProvidersExcludedFFSSystems: null
};

const initialModelPlanValues: ModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  opsEvalAndLearning: initialOpsEvalAndLearningValues,
  payments: initialPaymentValues,
  itTools: initialFormValues
};

const ITToolsPageEight = () => {
  const { t } = useTranslation('itTools');
  const { t: o } = useTranslation('operationsEvaluationAndLearning');
  const { t: p } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();
  const formikRef = useRef<FormikProps<ITToolsPageEightFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolPageEightType,
    GetITToolPageEightVariables
  >(GetITToolsPageEight, {
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || initialModelPlanValues;

  const {
    modelName,
    itTools,
    opsEvalAndLearning: { modelLearningSystems },
    payments: { payType, shouldAnyProvidersExcludedFFSSystems }
  } = modelPlan;

  /**
   * Identifying if each question requires tooling as well as rending answers
   * Checkbox answers will not be checked despite a store truthy boolean
   * 'Specify other' answer will not be rendered even if OTHER value is true
   */
  const questionOneNeedsTools: boolean = modelLearningSystems.includes(
    ModelLearningSystemType.EDUCATE_BENEFICIARIES
  );

  const questionTwoNeedsTools: boolean = payType.includes(
    PayType.CLAIMS_BASED_PAYMENTS
  );

  const questionThreeNeedsTools: boolean =
    shouldAnyProvidersExcludedFFSSystems === true;

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageEightFormType,
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
            history.push(`/models/${modelID}/task-list/it-tools/page-nine`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/it-tools/page-seven`);
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
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
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
        {(formikProps: FormikProps<ITToolsPageEightFormType>) => {
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
                    data-testid="it-tools-page-eight-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <Fieldset disabled={loading}>
                      {/* Question One: Will the model have a learning system? */}
                      <FieldGroup
                        scrollElement="oelEducateBeneficiaries"
                        error={!!flatErrors.oelEducateBeneficiaries}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('educateTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelEducateBeneficiaries}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('learningSystem')}
                          answers={modelLearningSystems.map(system =>
                            translateModelLearningSystemType(system || '')
                          )}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning/learning`}
                          answered={modelLearningSystems.length > 0}
                          needsTool={questionOneNeedsTools}
                          subtext={t('educateBeneficiariesNeedsAnswer')}
                          scrollElememnt="modelLearningSystems"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelEducateBeneficiaries}
                          fieldName="oelEducateBeneficiaries"
                          needsTool={questionOneNeedsTools}
                          htmlID="oel-educate-beneficiaries"
                          EnumType={OelEducateBeneficiariesType}
                          translation={translateOelEducateBeneficiariesType}
                        />
                      </FieldGroup>

                      <h2>{p('heading')}</h2>

                      {/* Question Two: What will you pay? */}

                      <FieldGroup
                        scrollElement="pMakeClaimsPayments"
                        error={!!flatErrors.pMakeClaimsPayments}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('ffsTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.pMakeClaimsPayments}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={p('whatWillYouPay')}
                          answers={payType.map(type =>
                            translatePayType(type || '')
                          )}
                          redirect={`/models/${modelID}/task-list/payments`}
                          answered={payType.length > 0}
                          needsTool={questionTwoNeedsTools}
                          subtext={t('ffsNeedsAnswer')}
                          scrollElememnt="payType"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.pMakeClaimsPayments}
                          fieldName="pMakeClaimsPayments"
                          needsTool={questionTwoNeedsTools}
                          htmlID="p-claims-payments"
                          EnumType={PMakeClaimsPaymentsType}
                          translation={translatePMakeClaimsPaymentsType}
                        />
                      </FieldGroup>

                      {/* Question Three: Should model participants be excluded from existing Fee-for-Service payment systems? */}

                      <FieldGroup
                        scrollElement="pInformFfs"
                        error={!!flatErrors.pInformFfs}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('waiveParticipantsTools')}
                        </legend>

                        <FieldErrorMsg>{flatErrors.pInformFfs}</FieldErrorMsg>

                        <ITToolsSummary
                          question={p('participantsExcluded')}
                          answers={[
                            translateBoolean(
                              shouldAnyProvidersExcludedFFSSystems || false
                            )
                          ]}
                          redirect={`/models/${modelID}/task-list/payments`}
                          answered={
                            shouldAnyProvidersExcludedFFSSystems !== null
                          }
                          needsTool={questionThreeNeedsTools}
                          subtext={t('yesFFSNeedsAnswer')}
                          scrollElememnt="shouldAnyProvidersExcludedFFSSystems"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.pInformFfs}
                          fieldName="pInformFfs"
                          needsTool={questionThreeNeedsTools}
                          htmlID="p-inform-ffs"
                          EnumType={PInformFfsType}
                          translation={translatePInformFfsType}
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
      <PageNumber currentPage={8} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageEight;
