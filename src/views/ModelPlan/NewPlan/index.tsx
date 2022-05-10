import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import CreateDraftModelPlan from 'queries/CreateModelPlan';
import flattenErrors from 'utils/flattenErrors';
import NewModelPlanValidationSchema from 'validations/newModelPlan';
import NotFound from 'views/NotFound';

import Collaborators from '../Collaborators';
import AddCollaborator from '../Collaborators/AddCollaborator';

const NewPlanContent = () => {
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const history = useHistory();
  const [mutate] = useMutation(CreateDraftModelPlan);

  const handleCreateDraftModelPlan = (formikValues: { modelName: string }) => {
    const { modelName } = formikValues;
    mutate({
      variables: {
        input: {
          modelName,
          status: 'PLAN_DRAFT'
        }
      }
    }).then(response => {
      if (!response?.errors) {
        const { id } = response?.data?.createModelPlan;
        history.push(`/models/new-plan/${id}/collaborators`);
      }
    });
  };

  return (
    <MainContent data-testid="new-plan">
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
          <PageHeading className="margin-top-4">{t('heading')}</PageHeading>
          <Alert
            type="info"
            slim
            data-testid="mandatory-fields-alert"
            className="margin-bottom-4"
          >
            <span className="mandatory-fields-alert__text">
              {t('modelNameInfo')}
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
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <FieldGroup
                      scrollElement="modelName"
                      error={!!flatErrors.modelName}
                    >
                      <Label htmlFor="new-plan-model-name">
                        {t('modeName')}
                      </Label>
                      <FieldErrorMsg>{flatErrors.modelName}</FieldErrorMsg>
                      <Field
                        as={TextInput}
                        error={!!flatErrors.modelName}
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
                        {h('cancel')}
                      </UswdsReactLink>
                      <Button
                        type="submit"
                        disabled={!dirty}
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
      </div>
    </MainContent>
  );
};

const NewPlan = () => {
  return (
    <Switch>
      {/* New Plan Pages */}
      <Route path="/models/new-plan" exact render={() => <NewPlanContent />} />
      <Route
        path="/models/new-plan/:modelId/collaborators"
        render={() => <Collaborators />}
      />
      <Route
        path="/models/new-plan/:modelId/add-collaborator/:collaboratorId?"
        render={() => <AddCollaborator />}
      />

      {/* 404 */}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default NewPlan;
