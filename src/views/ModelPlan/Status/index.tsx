import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  Icon,
  Label,
  Select
} from '@trussworks/react-uswds';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import { ModelStatus, useUpdateModelPlanMutation } from 'gql/gen/graphql';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import FieldGroup from 'components/shared/FieldGroup';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

type StatusFormProps = {
  status: ModelStatus | undefined;
};

const Status = () => {
  const { t: modelPlanT } = useTranslation('modelPlan');
  const { t: modelPlanMiscT } = useTranslation('modelPlanMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { status: statusConfig } = usePlanTranslation('modelPlan');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();
  const formikRef = useRef<FormikProps<StatusFormProps>>(null);

  const { status } = useContext(ModelInfoContext);

  const [update] = useUpdateModelPlanMutation();

  const handleFormSubmit = (formikValues: StatusFormProps) => {
    update({
      variables: {
        id: modelID,
        changes: {
          status: formikValues.status
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push(`/models/${modelID}/task-list/`);
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: StatusFormProps = {
    status: status ?? undefined
  };

  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 6 }}>
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{miscellaneousT('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/models/${modelID}/task-list/`}
              >
                <span>{miscellaneousT('tasklistBreadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{modelPlanMiscT('headingStatus')}</Breadcrumb>
          </BreadcrumbBar>

          <PageHeading className="margin-bottom-1">
            {modelPlanMiscT('headingStatus')}
          </PageHeading>

          <p className="margin-bottom-6 line-height-body-5">
            {modelPlanMiscT('copy')}
          </p>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleFormSubmit}
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<StatusFormProps>) => {
              const {
                errors,
                values,
                setErrors,
                dirty,
                setFieldValue,
                handleSubmit
              } = formikProps;
              return (
                <>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <FieldGroup scrollElement="status" error={!!errors.status}>
                      <Label htmlFor="Status-Dropdown">
                        {modelPlanT('status.label')}
                      </Label>

                      <ErrorMessage name="status" />

                      <Field
                        as={Select}
                        id="Status-Dropdown"
                        name="role"
                        value={values.status}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('status', e.target.value);
                        }}
                      >
                        {getKeys(statusConfig.options).map(role => {
                          return (
                            <option
                              key={`Status-Dropdown-${statusConfig.options[role]})}`}
                              value={role}
                            >
                              {statusConfig.options[role]}
                            </option>
                          );
                        })}
                      </Field>
                    </FieldGroup>

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="submit"
                        disabled={!dirty}
                        className=""
                        onClick={() => setErrors({})}
                      >
                        {modelPlanMiscT('updateButton')}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled"
                      onClick={() =>
                        history.push(`/models/${modelID}/task-list/`)
                      }
                    >
                      <Icon.ArrowBack className="margin-right-1" aria-hidden />

                      {modelPlanMiscT('return')}
                    </Button>
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

export default Status;
