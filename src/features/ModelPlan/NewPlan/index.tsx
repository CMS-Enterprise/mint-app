import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  GridContainer,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import { useCreateModelPlanMutation } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import flattenErrors from 'utils/flattenErrors';
import NewModelPlanValidationSchema from 'validations/newModelPlan';

const NewPlanContent = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: modelPlanMiscT } = useTranslation('modelPlanMisc');

  const navigate = useNavigate();
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
        navigate(`/models/${id}/collaboration-area/collaborators?view=add`);
      }
    });
  };

  return (
    <MainContent data-testid="new-plan">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Breadcrumbs
            items={[BreadcrumbItemOptions.HOME]}
            customItem={modelPlanMiscT('breadcrumb')}
          />

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
                  <form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
                        maxLength={200}
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
                  </form>
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
    <Routes>
      {/* New Plan Pages */}
      <Route path="/models/new-plan" element={<NewPlanContent />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default NewPlan;
