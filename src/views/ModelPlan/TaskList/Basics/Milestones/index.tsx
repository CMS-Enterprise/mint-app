import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  DatePicker,
  Fieldset,
  Grid,
  GridContainer,
  IconAdd,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlan from 'queries/GetModelPlan';
import {
  GetModelPlan as GetModelPlanType,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';
import { UpdatePlanMilestones as UpdatePlanMilestonesType } from 'queries/types/UpdatePlanMilestones';
import UpdatePlanMilestones from 'queries/UpdatePlanMilestones';
import flattenErrors from 'utils/flattenErrors';
import planBasicsSchema from 'validations/planBasics';

import './index.scss';

type PlanBasicsMilestoneTypes = {
  completeICIP: string | null;
  clearanceStarts: string | null;
  clearanceEnds: string | null;
  announced: string | null;
  applicationsStart: string | null;
  applicationsEnd: string | null;
  performancePeriodStarts: string | null;
  performancePeriodEnds: string | null;
  wrapUpEnds: string | null;
  highLevelNote: string;
  phasedIn: boolean | undefined;
  phasedInNote: string;
};

const Milestones = () => {
  const { t } = useTranslation('basics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();
  const formikRef = useRef<FormikProps<PlanBasicsMilestoneTypes>>(null);
  const [hasHighLevelNote, setHasHighLevelNote] = useState(false);
  const [hasAdditionalNote, setHasAdditionalNote] = useState(false);

  const { data } = useQuery<GetModelPlanType, GetModelPlanVariables>(
    GetModelPlan,
    {
      variables: {
        id: modelID
      }
    }
  );

  const { modelName, milestones } = data?.modelPlan || {};

  const [update] = useMutation<UpdatePlanMilestonesType>(UpdatePlanMilestones);

  const initialValues: PlanBasicsMilestoneTypes = {
    completeICIP: milestones?.completeICIP ?? null,
    clearanceStarts: milestones?.clearanceStarts ?? null,
    clearanceEnds: milestones?.clearanceEnds ?? null,
    announced: milestones?.announced ?? null,
    applicationsStart: milestones?.applicationsStart ?? null,
    applicationsEnd: milestones?.applicationsEnd ?? null,
    performancePeriodStarts: milestones?.performancePeriodStarts ?? null,
    performancePeriodEnds: milestones?.performancePeriodEnds ?? null,
    wrapUpEnds: milestones?.wrapUpEnds ?? null,
    highLevelNote: milestones?.highLevelNote ?? '',
    phasedIn: milestones?.phasedIn ?? undefined,
    phasedInNote: milestones?.phasedInNote ?? ''
  };

  const handleFormSubmit = (
    formikValues: PlanBasicsMilestoneTypes,
    redirect?: 'back' | 'task-list'
  ) => {
    update({
      variables: {
        id: milestones?.id,
        changes: {
          completeICIP: formikValues.completeICIP,
          clearanceStarts: formikValues.clearanceStarts,
          clearanceEnds: formikValues.clearanceEnds,
          announced: formikValues.announced,
          applicationsStart: formikValues.applicationsStart,
          applicationsEnd: formikValues.applicationsEnd,
          performancePeriodStarts: formikValues.performancePeriodStarts,
          performancePeriodEnds: formikValues.performancePeriodEnds,
          wrapUpEnds: formikValues.wrapUpEnds,
          highLevelNote: formikValues.highLevelNote,
          phasedIn: formikValues.phasedIn,
          phasedInNote: formikValues.phasedInNote
        }
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
          handleFormSubmit(values);
        }}
        enableReinitialize
        validationSchema={planBasicsSchema.pageThreeSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<PlanBasicsMilestoneTypes>) => {
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
          const handleOnBlur = (e: any, field: string) => {
            if (e === '') {
              return;
            }
            try {
              setFieldValue(field, new Date(e).toISOString());
              delete errors[field as keyof PlanBasicsMilestoneTypes];
            } catch (error) {
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
              {values.completeICIP && (
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
                  <FieldGroup
                    scrollElement="completeICIP"
                    error={!!flatErrors.completeICIP}
                    className="margin-top-0 width-card-lg"
                  >
                    <Label htmlFor="Milestone-completeICIP">
                      {t('completeICIP')}
                    </Label>
                    <div className="usa-hint" id="appointment-date-hint">
                      {h('datePlaceholder')}
                    </div>
                    <FieldErrorMsg>{flatErrors.completeICIP}</FieldErrorMsg>
                    <Field
                      as={DatePicker}
                      error={+!!flatErrors.completeICIP}
                      id="Milestone-completeICIP"
                      maxLength={50}
                      name="completeICIP"
                      defaultValue={values.completeICIP}
                      onBlur={(e: any) =>
                        handleOnBlur(e.target.value, 'completeICIP')
                      }
                    />
                  </FieldGroup>

                  <legend className="usa-label margin-bottom-1">
                    {t('clearance')}
                  </legend>

                  <div className="fieldGroup__wrapper">
                    <FieldGroup
                      scrollElement="clearanceStarts"
                      error={!!flatErrors.clearanceStarts}
                      className="margin-top-0 width-card-lg"
                    >
                      <label
                        htmlFor="Milestone-clearanceStarts"
                        className="usa-legend margin-top-0"
                      >
                        {t('clearanceStartDate')}
                      </label>
                      <div className="usa-hint" id="appointment-date-hint">
                        {h('datePlaceholder')}
                      </div>
                      <FieldErrorMsg>
                        {flatErrors.clearanceStarts}
                      </FieldErrorMsg>
                      <Field
                        as={DatePicker}
                        error={+!!flatErrors.clearanceStarts}
                        id="Milestone-clearanceStarts"
                        maxLength={50}
                        name="clearanceStarts"
                        defaultValue={values.clearanceStarts}
                        onBlur={(e: any) =>
                          handleOnBlur(e.target.value, 'clearanceStarts')
                        }
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="clearanceEnds"
                      error={!!flatErrors.clearanceEnds}
                      className="margin-top-0 width-card-lg"
                    >
                      <label
                        htmlFor="Milestone-clearanceEnds"
                        className="usa-legend margin-top-0"
                      >
                        {t('clearanceEndDate')}
                      </label>
                      <div className="usa-hint" id="appointment-date-hint">
                        {h('datePlaceholder')}
                      </div>
                      <FieldErrorMsg>{flatErrors.clearanceEnds}</FieldErrorMsg>
                      <Field
                        as={DatePicker}
                        error={+!!flatErrors.clearanceEnds}
                        id="Milestone-clearanceEnds"
                        maxLength={50}
                        name="clearanceEnds"
                        defaultValue={values.clearanceEnds}
                        onBlur={(e: any) =>
                          handleOnBlur(e.target.value, 'clearanceEnds')
                        }
                      />
                    </FieldGroup>
                  </div>

                  <FieldGroup
                    scrollElement="announced"
                    error={!!flatErrors.announced}
                    className="margin-top-4 width-card-lg"
                  >
                    <Label htmlFor="Milestone-announced">
                      {t('annouceModel')}
                    </Label>
                    <div className="usa-hint" id="appointment-date-hint">
                      {h('datePlaceholder')}
                    </div>
                    <FieldErrorMsg>{flatErrors.announced}</FieldErrorMsg>
                    <Field
                      as={DatePicker}
                      error={+!!flatErrors.announced}
                      id="Milestone-announced"
                      maxLength={50}
                      name="announced"
                      defaultValue={values.announced}
                      onBlur={(e: any) =>
                        handleOnBlur(e.target.value, 'announced')
                      }
                    />
                  </FieldGroup>

                  <legend className="usa-label margin-bottom-1">
                    {t('applicationPeriod')}
                  </legend>

                  <div className="fieldGroup__wrapper">
                    <FieldGroup
                      scrollElement="applicationsStart"
                      error={!!flatErrors.applicationsStart}
                      className="margin-top-0 width-card-lg"
                    >
                      <label
                        htmlFor="Milestone-applicationsStart"
                        className="usa-legend margin-top-0"
                      >
                        {t('applicationStartDate')}
                      </label>
                      <div className="usa-hint" id="appointment-date-hint">
                        {h('datePlaceholder')}
                      </div>
                      <FieldErrorMsg>
                        {flatErrors.applicationsStart}
                      </FieldErrorMsg>
                      <Field
                        as={DatePicker}
                        error={+!!flatErrors.applicationsStart}
                        id="Milestone-applicationsStart"
                        maxLength={50}
                        name="applicationsStart"
                        defaultValue={values.applicationsStart}
                        onBlur={(e: any) =>
                          handleOnBlur(e.target.value, 'applicationsStart')
                        }
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="applicationsEnd"
                      error={!!flatErrors.applicationsEnd}
                      className="margin-top-0 width-card-lg"
                    >
                      <label
                        htmlFor="Milestone-applicationsEnd"
                        className="usa-legend margin-top-0"
                      >
                        {t('applicationEndDate')}
                      </label>
                      <div className="usa-hint" id="appointment-date-hint">
                        {h('datePlaceholder')}
                      </div>
                      <FieldErrorMsg>
                        {flatErrors.applicationsEnd}
                      </FieldErrorMsg>
                      <Field
                        as={DatePicker}
                        error={+!!flatErrors.applicationsEnd}
                        id="Milestone-applicationsEnd"
                        maxLength={50}
                        name="applicationsEnd"
                        defaultValue={values.applicationsEnd}
                        onBlur={(e: any) =>
                          handleOnBlur(e.target.value, 'applicationsEnd')
                        }
                      />
                    </FieldGroup>
                  </div>

                  <legend className="usa-label margin-bottom-1">
                    {t('demonstrationPerformance')}
                  </legend>

                  <div className="fieldGroup__wrapper">
                    <FieldGroup
                      scrollElement="performancePeriodStarts"
                      error={!!flatErrors.performancePeriodStarts}
                      className="margin-top-0 width-card-lg"
                    >
                      <label
                        htmlFor="Milestone-performancePeriodStarts"
                        className="usa-legend margin-top-0"
                      >
                        {t('performanceStartDate')}
                      </label>
                      <div className="usa-hint" id="appointment-date-hint">
                        {h('datePlaceholder')}
                      </div>
                      <FieldErrorMsg>
                        {flatErrors.performancePeriodStarts}
                      </FieldErrorMsg>
                      <Field
                        as={DatePicker}
                        error={+!!flatErrors.performancePeriodStarts}
                        id="Milestone-performancePeriodStarts"
                        maxLength={50}
                        name="performancePeriodStarts"
                        defaultValue={values.performancePeriodStarts}
                        onBlur={(e: any) =>
                          handleOnBlur(
                            e.target.value,
                            'performancePeriodStarts'
                          )
                        }
                      />
                    </FieldGroup>
                    <FieldGroup
                      scrollElement="performancePeriodEnds"
                      error={!!flatErrors.performancePeriodEnds}
                      className="margin-top-0 width-card-lg"
                    >
                      <label
                        htmlFor="Milestone-performancePeriodEnds"
                        className="usa-legend margin-top-0"
                      >
                        {t('performanceEndDate')}
                      </label>
                      <div className="usa-hint" id="appointment-date-hint">
                        {h('datePlaceholder')}
                      </div>
                      <FieldErrorMsg>
                        {flatErrors.performancePeriodEnds}
                      </FieldErrorMsg>
                      <Field
                        as={DatePicker}
                        error={+!!flatErrors.performancePeriodEnds}
                        id="Milestone-performancePeriodEnds"
                        maxLength={50}
                        name="performancePeriodEnds"
                        defaultValue={values.performancePeriodEnds}
                        onBlur={(e: any) =>
                          handleOnBlur(e.target.value, 'performancePeriodEnds')
                        }
                      />
                    </FieldGroup>
                  </div>

                  <FieldGroup
                    scrollElement="wrapUpEnds"
                    error={!!flatErrors.wrapUpEnds}
                    className="margin-top-4  width-card-lg"
                  >
                    <Label htmlFor="Milestone-wrapUpEnds">
                      {t('modelWrapUp')}
                    </Label>
                    <div className="usa-hint" id="appointment-date-hint">
                      {h('datePlaceholder')}
                    </div>
                    <FieldErrorMsg>{flatErrors.wrapUpEnds}</FieldErrorMsg>
                    <Field
                      as={DatePicker}
                      error={+!!flatErrors.wrapUpEnds}
                      id="Milestone-wrapUpEnds"
                      maxLength={50}
                      name="wrapUpEnds"
                      defaultValue={values.wrapUpEnds}
                      onBlur={(e: any) =>
                        handleOnBlur(e.target.value, 'wrapUpEnds')
                      }
                    />
                  </FieldGroup>

                  <div className="grid-col-12">
                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled margin-top-4"
                      onClick={() => setHasHighLevelNote(!hasHighLevelNote)}
                    >
                      <IconAdd className="margin-right-1" aria-hidden />
                      {h('additionalNote')}
                    </Button>
                  </div>

                  {hasHighLevelNote && (
                    <FieldGroup className="margin-top-4 grid-col-12">
                      <Field
                        as={TextAreaField}
                        className="height-15"
                        id="ModelType-HighLevelNote"
                        name="highLevelNote"
                        label={t('Notes')}
                      />
                    </FieldGroup>
                  )}

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

                  <div className="grid-col-12">
                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled margin-top-4"
                      onClick={() => setHasAdditionalNote(!hasAdditionalNote)}
                    >
                      <IconAdd className="margin-right-1" aria-hidden />
                      {h('additionalNote')}
                    </Button>
                  </div>

                  {hasAdditionalNote && (
                    <FieldGroup className="margin-top-4 grid-col-12">
                      <Field
                        as={TextAreaField}
                        className="height-15"
                        id="ModelType-phasedInNote"
                        name="phasedInNote"
                        label={t('notes')}
                      />
                    </FieldGroup>
                  )}

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
                              handleFormSubmit(values, 'task-list');
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
                    onClick={() => {
                      if (Object.keys(errors).length > 0) {
                        window.scrollTo(0, 0);
                      } else {
                        validateForm().then(err => {
                          if (Object.keys(err).length > 0) {
                            window.scrollTo(0, 0);
                          } else {
                            handleFormSubmit(values, 'task-list');
                          }
                        });
                      }
                    }}
                  >
                    <IconArrowBack className="margin-right-1" aria-hidden />
                    {h('saveAndReturn')}
                  </Button>
                </Form>
              )}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={3} totalPages={3} className="margin-bottom-10" />
    </div>
  );
};

export default Milestones;
