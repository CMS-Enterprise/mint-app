import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconAdd,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlanQuery from 'queries/GetModelPlanQuery';
import {
  GetModelPlan,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';
import flattenErrors from 'utils/flattenErrors';
import planBasicsSchema from 'validations/planBasics';

type PlanBasicsOverviewTypes = {
  // TODO: change this prop 👇 to take in the enums
  modelType: string;
  problem: string;
  goal: string;
  testInterventions: string;
  note: string;
};

const Overview = () => {
  const { t } = useTranslation('basics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelId } = useParams<{ modelId: string }>();
  const [hasAdditionalNote, setHasAdditionalNote] = useState(false);
  const history = useHistory();

  const { data } = useQuery<GetModelPlan, GetModelPlanVariables>(
    GetModelPlanQuery,
    {
      variables: {
        id: modelId
      }
    }
  );

  const { modelName } = data?.modelPlan || {};

  const initialValues = {
    modelType: '',
    problem: '',
    goal: '',
    testInterventions: '',
    note: ''
  };

  const handleFormSubmit = (formikValues: PlanBasicsOverviewTypes) => {
    console.log(formikValues);
    // update({
    //   variables: {
    //     input: {
    //       id: modelId,
    //       modelName: formikValues.modelName,
    //       modelCategory: formikValues.modelCategory,
    //       cmsCenter: formikValues.cmsCenter,
    //       cmmiGroups: formikValues.cmmiGroup,
    //       status: 'PLAN_DRAFT'
    //     }
    //   }
    // })
    //   .then(response => {
    //     if (!response?.errors) {
    history.push(`/models/${modelId}/task-list/basics/milestones`);
    //     }
    //   })
    //   .catch(errors => {
    //     // formikRef?.current?.setErrors(errors);
    //     console.log(errors);
    //   });
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
            <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
          </BreadcrumbBar>
          <PageHeading className="margin-bottom-1">{t('heading')}</PageHeading>
          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            <Trans i18nKey="modelPlanTaskList:subheading">
              indexZero {modelName} indexTwo
            </Trans>
          </p>
          <p className="margin-bottom-2 font-body-md line-height-sans-4">
            {t('helpText')}
          </p>

          <Formik
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            enableReinitialize
            validationSchema={planBasicsSchema.pageTwoSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(formikProps: FormikProps<PlanBasicsOverviewTypes>) => {
              const {
                dirty,
                errors,
                handleSubmit,
                setErrors,
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
                    className="tablet:grid-col-6"
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <FieldGroup
                      scrollElement="modelType"
                      error={!!flatErrors.modelType}
                      className="margin-top-4"
                    >
                      <Label htmlFor="modelType">{t('modelType')}</Label>
                      <FieldErrorMsg>{flatErrors.modelType}</FieldErrorMsg>
                      <Fieldset>
                        <Field
                          as={Radio}
                          id="ModelType-Voluntary"
                          name="modelType"
                          label={t('voluntary')}
                          value="VOLUNTARY"
                          checked={values.modelType === 'VOLUNTARY'}
                        />
                        <Field
                          as={Radio}
                          id="ModelType-Mandatory"
                          name="modelType"
                          label={t('Mandatory')}
                          value="MANDATORY"
                          checked={values.modelType === 'MANDATORY'}
                        />
                      </Fieldset>
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="problem"
                      error={!!flatErrors.problem}
                      className="margin-top-4"
                    >
                      <Field
                        as={TextAreaField}
                        className="height-15"
                        error={flatErrors.problem}
                        id="ModelType-Problem"
                        name="problem"
                        label={t('problem')}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="goal"
                      error={!!flatErrors.goal}
                      className="margin-top-4"
                    >
                      <Field
                        as={TextAreaField}
                        className="height-15"
                        error={flatErrors.goal}
                        id="ModelType-Goal"
                        name="goal"
                        hint={t('goalHelp')}
                        label={t('goal')}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="testInterventions"
                      error={!!flatErrors.testInterventions}
                      className="margin-top-4"
                    >
                      <Field
                        as={TextAreaField}
                        className="height-15"
                        error={flatErrors.testInterventions}
                        id="ModelType-testInterventions"
                        name="testInterventions"
                        label={t('testInterventions')}
                      />
                    </FieldGroup>

                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled margin-top-4"
                      onClick={() => setHasAdditionalNote(true)}
                    >
                      <IconAdd className="margin-right-1" aria-hidden />
                      {h('additionalNote')}
                    </Button>

                    {hasAdditionalNote && (
                      <FieldGroup className="margin-top-4">
                        <Field
                          as={TextAreaField}
                          className="height-15"
                          id="ModelType-note"
                          name="note"
                          label={t('Notes')}
                        />
                      </FieldGroup>
                    )}

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="button"
                        className="usa-button usa-button--outline margin-bottom-1"
                        onClick={() => history.goBack()}
                      >
                        {h('back')}
                      </Button>
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
          currentPage={2}
          totalPages={3}
          className="margin-bottom-10"
        />
      </div>
    </MainContent>
  );
};

export default Overview;
