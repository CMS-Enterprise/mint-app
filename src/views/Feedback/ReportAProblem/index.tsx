import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Label,
  Radio,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import CreateReportAProblem from 'gql/apolloGQL/Feedback/CreateReportAProblem';
import {
  ReportAProblemInput,
  ReportAProblemSection,
  ReportAProblemSeverity
} from 'gql/gen/graphql';

import BooleanRadio from 'components/BooleanRadioForm';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import FieldGroup from 'components/shared/FieldGroup';
import { getKeys } from 'types/translation';
import { sortOtherEnum } from 'utils/modelPlan';

const ReportAProblem = () => {
  const { t } = useTranslation(['reportAProblem', 'miscellaneous']);

  const [update, { loading }] = useMutation(CreateReportAProblem);

  const handleFormSubmit = (formikValues: ReportAProblemInput) => {
    update({
      variables: {
        input: formikValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          // TODO: success page
          //   history.push(`/models/${modelID}/task-list`);
        }
      })
      .catch(errors => {
        // TODO: error handling
      });
  };

  const initialValues: ReportAProblemInput = {
    isAnonymousSubmission: false,
    allowContact: true,
    section: null,
    sectionOther: '',
    whatDoing: '',
    whatWentWrong: '',
    severity: null,
    severityOther: ''
  };

  return (
    <MainContent>
      <GridContainer>
        <PageHeading className="margin-bottom-2" data-testid="model-plan-name">
          {t('heading')}
        </PageHeading>

        <p className="margin-bottom-2 font-body-lg">{t('subheading')}</p>

        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            handleFormSubmit(values);
          }}
          enableReinitialize
        >
          {(formikProps: FormikProps<ReportAProblemInput>) => {
            const { handleSubmit, setFieldValue, values } = formikProps;

            return (
              <Grid desktop={{ col: 6 }}>
                <Form
                  className="margin-top-3"
                  onSubmit={e => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={loading}>
                    <FieldGroup>
                      <Label htmlFor="report-a-problem-allow-anon-submission">
                        {t('isAnonymousSubmission.label')}
                      </Label>

                      <BooleanRadio
                        field="isAnonymousSubmission"
                        id="report-a-problem-allow-anon-submission"
                        value={values.isAnonymousSubmission}
                        setFieldValue={setFieldValue}
                        options={{
                          true: t('isAnonymousSubmission.options.true'),
                          false: t('isAnonymousSubmission.options.false')
                        }}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label htmlFor="report-a-problem-allow-contact">
                        {t('allowContact.label')}
                      </Label>

                      <p className="text-base margin-y-1">
                        {t('allowContact.sublabel')}
                      </p>

                      <BooleanRadio
                        field="allowContact"
                        id="report-a-problem-allow-contact"
                        value={values.allowContact}
                        setFieldValue={setFieldValue}
                        disabled={values.isAnonymousSubmission === true}
                        options={{
                          true: t('allowContact.options.true'),
                          false: t('allowContact.options.false')
                        }}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label htmlFor="report-a-problem-allow-contact">
                        {t('allowContact.label')}
                      </Label>

                      <Fieldset>
                        {getKeys(ReportAProblemSection)
                          .sort(sortOtherEnum)
                          .map(key => (
                            <Fragment key={key}>
                              <Field
                                as={Radio}
                                id={`report-a-problem-section-${key}`}
                                name="section"
                                label={t(`section.options.${key}`)}
                                value={key}
                                checked={values.section === key}
                                onChange={() => {
                                  setFieldValue('section', key);
                                }}
                              />

                              {key === ReportAProblemSection.OTHER && (
                                <div className="margin-left-4 margin-top-1">
                                  <Field
                                    as={TextInput}
                                    id="report-a-problem-section-other"
                                    disabled={
                                      values.section !==
                                      ReportAProblemSection.OTHER
                                    }
                                    name="sectionOther"
                                  />
                                </div>
                              )}
                            </Fragment>
                          ))}
                      </Fieldset>
                    </FieldGroup>

                    <FieldGroup>
                      <Label htmlFor="report-a-problem-what-doing">
                        {t('whatDoing.label')}
                      </Label>

                      <Field
                        as={Textarea}
                        className="height-card"
                        id="report-a-problem-section-what-doing"
                        name="whatDoing"
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label htmlFor="report-a-problem-what-went-wrong">
                        {t('whatWentWrong.label')}
                      </Label>

                      <Field
                        as={Textarea}
                        className="height-card"
                        id="report-a-problem-section-what-went-wrong"
                        name="whatWentWrong"
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label htmlFor="report-a-problem-allow-severity">
                        {t('severity.label')}
                      </Label>

                      <Fieldset>
                        {getKeys(ReportAProblemSeverity)
                          .sort(sortOtherEnum)
                          .map(key => (
                            <Fragment key={key}>
                              <Field
                                as={Radio}
                                id={`report-a-problem-severity-${key}`}
                                name="severity"
                                label={t(`severity.options.${key}`)}
                                value={key}
                                checked={values.severity === key}
                                onChange={() => {
                                  setFieldValue('severity', key);
                                }}
                              />

                              {key === ReportAProblemSeverity.OTHER && (
                                <div className="margin-left-4 margin-top-1">
                                  <Field
                                    as={TextInput}
                                    id="report-a-problem-severity-other"
                                    disabled={
                                      values.severity !==
                                      ReportAProblemSeverity.OTHER
                                    }
                                    name="severityOther"
                                  />
                                </div>
                              )}
                            </Fragment>
                          ))}
                      </Fieldset>
                    </FieldGroup>

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="button"
                        className="usa-button usa-button--outline margin-bottom-1"
                        onClick={() => {
                          handleFormSubmit(values);
                        }}
                      >
                        {t('sendReport')}
                      </Button>

                      <Button
                        type="button"
                        className="usa-button margin-bottom-1"
                        onClick={() => {
                          handleFormSubmit(values);
                        }}
                      >
                        {t('sendAndStartAnother')}
                      </Button>
                    </div>
                  </Fieldset>
                </Form>
              </Grid>
            );
          }}
        </Formik>
      </GridContainer>
    </MainContent>
  );
};

export default ReportAProblem;
