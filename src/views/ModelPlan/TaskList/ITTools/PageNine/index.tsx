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
import GetITToolsPageNine from 'queries/ITTools/GetITToolsPageNine';
import {
  GetITToolPageNine as GetITToolPageNineType,
  GetITToolPageNine_modelPlan_itTools as ITToolsPageNineFormType,
  GetITToolPageNine_modelPlan_payments as PaymentsFormType,
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
  sortOtherEnum,
  translateBoolean,
  translateNonClaimsBasedPayType,
  translatePayType,
  translatePNonClaimsBasedPaymentsType,
  translatePRecoverPaymentsType,
  translatePSharedSavingsPlanType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const ITToolsPageNine = () => {
  const { t } = useTranslation('itTools');
  const { t: o } = useTranslation('operationsEvaluationAndLearning');
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

  const {
    id,
    pNonClaimsBasedPayments,
    pNonClaimsBasedPaymentsOther,
    pNonClaimsBasedPaymentsNote,
    pSharedSavingsPlan,
    pSharedSavingsPlanOther,
    pSharedSavingsPlanNote,
    pRecoverPayments,
    pRecoverPaymentsOther,
    pRecoverPaymentsNote
  } = data?.modelPlan?.itTools || ({} as ITToolsPageNineFormType);

  const { payType = [], nonClaimsPayments = [], willRecoverPayments } =
    data?.modelPlan?.payments || ({} as PaymentsFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageNineFormType,
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

  const initialValues: ITToolsPageNineFormType = {
    __typename: 'PlanITTools',
    id: id ?? '',
    pNonClaimsBasedPayments: pNonClaimsBasedPayments ?? [],
    pNonClaimsBasedPaymentsOther: pNonClaimsBasedPaymentsOther ?? '',
    pNonClaimsBasedPaymentsNote: pNonClaimsBasedPaymentsNote ?? '',
    pSharedSavingsPlan: pSharedSavingsPlan ?? [],
    pSharedSavingsPlanOther: pSharedSavingsPlanOther ?? '',
    pSharedSavingsPlanNote: pSharedSavingsPlanNote ?? '',
    pRecoverPayments: pRecoverPayments ?? [],
    pRecoverPaymentsOther: pRecoverPaymentsOther ?? '',
    pRecoverPaymentsNote: pRecoverPaymentsNote ?? ''
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
      <p className="margin-bottom-2 font-body-md line-hNine-sans-4">
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
                    <FieldGroup
                      scrollElement="pNonClaimsBasedPayments"
                      error={!!flatErrors.pNonClaimsBasedPayments}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="pNonClaimsBasedPayments"
                        render={arrayHelpers => (
                          <>
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
                              answers={payType!.map(type =>
                                translatePayType(type || '')
                              )}
                              redirect={`/models/${modelID}/task-list/payments`}
                              answered={payType!.length > 0}
                              needsTool={payType!.includes(
                                PayType.NON_CLAIMS_BASED_PAYMENTS
                              )}
                              subtext={t('nonClaimsNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(PNonClaimsBasedPaymentsType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !payType!.includes(
                                          PayType.NON_CLAIMS_BASED_PAYMENTS
                                        )
                                      }
                                      id={`it-tools-p-non-claims-payments-${type}`}
                                      name="pNonClaimsBasedPayments"
                                      label={translatePNonClaimsBasedPaymentsType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.pNonClaimsBasedPayments.includes(
                                        type as PNonClaimsBasedPaymentsType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.pNonClaimsBasedPayments.indexOf(
                                            e.target
                                              .value as PNonClaimsBasedPaymentsType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      PNonClaimsBasedPaymentsType.OTHER &&
                                      values.pNonClaimsBasedPayments.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-p-non-claims-payments-other"
                                            className={classNames(
                                              {
                                                'text-gray-30': !payType!.includes(
                                                  PayType.NON_CLAIMS_BASED_PAYMENTS
                                                )
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.pNonClaimsBasedPaymentsOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !payType!.includes(
                                                PayType.NON_CLAIMS_BASED_PAYMENTS
                                              )
                                            }
                                            className="maxw-none"
                                            id="it-tools-p-non-claims-payments-other"
                                            maxLength={50}
                                            name="pNonClaimsBasedPaymentsOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-p-non-claims-payments-note"
                              field="pNonClaimsBasedPaymentsNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="pSharedSavingsPlan"
                      error={!!flatErrors.pSharedSavingsPlan}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="pSharedSavingsPlan"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('sharedSavingsTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.pSharedSavingsPlan}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={p('selectNonClaims')}
                              answers={nonClaimsPayments!.map(type =>
                                translateNonClaimsBasedPayType(type || '')
                              )}
                              redirect={`/models/${modelID}/task-list/payments`}
                              answered={nonClaimsPayments!.length > 0}
                              needsTool={nonClaimsPayments!.includes(
                                NonClaimsBasedPayType.SHARED_SAVINGS
                              )}
                              subtext={t('sharedSavingsNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(PSharedSavingsPlanType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !nonClaimsPayments!.includes(
                                          NonClaimsBasedPayType.SHARED_SAVINGS
                                        )
                                      }
                                      id={`it-tools-p-shared-savings-${type}`}
                                      name="pSharedSavingsPlan"
                                      label={translatePSharedSavingsPlanType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.pSharedSavingsPlan.includes(
                                        type as PSharedSavingsPlanType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.pSharedSavingsPlan.indexOf(
                                            e.target
                                              .value as PSharedSavingsPlanType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === PSharedSavingsPlanType.OTHER &&
                                      values.pSharedSavingsPlan.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-p-shared-savings-other"
                                            className={classNames(
                                              {
                                                'text-gray-30': !nonClaimsPayments!.includes(
                                                  NonClaimsBasedPayType.SHARED_SAVINGS
                                                )
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.pSharedSavingsPlanOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !nonClaimsPayments!.includes(
                                                NonClaimsBasedPayType.SHARED_SAVINGS
                                              )
                                            }
                                            className="maxw-none"
                                            id="it-tools-p-shared-savings-other"
                                            maxLength={50}
                                            name="pSharedSavingsPlanOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-p-shared-savings-note"
                              field="pSharedSavingsPlanNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="pRecoverPayments"
                      error={!!flatErrors.pRecoverPayments}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="pRecoverPayments"
                        render={arrayHelpers => (
                          <>
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
                              needsTool={willRecoverPayments === true}
                              subtext={t('yesFFSNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(PRecoverPaymentsType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={!willRecoverPayments}
                                      id={`it-tools-p-recover-payments-${type}`}
                                      name="pRecoverPayments"
                                      label={translatePRecoverPaymentsType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.pRecoverPayments.includes(
                                        type as PRecoverPaymentsType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.pRecoverPayments.indexOf(
                                            e.target
                                              .value as PRecoverPaymentsType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === PRecoverPaymentsType.OTHER &&
                                      values.pRecoverPayments.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-p-recover-payments-other"
                                            className={classNames(
                                              {
                                                'text-gray-30': !willRecoverPayments
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.pRecoverPaymentsOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={!willRecoverPayments}
                                            className="maxw-none"
                                            id="it-tools-p-recover-payments-other"
                                            maxLength={50}
                                            name="pRecoverPaymentsOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-p-recover-payments-note"
                              field="pRecoverPaymentsNote"
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
      <PageNumber currentPage={9} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageNine;
