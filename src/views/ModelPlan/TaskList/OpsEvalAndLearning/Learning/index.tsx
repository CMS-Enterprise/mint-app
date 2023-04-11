import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsWarning from 'components/ITToolsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import useScrollElement from 'hooks/useScrollElement';
import GetLearning from 'queries/OpsEvalAndLearning/GetLearning';
import {
  GetLearning as GetLearningType,
  GetLearning_modelPlan_opsEvalAndLearning as GetLearningFormType,
  GetLearningVariables
} from 'queries/OpsEvalAndLearning/types/GetLearning';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import { ModelLearningSystemType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  sortOtherEnum,
  translateModelLearningSystemType
} from 'utils/modelPlan';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

const Learning = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  // Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
  type InitialValueType = Omit<
    GetLearningFormType,
    'readyForReviewByUserAccount' | 'readyForReviewDts'
  >;

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetLearningType,
    GetLearningVariables
  >(GetLearning, {
    variables: {
      id: modelID
    },
    fetchPolicy: 'network-only'
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    modelLearningSystems,
    modelLearningSystemsOther,
    modelLearningSystemsNote,
    anticipatedChallenges,
    readyForReviewByUserAccount,
    readyForReviewDts,
    status
  } = data?.modelPlan?.opsEvalAndLearning || ({} as GetLearningFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Tools, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useMutation<UpdatePlanOpsEvalAndLearningVariables>(
    UpdatePlanOpsEvalAndLearning
  );

  const handleFormSubmit = (
    redirect?: 'back' | 'task-list' | 'next' | string
  ) => {
    const dirtyInputs = dirtyInput(
      formikRef?.current?.initialValues,
      formikRef?.current?.values
    );

    if (dirtyInputs.status) {
      dirtyInputs.status = sanitizeStatus(dirtyInputs.status);
    }

    update({
      variables: {
        id,
        changes: dirtyInputs
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/data-sharing`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          } else if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/payment`);
          } else if (redirect) {
            history.push(redirect);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: InitialValueType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    iddocSupport: iddocSupport ?? null,
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    modelLearningSystems: modelLearningSystems ?? [],
    modelLearningSystemsOther: modelLearningSystemsOther ?? '',
    modelLearningSystemsNote: modelLearningSystemsNote ?? '',
    anticipatedChallenges: anticipatedChallenges ?? '',
    status
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
        {(formikProps: FormikProps<InitialValueType>) => {
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

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-learning-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <FieldArray
                  name="modelLearningSystems"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label">
                        {t('learningSystem')}
                      </legend>

                      {itSolutionsStarted && (
                        <ITToolsWarning
                          id="ops-eval-and-learning-data-needed-warning"
                          onClick={() =>
                            handleFormSubmit(
                              `/models/${modelID}/task-list/it-solutions`
                            )
                          }
                        />
                      )}

                      <FieldErrorMsg>
                        {flatErrors.modelLearningSystems}
                      </FieldErrorMsg>

                      {Object.keys(ModelLearningSystemType)
                        .sort(sortOtherEnum)
                        .map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`ops-eval-and-learning-learning-systems-${type}`}
                                name="modelLearningSystems"
                                label={translateModelLearningSystemType(type)}
                                value={type}
                                checked={values?.modelLearningSystems.includes(
                                  type as ModelLearningSystemType
                                )}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(e.target.value);
                                  } else {
                                    const idx = values.modelLearningSystems.indexOf(
                                      e.target.value as ModelLearningSystemType
                                    );
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                              {type === ModelLearningSystemType.OTHER &&
                                values.modelLearningSystems.includes(type) && (
                                  <div className="margin-left-4 margin-top-neg-3">
                                    <Label
                                      htmlFor="ops-eval-and-learning-learning-systems-other"
                                      className="text-normal maxw-none"
                                    >
                                      {h('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors.modelLearningSystemsOther}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextAreaField}
                                      className="maxw-none mint-textarea"
                                      id="ops-eval-and-learning-learning-systems-other"
                                      maxLength={5000}
                                      name="modelLearningSystemsOther"
                                    />
                                  </div>
                                )}
                            </Fragment>
                          );
                        })}
                      <AddNote
                        id="ops-eval-and-learning-learning-systems-note"
                        field="modelLearningSystemsNote"
                      />
                    </>
                  )}
                />

                <FieldGroup
                  scrollElement="anticipatedChallenges"
                  error={!!flatErrors.anticipatedChallenges}
                >
                  <Label htmlFor="ops-eval-and-learning-learning-anticipated-challenges">
                    {t('obstacles')}
                  </Label>
                  <p className="text-base margin-y-1 margin-top-2 line-height-body-4">
                    {t('obstaclesInfo')}
                  </p>
                  <FieldErrorMsg>
                    {flatErrors.anticipatedChallenges}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    className="height-card"
                    error={flatErrors.anticipatedChallenges}
                    id="ops-eval-and-learning-learning-anticipated-challenges"
                    data-testid="ops-eval-and-learning-learning-anticipated-challenges"
                    name="anticipatedChallenges"
                  />
                </FieldGroup>

                {!loading && values.status && (
                  <ReadyForReview
                    id="ops-eval-and-learning-learning-status"
                    field="status"
                    sectionName={t('heading')}
                    status={values.status}
                    setFieldValue={setFieldValue}
                    readyForReviewBy={readyForReviewByUserAccount?.commonName}
                    readyForReviewDts={readyForReviewDts}
                  />
                )}

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
                    {h('saveAndStartNext')}
                  </Button>
                </div>
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => handleFormSubmit('task-list')}
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
            9,
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

export default Learning;
