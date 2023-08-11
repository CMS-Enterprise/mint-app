import React, { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  GridContainer,
  IconArrowBack,
  IconInfo,
  Label,
  Link as TrussLink,
  Radio,
  SummaryBox,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import Tooltip from 'components/shared/Tooltip';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import usePlanTranslation from 'hooks/usePlanTranslation';
import GetModelPlanInfo from 'queries/Basics/GetModelPlanInfo';
import {
  GetModelPlanInfo as GetModelPlanInfoType,
  GetModelPlanInfo_modelPlan as ModelFormType,
  GetModelPlanInfoVariables
} from 'queries/Basics/types/GetModelPlanInfo';
import { UpdateModelPlanAndBasicsVariables } from 'queries/types/UpdateModelPlanAndBasics';
import UpdateModelPlanAndBasics from 'queries/UpdateModelPlanAndBasics';
import {
  CMMIGroup,
  CMSCenter,
  ModelCategory
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import planBasicsSchema from 'validations/planBasics';
import { NotFoundPartial } from 'views/NotFound';

import Milestones from './Milestones';
import Overview from './Overview';

type ModelPlanInfoFormType = Omit<ModelFormType, 'nameHistory'>;

const BasicsContent = () => {
  const { t: modelPlanT } = useTranslation('modelPlan');
  const { t: planBasicsT } = useTranslation('planBasics');
  const { t: planBasicsMiscT } = useTranslation('planBasicsMisc');
  const { t: generalT } = useTranslation('draftModelPlan');

  const {
    modelCategory: modelCategoryConfig,
    cmsCenters: modelCMSCenterConfig,
    cmmiGroups: modelCMSGroupsConfig
  } = usePlanTranslation('planBasics');

  const { modelID } = useParams<{ modelID: string }>();

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

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

  const { id, modelName, abbreviation, basics, nameHistory } =
    data?.modelPlan || {};

  const {
    demoCode,
    amsModelID,
    modelCategory,
    additionalModelCategories,
    cmsCenters,
    cmmiGroups,
    cmsOther
  } = basics || {};

  const filteredNameHistory = nameHistory?.filter(
    previousName => previousName !== modelName
  );

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
      abbreviation: updateAbbreviation,
      basics: updateBasics
    } = formikValues;
    update({
      variables: {
        id: updateId,
        changes: {
          modelName: updateModelName,
          abbreviation: updateAbbreviation
        },
        basicsId: updateBasics.id,
        basicsChanges: {
          demoCode: updateBasics.demoCode,
          amsModelID: updateBasics.amsModelID,
          modelCategory: updateBasics.modelCategory,
          additionalModelCategories: updateBasics.additionalModelCategories,
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
    abbreviation: abbreviation ?? '',
    basics: {
      __typename: 'PlanBasics',
      id: basics?.id ?? '',
      demoCode: demoCode ?? '',
      amsModelID: amsModelID ?? '',
      modelCategory: modelCategory ?? null,
      additionalModelCategories: additionalModelCategories ?? [],
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

      <PageHeading className="margin-top-4 margin-bottom-0">
        {planBasicsMiscT('heading')}
      </PageHeading>
      <p className="margin-top-1 margin-bottom-2 line-height-sans-3">
        {planBasicsMiscT('description')}
      </p>

      <AskAQuestion modelID={modelID} />

      <p className="margin-bottom-0 margin-top-6">
        {planBasicsMiscT('required1')}
        <RequiredAsterisk />
        {planBasicsMiscT('required2')}
      </p>

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
                      onSubmit={e => {
                        handleSubmit(e);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup
                          scrollElement="modelName"
                          error={!!flatErrors.modelName}
                          className="margin-top-4"
                        >
                          <Label htmlFor="plan-basics-model-name">
                            {modelPlanT('modelName.question')}
                            <RequiredAsterisk />
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
                          scrollElement="abbreviation"
                          error={!!flatErrors.abbreviation}
                          className="margin-top-4"
                        >
                          <Label htmlFor="plan-basics-model-name">
                            {modelPlanT('abbreviation.question')}
                          </Label>

                          <span className="usa-hint display-block text-normal margin-top-1">
                            {modelPlanT('abbreviation.hint')}
                          </span>

                          <FieldErrorMsg>
                            {flatErrors.abbreviation}
                          </FieldErrorMsg>
                          <Field
                            as={TextInput}
                            error={!!flatErrors.abbreviation}
                            id="plan-basics-abbreviation"
                            maxLength={50}
                            name="abbreviation"
                          />
                        </FieldGroup>

                        <div
                          className={classNames(
                            'bg-base-lightest padding-2 margin-top-4',
                            {
                              'maxw-mobile-lg': isTablet
                            }
                          )}
                        >
                          <Label
                            htmlFor="plan-basics-demo-code"
                            className="margin-top-0"
                          >
                            {planBasicsMiscT('otherIdentifiers')}
                          </Label>

                          <p className="line-height-mono-4">
                            {planBasicsMiscT('otherIdentifiersInfo1')}

                            <TrussLink
                              aria-label="Open AMS in a new tab"
                              href="https://ams.cmmi.cms.gov"
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="external"
                            >
                              {planBasicsMiscT('otherIdentifiersInfo2')}
                            </TrussLink>

                            {planBasicsMiscT('otherIdentifiersInfo3')}
                          </p>
                          <Grid row gap>
                            <Grid desktop={{ col: 6 }}>
                              <FieldGroup
                                scrollElement="basics.amsModelID"
                                error={!!flatErrors['basics.amsModelID']}
                                className="margin-top-0"
                              >
                                <Label htmlFor="plan-basics-ams-model-id">
                                  {planBasicsT('amsModelID.question')}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors['basics.amsModelID']}
                                </FieldErrorMsg>
                                <Field
                                  as={TextInput}
                                  error={!!flatErrors['basics.amsModelID']}
                                  id="plan-basics-ams-model-id"
                                  maxLength={50}
                                  name="basics.amsModelID"
                                />
                              </FieldGroup>
                            </Grid>
                            <Grid desktop={{ col: 6 }}>
                              <FieldGroup
                                scrollElement="basics.demoCode"
                                error={!!flatErrors['basics.demoCode']}
                                className="margin-top-0"
                              >
                                <Label htmlFor="plan-basics-demo-code">
                                  {planBasicsT('demoCode.question')}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors['basics.demoCode']}
                                </FieldErrorMsg>
                                <Field
                                  as={TextInput}
                                  error={!!flatErrors['basics.demoCode']}
                                  id="plan-basics-demo-code"
                                  maxLength={50}
                                  name="basics.demoCode"
                                />
                              </FieldGroup>
                            </Grid>
                          </Grid>
                        </div>

                        <FieldGroup
                          scrollElement="modelCategory"
                          error={!!flatErrors['basics.modelCategory']}
                          className="margin-top-4"
                        >
                          <Label htmlFor="plan-basics-model-category">
                            {planBasicsT('modelCategory.question')}
                            <RequiredAsterisk />
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors['basics.modelCategory']}
                          </FieldErrorMsg>

                          <Fieldset>
                            {Object.keys(ModelCategory).map(key => (
                              <Fragment key={key}>
                                <Field
                                  as={Radio}
                                  id={`plan-basics-model-category-${key}`}
                                  name="basics.modelCategory"
                                  label={
                                    <span
                                      className="display-flex flex-align-center"
                                      style={{ gap: '4px' }}
                                    >
                                      {modelCategoryConfig.options[key]}
                                      {key !==
                                        ModelCategory.TO_BE_DETERMINED && (
                                        <Tooltip
                                          label={
                                            modelCategoryConfig.tooltip[key]
                                          }
                                          position="right"
                                        >
                                          <IconInfo className="text-base-light" />
                                        </Tooltip>
                                      )}
                                    </span>
                                  }
                                  value={key}
                                  checked={values.basics.modelCategory === key}
                                  onChange={() => {
                                    setFieldValue('basics.modelCategory', key);
                                    if (
                                      values.basics.additionalModelCategories.includes(
                                        key as ModelCategory
                                      )
                                    ) {
                                      values.basics.additionalModelCategories.splice(
                                        values.basics.additionalModelCategories.indexOf(
                                          key as ModelCategory
                                        ),
                                        1
                                      );
                                    }
                                  }}
                                />
                              </Fragment>
                            ))}
                          </Fieldset>
                        </FieldGroup>

                        <FieldGroup
                          error={
                            !!flatErrors['basics.additionalModelCategories']
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="basics.additionalModelCategories"
                            className="text-normal"
                          >
                            {planBasicsT('additionalModelCategories.question')}
                          </Label>

                          <span className="usa-hint display-block text-normal margin-top-1">
                            {planBasicsT('additionalModelCategories.hint')}
                          </span>

                          <FieldErrorMsg>
                            {flatErrors['basics.additionalModelCategories']}
                          </FieldErrorMsg>

                          {Object.keys(ModelCategory)
                            .filter(
                              key => key !== ModelCategory.TO_BE_DETERMINED
                            )
                            .map(group => {
                              return (
                                <Fragment key={group}>
                                  <Field
                                    as={CheckboxField}
                                    id={`plan-basics-model-additional-category-${group}`}
                                    name="basics.additionalModelCategories"
                                    disabled={
                                      values.basics.modelCategory === group
                                    }
                                    label={
                                      <span
                                        className="display-flex flex-align-center"
                                        style={{ gap: '4px' }}
                                      >
                                        {modelCategoryConfig.options[group]}

                                        <Tooltip
                                          label={
                                            modelCategoryConfig.tooltip[group]
                                          }
                                          position="right"
                                        >
                                          <IconInfo className="text-base-light" />
                                        </Tooltip>
                                      </span>
                                    }
                                    value={group}
                                    checked={values.basics.additionalModelCategories.includes(
                                      group as ModelCategory
                                    )}
                                  />
                                </Fragment>
                              );
                            })}
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="cmsCenters"
                          error={!!flatErrors['basics.cmsCenters']}
                          className="margin-top-4"
                        >
                          <Fieldset>
                            <FieldArray
                              name="basics.cmsCenters"
                              render={arrayHelpers => (
                                <>
                                  <Label htmlFor="plan-basics-cmsCenters">
                                    {planBasicsT('cmsCenters.question')}
                                    <RequiredAsterisk />
                                  </Label>

                                  <FieldErrorMsg>
                                    {flatErrors['basics.cmsCenters']}
                                  </FieldErrorMsg>

                                  {Object.keys(
                                    modelCMSCenterConfig.options
                                  ).map(center => {
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
                                  })}

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
                          <IconArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {generalT('saveAndReturn')}
                        </Button>
                      </Fieldset>
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
