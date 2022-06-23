import React, { Fragment, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
  SummaryBox,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
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
import GetModelPlanOpsEvalAndLearning from 'queries/GetModelPlanOpsEvalAndLearning';
import {
  GetModelPlanOpsEvalAndLearning as GetModelPlanOpsEvalAndLearningType,
  GetModelPlanOpsEvalAndLearning_modelPlan_opsEvalAndLearning as ModelPlanOpsEvalAndLearningFormType
} from 'queries/types/GetModelPlanOpsEvalAndLearning';
import { UpdateModelPlanOpsEvalAndLearningVariables } from 'queries/types/UpdateModelPlanOpsEvalAndLearning';
import UpdateModelPlanOpsEvalAndLearning from 'queries/UpdateModelPlanOpsEvalAndLearning';
import {
  AgencyOrStateHelpType,
  ContractorSupportType,
  HelpdeskUseType,
  StakeholdersType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateAgencyOrStateHelpType,
  translateContractorSupportType,
  translateHelpdeskUseType,
  translateStakeholdersType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

export const OpsEvalAndLearningContent = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ModelPlanOpsEvalAndLearningFormType>>(
    null
  );
  const history = useHistory();

  const { data } = useQuery<GetModelPlanOpsEvalAndLearningType>(
    GetModelPlanOpsEvalAndLearning,
    {
      variables: {
        id: modelID
      }
    }
  );

  const {
    id,
    agencyOrStateHelp,
    agencyOrStateHelpOther,
    agencyOrStateHelpNote,
    stakeholders,
    stakeholdersOther,
    stakeholdersNote,
    helpdeskUse,
    helpdeskUseOther,
    helpdeskUseNote,
    contractorSupport,
    contractorSupportOther,
    contractorSupportHow,
    contractorSupportNote,
    iddocSupport,
    iddocSupportNote
  } =
    data?.modelPlan?.opsEvalAndLearning ||
    ({} as ModelPlanOpsEvalAndLearningFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdateModelPlanOpsEvalAndLearningVariables>(
    UpdateModelPlanOpsEvalAndLearning
  );

  const handleFormSubmit = (
    formikValues: ModelPlanOpsEvalAndLearningFormType,
    redirect?: 'next' | 'back'
  ) => {
    update({
      variables: {
        id,
        changes: formikValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/iddoc`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues = {
    agencyOrStateHelp: agencyOrStateHelp ?? [],
    agencyOrStateHelpOther: agencyOrStateHelpOther ?? '',
    agencyOrStateHelpNote: agencyOrStateHelpNote ?? '',
    stakeholders: stakeholders ?? [],
    stakeholdersOther: stakeholdersOther ?? '',
    stakeholdersNote: stakeholdersNote ?? null,
    helpdeskUse: helpdeskUse ?? [],
    helpdeskUseOther: helpdeskUseOther ?? '',
    helpdeskUseNote: helpdeskUseNote ?? '',
    contractorSupport: contractorSupport ?? [],
    contractorSupportOther: contractorSupportOther ?? '',
    contractorSupportHow: contractorSupportHow ?? '',
    contractorSupportNote: contractorSupportNote ?? '',
    iddocSupport: iddocSupport ?? null,
    iddocSupportNote: iddocSupportNote ?? ''
  } as ModelPlanOpsEvalAndLearningFormType;

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
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ModelPlanOpsEvalAndLearningFormType>) => {
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
                className="tablet:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <FieldArray
                  name="agencyOrStateHelp"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label">
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
                                  'OTHER' as AgencyOrStateHelpType
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
                                      as={TextInput}
                                      className="maxw-none"
                                      id="ops-eval-and-learning-agency-or-state-help-other"
                                      maxLength={50}
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

                <div className="margin-top-6 margin-bottom-3">
                  <Button type="submit" onClick={() => setErrors({})}>
                    {h('next')}
                  </Button>
                </div>
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => handleFormSubmit(values, 'back')}
                >
                  <IconArrowBack className="margin-right-1" aria-hidden />
                  {h('saveAndReturn')}
                </Button>
              </Form>

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
      <PageNumber currentPage={1} totalPages={5} className="margin-y-6" />
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
            {/* <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/iddoc"
              exact
              render={() => <ParticipantsOptions />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/iddoc-testing"
              exact
              render={() => <Communication />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/iddoc-monitoring"
              exact
              render={() => <Coordination />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/performance"
              exact
              render={() => <ProviderOptions />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/evaluation"
              exact
              render={() => <ProviderOptions />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/ccw-and-quality"
              exact
              render={() => <ProviderOptions />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/data-sharing"
              exact
              render={() => <ProviderOptions />}
            />
            <Route
              path="/models/:modelID/task-list/ops-eval-and-learning/learning"
              exact
              render={() => <ProviderOptions />}
            /> */}
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default OpsEvalAndLearning;
