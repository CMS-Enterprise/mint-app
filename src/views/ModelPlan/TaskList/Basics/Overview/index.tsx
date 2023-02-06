import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import GetBasics from 'queries/Basics/GetBasics';
import {
  GetBasics as GetBasicsType,
  GetBasics_modelPlan_basics as BasicsFormType,
  GetBasicsVariables
} from 'queries/Basics/types/GetBasics';
import {
  UpdatePlanBasics as UpdatePlanBasicsType,
  UpdatePlanBasicsVariables
} from 'queries/Basics/types/UpdatePlanBasics';
import UpdatePlanBasics from 'queries/Basics/UpdatePlanBasics';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

const Overview = () => {
  const { t } = useTranslation('basics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<BasicsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<GetBasicsType, GetBasicsVariables>(
    GetBasics,
    {
      variables: {
        id: modelID
      }
    }
  );

  const { modelName } = data?.modelPlan || {};

  const { id, modelType, problem, goal, testInterventions, note } =
    data?.modelPlan?.basics || ({} as BasicsFormType);

  const [update] = useMutation<UpdatePlanBasicsType, UpdatePlanBasicsVariables>(
    UpdatePlanBasics
  );

  const handleFormSubmit = (redirect?: 'next' | 'back' | 'task-list') => {
    update({
      variables: {
        id,
        changes: dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        )
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/basics/milestones`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/basics`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: BasicsFormType = {
    __typename: 'PlanBasics',
    id: id ?? '',
    modelType: modelType ?? null,
    problem: problem ?? '',
    goal: goal ?? '',
    testInterventions: testInterventions ?? '',
    note: note ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div data-testid="model-plan-overview">
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-1">
        {t('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {h('for')} {modelName}
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          handleFormSubmit('next');
        }}
        enableReinitialize
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<BasicsFormType>) => {
          const {
            dirty,
            errors,
            handleSubmit,
            isValid,
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
                  heading={h('checkAndFix')}
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
                className="tablet:grid-col-6 margin-top-6"
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
                    error={flatErrors.testInterventions}
                    id="ModelType-testInterventions"
                    name="testInterventions"
                    label={t('testInterventions')}
                  />
                </FieldGroup>

                <AddNote id="ModelType-note" field="note" />

                <div className="margin-top-6 margin-bottom-3">
                  <Button
                    type="button"
                    className="usa-button usa-button--outline margin-bottom-1"
                    onClick={() => handleFormSubmit('back')}
                  >
                    {h('back')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!(dirty || isValid)}
                    className=""
                    onClick={() => setErrors({})}
                  >
                    {h('next')}
                  </Button>
                </div>
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => handleFormSubmit('task-list')}
                >
                  <IconArrowBack className="margin-right-1" aria-hidden />
                  {h('saveAndReturn')}
                </Button>
              </Form>
              <AutoSave
                values={values}
                onSave={() => {
                  if (Object.keys(formikRef.current!.touched).length !== 0) {
                    handleFormSubmit();
                  }
                }}
                debounceDelay={3000}
              />
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={2} totalPages={3} className="margin-bottom-10" />
    </div>
  );
};

export default Overview;
