import React, { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
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
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import modelCategoryEnum from 'constants/enums/modelCategory';
import GetModelPlanQuery from 'queries/GetModelPlanQuery';
import {
  GetModelPlan,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';
import { UpdateModelPlan as UpdateModelPlanType } from 'queries/types/UpdateModelPlan';
import UpdateModelPlan from 'queries/UpdateModelPlan';
import flattenErrors from 'utils/flattenErrors';
import {
  translateCmmiGroup,
  translateCmsCenter,
  translateModelCategory
} from 'utils/modelPlan';
import planBasicsSchema from 'validations/planBasics';
import { NotFoundPartial } from 'views/NotFound';

import Milestones from './Milestones';
import Overview from './Overview';

type PlanBasicModelPlanFormType = {
  modelName: string;
  modelCategory: string;
  cmsCenters: string[];
  cmmiGroup: string[];
  cmsOther: string;
};

const BasicsContent = () => {
  const { t } = useTranslation('basics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelId } = useParams<{ modelId: string }>();

  const formikRef = useRef<FormikProps<PlanBasicModelPlanFormType>>(null);
  const history = useHistory();
  const [isCmmiGroupShown, setIsCmmiGroupShown] = useState(false);

  const { data } = useQuery<GetModelPlan, GetModelPlanVariables>(
    GetModelPlanQuery,
    {
      variables: {
        id: modelId
      }
    }
  );

  const { modelName, modelCategory, cmsCenters, cmmiGroups, cmsOther } =
    data?.modelPlan || {};

  const [update] = useMutation<UpdateModelPlanType>(UpdateModelPlan);

  const handleUpdateModelPlan = (formikValues: PlanBasicModelPlanFormType) => {
    update({
      variables: {
        input: {
          id: modelId,
          modelName: formikValues.modelName,
          modelCategory: formikValues.modelCategory,
          cmsCenters: formikValues.cmsCenters,
          cmmiGroups: formikValues.cmmiGroup,
          cmsOther: formikValues.cmsOther,
          status: 'PLAN_DRAFT'
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push(`/models/${modelId}/task-list/basics/overview`);
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const handleSave = (
    formikValues: PlanBasicModelPlanFormType,
    isAutoSave: boolean = false
  ) => {
    update({
      variables: {
        input: {
          id: modelId,
          modelName: formikValues.modelName,
          modelCategory:
            formikValues.modelCategory !== ''
              ? formikValues.modelCategory
              : null,
          cmsCenters: formikValues.cmsCenters,
          cmmiGroups: formikValues.cmmiGroup,
          cmsOther: formikValues.cmsOther,
          status: 'PLAN_DRAFT'
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (!isAutoSave) {
            history.push(`/models/${modelId}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: PlanBasicModelPlanFormType = {
    modelName: modelName as string,
    modelCategory: modelCategory ?? '',
    cmsCenters: cmsCenters ?? [],
    cmmiGroup: cmmiGroups ?? [],
    cmsOther: cmsOther ?? ''
  };

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
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/models/${modelId}/task-list/`}
              >
                <span>{h('tasklistBreadcrumb')}</span>
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
            initialValues={initialValues}
            onSubmit={handleUpdateModelPlan}
            enableReinitialize
            validationSchema={
              isCmmiGroupShown
                ? planBasicsSchema.pageOneSchemaWithCmmiGroup
                : planBasicsSchema.pageOneSchema
            }
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<PlanBasicModelPlanFormType>) => {
              const {
                dirty,
                errors,
                handleSubmit,
                setErrors,
                setFieldValue,
                isValid,
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
                        {Object.keys(modelCategoryEnum).map(role => {
                          return (
                            <option
                              key={`Model-Category-${translateModelCategory(
                                modelCategoryEnum[role]
                              )}`}
                              value={role}
                            >
                              {translateModelCategory(modelCategoryEnum[role])}
                            </option>
                          );
                        })}
                      </Field>
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="cmsCenters"
                      error={!!flatErrors.cmsCenters}
                      className="margin-top-4"
                    >
                      <FieldArray
                        name="cmsCenters"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label">
                              {t('cmsComponent')}
                            </legend>
                            <FieldErrorMsg>
                              {flatErrors.cmsCenters}
                            </FieldErrorMsg>

                            {(t('cmsComponents', {
                              returnObjects: true
                            }) as string[]).map((item, key) => {
                              return (
                                <Fragment key={item}>
                                  <Field
                                    as={CheckboxField}
                                    id={`new-plan-cmsCenters--${key}`}
                                    name="cmsCenters"
                                    label={item}
                                    value={translateCmsCenter(item)}
                                    checked={values.cmsCenters.includes(
                                      translateCmsCenter(item)
                                    )}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push(e.target.value);
                                      } else {
                                        const idx = values.cmsCenters.indexOf(
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

                            {values.cmsCenters.includes('OTHER') && (
                              <FieldGroup className="margin-top-4">
                                <Label htmlFor="plan-basics-cmsCategory--Other">
                                  {h('pleaseSpecify')}
                                </Label>
                                <Field
                                  as={TextInput}
                                  id="plan-basics-cmsCategory--Other"
                                  maxLength={50}
                                  name="cmsOther"
                                />
                              </FieldGroup>
                            )}
                          </>
                        )}
                      />
                    </FieldGroup>
                    {values.cmsCenters.includes('CMMI') && (
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
                                      value={translateCmmiGroup(item)}
                                      checked={values.cmmiGroup.includes(
                                        translateCmmiGroup(item)
                                      )}
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
                        disabled={!(dirty || isValid)}
                        onClick={() => setErrors({})}
                      >
                        {h('next')}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled"
                      onClick={() => handleSave(values)}
                    >
                      <IconArrowBack className="margin-right-1" aria-hidden />
                      {h('saveAndReturn')}
                    </Button>
                  </Form>
                  <AutoSave
                    values={values}
                    onSave={() => {
                      handleSave(formikRef.current!.values, true);
                    }}
                    debounceDelay={3000}
                  />
                </>
              );
            }}
          </Formik>
        </div>
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
        exact
        render={() => <BasicsContent />}
      />
      <Route
        path="/models/:modelId/task-list/basics/overview"
        exact
        render={() => <Overview />}
      />
      <Route
        path="/models/:modelId/task-list/basics/milestones"
        exact
        render={() => <Milestones />}
      />
      <Route path="*" render={() => <NotFoundPartial />} />
    </Switch>
  );
};

export default Basics;
