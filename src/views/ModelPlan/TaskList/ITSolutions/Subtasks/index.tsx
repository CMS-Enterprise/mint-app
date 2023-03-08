import React, { useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Grid,
  IconArrowBack,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import CreateOperationalSolutionSubtasks from 'queries/ITSolutions/CreateOperationalSolutionSubtasks';
// import useMessage from 'hooks/useMessage';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import {
  CreateOperationalSolutionSubtasks as CreateSubTasksType,
  CreateOperationalSolutionSubtasks_createOperationalSolutionSubtasks as CreateSubtasksFormType,
  CreateOperationalSolutionSubtasksVariables
} from 'queries/ITSolutions/types/CreateOperationalSolutionSubtasks';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import { OperationalSolutionSubtaskStatus } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { translateSubtasks } from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

const Subtasks = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  // const history = useHistory();

  const { t } = useTranslation('subtasks');
  const { t: h } = useTranslation('draftModelPlan');

  // const { showMessageOnNextPage, message } = useMessage();

  const { modelName } = useContext(ModelInfoContext);

  const { data: solutionData, error } = useQuery<
    GetOperationalSolutionType,
    GetOperationalSolutionVariables
  >(GetOperationalSolution, {
    variables: {
      id: operationalSolutionID
    }
  });

  const solution = useMemo(() => {
    return (
      solutionData?.operationalSolution ||
      ({} as GetOperationalSolutionOperationalSolutionType)
    );
  }, [solutionData?.operationalSolution]);

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    {
      text: t('itSolutionsTrackerBreadcrumb'),
      url: `/models/${modelID}/task-list/it-solutions`
    },
    {
      text: t('solutionDetails'),
      url: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
    },
    { text: t('addSubtask') }
  ];

  const formikRef = useRef<FormikProps<CreateSubtasksFormType>>(null);

  const initialValues: CreateSubtasksFormType = {
    __typename: 'OperationalSolutionSubtask',
    name: '',
    status: OperationalSolutionSubtaskStatus.TODO
  };

  const [create] = useMutation<
    CreateSubTasksType,
    CreateOperationalSolutionSubtasksVariables
  >(CreateOperationalSolutionSubtasks);

  const handleFormSubmit = (formikValues: CreateSubtasksFormType) => {
    if (!formikValues.name) {
      formikRef?.current?.setFieldError('name', 'Enter the Subtask name');
      return;
    }
    const { name, status } = formikValues;
    create({
      variables: {
        solutionID: operationalSolutionID,
        inputs: [
          {
            name,
            status
          }
        ]
      }
    })
      .then(response => {
        if (!response?.errors) {
          console.log(`it worked`); // eslint-disable-line
          console.log(response);// eslint-disable-line
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  if (error || !solution) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('addSubtask')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('addSubtaskInfo')}</p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeedID={operationalNeedID}
              modelID={modelID}
              solution={solution}
              renderSolutionCardLinks={false}
            />

            <Formik
              initialValues={initialValues}
              onSubmit={values => {
                handleFormSubmit(values);
                // console.log(values); // eslint-disable-line
              }}
              enableReinitialize
              innerRef={formikRef}
            >
              {(formikProps: FormikProps<CreateSubtasksFormType>) => {
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
                      className="margin-top-6"
                      data-testid="it-tools-page-seven-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <FieldGroup
                        scrollElement="name"
                        error={!!flatErrors.name}
                        className="margin-top-4"
                      >
                        <Label htmlFor="subtask-name">
                          {t('subtaskName')}
                          <RequiredAsterisk />
                        </Label>
                        <FieldErrorMsg>{flatErrors.name}</FieldErrorMsg>
                        <Field
                          as={TextInput}
                          error={!!flatErrors.name}
                          id="subtask-name"
                          maxLength={50}
                          name="name"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="status"
                        error={!!flatErrors.status}
                        className="margin-top-4"
                      >
                        <Label htmlFor="subtask-status">
                          {t('statusQuestion')}
                        </Label>
                        <FieldErrorMsg>{flatErrors.status}</FieldErrorMsg>
                        {Object.keys(OperationalSolutionSubtaskStatus)
                          .reverse()
                          .map(key => (
                            <Field
                              key={key}
                              as={Radio}
                              id={`subtask-status-${key}`}
                              name="status"
                              label={translateSubtasks(key)}
                              value={key}
                              checked={values.status === key}
                              onChange={() => {
                                setFieldValue('status', key);
                              }}
                            />
                          ))}
                      </FieldGroup>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="submit"
                          id="submit-solutions"
                          disabled={!dirty}
                          onClick={() => setErrors({})}
                        >
                          {t('addSubtask')}
                        </Button>
                      </div>

                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled display-flex flex-align-center margin-bottom-6"
                        onClick={() => {}}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {t('returnToDetails')}
                      </Button>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <ITSolutionsSidebar
            modelID={modelID}
            renderTextFor="need"
            helpfulLinks={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Subtasks;
