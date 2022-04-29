import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Dropdown,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import modelCategory from 'constants/enums/modelCategory';
import GetModelPlanQuery from 'queries/GetModelPlanQuery';
import {
  GetModelPlan,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';
import { UpdateModelPlan as UpdateModelPlanType } from 'queries/types/UpdateModelPlan';
import UpdateModelPlan from 'queries/UpdateModelPlan';
import flattenErrors from 'utils/flattenErrors';
import { translateModelCategory } from 'utils/modelPlan';
import planBasicsSchema from 'validations/planBasics';
import NotFound, { NotFoundPartial } from 'views/NotFound';

const BasicsContent = () => {
  const { t } = useTranslation('basics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelId } = useParams<{ modelId: string }>();
  const [isCmmiGroupShown, setIsCmmiGroupShown] = useState(false);

  const { data } = useQuery<GetModelPlan, GetModelPlanVariables>(
    GetModelPlanQuery,
    {
      variables: {
        id: modelId
      }
    }
  );

  const { modelName } = data?.modelPlan || {};

  const [update] = useMutation<UpdateModelPlanType>(UpdateModelPlan);

  const initialValues = {
    modelName: modelName as string,
    modelCategory: '',
    cmsComponent: "",
    // TODO: Update this when BE is ready
    // cmsComponent: [],
    cmmiGroup: []
  };

  const handleSubmit = () => {
    update({
        variables: {
          input: {
            id: modelId,
            modelName,
            modelCategory,
            cmsCenter: cmsComponent,
            cmmiGroups: cmmiGroup
          }
        }
      })
        .then(response => {
          if (!response?.errors) {
            history.push(`/models/new-plan/${modelId}/collaborators`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    }
  }

  return (
    <MainContent className="margin-bottom-5">
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
              {h('mandatoryFields')}
            </span>
          </Alert>
          <Formik
            // TODO: change intial value of model name of plan via gql
            initialValues={initialValues}
            onSubmit={values => {
              console.log(values);
            }}
            enableReinitialize
            validationSchema={
              isCmmiGroupShown
                ? planBasicsSchema.pageOneSchemaWithCmmiGroup
                : planBasicsSchema.pageOneSchema
            }
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(
              formikProps: FormikProps<{
                modelName: string;
                modelCategory: string;
                cmsComponent: string[];
                cmmiGroup: string[];
              }>
            ) => {
              const {
                dirty,
                errors,
                handleSubmit,
                setErrors,
                setFieldValue,
                values
              } = formikProps;
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
                      className="margin-top-4"
                    >
                      <Label htmlFor="plan-basics-model-name">
                        {t('modelName')}
                      </Label>
                      <FieldErrorMsg>{flatErrors.modelName}</FieldErrorMsg>
                      <Field
                        as={TextInput}
                        error={!!flatErrors.modelName}
                        id="plan-basics-model-name"
                        maxLength={50}
                        name="modelName"
                        defaultValue={modelName}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="modelCategory"
                      error={!!flatErrors.modelCategory}
                      className="margin-top-4"
                    >
                      <Label htmlFor="plan-basics-model-category">
                        {t('modelCategory')}
                      </Label>
                      <FieldErrorMsg>{flatErrors.modelCategory}</FieldErrorMsg>
                      <Field
                        as={Dropdown}
                        id="plan-basics-model-category"
                        name="role"
                        value={values.modelCategory}
                        onChange={(e: any) => {
                          setFieldValue('modelCategory', e.target.value);
                        }}
                      >
                        <option value="" key="default-select" disabled>
                          {`-${h('select')}-`}
                        </option>
                        {Object.keys(modelCategory).map(role => {
                          return (
                            <option
                              key={`Model-Category-${translateModelCategory(
                                modelCategory[role]
                              )}`}
                              value={role}
                            >
                              {translateModelCategory(modelCategory[role])}
                            </option>
                          );
                        })}
                      </Field>
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="cmsComponent"
                      error={!!flatErrors.cmsComponent}
                      className="margin-top-4"
                    >
                      <FieldArray
                        name="cmsComponent"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label">
                              {t('cmsComponent')}
                            </legend>
                            <FieldErrorMsg>
                              {flatErrors.cmsComponent}
                            </FieldErrorMsg>

                            {(t('cmsComponents', {
                              returnObjects: true
                            }) as string[]).map((item, key) => {
                              return (
                                <Fragment key={item}>
                                  <Field
                                    as={CheckboxField}
                                    id={`new-plan-cmsComponent--${key}`}
                                    name="cmsComponent"
                                    label={item}
                                    value={item}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push(e.target.value);
                                      } else {
                                        const idx = values.cmsComponent.indexOf(
                                          e.target.value
                                        );
                                        arrayHelpers.remove(idx);
                                      }
                                      if (e.target.value === 'CMMI') {
                                        setIsCmmiGroupShown(true);
                                      }
                                    }}
                                  />
                                </Fragment>
                              );
                            })}

                            {values.cmsComponent.includes('Other') && (
                              <FieldGroup className="margin-top-4">
                                <Label htmlFor="plan-basics-cmsCategory--Other">
                                  {h('pleaseSpecify')}
                                </Label>
                                {/* TODO: once BE adds in this field, we can then implement this */}
                                <Field
                                  as={TextInput}
                                  id="plan-basics-cmsCategory--Other"
                                  maxLength={50}
                                  name="cmsComponentOther"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    console.log(
                                      `Other CMS Group: ${e.target.value}`
                                    );
                                  }}
                                />
                              </FieldGroup>
                            )}
                          </>
                        )}
                      />
                    </FieldGroup>
                    {values.cmsComponent.includes('CMMI') && (
                      <FieldGroup
                        error={!!flatErrors.cmmiGroup}
                        className="margin-top-4"
                      >
                        <FieldArray
                          name="cmmiGroup"
                          render={arrayHelpers => (
                            <>
                              <legend className="usa-label text-normal">
                                {t('cmmiGroup')}
                              </legend>
                              <FieldErrorMsg>
                                {flatErrors.cmmiGroup}
                              </FieldErrorMsg>

                              {(t('cmmiGroups', {
                                returnObjects: true
                              }) as string[]).map((item, key) => {
                                return (
                                  <Fragment key={item}>
                                    <Field
                                      as={CheckboxField}
                                      id={`new-plan-cmmiGroup--${key}`}
                                      name="cmmiGroup"
                                      label={item}
                                      value={item}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.cmmiGroup.indexOf(
                                            e.target.value
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                  </Fragment>
                                );
                              })}
                            </>
                          )}
                        />
                      </FieldGroup>
                    )}

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="submit"
                        disabled={!dirty}
                        className=""
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
        {/* //TODO: To implement a save function */}
        <Link
          to={`/models/${modelId}/task-list/`}
          className="display-flex flex-align-center margin-bottom-6"
        >
          <IconArrowBack className="margin-right-1" aria-hidden />
          {h('saveAndReturn')}
        </Link>
        <PageNumber
          currentPage={1}
          totalPages={3}
          className="margin-bottom-10"
        />
      </div>
    </MainContent>
  );
};

export const Basics = () => {
  return (
    <Switch>
      <Route
        path="/models/:modelId/task-list/basics"
        render={() => <BasicsContent />}
      />
      <Route
        path="/models/:modelId/task-list/basics/overview"
        render={() => <NotFound />}
      />
      <Route
        path="/models/:modelId/task-list/basics/milestones"
        render={() => <NotFound />}
      />
      <Route path="*" render={() => <NotFoundPartial />} />
    </Switch>
  );
};

export default Basics;
