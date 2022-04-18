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

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import CreateDraftModelPlan from 'queries/CreateDraftModelPlan';
import flattenErrors from 'utils/flattenErrors';
import NewModelPlanValidationSchema from 'validations/newModelPlan';
import NotFound from 'views/NotFound';

import Collaborators from '../Collaborators';

const NewPlanContent = () => {
  const { t } = useTranslation('modelPlan');
  const history = useHistory();
  const [mutate] = useMutation(CreateDraftModelPlan);

  const handleCreateDraftModelPlan = (formikValues: { modelName: string }) => {
    const { modelName } = formikValues;
    mutate({
      variables: {
        input: {
          modelName
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
    <MainContent className="margin-bottom-5">
      <div className="grid-container">
        <div className="tablet:grid-col-12">
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>Home</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('stepsOverview.heading')}</Breadcrumb>
          </BreadcrumbBar>
          <PageHeading>{t('stepsOverview.heading')}</PageHeading>
          <Formik
            initialValues={{ modelName: '' }}
            onSubmit={handleCreateDraftModelPlan}
            validationSchema={NewModelPlanValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(formikProps: FormikProps<{ modelName: string }>) => {
              const { values, errors, setErrors, handleSubmit } = formikProps;
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
                      <Label htmlFor="new-plan-model-name">Model Name</Label>
                      <FieldErrorMsg>{flatErrors.modelName}</FieldErrorMsg>
                      <Field
                        as={TextInput}
                        error={!!flatErrors.modelName}
                        id="new-plan-model-name"
                        maxLength={50}
                        name="modelName"
                      />
                    </FieldGroup>
                    <Button
                      className="margin-top-5 display-block"
                      type="submit"
                      onClick={() => setErrors({})}
                    >
                      Continue
                    </Button>
                    {/* <AutoSave
                      values={values}
                      onSave={dispatchSave}
                      debounceDelay={1000 * 3}
                    /> */}
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
    <MainContent className="grid-container">
      <Switch>
        {/* New Plan Pages */}
        <Route
          path="/models/new-plan"
          exact
          render={() => <NewPlanContent />}
        />
        <Route
          path="/models/new-plan/:modelID/collaborators"
          render={() => <Collaborators />}
        />

        {/* 404 */}
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </MainContent>
  );
};

export default NewPlan;
