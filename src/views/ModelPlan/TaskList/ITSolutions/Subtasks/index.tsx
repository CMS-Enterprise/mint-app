import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';
import {
  useCreateOperationalSolutionSubtasksMutation,
  useDeleteOperationalSolutionSubtaskMutation,
  useGetOperationalSolutionQuery,
  useUpdateOperationalSolutionSubtasksMutation
} from 'gql/gen/graphql';
import { CreateOperationalSolutionSubtasks_createOperationalSolutionSubtasks as CreateType } from 'gql/gen/types/CreateOperationalSolutionSubtasks';
import { GetOperationalSolution_operationalSolution_operationalSolutionSubtasks as UpdateType } from 'gql/gen/types/GetOperationalSolution';

import Breadcrumbs from 'components/Breadcrumbs';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { OperationalSolutionSubtaskStatus } from 'types/graphql-global-types';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

type SubTaskType = UpdateType[] | CreateType[];

type FormType = {
  subtasks: SubTaskType;
};

export const isUpdateSubtasks = (task: SubTaskType): task is UpdateType[] => {
  return 'id' in task[0];
};

const isUpdateType = (task: UpdateType | CreateType): task is UpdateType => {
  return 'id' in task;
};

const Subtasks = ({
  managingSubtasks = false
}: {
  managingSubtasks?: boolean;
}) => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  const history = useHistory();
  const location = useLocation();
  const fromManageSubtasks = location.search.includes('manage-subtasks');

  const { t: opSolutionsMiscT } = useTranslation('opSolutionsMisc');
  const { t: subtasksT } = useTranslation('operationalSolutionSubtasks');
  const { t: h } = useTranslation('draftModelPlan');

  const { status: statusConfig } = usePlanTranslation(
    'operationalSolutionSubtasks'
  );

  const { modelName } = useContext(ModelInfoContext);
  const { showMessage, showMessageOnNextPage, message } = useMessage();
  const [isModalOpen, setModalOpen] = useState(false);
  const [inputName, setInputName] = useState('');
  const [inputId, setInputId] = useState('');

  const {
    data: solutionData,
    loading,
    error,
    refetch
  } = useGetOperationalSolutionQuery({
    variables: {
      id: operationalSolutionID
    }
  });

  const solution = solutionData?.operationalSolution;
  const queriedSubtasks = solution?.operationalSolutionSubtasks!;

  const formikRef = useRef<FormikProps<FormType>>(null);

  const initialValues: FormType = {
    subtasks:
      managingSubtasks && !loading
        ? queriedSubtasks
        : [
            {
              __typename: 'OperationalSolutionSubtask',
              name: '',
              status: OperationalSolutionSubtaskStatus.TODO
            }
          ]
  };

  const [create] = useCreateOperationalSolutionSubtasksMutation();

  const [update] = useUpdateOperationalSolutionSubtasksMutation();

  const [removeSubtask] = useDeleteOperationalSolutionSubtaskMutation();

  const handleDelete = (name: string, id: string) => {
    removeSubtask({
      variables: {
        id
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (queriedSubtasks && queriedSubtasks.length > 1) {
            showMessage(
              <Alert
                type="success"
                slim
                data-testid="success-subtask-alert"
                className="margin-y-4"
              >
                {opSolutionsMiscT('subtasks.removeSubtaskSuccess', {
                  subTaskName: name
                })}
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
                {opSolutionsMiscT('subtasks.removeSubtaskSuccess', {
                  subTaskName: name
                })}
              </Alert>
            );
            history.push(
              `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
            );
          }
        }
      })
      .catch(() => {
        showMessage(
          <Alert type="error" slim className="margin-y-4">
            <span className="mandatory-fields-alert__text">
              {opSolutionsMiscT('subtasks.removeSubtaskError', {
                subTaskName: name
              })}
            </span>
          </Alert>
        );
        setModalOpen(false);
      });
  };

  const handleFormSubmit = ({ subtasks }: FormType) => {
    if (!isUpdateSubtasks(subtasks)) {
      subtasks.map(subtask =>
        create({
          variables: {
            solutionID: operationalSolutionID,
            inputs: [
              {
                name: subtask.name,
                status: subtask.status
              }
            ]
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
                  {opSolutionsMiscT('subtasks.successMessage')}
                </Alert>
              );
              history.push(
                `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
              );
            }
          })
          .catch(errors => {
            formikRef?.current?.setErrors(errors);
          })
      );
    } else {
      subtasks.map(subtask =>
        update({
          variables: {
            inputs: [
              {
                id: subtask.id,
                changes: {
                  name: subtask.name,
                  status: subtask.status
                }
              }
            ]
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
                  {opSolutionsMiscT('subtasks.successfulUpdateMessage')}
                </Alert>
              );
              history.push(
                `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
              );
            }
          })
          .catch(errors => {
            formikRef?.current?.setErrors(errors);
          })
      );
    }
  };

  if (!solution && loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFound />;
  }

  const renderModal = () => {
    return (
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
        className="confirmation-modal"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {opSolutionsMiscT('subtasks.removeModal.header', {
            subTaskName: inputName
          })}
        </PageHeading>

        <p className="margin-top-2 margin-bottom-3">
          {opSolutionsMiscT('subtasks.removeModal.warning')}
        </p>

        <Button
          type="button"
          className="margin-right-4"
          onClick={() => {
            handleDelete(inputName, inputId);
            setModalOpen(false);
          }}
        >
          {opSolutionsMiscT('subtasks.removeModal.removeSubtask')}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {opSolutionsMiscT('subtasks.removeModal.keepSubtask')}
        </Button>
      </Modal>
    );
  };

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    {
      text: opSolutionsMiscT('subtasks.itSolutionsTrackerBreadcrumb'),
      url: `/models/${modelID}/task-list/it-solutions`
    },
    {
      text: opSolutionsMiscT('subtasks.solutionDetails'),
      url: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
    },
    {
      text: managingSubtasks
        ? opSolutionsMiscT('subtasks.manageSubtasks')
        : opSolutionsMiscT('subtasks.addSubtask')
    }
  ];

  return (
    <>
      {renderModal()}
      <Breadcrumbs items={breadcrumbs} />

      {message}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {managingSubtasks
              ? opSolutionsMiscT('subtasks.manageSubtasks')
              : opSolutionsMiscT('subtasks.addSubtask')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">
            {managingSubtasks
              ? opSolutionsMiscT('subtasks.manageSubtaskInfo')
              : opSolutionsMiscT('subtasks.addSubtaskInfo')}
          </p>

          <Grid tablet={{ col: 12 }} desktop={{ col: 8 }}>
            {solution && (
              <NeedQuestionAndAnswer
                operationalNeedID={operationalNeedID}
                modelID={modelID}
                solution={solution}
                renderSolutionCardLinks={false}
              />
            )}

            <Formik
              initialValues={initialValues}
              onSubmit={values => {
                handleFormSubmit(values);
              }}
              enableReinitialize
              innerRef={formikRef}
            >
              {formikProps => {
                const {
                  errors,
                  handleSubmit,
                  setErrors,
                  values: formValues
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
                      data-testid={
                        managingSubtasks
                          ? 'manage-subtask-form'
                          : 'add-subtask-form'
                      }
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <FieldArray name="subtasks">
                          {({ push, remove }) => {
                            const { subtasks } = formValues;

                            return (
                              <>
                                {subtasks &&
                                  subtasks.map((input, index) => (
                                    <div
                                      // eslint-disable-next-line react/no-array-index-key
                                      key={index}
                                      className={
                                        subtasks.length > 1
                                          ? 'border-bottom border-base-light'
                                          : ''
                                      }
                                      data-testid={
                                        managingSubtasks
                                          ? `manage-subtasks--${index}`
                                          : `add-subtask--${index}`
                                      }
                                    >
                                      {managingSubtasks ? (
                                        <div className="margin-top-4">
                                          <p className="usa-label margin-0">
                                            {opSolutionsMiscT(
                                              'subtasks.subtaskName'
                                            )}
                                          </p>
                                          <p className="margin-0">
                                            {input.name}
                                          </p>
                                        </div>
                                      ) : (
                                        <FieldGroup
                                          scrollElement="name"
                                          error={!!flatErrors.name}
                                          className="margin-top-4"
                                        >
                                          <Label
                                            htmlFor={`subtasks[${index}].name`}
                                          >
                                            {subtasksT('name.label')}
                                            <RequiredAsterisk />
                                          </Label>

                                          <FieldErrorMsg>
                                            {flatErrors.name}
                                          </FieldErrorMsg>

                                          <Field
                                            as={TextInput}
                                            id={`subtask-name--${index}`}
                                            data-testid={`subtask-name--${index}`}
                                            maxLength={50}
                                            name={`subtasks[${index}].name`}
                                          />
                                        </FieldGroup>
                                      )}

                                      <FieldGroup className="margin-top-4">
                                        <Label
                                          htmlFor={`subtasks[${index}].status`}
                                        >
                                          {subtasksT('status.label')}
                                        </Label>

                                        {getKeys(
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
                                                label={
                                                  statusConfig.options[status]
                                                }
                                                value={status}
                                                checked={
                                                  subtasks &&
                                                  subtasks[index].status ===
                                                    status
                                                }
                                              />
                                            );
                                          })}

                                        {!managingSubtasks &&
                                          subtasks.length > 1 && (
                                            <Button
                                              type="button"
                                              onClick={() => remove(index)}
                                              className="usa-button usa-button--unstyled line-height-body-5 text-red margin-y-3"
                                            >
                                              {opSolutionsMiscT(
                                                'subtasks.removeSubtask'
                                              )}
                                            </Button>
                                          )}

                                        {managingSubtasks &&
                                          isUpdateType(input) && (
                                            <Button
                                              type="button"
                                              onClick={() => {
                                                setModalOpen(true);
                                                setInputName(input.name);
                                                setInputId(input.id);
                                              }}
                                              className="usa-button usa-button--unstyled line-height-body-5 text-red margin-y-3"
                                            >
                                              {opSolutionsMiscT(
                                                'subtasks.removeSubtask'
                                              )}
                                            </Button>
                                          )}
                                      </FieldGroup>
                                    </div>
                                  ))}

                                <div className="margin-top-3">
                                  <Button
                                    type="button"
                                    id="add-another-subtask"
                                    onClick={() =>
                                      managingSubtasks
                                        ? history.push(
                                            `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks?from=manage-subtasks`
                                          )
                                        : push({
                                            __typename:
                                              'OperationalSolutionSubtask',
                                            name: '',
                                            status:
                                              OperationalSolutionSubtaskStatus.TODO
                                          })
                                    }
                                    outline
                                  >
                                    {opSolutionsMiscT(
                                      'subtasks.addAnotherSubtask'
                                    )}
                                  </Button>
                                </div>
                              </>
                            );
                          }}
                        </FieldArray>
                      </Fieldset>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="submit"
                          id="submit-subtasks"
                          disabled={
                            !!(
                              !managingSubtasks &&
                              formValues.subtasks &&
                              formValues.subtasks.find(
                                input => input.name === ''
                              )
                            )
                          }
                          onClick={() => setErrors({})}
                        >
                          {managingSubtasks
                            ? opSolutionsMiscT('subtasks.updateSubtasks')
                            : opSolutionsMiscT('subtasks.addSubtask')}
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
                        <Icon.ArrowBack
                          className="margin-right-1"
                          aria-hidden
                        />
                        {fromManageSubtasks
                          ? opSolutionsMiscT('subtasks.returnToPreviousPage')
                          : opSolutionsMiscT('subtasks.returnToDetails')}
                      </Button>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
        <Grid desktop={{ col: 3 }} className="padding-x-1">
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
