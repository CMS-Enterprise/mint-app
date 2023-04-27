import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
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
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import useScrollElement from 'hooks/useScrollElement';
import GetOpsEvalAndLearning from 'queries/OpsEvalAndLearning/GetOpsEvalAndLearning';
import {
  GetOpsEvalAndLearning as GetOpsEvalAndLearningType,
  GetOpsEvalAndLearning_modelPlan_opsEvalAndLearning as OpsEvalAndLearningFormType,
  GetOpsEvalAndLearningVariables
} from 'queries/OpsEvalAndLearning/types/GetOpsEvalAndLearning';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import {
  AgencyOrStateHelpType,
  CcmInvolvmentType,
  ContractorSupportType,
  DataForMonitoringType,
  StakeholdersType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  mapMultiSelectOptions,
  sortOtherEnum,
  translateAgencyOrStateHelpType,
  translateContractorSupportType,
  translateStakeholdersType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import CCWAndQuality from './CCWAndQuality';
import DataSharing from './DataSharing';
import Evaluation from './Evaluation';
import IDDOC from './IDDOC';
import IDDOCMonitoring from './IDDOCMonitoring';
import IDDOCTesting from './IDDOCTesting';
import Learning from './Learning';
import Performance from './Performance';

// Used to render the total pages based on certain answers populated within this task list item
export const renderTotalPages = (
  iddoc: boolean | null,
  qualityOrCCW?: boolean | null
) => {
  let totalPages = 5;
  if (iddoc) totalPages += 3;
  if (qualityOrCCW) totalPages += 1;
  return totalPages;
};

// Used to render the current page based on certain answers populated within this task list item
export const renderCurrentPage = (
  currentPage: number,
  iddoc: boolean | null,
  qualityOrCCW?: boolean | null
) => {
  let adjustedCurrentPage = currentPage;
  if (currentPage > 2 && !iddoc) adjustedCurrentPage -= 3;
  if (currentPage > 6 && !qualityOrCCW) adjustedCurrentPage -= 1;
  return adjustedCurrentPage;
};

// Checks to see is there is a checked 'Yes' answer within the ccmInvolvment array
export const isCCWInvolvement = (
  ccmInvolvment: CcmInvolvmentType[] | undefined
) => {
  return (ccmInvolvment || []).some(value =>
    [
      CcmInvolvmentType.YES_EVALUATION,
      CcmInvolvmentType.YES__IMPLEMENTATION
    ].includes(value)
  );
};

// Checks to see is there is a checked 'Yes' answer within the ccmInvolvment array
export const isQualityMeasures = (
  dataNeededForMonitoring: DataForMonitoringType[] | undefined
) => {
  return (dataNeededForMonitoring || []).some(value =>
    [
      DataForMonitoringType.QUALITY_CLAIMS_BASED_MEASURES,
      DataForMonitoringType.QUALITY_REPORTED_MEASURES
    ].includes(value)
  );
};

export const OpsEvalAndLearningContent = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<OpsEvalAndLearningFormType>>(null);

  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetOpsEvalAndLearningType,
    GetOpsEvalAndLearningVariables
  >(GetOpsEvalAndLearning, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    ccmInvolvment,
    dataNeededForMonitoring,
    agencyOrStateHelp,
    agencyOrStateHelpOther,
    agencyOrStateHelpNote,
    stakeholders,
    stakeholdersOther,
    stakeholdersNote,
    helpdeskUse,
    helpdeskUseNote,
    contractorSupport,
    contractorSupportOther,
    contractorSupportHow,
    contractorSupportNote,
    iddocSupport,
    iddocSupportNote
  } = data?.modelPlan?.opsEvalAndLearning || ({} as OpsEvalAndLearningFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useMutation<UpdatePlanOpsEvalAndLearningVariables>(
    UpdatePlanOpsEvalAndLearning
  );

  const handleFormSubmit = (redirect?: 'next' | 'back' | string) => {
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
            if (formikRef?.current?.values.iddocSupport) {
              history.push(
                `/models/${modelID}/task-list/ops-eval-and-learning/iddoc`
              );
            } else {
              history.push(
                `/models/${modelID}/task-list/ops-eval-and-learning/performance`
              );
            }
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/`);
          } else if (redirect) {
            history.push(redirect);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: OpsEvalAndLearningFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    agencyOrStateHelp: agencyOrStateHelp ?? [],
    agencyOrStateHelpOther: agencyOrStateHelpOther ?? '',
    agencyOrStateHelpNote: agencyOrStateHelpNote ?? '',
    stakeholders: stakeholders ?? [],
    stakeholdersOther: stakeholdersOther ?? '',
    stakeholdersNote: stakeholdersNote ?? '',
    helpdeskUse: helpdeskUse ?? null,
    helpdeskUseNote: helpdeskUseNote ?? '',
    contractorSupport: contractorSupport ?? [],
    contractorSupportOther: contractorSupportOther ?? '',
    contractorSupportHow: contractorSupportHow ?? '',
    contractorSupportNote: contractorSupportNote ?? '',
    iddocSupport: iddocSupport ?? null,
    iddocSupportNote: iddocSupportNote ?? ''
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
        {h('for')} {modelName}
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
        {(formikProps: FormikProps<OpsEvalAndLearningFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
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

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <FieldArray
                  name="agencyOrStateHelp"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label maxw-none">
                        {t('anotherAgency')}
                      </legend>
                      <FieldErrorMsg>
                        {flatErrors.agencyOrStateHelp}
                      </FieldErrorMsg>

                      {Object.keys(AgencyOrStateHelpType)
                        .sort(sortOtherEnum)
                        .map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`ops-eval-and-learning-agency-or-state-help-${type}`}
                                name="agencyOrStateHelp"
                                label={translateAgencyOrStateHelpType(type)}
                                value={type}
                                checked={values?.agencyOrStateHelp.includes(
                                  type as AgencyOrStateHelpType
                                )}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(e.target.value);
                                  } else {
                                    const idx = values.agencyOrStateHelp.indexOf(
                                      e.target.value as AgencyOrStateHelpType
                                    );
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                              {type === 'OTHER' &&
                                values.agencyOrStateHelp.includes(
                                  AgencyOrStateHelpType.OTHER
                                ) && (
                                  <div className="margin-left-4 margin-top-neg-3">
                                    <Label
                                      htmlFor="ops-eval-and-learning-agency-or-state-help-other"
                                      className="text-normal"
                                    >
                                      {h('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors.agencyOrStateHelpOther}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextAreaField}
                                      className="maxw-none mint-textarea"
                                      id="ops-eval-and-learning-agency-or-state-help-other"
                                      maxLength={5000}
                                      name="agencyOrStateHelpOther"
                                    />
                                  </div>
                                )}
                            </Fragment>
                          );
                        })}
                      <AddNote
                        id="ops-eval-and-learning-agency-or-state-help-note"
                        field="agencyOrStateHelpNote"
                      />
                    </>
                  )}
                />

                <FieldGroup
                  scrollElement="stakeholders"
                  error={!!flatErrors.stakeholders}
                  className="margin-top-4"
                >
                  <Label
                    htmlFor="ops-eval-and-learning-stakeholders"
                    id="label-ops-eval-and-learning-stakeholders"
                  >
                    {t('stakeholders')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.stakeholders}</FieldErrorMsg>

                  <Field
                    as={MultiSelect}
                    id="ops-eval-and-learning-stakeholders"
                    name="stakeholders"
                    ariaLabel="label-ops-eval-and-learning-stakeholders"
                    role="combobox"
                    options={mapMultiSelectOptions(
                      translateStakeholdersType,
                      StakeholdersType
                    )}
                    selectedLabel={t('selectedStakeholders')}
                    onChange={(value: string[] | []) => {
                      setFieldValue('stakeholders', value);
                    }}
                    initialValues={initialValues.stakeholders}
                  />

                  {values.stakeholders.includes(StakeholdersType.OTHER) && (
                    <>
                      <p className="margin-y-1 margin-top-3">
                        {t('pleaseDescribe')}
                      </p>
                      <FieldErrorMsg>
                        {flatErrors.stakeholdersOther}
                      </FieldErrorMsg>
                      <Field
                        as={TextInput}
                        data-testid="ops-eval-and-learning-stakeholders-other"
                        error={!!flatErrors.stakeholdersOther}
                        id="ops-eval-and-learning-key-other"
                        maxLength={50}
                        name="stakeholdersOther"
                      />
                    </>
                  )}

                  <AddNote
                    id="ops-eval-and-learning-stakeholders-note"
                    field="stakeholdersNote"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="helpdeskUse"
                  error={!!flatErrors.helpdeskUse}
                  className="margin-y-4 margin-bottom-8"
                >
                  <Label htmlFor="ops-eval-and-learning-help-desk-use">
                    {t('helpDesk')}
                  </Label>
                  {itSolutionsStarted && (
                    <ITSolutionsWarning
                      id="ops-eval-and-learning-help-desk-use-warning"
                      onClick={() =>
                        handleFormSubmit(
                          `/models/${modelID}/task-list/it-solutions`
                        )
                      }
                    />
                  )}
                  <FieldErrorMsg>{flatErrors.helpdeskUse}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key.toString()}
                        id={`ops-eval-and-learning-help-desk-use-${key}`}
                        name="helpdeskUse"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.helpdeskUse === key}
                        onChange={() => {
                          setFieldValue('helpdeskUse', key);
                        }}
                      />
                    ))}
                  </Fieldset>

                  <AddNote
                    id="ops-eval-and-learning-help-desk-use-note"
                    field="helpdeskUseNote"
                  />
                </FieldGroup>

                <FieldArray
                  name="contractorSupport"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label maxw-none">
                        {t('whatContractors')}
                      </legend>
                      <FieldErrorMsg>
                        {flatErrors.contractorSupport}
                      </FieldErrorMsg>

                      {[
                        ContractorSupportType.ONE,
                        ContractorSupportType.MULTIPLE,
                        ContractorSupportType.NONE,
                        ContractorSupportType.OTHER
                      ].map(type => {
                        return (
                          <Fragment key={type}>
                            <Field
                              as={CheckboxField}
                              id={`ops-eval-and-learning-contractor-support-${type}`}
                              name="contractorSupport"
                              label={translateContractorSupportType(type)}
                              value={type}
                              checked={values?.contractorSupport.includes(
                                type as ContractorSupportType
                              )}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                if (e.target.checked) {
                                  arrayHelpers.push(e.target.value);
                                } else {
                                  const idx = values.contractorSupport.indexOf(
                                    e.target.value as ContractorSupportType
                                  );
                                  arrayHelpers.remove(idx);
                                }
                              }}
                            />
                            {type === 'OTHER' &&
                              values.contractorSupport.includes(
                                ContractorSupportType.OTHER
                              ) && (
                                <div className="margin-left-4 margin-top-neg-3">
                                  <Label
                                    htmlFor="ops-eval-and-learning-contractor-support-other"
                                    className="text-normal"
                                  >
                                    {h('pleaseSpecify')}
                                  </Label>
                                  <FieldErrorMsg>
                                    {flatErrors.contractorSupportOther}
                                  </FieldErrorMsg>
                                  <Field
                                    as={TextAreaField}
                                    className="maxw-none mint-textarea"
                                    id="ops-eval-and-learning-contractor-support-other"
                                    maxLength={5000}
                                    name="contractorSupportOther"
                                  />
                                </div>
                              )}
                          </Fragment>
                        );
                      })}

                      <FieldGroup
                        scrollElement="contractorSupportHow"
                        error={!!flatErrors.contractorSupportHow}
                      >
                        <Label
                          htmlFor="ops-eval-and-learning-contractor-support-how"
                          className="text-normal margin-top-4"
                        >
                          {t('whatContractorsHow')}
                        </Label>
                        <p className="text-base margin-y-1">
                          {t('whatContractorsHowInfo')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.contractorSupportHow}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          className="height-card"
                          error={flatErrors.contractorSupportHow}
                          id="ops-eval-and-learning-contractor-support-how"
                          data-testid="ops-eval-and-learning-contractor-support-how"
                          name="contractorSupportHow"
                        />
                      </FieldGroup>

                      <AddNote
                        id="ops-eval-and-learning-contractor-support-note"
                        field="contractorSupportNote"
                      />
                    </>
                  )}
                />

                <FieldGroup
                  scrollElement="iddocSupport"
                  error={!!flatErrors.iddocSupport}
                  className="margin-y-4 margin-bottom-8"
                >
                  <Label htmlFor="ops-eval-and-learning-iddoc-support">
                    {t('iddocSupport')}
                  </Label>
                  {itSolutionsStarted && (
                    <ITSolutionsWarning
                      id="ops-eval-and-learning-iddoc-support-warning"
                      onClick={() =>
                        handleFormSubmit(
                          `/models/${modelID}/task-list/it-solutions`
                        )
                      }
                    />
                  )}
                  <p className="text-base margin-y-1">
                    {t('iddocSupportInfo')}
                  </p>
                  <p className="text-base margin-y-1 margin-top-2">
                    {t('iddocSupportInfo2')}
                  </p>
                  <FieldErrorMsg>{flatErrors.iddocSupport}</FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="ops-eval-and-learning-iddoc-support"
                      name="iddocSupport"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.iddocSupport === true}
                      onChange={() => {
                        setFieldValue('iddocSupport', true);
                      }}
                    />
                    <Field
                      as={Radio}
                      id="ops-eval-and-learning-iddoc-support-no"
                      name="iddocSupport"
                      label={h('no')}
                      value="FALSE"
                      checked={values.iddocSupport === false}
                      onChange={() => {
                        setFieldValue('iddocSupport', false);
                      }}
                    />
                  </Fieldset>

                  <AddNote
                    id="ops-eval-and-learning-iddoc-support-note"
                    field="iddocSupportNote"
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
                  onClick={() => handleFormSubmit('back')}
                >
                  <IconArrowBack className="margin-right-1" aria-hidden />
                  {h('saveAndReturn')}
                </Button>
              </Form>

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
            1,
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          totalPages={renderTotalPages(
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export const OpsEvalAndLearning = () => {
  return (
    <MainContent data-testid="model-ops-eval-and-learning">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning"
              exact
              render={() => <OpsEvalAndLearningContent />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/iddoc"
              exact
              render={() => <IDDOC />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/iddoc-testing"
              exact
              render={() => <IDDOCTesting />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/iddoc-monitoring"
              exact
              render={() => <IDDOCMonitoring />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/performance"
              exact
              render={() => <Performance />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/evaluation"
              exact
              render={() => <Evaluation />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/ccw-and-quality"
              exact
              render={() => <CCWAndQuality />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/data-sharing"
              exact
              render={() => <DataSharing />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/learning"
              exact
              render={() => <Learning />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default OpsEvalAndLearning;
