import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  CharacterCount,
  Fieldset,
  Grid,
  GridContainer,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  ReportAProblemInput,
  ReportAProblemSection,
  ReportAProblemSeverity
} from 'gql/generated/graphql';
import CreateReportAProblem from 'gql/operations/Feedback/CreateReportAProblem';

import Alert from 'components/Alert';
import BooleanRadio from 'components/BooleanRadioForm';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { getKeys } from 'types/translation';
import { tObject } from 'utils/translation';

const ReportAProblem = () => {
  const { t } = useTranslation(['feedback', 'miscellaneous']);

  const history = useHistory();

  const [mutationError, setMutationError] = useState<boolean>(false);

  const [update, { loading }] = useMutation(CreateReportAProblem);

  const sectionOptions = tObject<ReportAProblemSection>(
    'feedback:section.options'
  );

  const severityOptions = tObject<ReportAProblemSeverity>(
    'feedback:severity.options'
  );

  const handleFormSubmit = (formikValues: ReportAProblemInput) => {
    update({
      variables: {
        input: formikValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push('/feedback-received');
        }
      })
      .catch(errors => {
        setMutationError(true);
        window.scrollTo(0, 0);
      });
  };

  const initialValues: ReportAProblemInput = {
    isAnonymousSubmission: false,
    allowContact: null,
    section: null,
    sectionOther: '',
    severity: null,
    severityOther: ''
  };

  return (
    <MainContent>
      <GridContainer>
        <HelpBreadcrumb newTabOnly />

        {mutationError && (
          <Alert type="error" slim className="margin-top-4">
            {t('errorFeedback')}
          </Alert>
        )}

        <PageHeading className="margin-bottom-2">
          {t('reportHeading')}
        </PageHeading>

        <p className="margin-bottom-2 font-body-lg line-height-sans-lg">
          {t('reportSubheading')}
        </p>

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

                      <p className="text-base margin-y-1">
                        {t('isAnonymousSubmission.sublabel')}
                      </p>

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
                      <Label
                        htmlFor="report-a-problem-allow-contact"
                        className="margin-top-5"
                      >
                        {t('allowContact.label')}
                      </Label>

                      <p className="text-base margin-y-1">
                        {t('allowContact.sublabel')}
                      </p>

                      <BooleanRadio
                        field="allowContact"
                        id="report-a-problem-allow-contact"
                        value={
                          values.allowContact === undefined
                            ? null
                            : values.allowContact
                        }
                        setFieldValue={setFieldValue}
                        disabled={values.isAnonymousSubmission === true}
                        options={{
                          true: t('allowContact.options.true'),
                          false: t('allowContact.options.false')
                        }}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="report-a-problem-allow-contact"
                        className="margin-top-5"
                      >
                        {t('section.label')}
                      </Label>

                      <Fieldset>
                        {getKeys(sectionOptions).map(key => (
                          <Fragment key={key}>
                            <Field
                              as={Radio}
                              id={`report-a-problem-section-${key}`}
                              data-testid={`report-a-problem-section-${key}`}
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
                                  data-testid="report-a-problem-section-other"
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
                      <Label
                        htmlFor="report-a-problem-what-went-wrong"
                        className="margin-top-5"
                      >
                        {t('whatDoing.label')}
                      </Label>

                      <Field
                        as={CharacterCount}
                        id="report-a-problem-section-what-doing"
                        data-testid="report-a-problem-section-what-doing"
                        className="height-card margin-bottom-1"
                        isTextArea
                        name="whatDoing"
                        maxLength={2000}
                        getCharacterCount={(text: string): number =>
                          Array.from(text).length
                        }
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="report-a-problem-what-went-wrong"
                        className="margin-top-5"
                      >
                        {t('whatWentWrong.label')}
                      </Label>

                      <Field
                        as={CharacterCount}
                        id="report-a-problem-section-what-went-wrong"
                        data-testid="report-a-problem-section-what-went-wrong"
                        className="height-card margin-bottom-1"
                        isTextArea
                        name="whatWentWrong"
                        maxLength={2000}
                        getCharacterCount={(text: string): number =>
                          Array.from(text).length
                        }
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="report-a-problem-allow-severity"
                        className="margin-top-5"
                      >
                        {t('severity.label')}
                      </Label>

                      <Fieldset>
                        {getKeys(severityOptions).map(key => (
                          <Fragment key={key}>
                            <Field
                              as={Radio}
                              id={`report-a-problem-severity-${key}`}
                              data-testid={`report-a-problem-severity-${key}`}
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
                        className="usa-button margin-bottom-1"
                        onClick={() => {
                          handleFormSubmit(values);
                        }}
                      >
                        {t('sendReport')}
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
