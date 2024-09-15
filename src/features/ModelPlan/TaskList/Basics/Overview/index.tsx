import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetOverviewQuery,
  ModelType,
  TypedUpdateBasicsDocument,
  useGetOverviewQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import CheckboxField from 'components/CheckboxField';
import FieldGroup from 'components/FieldGroup';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { NotFoundPartial } from 'features/NotFound';

type BasicsFormType = GetOverviewQuery['modelPlan']['basics'];

const Overview = () => {
  const { t: basicsT } = useTranslation('basics');
  const { t: basicsMiscT } = useTranslation('basicsMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { modelType: modelTypeConfig } = usePlanTranslation('basics');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<BasicsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetOverviewQuery({
    variables: {
      id: modelID
    }
  });

  const { modelName } = data?.modelPlan || {};

  const {
    id,
    modelType,
    modelTypeOther,
    problem,
    goal,
    testInterventions,
    note
  } = (data?.modelPlan?.basics || {}) as BasicsFormType;

  const { mutationError } = useHandleMutation(TypedUpdateBasicsDocument, {
    id,
    formikRef
  });

  const initialValues: BasicsFormType = {
    __typename: 'PlanBasics',
    id: id ?? '',
    modelType: modelType ?? [],
    modelTypeOther: modelTypeOther ?? '',
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
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.BASICS
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-1">
        {basicsMiscT('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {miscellaneousT('for')} {modelName}
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(
            `/models/${modelID}/collaboration-area/task-list/basics/milestones`
          );
        }}
        enableReinitialize
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<BasicsFormType>) => {
          const { dirty, handleSubmit, isValid, setErrors, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

              <Form
                className="tablet:grid-col-6 margin-top-6"
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup className="margin-top-4">
                    <Label htmlFor="modelType">
                      {basicsT('modelType.label')}
                    </Label>

                    <Fieldset>
                      {getKeys(modelTypeConfig.options).map(key => (
                        <Fragment key={key}>
                          <Field
                            as={CheckboxField}
                            id={`ModelType-${key}`}
                            name="modelType"
                            label={modelTypeConfig.options[key]}
                            value={key}
                            checked={values.modelType.includes(key)}
                          />
                        </Fragment>
                      ))}

                      {values.modelType?.includes(ModelType.OTHER) && (
                        <div className="margin-left-4">
                          <span>{basicsT('modelTypeOther.label')}</span>
                          <Field
                            as={TextInput}
                            id="ModelType-Other"
                            data-testid="ModelType-Other"
                            name="modelTypeOther"
                          />
                        </div>
                      )}
                    </Fieldset>
                  </FieldGroup>

                  <FieldGroup className="margin-top-4">
                    <Field
                      as={TextAreaField}
                      id="ModelType-Problem"
                      data-testid="ModelType-Problem"
                      name="problem"
                      label={basicsT('problem.label')}
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-4">
                    <Field
                      as={TextAreaField}
                      id="ModelType-Goal"
                      name="goal"
                      hint={basicsT('goal.sublabel')}
                      label={basicsT('goal.label')}
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-4">
                    <Field
                      as={TextAreaField}
                      id="ModelType-testInterventions"
                      name="testInterventions"
                      label={basicsT('testInterventions.label')}
                    />
                  </FieldGroup>

                  <AddNote id="ModelType-note" field="note" />

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() =>
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/basics`
                        )
                      }
                    >
                      {miscellaneousT('back')}
                    </Button>

                    <Button
                      type="submit"
                      disabled={!(dirty || isValid)}
                      className=""
                      onClick={() => setErrors({})}
                    >
                      {miscellaneousT('next')}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() =>
                      history.push(
                        `/models/${modelID}/collaboration-area/task-list`
                      )
                    }
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={2} totalPages={3} className="margin-bottom-10" />
    </div>
  );
};

export default Overview;
