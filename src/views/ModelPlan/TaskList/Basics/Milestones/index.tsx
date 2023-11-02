import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconArrowBack,
  Label,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';
import { GetMilestonesQuery } from 'gql/gen/graphql';
import {
  useGetMilestonesQuery,
  useUpdateBasicsMutation
} from 'gql/gen/graphql-types';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import MINTAlert from 'components/shared/Alert';
import MINTDatePicker from 'components/shared/DatePicker';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import ExternalLink from 'components/shared/ExternalLink';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { isDateInPast } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

import './index.scss';

type MilestonesFormType = GetMilestonesQuery['modelPlan']['basics'];

// Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
type InitialValueType = Omit<
  MilestonesFormType,
  'readyForReviewByUserAccount' | 'readyForReviewDts'
>;

const Milestones = () => {
  const { t: basicsT } = useTranslation('basics');
  const { t: basicsMiscT } = useTranslation('basicsMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { phasedIn: phasedInConfig } = usePlanTranslation('basics');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();
  const formikRef = useRef<FormikProps<InitialValueType>>(null);

  const { data, loading, error } = useGetMilestonesQuery({
    variables: {
      id: modelID
    },
    fetchPolicy: 'network-only'
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
    readyForReviewByUserAccount,
    readyForReviewDts,
    status
  } = data?.modelPlan?.basics || ({} as MilestonesFormType);

  const [update] = useUpdateBasicsMutation();

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
            history.push(`/models/${modelID}/task-list/characteristics`);
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
    <div>
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
        <Breadcrumb current>{basicsMiscT('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-1">
        {basicsMiscT('heading')}
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

      {/*
        Conditional render the entire form here to load async data properly on a hard browser refresh
        Naviagting to this component through react-router-dom however properly loads the async data into the Truss datepickers
      */}

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
                setFieldError(field, miscellaneousT('validDate'));
              }
            };

            return (
              <div data-testid="model-plan-milestones">
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
                  className="desktop:grid-col-7 milestone-form margin-top-6"
                  onSubmit={e => {
                    handleSubmit(e);
                    window.scrollTo(0, 0);
                  }}
                >
                  <Fieldset disabled={!!error || loading}>
                    <PageHeading headingLevel="h3" className="margin-bottom-2">
                      {basicsMiscT('highLevelTimeline')}
                    </PageHeading>

                    <MINTAlert type="info" slim>
                      <Trans i18nKey="milestonesInfo">
                        Please be sure that the dates listed here are updated in
                        the clearance calendar, if applicable. Contact the MINT
                        Team at{' '}
                        <ExternalLink href="mailto:MINTTeam@cms.hhs.gov">
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
                              id="Milestone-completeICIP"
                              label={basicsT('completeICIP.label')}
                              placeHolder
                              handleOnBlur={handleOnBlur}
                              formikValue={values.completeICIP}
                              value={completeICIP}
                              error={flatErrors.completeICIP}
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
                            {basicsMiscT('clearance')}
                          </legend>

                          <label
                            htmlFor="Milestone-clearanceStarts"
                            className="text-base"
                          >
                            {basicsMiscT('clearanceInfo')}
                          </label>

                          <div className="datepicker__wrapper text-normal">
                            <MINTDatePicker
                              fieldName="clearanceStarts"
                              id="Milestone-clearanceStarts"
                              label={basicsT('clearanceStarts.label')}
                              boldLabel={false}
                              placeHolder
                              handleOnBlur={handleOnBlur}
                              formikValue={values.clearanceStarts}
                              value={clearanceStarts}
                              error={flatErrors.clearanceStarts}
                              warning={false}
                              className="margin-top-1"
                            />

                            <MINTDatePicker
                              fieldName="clearanceEnds"
                              id="Milestone-clearanceEnds"
                              label={basicsT('clearanceEnds.label')}
                              boldLabel={false}
                              placeHolder
                              handleOnBlur={handleOnBlur}
                              formikValue={values.clearanceEnds}
                              value={clearanceEnds}
                              error={flatErrors.clearanceEnds}
                              warning={false}
                              className="margin-top-1"
                            />
                          </div>

                          {(isDateInPast(values.clearanceEnds) ||
                            isDateInPast(values.clearanceStarts)) && (
                            <Alert type="warning" className="margin-top-4">
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
                            id="Milestone-announced"
                            label={basicsT('announced.label')}
                            placeHolder
                            handleOnBlur={handleOnBlur}
                            formikValue={values.announced}
                            value={announced}
                            error={flatErrors.announced}
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
                            {basicsMiscT('applicationPeriod')}
                          </legend>
                        </ProcessListHeading>

                        <div className="datepicker__wrapper">
                          <MINTDatePicker
                            fieldName="applicationsStart"
                            id="Milestone-applicationsStart"
                            label={basicsT('applicationsStart.label')}
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
                            label={basicsT('applicationsEnd.label')}
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
                            {basicsMiscT('demonstrationPerformance')}
                          </legend>

                          <label
                            htmlFor="Milestone-performancePeriodStarts"
                            className="text-base"
                          >
                            {basicsMiscT('demonstrationPerformanceInfo')}
                          </label>
                        </ProcessListHeading>

                        <div className="datepicker__wrapper">
                          <MINTDatePicker
                            fieldName="performancePeriodStarts"
                            id="Milestone-performancePeriodStarts"
                            label={basicsT('performancePeriodStarts.label')}
                            boldLabel={false}
                            placeHolder
                            handleOnBlur={handleOnBlur}
                            formikValue={values.performancePeriodStarts}
                            value={performancePeriodStarts}
                            error={flatErrors.performancePeriodStarts}
                            warning={false}
                            className="margin-top-0"
                          />

                          <MINTDatePicker
                            fieldName="performancePeriodEnds"
                            id="Milestone-performancePeriodEnds"
                            label={basicsT('performancePeriodEnds.label')}
                            boldLabel={false}
                            placeHolder
                            handleOnBlur={handleOnBlur}
                            formikValue={values.performancePeriodEnds}
                            value={performancePeriodEnds}
                            error={flatErrors.performancePeriodEnds}
                            warning={false}
                            className="margin-top-0"
                          />
                        </div>

                        {(isDateInPast(values.performancePeriodStarts) ||
                          isDateInPast(values.performancePeriodEnds)) && (
                          <Alert type="warning" className="margin-top-4">
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
                            id="Milestone-wrapUpEnds"
                            label={basicsT('wrapUpEnds.label')}
                            placeHolder
                            handleOnBlur={handleOnBlur}
                            formikValue={values.wrapUpEnds}
                            value={wrapUpEnds}
                            error={flatErrors.wrapUpEnds}
                            half
                          />
                        </div>
                      </ProcessListItem>
                    </ProcessList>

                    <AddNote
                      id="ModelType-HighLevelNote"
                      field="highLevelNote"
                    />

                    <FieldGroup
                      scrollElement="phasedIn"
                      error={!!flatErrors.phasedIn}
                      className="margin-top-4"
                    >
                      <Label htmlFor="phasedIn">
                        {basicsT('phasedIn.label')}
                      </Label>

                      <span className="usa-hint display-block text-normal margin-top-1">
                        {basicsT('phasedIn.sublabel')}
                      </span>

                      <FieldErrorMsg>{flatErrors.phasedIn}</FieldErrorMsg>

                      <BooleanRadio
                        field="phasedIn"
                        id="phasedIn"
                        value={values.phasedIn}
                        setFieldValue={setFieldValue}
                        options={phasedInConfig.options}
                      />
                    </FieldGroup>

                    <AddNote id="ModelType-phasedInNote" field="phasedInNote" />

                    {!loading && values.status && (
                      <ReadyForReview
                        id="milestones-status"
                        field="status"
                        sectionName={basicsMiscT('heading')}
                        status={values.status}
                        setFieldValue={setFieldValue}
                        readyForReviewBy={
                          readyForReviewByUserAccount?.commonName
                        }
                        readyForReviewDts={readyForReviewDts}
                      />
                    )}

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="button"
                        className="usa-button usa-button--outline margin-bottom-1"
                        onClick={() => {
                          if (getKeys(errors).length > 0) {
                            window.scrollTo(0, 0);
                          } else {
                            validateForm().then(err => {
                              if (getKeys(err).length > 0) {
                                window.scrollTo(0, 0);
                              } else {
                                handleFormSubmit('back');
                              }
                            });
                          }
                        }}
                      >
                        {miscellaneousT('back')}
                      </Button>

                      <Button
                        type="submit"
                        className=""
                        onClick={() => setErrors({})}
                      >
                        {miscellaneousT('saveAndStartNext')}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled"
                      onClick={() => handleFormSubmit('task-list')}
                    >
                      <IconArrowBack className="margin-right-1" aria-hidden />

                      {miscellaneousT('saveAndReturn')}
                    </Button>
                  </Fieldset>
                </Form>
              </div>
            );
          }}
        </Formik>
      )}

      <PageNumber currentPage={3} totalPages={3} className="margin-bottom-10" />
    </div>
  );
};

export default Milestones;
