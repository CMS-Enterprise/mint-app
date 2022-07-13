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
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsSummary from 'components/ITToolsSummary';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetITToolsPageEight from 'queries/ITTools/GetITToolsPageEight';
import {
  GetITToolPageEight as GetITToolPageEightType,
  GetITToolPageEight_modelPlan_itTools as ITToolsPageEightFormType,
  GetITToolPageEight_modelPlan_opsEvalAndLearning as OpsEvalAndLearnignFormType,
  GetITToolPageEight_modelPlan_payments as PaymentsFormType,
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
  sortOtherEnum,
  translateBoolean,
  translateModelLearningSystemType,
  translateOelEducateBeneficiariesType,
  translatePayType,
  translatePInformFfsType,
  translatePMakeClaimsPaymentsType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

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

  const {
    id,
    oelEducateBeneficiaries,
    oelEducateBeneficiariesOther,
    oelEducateBeneficiariesNote,
    pMakeClaimsPayments,
    pMakeClaimsPaymentsOther,
    pMakeClaimsPaymentsNote,
    pInformFfs,
    pInformFfsOther,
    pInformFfsNote
  } = data?.modelPlan?.itTools || ({} as ITToolsPageEightFormType);

  const { modelLearningSystems = [] } =
    data?.modelPlan?.opsEvalAndLearning || ({} as OpsEvalAndLearnignFormType);

  const { payType = [], shouldAnyProvidersExcludedFFSSystems } =
    data?.modelPlan?.payments || ({} as PaymentsFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageEightFormType,
    redirect?: 'next' | 'back' | 'task-list'
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

  const initialValues: ITToolsPageEightFormType = {
    __typename: 'PlanITTools',
    id: id ?? '',
    oelEducateBeneficiaries: oelEducateBeneficiaries ?? [],
    oelEducateBeneficiariesOther: oelEducateBeneficiariesOther ?? '',
    oelEducateBeneficiariesNote: oelEducateBeneficiariesNote ?? '',
    pMakeClaimsPayments: pMakeClaimsPayments ?? [],
    pMakeClaimsPaymentsOther: pMakeClaimsPaymentsOther ?? '',
    pMakeClaimsPaymentsNote: pMakeClaimsPaymentsNote ?? '',
    pInformFfs: pInformFfs ?? [],
    pInformFfsOther: pInformFfsOther ?? '',
    pInformFfsNote: pInformFfsNote ?? ''
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
        {t('subheading')}
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
                    data-testid="oit-tools-page-eight-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <h2>{o('heading')}</h2>

                    <FieldGroup
                      scrollElement="oelEducateBeneficiaries"
                      error={!!flatErrors.oelEducateBeneficiaries}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelEducateBeneficiaries"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('educateTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.oelEducateBeneficiaries}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={o('dataToSend')}
                              answers={modelLearningSystems.map(system =>
                                translateModelLearningSystemType(system || '')
                              )}
                              options={[
                                translateModelLearningSystemType(
                                  ModelLearningSystemType.EDUCATE_BENEFICIARIES
                                )
                              ]}
                              redirect={`/models/${modelID}/task-list/ops-eval-and-learning/learning`}
                              answered={modelLearningSystems.length > 0}
                              needsTool={modelLearningSystems.includes(
                                ModelLearningSystemType.EDUCATE_BENEFICIARIES
                              )}
                              subtext={t('educateBeneficiariesNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelEducateBeneficiariesType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !modelLearningSystems.includes(
                                          ModelLearningSystemType.EDUCATE_BENEFICIARIES
                                        )
                                      }
                                      id={`it-tools-oel-educate-beneficiaries-${type}`}
                                      name="oelEducateBeneficiaries"
                                      label={translateOelEducateBeneficiariesType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelEducateBeneficiaries.includes(
                                        type as OelEducateBeneficiariesType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelEducateBeneficiaries.indexOf(
                                            e.target
                                              .value as OelEducateBeneficiariesType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      OelEducateBeneficiariesType.OTHER &&
                                      values.oelEducateBeneficiaries.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-educate-beneficiaries-other"
                                            className={classNames(
                                              {
                                                'text-gray-30': !modelLearningSystems.includes(
                                                  ModelLearningSystemType.EDUCATE_BENEFICIARIES
                                                )
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.oelEducateBeneficiariesOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !modelLearningSystems.includes(
                                                ModelLearningSystemType.EDUCATE_BENEFICIARIES
                                              )
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-educate-beneficiaries-other"
                                            maxLength={50}
                                            name="oelEducateBeneficiariesOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-educate-beneficiaries-note"
                              field="oelEducateBeneficiariesNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <h2>{p('heading')}</h2>

                    <FieldGroup
                      scrollElement="pMakeClaimsPayments"
                      error={!!flatErrors.pMakeClaimsPayments}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="pMakeClaimsPayments"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('ffsTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.pMakeClaimsPayments}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={p('whatWillYouPay')}
                              answers={payType!.map(type =>
                                translatePayType(type || '')
                              )}
                              options={[
                                translatePayType(PayType.CLAIMS_BASED_PAYMENTS)
                              ]}
                              redirect={`/models/${modelID}/task-list/payments`}
                              answered={payType!.length > 0}
                              needsTool={payType!.includes(
                                PayType.CLAIMS_BASED_PAYMENTS
                              )}
                              subtext={t('ffsNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(PMakeClaimsPaymentsType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !payType!.includes(
                                          PayType.CLAIMS_BASED_PAYMENTS
                                        )
                                      }
                                      id={`it-tools-p-claims-payments-${type}`}
                                      name="pMakeClaimsPayments"
                                      label={translatePMakeClaimsPaymentsType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.pMakeClaimsPayments.includes(
                                        type as PMakeClaimsPaymentsType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.pMakeClaimsPayments.indexOf(
                                            e.target
                                              .value as PMakeClaimsPaymentsType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === PMakeClaimsPaymentsType.OTHER &&
                                      values.pMakeClaimsPayments.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-p-claims-payments-other"
                                            className={classNames(
                                              {
                                                'text-gray-30': !payType!.includes(
                                                  PayType.CLAIMS_BASED_PAYMENTS
                                                )
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.pMakeClaimsPaymentsOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !payType!.includes(
                                                PayType.CLAIMS_BASED_PAYMENTS
                                              )
                                            }
                                            className="maxw-none"
                                            id="it-tools-p-claims-payments-other"
                                            maxLength={50}
                                            name="pMakeClaimsPaymentsOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-p-claims-payments-note"
                              field="pMakeClaimsPaymentsNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="pInformFfs"
                      error={!!flatErrors.pInformFfs}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="pInformFfs"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('waiveParticipantsTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.pInformFfs}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={p('participantsExcluded')}
                              answers={[
                                translateBoolean(
                                  shouldAnyProvidersExcludedFFSSystems || false
                                )
                              ]}
                              options={[
                                translateBoolean(true),
                                translateBoolean(false)
                              ]}
                              redirect={`/models/${modelID}/task-list/payments`}
                              answered={
                                shouldAnyProvidersExcludedFFSSystems !== null
                              }
                              needsTool={
                                shouldAnyProvidersExcludedFFSSystems === true
                              }
                              subtext={t('yesFFSNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(PInformFfsType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !payType!.includes(
                                          PayType.CLAIMS_BASED_PAYMENTS
                                        )
                                      }
                                      id={`it-tools-p-inform-ffs-${type}`}
                                      name="pInformFfs"
                                      label={translatePInformFfsType(type)}
                                      value={type}
                                      checked={values?.pInformFfs.includes(
                                        type as PInformFfsType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.pInformFfs.indexOf(
                                            e.target.value as PInformFfsType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === PInformFfsType.OTHER &&
                                      values.pInformFfs.includes(type) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-p-inform-ffs-other"
                                            className={classNames(
                                              {
                                                'text-gray-30': !payType!.includes(
                                                  PayType.CLAIMS_BASED_PAYMENTS
                                                )
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.pInformFfsOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !payType!.includes(
                                                PayType.CLAIMS_BASED_PAYMENTS
                                              )
                                            }
                                            className="maxw-none"
                                            id="it-tools-p-inform-ffs-other"
                                            maxLength={50}
                                            name="pInformFfsOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-p-inform-ffs-note"
                              field="pInformFfsNote"
                            />
                          </>
                        )}
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
      <PageNumber currentPage={8} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageEight;
