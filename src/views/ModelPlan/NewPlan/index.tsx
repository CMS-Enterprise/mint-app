import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { useCreateModelPlanMutation } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import flattenErrors from 'utils/flattenErrors';
import NewModelPlanValidationSchema from 'validations/newModelPlan';
import NotFound from 'views/NotFound';

const NewPlanContent = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: modelPlanMiscT } = useTranslation('modelPlanMisc');

  const history = useHistory();
  const [mutate] = useCreateModelPlanMutation();

  const handleCreateDraftModelPlan = (formikValues: { modelName: string }) => {
    const { modelName } = formikValues;
    mutate({
      variables: {
        modelName
      }
    }).then(response => {
      if (!response.errors && response.data) {
        const { id } = response.data.createModelPlan;
        history.push(`/models/${id}/collaborators?view=add`);
      }
    });
  };

  return (
    <MainContent data-testid="new-plan">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{miscellaneousT('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{modelPlanMiscT('breadcrumb')}</Breadcrumb>
          </BreadcrumbBar>

          <PageHeading className="margin-top-4">
            {modelPlanMiscT('heading')}
          </PageHeading>

          <Alert
            type="info"
            slim
            data-testid="mandatory-fields-alert"
            className="margin-bottom-4"
          >
            <span className="mandatory-fields-alert__text">
              {modelPlanMiscT('modelNameInfo')}
            </span>
          </Alert>

          <Formik
            initialValues={{ modelName: '' }}
            onSubmit={handleCreateDraftModelPlan}
            validationSchema={NewModelPlanValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(formikProps: FormikProps<{ modelName: string }>) => {
              const { errors, setErrors, handleSubmit, dirty } = formikProps;
              const flatErrors = flattenErrors(errors);

              return (
                <>
                  {Object.keys(errors).length > 0 && (
                    <ErrorAlert
                      testId="formik-validation-errors"
                      classNames="margin-top-3"
                      heading={miscellaneousT('checkAndFix')}
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
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                    className="tablet:grid-col-6 margin-top-6"
                  >
                    <FieldGroup
                      scrollElement="modelName"
                      error={!!flatErrors.modelName}
                    >
                      <Label htmlFor="new-plan-model-name">
                        {modelPlanMiscT('modeName')}
                      </Label>

                      <FieldErrorMsg>{flatErrors.modelName}</FieldErrorMsg>

                      <Field
                        as={TextInput}
                        id="new-plan-model-name"
                        maxLength={50}
                        name="modelName"
                      />
                    </FieldGroup>

                    <div className="margin-top-5 display-block">
                      <UswdsReactLink
                        className="usa-button usa-button--outline margin-bottom-1"
                        variant="unstyled"
                        to="/models/steps-overview"
                      >
                        {miscellaneousT('cancel')}
                      </UswdsReactLink>

                      <Button
                        type="submit"
                        disabled={!dirty}
                        onClick={() => setErrors({})}
                      >
                        {miscellaneousT('next')}
                      </Button>
                    </div>
                  </Form>
                </>
              );
            }}
          </Formik>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

const NewPlan = () => {
  return (
    <Switch>
      {/* New Plan Pages */}
      <Route path="/models/new-plan" exact render={() => <NewPlanContent />} />

      {/* 404 */}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default NewPlan;
