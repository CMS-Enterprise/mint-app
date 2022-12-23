import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import MINTDatePicker from 'components/shared/DatePicker';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetMilestones from 'queries/Basics/GetMilestones';
import {
  GetMilestones as GetMilestonesType,
  GetMilestones_modelPlan_basics as MilestonesFormType,
  GetMilestonesVariables
} from 'queries/Basics/types/GetMilestones';
import { UpdatePlanBasicsVariables } from 'queries/Basics/types/UpdatePlanBasics';
import UpdatePlanBasics from 'queries/Basics/UpdatePlanBasics';
import { isDateInPast } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

import './index.scss';

const Milestones = () => {
  const { t } = useTranslation('basics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  // Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
  type InitialValueType = Omit<
    MilestonesFormType,
    'readyForReviewBy' | 'readyForReviewDts'
  >;

  const history = useHistory();
  const formikRef = useRef<FormikProps<InitialValueType>>(null);

  const { data, loading, error } = useQuery<
    GetMilestonesType,
    GetMilestonesVariables
  >(GetMilestones, {
    variables: {
      id: modelID
    }
  });

  const { modelName } = data?.modelPlan || {};

  const {
    id,
    completeICIP,
    clearanceStarts,
    clearanceEnds,
    announced,
    applicationsStart,
    applicationsEnd,
    performancePeriodStarts,
    performancePeriodEnds,
    highLevelNote,
    wrapUpEnds,
    phasedIn,
    phasedInNote,
    readyForReviewBy,
    readyForReviewDts,
    status
  } = data?.modelPlan?.basics || ({} as MilestonesFormType);

  const [update] = useMutation<UpdatePlanBasicsVariables>(UpdatePlanBasics);

  const handleFormSubmit = (redirect?: 'back' | 'task-list') => {
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
          if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/basics/overview`);
          } else {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: InitialValueType = {
    __typename: 'PlanBasics',
    id: id ?? '',
    completeICIP: completeICIP ?? null,
    clearanceStarts: clearanceStarts ?? null,
    clearanceEnds: clearanceEnds ?? null,
    announced: announced ?? null,
    applicationsStart: applicationsStart ?? null,
    applicationsEnd: applicationsEnd ?? null,
    performancePeriodStarts: performancePeriodStarts ?? null,
    performancePeriodEnds: performancePeriodEnds ?? null,
    wrapUpEnds: wrapUpEnds ?? null,
    highLevelNote: highLevelNote ?? '',
    phasedIn: phasedIn ?? null,
    phasedInNote: phasedInNote ?? '',
    status
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div data-testid="model-plan-milestones">
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
      <PageHeading className="margin-top-4 margin-bottom-1">
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
      {!loading && (
        <Formik
          initialValues={initialValues}
          onSubmit={() => {
            handleFormSubmit();
          }}
          enableReinitialize
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          innerRef={formikRef}
        >
          {(formikProps: FormikProps<InitialValueType>) => {
            const {
              errors,
              handleSubmit,
              setErrors,
              setFieldError,
              setFieldValue,
              validateForm,
              values
            } = formikProps;
            const flatErrors = flattenErrors(errors);

            const handleOnBlur = (
              e: React.ChangeEvent<HTMLInputElement>,
              field: string
            ) => {
              if (e.target.value === '') {
                setFieldValue(field, null);
                return;
              }
              try {
                setFieldValue(field, new Date(e.target.value).toISOString());
                delete errors[field as keyof InitialValueType];
              } catch (err) {
                setFieldError(field, t('validDate'));
              }
            };
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
                  className="tablet:grid-col-6 milestone-form margin-top-6"
                  onSubmit={e => {
                    handleSubmit(e);
                    window.scrollTo(0, 0);
                  }}
                >
                  <PageHeading headingLevel="h3" className="margin-bottom-4">
                    {t('highLevelTimeline')}
                  </PageHeading>

                  <MINTDatePicker
                    fieldName="completeICIP"
                    id="Milestone-completeICIP"
                    label={t('completeICIP')}
                    placeHolder
                    handleOnBlur={handleOnBlur}
                    formikValue={values.completeICIP}
                    value={completeICIP}
                    error={flatErrors.completeICIP}
                  />

                  <legend className="usa-label ">{t('clearance')}</legend>

                  <p className="text-base margin-bottom-neg-2 margin-top-1">
                    {t('clearanceInfo')}
                  </p>

                  <div className="fieldGroup__wrapper">
                    <MINTDatePicker
                      fieldName="clearanceStarts"
                      id="Milestone-clearanceStarts"
                      label={t('clearanceStartDate')}
                      boldLabel={false}
                      placeHolder
                      handleOnBlur={handleOnBlur}
                      formikValue={values.clearanceStarts}
                      value={clearanceStarts}
                      error={flatErrors.clearanceStarts}
                      warning={false}
                    />

                    <MINTDatePicker
                      fieldName="clearanceEnds"
                      id="Milestone-clearanceEnds"
                      label={t('clearanceEndDate')}
                      boldLabel={false}
                      placeHolder
                      handleOnBlur={handleOnBlur}
                      formikValue={values.clearanceEnds}
                      value={clearanceEnds}
                      error={flatErrors.clearanceEnds}
                      warning={false}
                    />
                  </div>

                  {(isDateInPast(values.clearanceEnds) ||
                    isDateInPast(values.clearanceStarts)) && (
                    <Alert type="warning" className="margin-top-4">
                      {h('dateWarning')}
                    </Alert>
                  )}

                  <MINTDatePicker
                    fieldName="announced"
                    className="margin-top-4 width-card-lg"
                    id="Milestone-announced"
                    label={t('annouceModel')}
                    placeHolder
                    handleOnBlur={handleOnBlur}
                    formikValue={values.announced}
                    value={announced}
                    error={flatErrors.announced}
                  />

                  <legend className="usa-label margin-bottom-neg-2">
                    {t('applicationPeriod')}
                  </legend>

                  <div className="fieldGroup__wrapper">
                    <MINTDatePicker
                      fieldName="applicationsStart"
                      id="Milestone-applicationsStart"
                      label={t('applicationStartDate')}
                      boldLabel={false}
                      placeHolder
                      handleOnBlur={handleOnBlur}
                      formikValue={values.applicationsStart}
                      value={applicationsStart}
                      error={flatErrors.applicationsStart}
                      warning={false}
                    />

                    <MINTDatePicker
                      fieldName="applicationsEnd"
                      id="Milestone-applicationsEnd"
                      label={t('applicationEndDate')}
                      boldLabel={false}
                      placeHolder
                      handleOnBlur={handleOnBlur}
                      formikValue={values.applicationsEnd}
                      value={applicationsEnd}
                      error={flatErrors.applicationsEnd}
                      warning={false}
                    />
                  </div>

                  {(isDateInPast(values.applicationsStart) ||
                    isDateInPast(values.applicationsEnd)) && (
                    <Alert type="warning" className="margin-top-4">
                      {h('dateWarning')}
                    </Alert>
                  )}

                  <legend className="usa-label margin-bottom-neg-2">
                    {t('demonstrationPerformance')}
                  </legend>

                  <div className="fieldGroup__wrapper">
                    <MINTDatePicker
                      fieldName="performancePeriodStarts"
                      id="Milestone-performancePeriodStarts"
                      label={t('performanceStartDate')}
                      boldLabel={false}
                      placeHolder
                      handleOnBlur={handleOnBlur}
                      formikValue={values.performancePeriodStarts}
                      value={performancePeriodStarts}
                      error={flatErrors.performancePeriodStarts}
                      warning={false}
                    />

                    <MINTDatePicker
                      fieldName="performancePeriodEnds"
                      id="Milestone-performancePeriodEnds"
                      label={t('performanceEndDate')}
                      boldLabel={false}
                      placeHolder
                      handleOnBlur={handleOnBlur}
                      formikValue={values.performancePeriodEnds}
                      value={performancePeriodEnds}
                      error={flatErrors.performancePeriodEnds}
                      warning={false}
                    />
                  </div>

                  {(isDateInPast(values.performancePeriodStarts) ||
                    isDateInPast(values.performancePeriodEnds)) && (
                    <Alert type="warning" className="margin-top-4">
                      {h('dateWarning')}
                    </Alert>
                  )}

                  <MINTDatePicker
                    fieldName="wrapUpEnds"
                    className="margin-top-4 width-card-lg"
                    id="Milestone-wrapUpEnds"
                    label={t('annouceModel')}
                    placeHolder
                    handleOnBlur={handleOnBlur}
                    formikValue={values.wrapUpEnds}
                    value={wrapUpEnds}
                    error={flatErrors.wrapUpEnds}
                  />

                  <AddNote id="ModelType-HighLevelNote" field="highLevelNote" />

                  <FieldGroup
                    scrollElement="phasedIn"
                    error={!!flatErrors.phasedIn}
                    className="margin-top-4"
                  >
                    <Label htmlFor="phasedIn">{t('tightTimeline')}</Label>
                    <span className="usa-hint display-block text-normal margin-top-1">
                      {t('tightTimelineInfo')}
                    </span>
                    <FieldErrorMsg>{flatErrors.phasedIn}</FieldErrorMsg>
                    <Fieldset>
                      <Field
                        as={Radio}
                        id="phasedIn-Yes"
                        name="phasedIn"
                        label={h('yes')}
                        value="YES"
                        checked={values.phasedIn === true}
                        onChange={() => {
                          setFieldValue('phasedIn', true);
                        }}
                      />
                      <Field
                        as={Radio}
                        id="phasedIn-No"
                        name="phasedIn"
                        label={h('no')}
                        value="FALSE"
                        checked={values.phasedIn === false}
                        onChange={() => {
                          setFieldValue('phasedIn', false);
                        }}
                      />
                    </Fieldset>
                  </FieldGroup>

                  <AddNote id="ModelType-phasedInNote" field="phasedInNote" />

                  <ReadyForReview
                    id="milestones-status"
                    field="status"
                    sectionName={t('heading')}
                    status={values.status}
                    setFieldValue={setFieldValue}
                    readyForReviewBy={readyForReviewBy}
                    readyForReviewDts={readyForReviewDts}
                  />

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        if (Object.keys(errors).length > 0) {
                          window.scrollTo(0, 0);
                        } else {
                          validateForm().then(err => {
                            if (Object.keys(err).length > 0) {
                              window.scrollTo(0, 0);
                            } else {
                              handleFormSubmit('back');
                            }
                          });
                        }
                      }}
                    >
                      {h('back')}
                    </Button>
                    <Button
                      type="submit"
                      className=""
                      onClick={() => setErrors({})}
                    >
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
              </>
            );
          }}
        </Formik>
      )}
      <PageNumber currentPage={3} totalPages={3} className="margin-bottom-10" />
    </div>
  );
};

export default Milestones;
