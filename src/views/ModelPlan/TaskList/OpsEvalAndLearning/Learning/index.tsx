import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetLearningQuery,
  ModelLearningSystemType,
  useGetLearningQuery,
  useUpdatePlanOpsEvalAndLearningMutation
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

type GetLearningFormType = GetLearningQuery['modelPlan']['opsEvalAndLearning'];

const Learning = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    modelLearningSystems: modelLearningSystemsConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID } = useParams<{ modelID: string }>();

  // Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
  type InitialValueType = Omit<
    GetLearningFormType,
    'readyForReviewByUserAccount' | 'readyForReviewDts'
  >;

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetLearningQuery({
    variables: {
      id: modelID
    }
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
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as GetLearningFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useUpdatePlanOpsEvalAndLearningMutation();

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
            <span>{miscellaneousT('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{miscellaneousT('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{opsEvalAndLearningMiscT('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>

      <PageHeading className="margin-top-4 margin-bottom-2">
        {opsEvalAndLearningMiscT('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {miscellaneousT('for')} {modelName}
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

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-learning-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="ops-eval-and-learning-learning-systems"
                    error={!!flatErrors.modelLearningSystems}
                  >
                    <Label htmlFor="ops-eval-and-learning-learning-systems">
                      {opsEvalAndLearningT('modelLearningSystems.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-learning-systems-warning"
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

                    {getKeys(modelLearningSystemsConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`ops-eval-and-learning-learning-systems-${type}`}
                            name="modelLearningSystems"
                            label={modelLearningSystemsConfig.options[type]}
                            value={type}
                            checked={values?.modelLearningSystems.includes(
                              type
                            )}
                          />

                          {type === ModelLearningSystemType.OTHER &&
                            values.modelLearningSystems.includes(
                              ModelLearningSystemType.OTHER
                            ) && (
                              <div className="margin-left-4">
                                <Label
                                  htmlFor="ops-eval-and-learning-learning-systems-other"
                                  className="text-normal maxw-none"
                                >
                                  {opsEvalAndLearningT(
                                    'modelLearningSystemsOther.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.modelLearningSystemsOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  id="ops-eval-and-learning-learning-systems-other"
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
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-learning-anticipated-challenges"
                    error={!!flatErrors.anticipatedChallenges}
                  >
                    <Label htmlFor="ops-eval-and-learning-learning-anticipated-challenges">
                      {opsEvalAndLearningT('anticipatedChallenges.label')}
                    </Label>

                    <p className="text-base margin-y-1 margin-top-2 line-height-body-4">
                      {opsEvalAndLearningT('anticipatedChallenges.sublabel')}
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
                      sectionName={opsEvalAndLearningMiscT('heading')}
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
                      {miscellaneousT('back')}
                    </Button>

                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('saveAndStartNext')}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => handleFormSubmit('task-list')}
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
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
