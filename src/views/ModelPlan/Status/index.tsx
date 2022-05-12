import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
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
import { Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import FieldGroup from 'components/shared/FieldGroup';
import modelStatus from 'constants/enums/modelPlanStatuses';
import { translateModelPlanStatus } from 'utils/modelPlan';

const Status = () => {
  const { t } = useTranslation('modelPlan');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelId } = useParams<{ modelId: string }>();

  const formikRef = useRef<FormikProps>(null);

  const NewModelPlanValidationSchema = Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the model Name')
  });

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
            initialValues={{ status: '' }}
            enableReinitialize
            onSubmit={values => console.log(values)}
            validationSchema={NewModelPlanValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<{ status: string }>) => {
              const {
                errors,
                values,
                setErrors,
                dirty,
                isValid,
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
                    <FieldGroup
                      scrollElement="status"
                      // error={!!flatErrors.status}
                    >
                      <Label htmlFor="IntakeForm-RequesterComponent">
                        {t('status.label')}
                      </Label>
                      <Field
                        as={Dropdown}
                        id="collaborator-role"
                        name="role"
                        value={values.status}
                        onChange={(e: any) => {
                          setFieldValue('teamRole', e.target.value);
                        }}
                      >
                        <option value="" key="default-select" disabled>
                          {`-${h('select')}-`}
                        </option>
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
                        disabled={!(dirty || isValid)}
                        className=""
                        onClick={() => setErrors({})}
                      >
                        {t('status.updateButton')}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled"
                      onClick={() => console.log('send me back')}
                    >
                      <IconArrowBack className="margin-right-1" aria-hidden />
                      {t('status.return')}
                    </Button>
                  </Form>
                </>
              );
            }}
          </Formik>

          {/*
            formik
            label
            dropdown

            update button submit button

            return link
           */}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Status;
