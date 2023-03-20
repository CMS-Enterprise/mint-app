import React, { Fragment, useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Grid,
  IconArrowBack,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import Breadcrumbs from 'components/Breadcrumbs';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import useMessage from 'hooks/useMessage';
import CreateOperationalSolutionSubtasks from 'queries/ITSolutions/CreateOperationalSolutionSubtasks';
import DeleteOperationalSolutionSubtasks from 'queries/ITSolutions/DeleteOperationalSolutionSubtasks';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import {
  CreateOperationalSolutionSubtasks as CreateSubTasksType,
  CreateOperationalSolutionSubtasksVariables
} from 'queries/ITSolutions/types/CreateOperationalSolutionSubtasks';
import { DeleteOperationalSolutionSubtaskVariables } from 'queries/ITSolutions/types/DeleteOperationalSolutionSubtask';
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

const Subtasks = ({ manageSubtasks = false }: { manageSubtasks?: boolean }) => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  const history = useHistory();
  const location = useLocation();
  const fromManageSubtasks = location.search.includes('manage-subtasks');

  const { t } = useTranslation('subtasks');
  const { t: h } = useTranslation('draftModelPlan');

  const { showMessage, showMessageOnNextPage, message } = useMessage();
  const [isModalOpen, setModalOpen] = useState(false);
  const { modelName } = useContext(ModelInfoContext);

  const { data: solutionData, error, refetch } = useQuery<
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

  const formikRef = useRef<FormikProps<CreateSubTasksType>>(null);
  const [create] = useMutation<
    CreateSubTasksType,
    CreateOperationalSolutionSubtasksVariables
  >(CreateOperationalSolutionSubtasks);

  const [
    removeSubtask
  ] = useMutation<DeleteOperationalSolutionSubtaskVariables>(
    DeleteOperationalSolutionSubtasks
  );

  const subtasks =
    solutionData?.operationalSolution.operationalSolutionSubtasks;

  const initialValues: CreateSubTasksType = {
    createOperationalSolutionSubtasks: [
      {
        __typename: 'OperationalSolutionSubtask',
        name: '',
        status: OperationalSolutionSubtaskStatus.TODO
      }
    ]
  };

  const handleDelete = (name: string, id: string) => {
    removeSubtask({
      variables: {
        id
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (subtasks && subtasks.length > 1) {
            showMessage(
              <Alert
                type="success"
                slim
                data-testid="success-subtask-alert"
                className="margin-y-4"
              >
                {t('removeSubtaskSuccess', { subTaskName: name })}
              </Alert>
            );
            refetch();
          } else {
            showMessageOnNextPage(
              <Alert
                type="success"
                slim
                data-testid="success-subtask-alert"
                className="margin-y-4"
              >
                {t('removeSubtaskSuccess', { subTaskName: name })}
              </Alert>
            );
            history.push(
              `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
            );
          }
        }
      })
      .catch(errors => {
        showMessage(
          <Alert type="error" slim className="margin-y-4">
            <span className="mandatory-fields-alert__text">
              {t('removeSubtaskError', { subTaskName: name })}
            </span>
          </Alert>
        );
        setModalOpen(false);
      });
  };

  const handleFormSubmit = (formikValues: CreateSubTasksType) => {
    const { createOperationalSolutionSubtasks } = formikValues;
    // const { name, status } = formikValues;
    create({
      variables: {
        solutionID: operationalSolutionID,
        inputs: createOperationalSolutionSubtasks!
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessageOnNextPage(
            <Alert
              type="success"
              slim
              data-testid="success-subtask-alert"
              className="margin-y-4"
            >
              {t('successMessage')}
            </Alert>
          );
          history.push(
            `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
          );
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const renderModal = (name: string, id: string) => {
    return (
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-y-0">
          {t('removeModal.header', {
            subTaskName: name
          })}
        </PageHeading>
        <p className="margin-top-2 margin-bottom-3">
          {t('removeModal.warning')}
        </p>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() => {
            handleDelete(name, id);
            setModalOpen(false);
          }}
        >
          {t('removeModal.removeSubtask')}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t('removeModal.keepSubtask')}
        </Button>
      </Modal>
    );
  };

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
    { text: manageSubtasks ? t('manageSubtasks') : t('addSubtask') }
  ];

  if (error || !solution) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {message}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {manageSubtasks ? t('manageSubtasks') : t('addSubtask')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">
            {manageSubtasks ? t('manageSubtaskInfo') : t('addSubtaskInfo')}
          </p>

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
              }}
              enableReinitialize
              innerRef={formikRef}
            >
              {formikProps => {
                const { errors, handleSubmit, setErrors, values } = formikProps;

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
                      data-testid="add-subtask-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      {manageSubtasks ? (
                        <>
                          {subtasks &&
                            subtasks.map((subtask, index) => {
                              return (
                                <div
                                  // eslint-disable-next-line react/no-array-index-key
                                  key={index}
                                  className={
                                    subtasks.length > 1
                                      ? 'border-bottom border-base-light'
                                      : ''
                                  }
                                >
                                  <FieldGroup className="margin-top-4">
                                    <p className="usa-label margin-0">
                                      {t('subtaskName')}
                                    </p>
                                    <p className="margin-0">{subtask.name}</p>
                                  </FieldGroup>
                                  <FieldGroup className="margin-top-4">
                                    <Label
                                      htmlFor={`subtasks[${index}].status`}
                                    >
                                      {t('statusQuestion')}
                                    </Label>
                                    {Object.keys(
                                      OperationalSolutionSubtaskStatus
                                    )
                                      .reverse()
                                      .map(status => {
                                        return (
                                          <Field
                                            key={`subtask-status--${status}`}
                                            as={Radio}
                                            id={`subtask-status--${index}--${status}`}
                                            name={`subtasks[${index}].status`}
                                            label={translateSubtasks(status)}
                                            value={status}
                                            checked={subtask.status === status}
                                          />
                                        );
                                      })}
                                    <Button
                                      type="button"
                                      onClick={() => setModalOpen(true)}
                                      className="usa-button usa-button--unstyled line-height-body-5 text-red margin-y-3"
                                    >
                                      {t('removeSubtask')}
                                    </Button>
                                    {renderModal(subtask.name, subtask.id)}
                                  </FieldGroup>
                                </div>
                              );
                            })}
                        </>
                      ) : (
                        <FieldArray name="createOperationalSolutionSubtasks">
                          {fieldArrayProps => {
                            const { push, remove } = fieldArrayProps;
                            const {
                              createOperationalSolutionSubtasks
                            } = values;

                            return (
                              <>
                                {createOperationalSolutionSubtasks &&
                                  createOperationalSolutionSubtasks.map(
                                    (input, index) => (
                                      <div
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={index}
                                        className={
                                          createOperationalSolutionSubtasks.length >
                                          1
                                            ? 'border-bottom border-base-light'
                                            : ''
                                        }
                                        data-testid={`add-subtask--${index}`}
                                      >
                                        <FieldGroup
                                          scrollElement="name"
                                          error={!!flatErrors.name}
                                          className="margin-top-4"
                                        >
                                          <Label
                                            htmlFor={`createOperationalSolutionSubtasks[${index}].name`}
                                          >
                                            {t('subtaskName')}
                                            <RequiredAsterisk />
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.name}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            error={!!flatErrors.name}
                                            id={`subtask-name--${index}`}
                                            maxLength={50}
                                            name={`createOperationalSolutionSubtasks[${index}].name`}
                                          />
                                        </FieldGroup>
                                        <FieldGroup className="margin-top-4">
                                          <Label
                                            htmlFor={`createOperationalSolutionSubtasks[${index}].status`}
                                          >
                                            {t('statusQuestion')}
                                          </Label>
                                          {Object.keys(
                                            OperationalSolutionSubtaskStatus
                                          )
                                            .reverse()
                                            .map(status => {
                                              return (
                                                <Field
                                                  key={`subtask-status--${status}`}
                                                  as={Radio}
                                                  id={`subtask-status--${index}--${status}`}
                                                  name={`createOperationalSolutionSubtasks[${index}].status`}
                                                  label={translateSubtasks(
                                                    status
                                                  )}
                                                  value={status}
                                                  checked={
                                                    values.createOperationalSolutionSubtasks &&
                                                    values
                                                      .createOperationalSolutionSubtasks[
                                                      index
                                                    ].status === status
                                                  }
                                                />
                                              );
                                            })}
                                          {createOperationalSolutionSubtasks.length >
                                            1 && (
                                            <Button
                                              type="button"
                                              onClick={() => remove(index)}
                                              className="usa-button usa-button--unstyled line-height-body-5 text-red margin-y-3"
                                            >
                                              {t('removeSubtask')}
                                            </Button>
                                          )}
                                        </FieldGroup>
                                      </div>
                                    )
                                  )}
                                <div className="margin-top-3">
                                  <Button
                                    type="button"
                                    id="add-another-subtask"
                                    onClick={() =>
                                      push({
                                        __typename:
                                          'OperationalSolutionSubtask',
                                        name: '',
                                        status:
                                          OperationalSolutionSubtaskStatus.TODO
                                      })
                                    }
                                    outline
                                  >
                                    {t('addAnotherSubtask')}
                                  </Button>
                                </div>
                              </>
                            );
                          }}
                        </FieldArray>
                      )}

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="submit"
                          id="submit-subtasks"
                          disabled={
                            !!(
                              values.createOperationalSolutionSubtasks &&
                              values.createOperationalSolutionSubtasks.find(
                                input => input.name === ''
                              )
                            )
                          }
                          onClick={() => setErrors({})}
                        >
                          {t('addSubtask')}
                        </Button>
                      </div>

                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled display-flex flex-align-center margin-bottom-6"
                        onClick={() =>
                          fromManageSubtasks
                            ? history.push(
                                `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/manage-subtasks`
                              )
                            : history.push(
                                `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
                              )
                        }
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {fromManageSubtasks
                          ? t('returnToPreviousPage')
                          : t('returnToDetails')}
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
