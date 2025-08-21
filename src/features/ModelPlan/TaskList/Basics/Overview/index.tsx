import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  GridContainer,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  GetOverviewQuery,
  ModelType,
  TypedUpdateBasicsDocument,
  useGetOverviewQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';

type BasicsFormType = GetOverviewQuery['modelPlan']['basics'];

// Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
type InitialValueType = Omit<
  BasicsFormType,
  'readyForReviewByUserAccount' | 'readyForReviewDts'
>;

const Overview = () => {
  const { t: basicsT } = useTranslation('basics');
  const { t: basicsMiscT } = useTranslation('basicsMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { modelType: modelTypeConfig } = usePlanTranslation('basics');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const navigate = useNavigate();

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
    note,
    readyForReviewByUserAccount,
    readyForReviewDts,
    status
  } = (data?.modelPlan?.basics || {}) as BasicsFormType;

  const { mutationError } = useHandleMutation(TypedUpdateBasicsDocument, {
    id,
    formikRef: formikRef as any
  });

  const initialValues: InitialValueType = {
    __typename: 'PlanBasics',
    id: id ?? '',
    modelType: modelType ?? [],
    modelTypeOther: modelTypeOther ?? '',
    problem: problem ?? '',
    goal: goal ?? '',
    testInterventions: testInterventions ?? '',
    note: note ?? '',
    status
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="model-plan-overview">
      <GridContainer>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={mutationError.closeModal}
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
            navigate(
              `/models/${modelID}/collaboration-area/task-list/characteristics`
            );
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
              handleSubmit,
              isValid,
              setErrors,
              setFieldValue,
              values
            } = formikProps;

            return (
              <>
                <ConfirmLeave />

                <MINTForm
                  className="tablet:grid-col-6 margin-top-6"
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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

                    {!loading && values.status && (
                      <ReadyForReview
                        id="milestones-status"
                        field="status"
                        sectionName={basicsMiscT('heading')}
                        status={values.status}
                        setFieldValue={setFieldValue}
                        readyForReviewBy={
                          readyForReviewByUserAccount?.commonName
                        }
                        readyForReviewDts={readyForReviewDts}
                      />
                    )}

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="button"
                        className="usa-button usa-button--outline margin-bottom-1"
                        onClick={() =>
                          navigate(
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
                        {miscellaneousT('saveAndStartNext')}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled"
                      onClick={() =>
                        navigate(
                          `/models/${modelID}/collaboration-area/task-list`
                        )
                      }
                    >
                      <Icon.ArrowBack
                        className="margin-right-1"
                        aria-hidden
                        aria-label="back"
                      />

                      {miscellaneousT('saveAndReturn')}
                    </Button>
                  </Fieldset>
                </MINTForm>
              </>
            );
          }}
        </Formik>

        <PageNumber
          currentPage={2}
          totalPages={2}
          className="margin-bottom-10"
        />
      </GridContainer>
    </MainContent>
  );
};

export default Overview;
