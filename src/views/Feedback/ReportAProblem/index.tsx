import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  Button,
  Fieldset,
  GridContainer,
  Label
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';
import CreateReportAProblem from 'gql/apolloGQL/Feedback/CreateReportAProblem';
import { ReportAProblemInput } from 'gql/gen/graphql';

import BooleanRadio from 'components/BooleanRadioForm';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import FieldGroup from 'components/shared/FieldGroup';

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
              <>
                <Form
                  className="margin-top-6"
                  onSubmit={e => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={loading}>
                    <FieldGroup>
                      <Label htmlFor="ops-eval-and-learning-technical-contacts-identified-use">
                        {t('isAnonymousSubmission.label')}
                      </Label>

                      <BooleanRadio
                        field="isAnonymousSubmission"
                        id="ops-eval-and-learning-technical-contacts-identified-use"
                        value={values.isAnonymousSubmission}
                        setFieldValue={setFieldValue}
                        options={{
                          true: t('isAnonymousSubmission.options.true'),
                          false: t('isAnonymousSubmission.options.false')
                        }}
                      />
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
              </>
            );
          }}
        </Formik>
      </GridContainer>
    </MainContent>
  );
};

export default ReportAProblem;
