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
import GetITToolsPageOne from 'queries/ITTools/GetITToolsPageOne';
import {
  GetITToolPageOne as GetITToolsPageOneType,
  GetITToolPageOne_modelPlan_generalCharacteristics as GeneralCharacteristicsFormType,
  GetITToolPageOne_modelPlan_itTools as ITToolsPageOneFormType,
  GetITToolPageOneVariables
} from 'queries/ITTools/types/GetITToolPageOne';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  GcCollectBidsType,
  GcPartCDType,
  GcUpdateContractType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateBoolean,
  translateGcCollectBidsType,
  translateGcPartCDType,
  translateGcUpdateContractType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const ITToolsPageOne = () => {
  const { t } = useTranslation('itTools');
  const { t: c } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ITToolsPageOneFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolsPageOneType,
    GetITToolPageOneVariables
  >(GetITToolsPageOne, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    gcPartCD,
    gcPartCDOther,
    gcPartCDNote,
    gcCollectBids,
    gcCollectBidsOther,
    gcCollectBidsNote,
    gcUpdateContract,
    gcUpdateContractOther,
    gcUpdateContractNote
  } = data?.modelPlan?.itTools || ({} as ITToolsPageOneFormType);

  const characteristics =
    data?.modelPlan?.generalCharacteristics ||
    ({} as GeneralCharacteristicsFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageOneFormType,
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
            history.push(`/models/${modelID}/task-list/it-tools/page-two`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: ITToolsPageOneFormType = {
    __typename: 'PlanITTools',
    id: id ?? '',
    gcPartCD: gcPartCD ?? [],
    gcPartCDOther: gcPartCDOther ?? '',
    gcPartCDNote: gcPartCDNote ?? '',
    gcCollectBids: gcCollectBids ?? [],
    gcCollectBidsOther: gcCollectBidsOther ?? '',
    gcCollectBidsNote: gcCollectBidsNote ?? '',
    gcUpdateContract: gcUpdateContract ?? [],
    gcUpdateContractOther: gcUpdateContractOther ?? '',
    gcUpdateContractNote: gcUpdateContractNote ?? ''
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
        {(formikProps: FormikProps<ITToolsPageOneFormType>) => {
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
                    data-testid="it-tools-page-one-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <h2>{c('heading')}</h2>

                    <FieldGroup
                      scrollElement="gcPartCD"
                      error={!!flatErrors.gcPartCD}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="gcPartCD"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label">
                              {t('partCDTools')}
                            </legend>
                            <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                              {t('partCDToolsInfo')}
                            </p>
                            <FieldErrorMsg>{flatErrors.gcPartCD}</FieldErrorMsg>

                            <ITToolsSummary
                              question={c('manageEnrollment')}
                              answers={[
                                translateBoolean(
                                  characteristics.managePartCDEnrollment ||
                                    false
                                )
                              ]}
                              options={[translateBoolean(true)]}
                              redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
                              answered={
                                characteristics.managePartCDEnrollment !== null
                              }
                              needsTool={
                                characteristics.managePartCDEnrollment === true
                              }
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(GcPartCDType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !characteristics.managePartCDEnrollment
                                      }
                                      id={`it-tools-gc-partc-${type}`}
                                      name="gcPartCD"
                                      label={translateGcPartCDType(type)}
                                      value={type}
                                      checked={values?.gcPartCD.includes(
                                        type as GcPartCDType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.gcPartCD.indexOf(
                                            e.target.value as GcPartCDType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === GcPartCDType.OTHER &&
                                      values.gcPartCD.includes(type) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-gc-partc-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.gcPartCDOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            disabled={
                                              !characteristics.managePartCDEnrollment
                                            }
                                            className="maxw-none"
                                            id="it-tools-gc-partcd-other"
                                            maxLength={50}
                                            name="gcPartCDOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-gc-partcd-note"
                              field="gcPartCDNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="gcCollectBids"
                      error={!!flatErrors.gcCollectBids}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="gcCollectBids"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label">
                              {t('collectBidsTools')}
                            </legend>
                            <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                              {t('partCDToolsInfo')}
                            </p>
                            <FieldErrorMsg>
                              {flatErrors.gcCollectBids}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={c('reviewPlanBids')}
                              answers={[
                                translateBoolean(
                                  characteristics.collectPlanBids || false
                                )
                              ]}
                              options={[translateBoolean(true)]}
                              redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
                              answered={
                                characteristics.collectPlanBids !== null
                              }
                              needsTool={
                                characteristics.collectPlanBids === true
                              }
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(GcCollectBidsType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !characteristics.collectPlanBids
                                      }
                                      id={`it-tools-gc-collect-bids-${type}`}
                                      name="gcCollectBids"
                                      label={translateGcCollectBidsType(type)}
                                      value={type}
                                      checked={values?.gcCollectBids.includes(
                                        type as GcCollectBidsType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.gcCollectBids.indexOf(
                                            e.target.value as GcCollectBidsType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === GcCollectBidsType.OTHER &&
                                      values.gcCollectBids.includes(type) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-gc-collect-bids-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.gcCollectBidsOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            disabled={
                                              !characteristics.collectPlanBids
                                            }
                                            className="maxw-none"
                                            id="it-tools-gc-collect-bids-other"
                                            maxLength={50}
                                            name="gcCollectBidsOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-gc-collect-bids-note"
                              field="gcCollectBidsNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="gcUpdateContract"
                      error={!!flatErrors.gcUpdateContract}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="gcUpdateContract"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label">
                              {t('updateContract')}
                            </legend>
                            <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                              {t('partCDToolsInfo')}
                            </p>
                            <FieldErrorMsg>
                              {flatErrors.planContactUpdated}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={c('updatedContact')}
                              answers={[
                                translateBoolean(
                                  characteristics.planContactUpdated || false
                                )
                              ]}
                              options={[translateBoolean(true)]}
                              redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
                              answered={
                                characteristics.planContactUpdated !== null
                              }
                              needsTool={
                                characteristics.planContactUpdated === true
                              }
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(GcUpdateContractType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !characteristics.planContactUpdated
                                      }
                                      id={`it-tools-gc-update-contract-${type}`}
                                      name="gcUpdateContract"
                                      label={translateGcUpdateContractType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.gcUpdateContract.includes(
                                        type as GcUpdateContractType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.gcUpdateContract.indexOf(
                                            e.target
                                              .value as GcUpdateContractType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === GcUpdateContractType.OTHER &&
                                      values.gcUpdateContract.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-gc-update-contract-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.gcUpdateContractOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            disabled={
                                              !characteristics.planContactUpdated
                                            }
                                            className="maxw-none"
                                            id="it-tools-gc-update-contract-other"
                                            maxLength={50}
                                            name="gcUpdateContractOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-gc-update-contract-note"
                              field="gcUpdateContractNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <div className="margin-top-6 margin-bottom-3">
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
      <PageNumber currentPage={1} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageOne;
