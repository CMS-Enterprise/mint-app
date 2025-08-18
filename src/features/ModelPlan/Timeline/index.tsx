import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Formik, FormikProps } from 'formik';
import {
  GetTimelineQuery,
  TypedUpdateTimelineDocument,
  useGetTimelineQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import MINTAlert from 'components/Alert';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import MINTDatePicker from 'components/DatePicker';
import ExternalLink from 'components/ExternalLink';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import ReadyForReview from 'components/ReadyForReview';
import useHandleMutation from 'hooks/useHandleMutation';
import { isDateInPast } from 'utils/date';

import './index.scss';

type TimelineFormType = GetTimelineQuery['modelPlan']['timeline'];

// Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
type InitialValueType = Omit<
  TimelineFormType,
  | 'readyForReviewByUserAccount'
  | 'readyForReviewDts'
  | 'createdDts'
  | 'modifiedDts'
>;

const Timeline = () => {
  const { t: timelineT } = useTranslation('timeline');
  const { t: timelineMiscT } = useTranslation('timelineMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<InitialValueType>>(null);

  const { data, loading, error } = useGetTimelineQuery({
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
    readyForReviewByUserAccount,
    readyForReviewDts,
    status
  } = (data?.modelPlan?.timeline || {}) as TimelineFormType;

  const { mutationError } = useHandleMutation(TypedUpdateTimelineDocument, {
    id,
    formikRef: formikRef as React.RefObject<FormikProps<any>>
  });

  const initialValues: InitialValueType = {
    __typename: 'PlanTimeline',
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
    status
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="model-plan-timeline">
      <GridContainer>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={() => mutationError.closeModal()}
          url={mutationError.destinationURL}
        />

        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.TIMELINE
          ]}
        />

        <Grid row>
          <Grid desktop={{ col: 9 }} tablet={{ col: 9 }}>
            <PageHeading className="margin-top-4 margin-bottom-1">
              {timelineMiscT('heading')}
            </PageHeading>

            <p
              className="margin-top-0 margin-bottom-1 font-body-lg"
              data-testid="model-plan-name"
            >
              {miscellaneousT('for')} {modelName}
            </p>

            <p className="margin-bottom-2 mint-body-medium">
              {timelineMiscT('description')}
            </p>

            {/*
        Conditional render the entire form here to load async data properly on a hard browser refresh
        Naviagting to this component through react-router-dom however properly loads the async data into the Truss datepickers
      */}

            {loading ? (
              <PageLoading />
            ) : (
              <Formik
                initialValues={initialValues}
                onSubmit={() => {
                  navigate(`/models/${modelID}/collaboration-area`);
                }}
                enableReinitialize
                validateOnBlur={false}
                validateOnChange={false}
                validateOnMount={false}
                innerRef={formikRef}
              >
                {(formikProps: FormikProps<InitialValueType>) => {
                  const {
                    handleSubmit,
                    setErrors,
                    setFieldError,
                    setFieldValue,
                    values
                  } = formikProps;

                  const handleOnBlur = (
                    e: React.ChangeEvent<HTMLInputElement>,
                    field: string
                  ) => {
                    if (e.target.value === '') {
                      setFieldValue(field, null);
                      return;
                    }
                    try {
                      setFieldValue(
                        field,
                        new Date(e.target.value).toISOString()
                      );
                    } catch (err) {
                      setFieldError(field, miscellaneousT('validDate'));
                    }
                  };

                  return (
                    <div data-testid="model-plan-timeline">
                      <ConfirmLeave />

                      <MINTForm
                        className="desktop:grid-col-8 timeline-form margin-y-6"
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                          handleSubmit(e);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <Fieldset disabled={!!error || loading}>
                          <MINTAlert type="info" slim>
                            <Trans i18nKey="timelineInfo">
                              Please be sure that the dates listed here are
                              updated in the clearance calendar, if applicable.
                              Contact the MINT Team at{' '}
                              <ExternalLink
                                href="mailto:MINTTeam@cms.hhs.gov"
                                inlineText
                              >
                                MINTTeam@cms.hhs.gov
                              </ExternalLink>{' '}
                              if you have any questions.
                            </Trans>
                          </MINTAlert>

                          <ProcessList className="read-only-model-plan__timeline maxw-full margin-left-neg-105  ">
                            <ProcessListItem className="read-only-model-plan__timeline__list-item maxw-full">
                              <ProcessListHeading
                                type="h5"
                                className="font-body-sm line-height-sans-4 text-normal"
                              >
                                <div className="datepicker__wrapper display-block">
                                  <MINTDatePicker
                                    className="margin-top-0"
                                    fieldName="completeICIP"
                                    id="timeline-completeICIP"
                                    label={timelineT('completeICIP.label')}
                                    placeHolder
                                    handleOnBlur={handleOnBlur}
                                    formikValue={values.completeICIP}
                                    value={completeICIP}
                                    shouldShowWarning={
                                      initialValues.completeICIP !==
                                      values.completeICIP
                                    }
                                    half
                                  />
                                </div>
                              </ProcessListHeading>
                            </ProcessListItem>

                            <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full">
                              <ProcessListHeading
                                type="h5"
                                className="font-body-sm line-height-sans-4 text-normal"
                              >
                                <legend className="usa-label margin-bottom-05">
                                  {timelineMiscT('clearance')}
                                </legend>

                                <label
                                  htmlFor="timeline-clearanceStarts"
                                  className="text-base"
                                >
                                  {timelineMiscT('clearanceInfo')}
                                </label>

                                <div className="datepicker__wrapper text-normal">
                                  <MINTDatePicker
                                    fieldName="clearanceStarts"
                                    id="timeline-clearanceStarts"
                                    label={timelineT('clearanceStarts.label')}
                                    boldLabel={false}
                                    placeHolder
                                    handleOnBlur={handleOnBlur}
                                    formikValue={values.clearanceStarts}
                                    value={clearanceStarts}
                                    warning={false}
                                    className="margin-top-1"
                                    shouldShowWarning={
                                      initialValues.clearanceStarts !==
                                      values.clearanceStarts
                                    }
                                  />

                                  <MINTDatePicker
                                    fieldName="clearanceEnds"
                                    id="timeline-clearanceEnds"
                                    label={timelineT('clearanceEnds.label')}
                                    boldLabel={false}
                                    placeHolder
                                    handleOnBlur={handleOnBlur}
                                    formikValue={values.clearanceEnds}
                                    value={clearanceEnds}
                                    warning={false}
                                    className="margin-top-1"
                                    shouldShowWarning={
                                      initialValues.clearanceEnds !==
                                      values.clearanceEnds
                                    }
                                  />
                                </div>

                                {(isDateInPast(values.clearanceEnds) ||
                                  isDateInPast(values.clearanceStarts)) &&
                                  (initialValues.clearanceStarts !==
                                    values.clearanceStarts ||
                                    initialValues.clearanceEnds !==
                                      values.clearanceEnds) && (
                                    <Alert
                                      type="warning"
                                      className="margin-top-4"
                                      headingLevel="h4"
                                    >
                                      {miscellaneousT('dateWarning')}
                                    </Alert>
                                  )}
                              </ProcessListHeading>
                            </ProcessListItem>

                            <ProcessListItem className="read-only-model-plan__timeline__list-item maxw-full">
                              <ProcessListHeading
                                type="h5"
                                className="font-body-sm line-height-sans-4 text-normal"
                              />

                              <div className="datepicker__wrapper display-block">
                                <MINTDatePicker
                                  className="margin-top-0"
                                  fieldName="announced"
                                  id="timeline-announced"
                                  label={timelineT('announced.label')}
                                  placeHolder
                                  handleOnBlur={handleOnBlur}
                                  formikValue={values.announced}
                                  value={announced}
                                  shouldShowWarning={
                                    initialValues.announced !== values.announced
                                  }
                                  half
                                />
                              </div>
                            </ProcessListItem>

                            <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full">
                              <ProcessListHeading
                                type="h5"
                                className="font-body-sm line-height-sans-4 text-normal"
                              >
                                <legend className="usa-label margin-bottom-neg-2">
                                  {timelineMiscT('applicationPeriod')}
                                </legend>
                              </ProcessListHeading>

                              <div className="datepicker__wrapper">
                                <MINTDatePicker
                                  fieldName="applicationsStart"
                                  id="timeline-applicationsStart"
                                  label={timelineT('applicationsStart.label')}
                                  boldLabel={false}
                                  placeHolder
                                  handleOnBlur={handleOnBlur}
                                  formikValue={values.applicationsStart}
                                  value={applicationsStart}
                                  shouldShowWarning={
                                    initialValues.applicationsStart !==
                                    values.applicationsStart
                                  }
                                  warning={false}
                                />

                                <MINTDatePicker
                                  fieldName="applicationsEnd"
                                  id="timeline-applicationsEnd"
                                  label={timelineT('applicationsEnd.label')}
                                  boldLabel={false}
                                  placeHolder
                                  handleOnBlur={handleOnBlur}
                                  formikValue={values.applicationsEnd}
                                  value={applicationsEnd}
                                  shouldShowWarning={
                                    initialValues.applicationsEnd !==
                                    values.applicationsEnd
                                  }
                                  warning={false}
                                />
                              </div>

                              {(isDateInPast(values.applicationsStart) ||
                                isDateInPast(values.applicationsEnd)) &&
                                (initialValues.applicationsStart !==
                                  values.applicationsStart ||
                                  initialValues.applicationsEnd !==
                                    values.applicationsEnd) && (
                                  <Alert
                                    type="warning"
                                    className="margin-top-4"
                                    headingLevel="h4"
                                  >
                                    {miscellaneousT('dateWarning')}
                                  </Alert>
                                )}
                            </ProcessListItem>

                            <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full">
                              <ProcessListHeading
                                type="h5"
                                className="font-body-sm line-height-sans-4 text-normal"
                              >
                                <legend className="usa-label">
                                  {timelineMiscT('demonstrationPerformance')}
                                </legend>

                                <label
                                  htmlFor="timeline-performancePeriodStarts"
                                  className="text-base"
                                >
                                  {timelineMiscT(
                                    'demonstrationPerformanceInfo'
                                  )}
                                </label>
                              </ProcessListHeading>

                              <div className="datepicker__wrapper">
                                <MINTDatePicker
                                  fieldName="performancePeriodStarts"
                                  id="timeline-performancePeriodStarts"
                                  label={timelineT(
                                    'performancePeriodStarts.label'
                                  )}
                                  boldLabel={false}
                                  placeHolder
                                  handleOnBlur={handleOnBlur}
                                  formikValue={values.performancePeriodStarts}
                                  value={performancePeriodStarts}
                                  warning={false}
                                  className="margin-top-0"
                                  shouldShowWarning={
                                    initialValues.performancePeriodStarts !==
                                    values.performancePeriodStarts
                                  }
                                />

                                <MINTDatePicker
                                  fieldName="performancePeriodEnds"
                                  id="timeline-performancePeriodEnds"
                                  label={timelineT(
                                    'performancePeriodEnds.label'
                                  )}
                                  boldLabel={false}
                                  placeHolder
                                  handleOnBlur={handleOnBlur}
                                  formikValue={values.performancePeriodEnds}
                                  value={performancePeriodEnds}
                                  warning={false}
                                  className="margin-top-0"
                                  shouldShowWarning={
                                    initialValues.performancePeriodEnds !==
                                    values.performancePeriodEnds
                                  }
                                />
                              </div>

                              {(isDateInPast(values.performancePeriodStarts) ||
                                isDateInPast(values.performancePeriodEnds)) &&
                                (initialValues.performancePeriodStarts !==
                                  values.performancePeriodStarts ||
                                  initialValues.performancePeriodEnds !==
                                    values.performancePeriodEnds) && (
                                  <Alert
                                    type="warning"
                                    className="margin-top-4"
                                    headingLevel="h4"
                                  >
                                    {miscellaneousT('dateWarning')}
                                  </Alert>
                                )}
                            </ProcessListItem>

                            <ProcessListItem className="read-only-model-plan__timeline__list-item maxw-full">
                              <ProcessListHeading
                                type="h5"
                                className="font-body-sm line-height-sans-4 text-normal"
                              />

                              <div className="datepicker__wrapper display-block">
                                <MINTDatePicker
                                  fieldName="wrapUpEnds"
                                  className="margin-top-0"
                                  id="timeline-wrapUpEnds"
                                  label={timelineT('wrapUpEnds.label')}
                                  placeHolder
                                  handleOnBlur={handleOnBlur}
                                  formikValue={values.wrapUpEnds}
                                  value={wrapUpEnds}
                                  shouldShowWarning={
                                    initialValues.wrapUpEnds !==
                                    values.wrapUpEnds
                                  }
                                  half
                                />
                              </div>
                            </ProcessListItem>
                          </ProcessList>

                          <AddNote
                            id="ModelType-HighLevelNote"
                            field="highLevelNote"
                          />

                          {!loading && values.status && (
                            <ReadyForReview
                              id="timeline-status"
                              field="status"
                              sectionName={timelineMiscT('heading')}
                              status={values.status}
                              setFieldValue={setFieldValue}
                              readyForReviewBy={
                                readyForReviewByUserAccount?.commonName
                              }
                              readyForReviewDts={readyForReviewDts}
                            />
                          )}

                          <div className="margin-top-2 margin-bottom-3">
                            <Button type="submit" onClick={() => setErrors({})}>
                              {miscellaneousT('save')}
                            </Button>
                          </div>

                          <Button
                            type="button"
                            className="usa-button usa-button--unstyled"
                            onClick={() =>
                              navigate(`/models/${modelID}/collaboration-area`)
                            }
                          >
                            <Icon.ArrowBack
                              className="margin-right-1"
                              aria-hidden
                              aria-label="back"
                            />

                            {timelineMiscT('dontUpdate')}
                          </Button>
                        </Fieldset>
                      </MINTForm>
                    </div>
                  );
                }}
              </Formik>
            )}
          </Grid>

          <Grid desktop={{ col: 3 }} tablet={{ col: 3 }}>
            <AskAQuestion
              modelID={modelID}
              renderTextFor="timeline"
              className="margin-top-8"
            />
          </Grid>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Timeline;
