import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  DatePicker,
  Fieldset,
  IconAdd,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlanQuery from 'queries/GetModelPlanQuery';
import {
  GetModelPlan,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';
import flattenErrors from 'utils/flattenErrors';
import planBasicsSchema from 'validations/planBasics';

type PlanBasicsOverviewTypes = {
  modelName: string;
  tightTimeline: string;
};

const Milestones = () => {
  const { t } = useTranslation('basics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelId } = useParams<{ modelId: string }>();
  const [hasHighLevelNote, setHasHighLevelNote] = useState(false);
  const [hasAdditionalNote, setHasAdditionalNote] = useState(false);
  const history = useHistory();

  const { data } = useQuery<GetModelPlan, GetModelPlanVariables>(
    GetModelPlanQuery,
    {
      variables: {
        id: modelId
      }
    }
  );

  const { modelName } = data?.modelPlan || {};

  const initialValues = {
    modelName: modelName as string,
    tightTimeline: ''
  };

  const handleFormSubmit = (formikValues: PlanBasicsOverviewTypes) => {
    console.log(formikValues);
  };

  return (
    <MainContent className="margin-bottom-5">
      <div className="grid-container">
        <div className="tablet:grid-col-12">
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{h('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
          </BreadcrumbBar>
          <PageHeading className="margin-bottom-1">{t('heading')}</PageHeading>
          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            <Trans i18nKey="modelPlanTaskList:subheading">
              indexZero {modelName} indexTwo
            </Trans>
          </p>
          <p className="margin-bottom-2 font-body-md line-height-sans-4">
            {t('helpText')}
          </p>

          <PageHeading headingLevel="h3" className="margin-bottom-4">
            {t('highLevelTimeline')}
          </PageHeading>

          <Formik
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            enableReinitialize
            validationSchema={planBasicsSchema.pageTwoSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(formikProps: FormikProps<PlanBasicsOverviewTypes>) => {
              const {
                dirty,
                errors,
                handleSubmit,
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
                      heading="Please check and fix the following"
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
                    className="tablet:grid-col-6 grid-row grid-gap"
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <FieldGroup
                      scrollElement="completeICIP"
                      error={!!flatErrors.completeICIP}
                      className="margin-top-0 grid-col-6"
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
                        error={!!flatErrors.completeICIP}
                        id="Milestone-completeICIP"
                        maxLength={50}
                        name="completeICIP"
                      />
                    </FieldGroup>

                    <FieldGroup className="grid-row grid-gap flex-align-end">
                      <div className="grid-col-6">
                        <legend className="usa-label margin-bottom-1">
                          {t('clearance')}
                        </legend>
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
                          error={!!flatErrors.clearanceStarts}
                          id="Milestone-clearanceStarts"
                          maxLength={50}
                          name="clearanceStarts"
                        />
                      </div>

                      <div className="grid-col-6">
                        <label
                          htmlFor="Milestone-clearanceEnds"
                          className="usa-legend margin-top-0"
                        >
                          {t('clearanceEndDate')}
                        </label>
                        <div className="usa-hint" id="appointment-date-hint">
                          {h('datePlaceholder')}
                        </div>
                        <FieldErrorMsg>
                          {flatErrors.clearanceEnds}
                        </FieldErrorMsg>
                        <Field
                          as={DatePicker}
                          error={!!flatErrors.clearanceEnds}
                          id="Milestone-clearanceEnds"
                          maxLength={50}
                          name="clearanceEnds"
                        />
                      </div>
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="announced"
                      error={!!flatErrors.announced}
                      className="margin-top-4 grid-col-6"
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
                        error={!!flatErrors.announced}
                        id="Milestone-announced"
                        maxLength={50}
                        name="announced"
                      />
                    </FieldGroup>

                    <FieldGroup className="grid-row grid-gap flex-align-end">
                      <div className="grid-col-6">
                        <legend className="usa-label margin-bottom-1">
                          {t('applicationPeriod')}
                        </legend>
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
                          error={!!flatErrors.applicationsStart}
                          id="Milestone-applicationsStart"
                          maxLength={50}
                          name="applicationsStart"
                        />
                      </div>
                      <div className="grid-col-6">
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
                          error={!!flatErrors.applicationsEnd}
                          id="Milestone-applicationsEnd"
                          maxLength={50}
                          name="applicationsEnd"
                        />
                      </div>
                    </FieldGroup>

                    <FieldGroup className="grid-row grid-gap flex-align-end">
                      <legend className="usa-label margin-bottom-1">
                        {t('demonstrationPerformance')}
                      </legend>
                      <div className="grid-col-6">
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
                          error={!!flatErrors.performancePeriodStarts}
                          id="Milestone-performancePeriodStarts"
                          maxLength={50}
                          name="performancePeriodStarts"
                        />
                      </div>

                      <div className="grid-col-6">
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
                          error={!!flatErrors.performancePeriodEnds}
                          id="Milestone-performancePeriodEnds"
                          maxLength={50}
                          name="performancePeriodEnds"
                        />
                      </div>
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="wrapUpEnds"
                      error={!!flatErrors.wrapUpEnds}
                      className="margin-top-4 grid-col-6"
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
                        error={!!flatErrors.wrapUpEnds}
                        id="Milestone-wrapUpEnds"
                        maxLength={50}
                        name="wrapUpEnds"
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
                      scrollElement="tightTimeline"
                      error={!!flatErrors.tightTimeline}
                      className="margin-top-4"
                    >
                      <Label htmlFor="tightTimeline">
                        {t('tightTimeline')}
                      </Label>
                      <span className="usa-hint display-block text-normal margin-top-1">
                        {t('tightTimelineInfo')}
                      </span>
                      <FieldErrorMsg>{flatErrors.tightTimeline}</FieldErrorMsg>
                      <Fieldset>
                        <Field
                          as={Radio}
                          id="phasedIn-Yes"
                          name="phasedIn"
                          label={h('yes')}
                          value="YES"
                          checked={values.phasedIn === 'YES'}
                        />
                        <Field
                          as={Radio}
                          id="phasedIn-No"
                          name="phasedIn"
                          label={h('no')}
                          value="NO"
                          checked={values.phasedIn === 'NO'}
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
                          label={t('Notes')}
                        />
                      </FieldGroup>
                    )}

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="button"
                        className="usa-button usa-button--outline margin-bottom-1"
                        onClick={() => history.goBack()}
                      >
                        {h('back')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={!dirty}
                        className=""
                        onClick={() => setErrors({})}
                      >
                        {h('next')}
                      </Button>
                    </div>
                  </Form>
                </>
              );
            }}
          </Formik>
        </div>
        {/* //TODO: To implement a save function */}
        <Link
          to={`/models/${modelId}/task-list/`}
          className="display-flex flex-align-center margin-bottom-6"
        >
          <IconArrowBack className="margin-right-1" aria-hidden />
          {h('saveAndReturn')}
        </Link>
        <PageNumber
          currentPage={3}
          totalPages={3}
          className="margin-bottom-10"
        />
      </div>
    </MainContent>
  );
};

export default Milestones;
