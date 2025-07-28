import React, { useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Grid,
  GridContainer,
  Icon,
  Label,
  Select
} from '@trussworks/react-uswds';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import { ModelStatus, useUpdateModelPlanMutation } from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';

type StatusFormProps = {
  status: ModelStatus | undefined;
};

const Status = () => {
  const { t: modelPlanT } = useTranslation('modelPlan');
  const { t: modelPlanTaskListT } = useTranslation('modelPlanTaskList');
  const { t: modelPlanMiscT } = useTranslation('modelPlanMisc');

  const { status: statusConfig } = usePlanTranslation('modelPlan');

  const { showMessageOnNextPage } = useMessage();

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  // Get model status from generated email link
  const modelStatus = params.get('model-status') as ModelStatus;

  const formikRef = useRef<FormikProps<StatusFormProps>>(null);

  const { status } = useContext(ModelInfoContext);

  const [update] = useUpdateModelPlanMutation();

  const handleFormSubmit = (formikValues: StatusFormProps) => {
    if (formikValues.status) {
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
            showMessageOnNextPage(
              modelPlanTaskListT('statusUpdateSuccess', {
                status: statusConfig.options[formikValues.status as ModelStatus]
              })
            );
            navigate(`/models/${modelID}/collaboration-area/`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    }
  };

  const initialValues: StatusFormProps = {
    status: modelStatus ?? status ?? undefined
  };

  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 6 }}>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.COLLABORATION_AREA,
              BreadcrumbItemOptions.STATUS
            ]}
          />

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
                        disabled={
                          (!dirty && !modelStatus) ||
                          (!dirty && modelStatus === status)
                        }
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
                        navigate(`/models/${modelID}/collaboration-area`)
                      }
                    >
                      <Icon.ArrowBack
                        className="margin-right-1"
                        aria-hidden
                        aria-label="back"
                      />

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
