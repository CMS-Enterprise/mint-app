import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import {
  DateInputDay,
  DateInputMonth,
  DateInputYear
} from 'components/shared/DateInput';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import { AnythingWrongSurvey } from 'components/Survey';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import {
  UpdateSystemIntakeReviewDates,
  UpdateSystemIntakeReviewDatesVariables
} from 'queries/types/UpdateSystemIntakeReviewDates';
import UpdateSystemIntakeReviewDatesQuery from 'queries/UpdateSystemIntakeReviewDatesQuery';
import { SubmitDatesForm } from 'types/systemIntake';
import { parseAsDate } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { DateValidationSchema } from 'validations/systemIntakeSchema';

const Dates = ({ systemIntake }: { systemIntake: SystemIntake }) => {
  const { systemId } = useParams<{ systemId: string }>();
  const history = useHistory();
  const { t } = useTranslation();
  const [mutate, mutationResult] = useMutation<
    UpdateSystemIntakeReviewDates,
    UpdateSystemIntakeReviewDatesVariables
  >(UpdateSystemIntakeReviewDatesQuery, {
    errorPolicy: 'all'
  });

  const { grtDate, grbDate } = systemIntake;
  const parsedGrbDate = grbDate ? parseAsDate(grbDate) : null;
  const parsedGrtDate = grtDate ? parseAsDate(grtDate) : null;

  // TODO: Fix Text Field so we don't have to set initial empty values
  const initialValues: SubmitDatesForm = {
    grtDateDay: grtDate && parsedGrtDate ? String(parsedGrtDate.day) : '',
    grtDateMonth: grtDate && parsedGrtDate ? String(parsedGrtDate.month) : '',
    grtDateYear: grtDate && parsedGrtDate ? String(parsedGrtDate.year) : '',
    grbDateDay: grbDate && parsedGrbDate ? String(parsedGrbDate.day) : '',
    grbDateMonth: grbDate && parsedGrbDate ? String(parsedGrbDate.month) : '',
    grbDateYear: grbDate && parsedGrbDate ? String(parsedGrbDate.year) : ''
  };

  const onSubmit = (values: SubmitDatesForm) => {
    const {
      grtDateDay,
      grtDateMonth,
      grtDateYear,
      grbDateMonth,
      grbDateDay,
      grbDateYear
    } = values;

    const newGrtDate = DateTime.fromObject({
      day: Number(grtDateDay),
      month: Number(grtDateMonth),
      year: Number(grtDateYear),
      zone: 'UTC'
    }).toISO();

    const newGrbDate = DateTime.fromObject({
      day: Number(grbDateDay),
      month: Number(grbDateMonth),
      year: Number(grbDateYear),
      zone: 'UTC'
    }).toISO();

    mutate({
      variables: {
        input: {
          id: systemId,
          grtDate: newGrtDate,
          grbDate: newGrbDate
        }
      }
    }).then(() => {
      history.push(`/governance-review-team/${systemId}/intake-request`);
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={DateValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<SubmitDatesForm>) => {
        const { errors, handleSubmit } = formikProps;
        const flatErrors = flattenErrors(errors);
        return (
          <>
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="system-intake-errors"
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
            {mutationResult.error && (
              <ErrorAlert heading="Error">
                <ErrorAlertMessage
                  message={mutationResult.error.message}
                  errorKey="systemIntake"
                />
              </ErrorAlert>
            )}
            <PageHeading data-testid="grt-dates-view">
              {t('governanceReviewTeam:dates.heading')}
            </PageHeading>
            <h2>{t('governanceReviewTeam:dates.subheading')}</h2>
            <div className="tablet:grid-col-6">
              <MandatoryFieldsAlert />
            </div>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                {/* GRT Date Fields */}
                <FieldGroup
                  error={
                    !!flatErrors.grtDateMonth ||
                    !!flatErrors.grtDateDay ||
                    !!flatErrors.grtDateYear
                  }
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      {t('governanceReviewTeam:dates.grtDate.label')}
                    </legend>
                    <HelpText id="TestDate-DateHelp">
                      For example 04 28 2020
                    </HelpText>
                    <FieldErrorMsg>{flatErrors.grtDateMonth}</FieldErrorMsg>
                    <FieldErrorMsg>{flatErrors.grtDateDay}</FieldErrorMsg>
                    <FieldErrorMsg>{flatErrors.grtDateYear}</FieldErrorMsg>
                    <div className="usa-memorable-date">
                      <div className="usa-form-group usa-form-group--month">
                        <Label htmlFor="Dates-GrtDateMonth">
                          {t('general:date.month')}
                        </Label>
                        <Field
                          as={DateInputMonth}
                          error={!!flatErrors.grtDateMonth}
                          id="Dates-GrtDateMonth"
                          name="grtDateMonth"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day">
                        <Label htmlFor="Dates-GrtDateDay">
                          {t('general:date.day')}
                        </Label>
                        <Field
                          as={DateInputDay}
                          error={!!flatErrors.grtDateDay}
                          id="Dates-GrtDateDay"
                          name="grtDateDay"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year">
                        <Label htmlFor="Dates-GrtDateYear">
                          {t('general:date.year')}
                        </Label>
                        <Field
                          as={DateInputYear}
                          error={!!flatErrors.grtDateYear}
                          id="Dates-GrtDateYear"
                          name="grtDateYear"
                        />
                      </div>
                    </div>
                  </fieldset>
                </FieldGroup>
                {/* End GRT Date Fields */}
                {/* GRB Date Fields */}
                <FieldGroup
                  error={
                    !!flatErrors.grbDateMonth ||
                    !!flatErrors.grbDateDay ||
                    !!flatErrors.grbDateYear
                  }
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      {t('governanceReviewTeam:dates.grbDate.label')}
                    </legend>
                    <FieldErrorMsg>{flatErrors.grbDateMonth}</FieldErrorMsg>
                    <FieldErrorMsg>{flatErrors.grbDateDay}</FieldErrorMsg>
                    <FieldErrorMsg>{flatErrors.grbDateYear}</FieldErrorMsg>
                    <div className="usa-memorable-date">
                      <div className="usa-form-group usa-form-group--month">
                        <Label htmlFor="Dates-GrbDateMonth">
                          {t('general:date.month')}
                        </Label>
                        <Field
                          as={TextField}
                          error={!!flatErrors.grbDateMonth}
                          id="Dates-GrbDateMonth"
                          maxLength={2}
                          name="grbDateMonth"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day">
                        <Label htmlFor="Dates-GrbDateDay">
                          {t('general:date.day')}
                        </Label>
                        <Field
                          as={TextField}
                          error={!!flatErrors.grbDateDay}
                          id="Dates-GrbDateDay"
                          maxLength={2}
                          name="grbDateDay"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year">
                        <Label htmlFor="Dates-GrbDateYear">
                          {t('general:date.year')}
                        </Label>
                        <Field
                          as={TextField}
                          error={!!flatErrors.grbDateYear}
                          id="Dates-GrbDateYear"
                          maxLength={4}
                          name="grbDateYear"
                        />
                      </div>
                    </div>
                  </fieldset>
                </FieldGroup>
                {/* End GRB Date Fields */}
                <Button className="margin-top-2" type="submit">
                  {t('governanceReviewTeam:dates.submit')}
                </Button>
              </Form>
              <AnythingWrongSurvey />
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default Dates;
