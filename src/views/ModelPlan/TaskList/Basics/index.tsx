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
  Fieldset,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  SummaryBox,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';
import { ResourceKey } from 'i18next';

import AskAQuestion from 'components/AskAQuestion';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlanInfo from 'queries/Basics/GetModelPlanInfo';
import {
  GetModelPlanInfo as GetModelPlanInfoType,
  GetModelPlanInfo_modelPlan as ModelFormType,
  GetModelPlanInfoVariables
} from 'queries/Basics/types/GetModelPlanInfo';
import { UpdateModelPlanAndBasicsVariables } from 'queries/types/UpdateModelPlanAndBasics';
import UpdateModelPlanAndBasics from 'queries/UpdateModelPlanAndBasics';
import { CMMIGroup, CMSCenter } from 'types/graphql-global-types';
import { TranslationPlan } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import planBasicsSchema from 'validations/planBasics';
import { NotFoundPartial } from 'views/NotFound';

import Milestones from './Milestones';
import Overview from './Overview';

type ModelPlanInfoFormType = Omit<ModelFormType, 'nameHistory'>;

const BasicsContent = () => {
  const { t: modelPlanT } = useTranslation('model_plan');
  const { t: planBasicsT } = useTranslation('plan_basics');
  const { t: planBasicsMiscT } = useTranslation('plan_basics_misc');
  const { t: generalT } = useTranslation('draftModelPlan');

  // Question configuration and translation mappings
  const translationStore: ResourceKey = useTranslation().i18n.store;

  const translationPlanMap: TranslationPlan =
    translationStore.data[navigator.language];

  const {
    modelCategory: modelCategoryConfig,
    cmsCenters: modelCMSCenterConfig,
    cmmiGroups: modelCMSGroupsConfig
  } = translationPlanMap.plan_basics;

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ModelPlanInfoFormType>>(null);

  const history = useHistory();

  const [areCmmiGroupsShown, setAreCmmiGroupsShown] = useState(
    formikRef?.current?.values.basics.cmsCenters.includes(CMSCenter.CMMI)
  );

  const [showOther, setShowOther] = useState(
    formikRef?.current?.values.basics.cmsCenters.includes(CMSCenter.OTHER)
  );

  const { data, loading, error } = useQuery<
    GetModelPlanInfoType,
    GetModelPlanInfoVariables
  >(GetModelPlanInfo, {
    variables: {
      id: modelID
    }
  });

  const { id, modelName, basics, nameHistory } = data?.modelPlan || {};
  const filteredNameHistory = nameHistory?.filter(
    previousName => previousName !== modelName
  );

  const { modelCategory, cmsCenters, cmmiGroups, cmsOther } = basics || {};

  const [update] = useMutation<UpdateModelPlanAndBasicsVariables>(
    UpdateModelPlanAndBasics
  );

  const handleFormSubmit = (
    formikValues: ModelPlanInfoFormType,
    redirect?: 'next' | 'back'
  ) => {
    if (!formikValues.modelName) {
      formikRef?.current?.setFieldError('modelName', 'Enter the Model name');
      return;
    }
    const {
      id: updateId,
      modelName: updateModelName,
      basics: updateBasics
    } = formikValues;
    update({
      variables: {
        id: updateId,
        changes: {
          modelName: updateModelName
        },
        basicsId: updateBasics.id,
        basicsChanges: {
          modelCategory: updateBasics.modelCategory,
          cmsCenters: updateBasics.cmsCenters,
          cmmiGroups: updateBasics.cmmiGroups,
          cmsOther: updateBasics.cmsOther
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/basics/overview`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: ModelPlanInfoFormType = {
    __typename: 'ModelPlan',
    id: id ?? '',
    modelName: modelName ?? '',
    basics: {
      __typename: 'PlanBasics',
      id: basics?.id ?? '',
      modelCategory: modelCategory ?? null,
      cmsCenters: cmsCenters ?? [],
      cmmiGroups: cmmiGroups ?? [],
      cmsOther: cmsOther ?? ''
    }
  };

  // 4 options
  // 1. Basics (name, category, CMS Component without CMMI and Other)
  // 2. Basics + cmmi group
  // 3. Basics + other group
  // 4. Basics + Cmmi + Other
  let validationSchema;
  if (areCmmiGroupsShown && showOther) {
    validationSchema = planBasicsSchema.pageOneSchemaWithOtherAndCmmi;
  } else if (areCmmiGroupsShown) {
    validationSchema = planBasicsSchema.pageOneSchemaWithCmmiGroups;
  } else if (showOther) {
    validationSchema = planBasicsSchema.pageOneSchemaWithOther;
  } else {
    validationSchema = planBasicsSchema.pageOneSchema;
  }

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{generalT('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{generalT('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{planBasicsMiscT('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4">
        {planBasicsMiscT('heading')}
      </PageHeading>

      <AskAQuestion modelID={modelID} />

      <Alert
        type="info"
        slim
        data-testid="mandatory-fields-alert"
        className="margin-bottom-4"
      >
        <span className="mandatory-fields-alert__text">
          {generalT('mandatoryFields')}
        </span>
      </Alert>

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ModelPlanInfoFormType>) => {
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
                  heading={generalT('checkAndFix')}
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
              <GridContainer className="padding-x-0">
                <Grid row gap>
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
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
                          {modelPlanT('modelName.question')}
                        </Label>
                        <FieldErrorMsg>{flatErrors.modelName}</FieldErrorMsg>
                        <Field
                          as={TextInput}
                          error={!!flatErrors.modelName}
                          id="plan-basics-model-name"
                          maxLength={50}
                          name="modelName"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="modelCategory"
                        error={!!flatErrors['basics.modelCategory']}
                        className="margin-top-4"
                      >
                        <Label htmlFor="plan-basics-model-category">
                          {planBasicsT('modelCategory.question')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors['basics.modelCategory']}
                        </FieldErrorMsg>
                        <Field
                          as={Dropdown}
                          id="plan-basics-model-category"
                          name="basics.modelCategory"
                          value={values.basics.modelCategory || ''}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFieldValue(
                              'basics.modelCategory',
                              e.target.value
                            );
                          }}
                        >
                          <option key="default-select" disabled value="">
                            {`-${generalT('select')}-`}
                          </option>
                          {Object.keys(modelCategoryConfig.options).map(
                            category => {
                              return (
                                <option key={category} value={category}>
                                  {modelCategoryConfig.options[category]}
                                </option>
                              );
                            }
                          )}
                        </Field>
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="cmsCenters"
                        error={!!flatErrors['basics.cmsCenters']}
                        className="margin-top-4"
                      >
                        <Fieldset legend={planBasicsT('cmsCenters.question')}>
                          <FieldArray
                            name="basics.cmsCenters"
                            render={arrayHelpers => (
                              <>
                                <FieldErrorMsg>
                                  {flatErrors['basics.cmsCenters']}
                                </FieldErrorMsg>

                                {Object.keys(modelCMSCenterConfig.options).map(
                                  center => {
                                    return (
                                      <Field
                                        key={center}
                                        as={CheckboxField}
                                        id={`new-plan-cmsCenters-${center}`}
                                        name="basics.cmsCenters"
                                        label={
                                          modelCMSCenterConfig.options[center]
                                        }
                                        value={center}
                                        checked={values.basics.cmsCenters.includes(
                                          center as CMSCenter
                                        )}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          if (e.target.checked) {
                                            arrayHelpers.push(e.target.value);
                                          } else {
                                            const idx = values.basics.cmsCenters.indexOf(
                                              e.target.value as CMSCenter
                                            );
                                            arrayHelpers.remove(idx);
                                          }
                                          if (
                                            e.target.value === CMSCenter.CMMI
                                          ) {
                                            setAreCmmiGroupsShown(
                                              !areCmmiGroupsShown
                                            );
                                          }
                                          if (
                                            e.target.value === CMSCenter.OTHER
                                          ) {
                                            setShowOther(!showOther);
                                          }
                                        }}
                                      />
                                    );
                                  }
                                )}

                                {values.basics.cmsCenters.includes(
                                  CMSCenter.OTHER
                                ) && (
                                  <FieldGroup
                                    className="margin-top-4"
                                    error={!!flatErrors['basics.cmsOther']}
                                  >
                                    <Label htmlFor="plan-basics-cmsCategory--Other">
                                      {generalT('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors['basics.cmsOther']}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextAreaField}
                                      id="plan-basics-cmsCategory--Other"
                                      maxLength={5000}
                                      className="mint-textarea"
                                      name="basics.cmsOther"
                                    />
                                  </FieldGroup>
                                )}
                              </>
                            )}
                          />
                        </Fieldset>
                      </FieldGroup>
                      <FieldGroup
                        error={!!flatErrors['basics.cmmiGroups']}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="basics.cmmiGroups"
                          className="text-normal"
                        >
                          {planBasicsT('cmmiGroups.question')}
                        </Label>

                        <p className="text-base margin-bottom-1 margin-top-1">
                          {planBasicsT('cmmiGroups.hint')}
                        </p>

                        <FieldErrorMsg>
                          {flatErrors['basics.cmmiGroups']}
                        </FieldErrorMsg>
                        {Object.keys(CMMIGroup).map(group => {
                          return (
                            <Fragment key={group}>
                              <Field
                                as={CheckboxField}
                                disabled={
                                  !values.basics.cmsCenters.includes(
                                    CMSCenter.CMMI
                                  )
                                }
                                id={`new-plan-cmmiGroup-${group}`}
                                name="basics.cmmiGroups"
                                label={modelCMSGroupsConfig.options[group]}
                                value={group}
                                checked={values.basics.cmmiGroups.includes(
                                  group as CMMIGroup
                                )}
                              />
                            </Fragment>
                          );
                        })}
                      </FieldGroup>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="submit"
                          disabled={!(dirty || isValid)}
                          onClick={() => setErrors({})}
                        >
                          {generalT('next')}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => handleFormSubmit(values, 'back')}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {generalT('saveAndReturn')}
                      </Button>
                    </Form>
                  </Grid>

                  <Grid desktop={{ col: 6 }}>
                    {filteredNameHistory && filteredNameHistory.length > 0 && (
                      <SummaryBox
                        heading=""
                        className="margin-top-6"
                        data-testid="summary-box--previous-name"
                      >
                        <p className="margin-y-0 text-bold">
                          {planBasicsMiscT('previousNames')}
                        </p>
                        <ul className="margin-top-1 margin-bottom-0 padding-left-2">
                          {filteredNameHistory.map(previousName => {
                            return (
                              <li key={`${modelName}-${previousName}`}>
                                {previousName}
                              </li>
                            );
                          })}
                        </ul>
                      </SummaryBox>
                    )}
                  </Grid>
                </Grid>
              </GridContainer>
              {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    if (formikRef.current!.values.modelName)
                      handleFormSubmit(formikRef.current!.values);
                  }}
                  debounceDelay={3000}
                />
              )}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={1} totalPages={3} className="margin-bottom-10" />
    </>
  );
};

export const Basics = () => {
  return (
    <MainContent data-testid="model-plan-basics">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Route
              path="/models/:modelID/task-list/basics"
              exact
              render={() => <BasicsContent />}
            />
            <Route
              path="/models/:modelID/task-list/basics/overview"
              exact
              render={() => <Overview />}
            />
            <Route
              path="/models/:modelID/task-list/basics/milestones"
              exact
              render={() => <Milestones />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Basics;
