import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Dropdown,
  Grid,
  GridContainer,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import FieldGroup from 'components/shared/FieldGroup';
import modelStatus from 'constants/enums/modelPlanStatuses';
import GetModelPlanQuery from 'queries/GetModelPlanQuery';
import { GetModelPlan } from 'queries/types/GetModelPlan';
import { UpdateModelPlan as UpdateModelPlanType } from 'queries/types/UpdateModelPlan';
import UpdateModelPlan from 'queries/UpdateModelPlan';
import { ModelStatus } from 'types/graphql-global-types';
import { translateModelPlanStatus } from 'utils/modelPlan';

type StatusFormProps = {
  status: ModelStatus | undefined;
};

const Status = () => {
  const { t } = useTranslation('modelPlan');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelId } = useParams<{ modelId: string }>();

  const history = useHistory();
  const formikRef = useRef<FormikProps<StatusFormProps>>(null);
  const NewModelPlanValidationSchema = Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the model Name')
  });

  const { data } = useQuery<GetModelPlan>(GetModelPlanQuery, {
    variables: {
      id: modelId
    }
  });

  const { status } = data?.modelPlan || {};

  const [update] = useMutation<UpdateModelPlanType>(UpdateModelPlan);

  const handleFormSubmit = (formikValues: StatusFormProps) => {
    console.log('fire');
    update({
      variables: {
        id: modelId,
        changes: {
          status: formikValues.status
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push(`/models/${modelId}/task-list/`);
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  return (
    <MainContent>
      <GridContainer>
        <Grid col={6}>
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{h('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/models/${modelId}/task-list/`}
              >
                <span>{h('tasklistBreadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('status.heading')}</Breadcrumb>
          </BreadcrumbBar>
          <PageHeading className="margin-bottom-1">
            {t('status.heading')}
          </PageHeading>
          <p className="margin-bottom-6 line-height-body-5">
            {t('status.copy')}
          </p>
          <Formik
            initialValues={{ status }}
            enableReinitialize
            onSubmit={handleFormSubmit}
            validationSchema={NewModelPlanValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
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
                      <Label htmlFor="IntakeForm-RequesterComponent">
                        {t('status.label')}
                      </Label>
                      <ErrorMessage name="status" />
                      <Field
                        as={Dropdown}
                        id="collaborator-role"
                        name="role"
                        value={values.status}
                        onChange={(e: any) => {
                          setFieldValue('status', e.target.value);
                        }}
                      >
                        {Object.keys(modelStatus).map(role => {
                          return (
                            <option
                              key={`Collaborator-Role-${translateModelPlanStatus(
                                modelStatus[role]
                              )}`}
                              value={role}
                            >
                              {translateModelPlanStatus(modelStatus[role])}
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
                        {t('status.updateButton')}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled"
                      onClick={() =>
                        history.push(`/models/${modelId}/task-list/`)
                      }
                    >
                      <IconArrowBack className="margin-right-1" aria-hidden />
                      {t('status.return')}
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
