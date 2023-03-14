import React, { Fragment, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Grid,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import Breadcrumbs from 'components/Breadcrumbs';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import useMessage from 'hooks/useMessage';
import DeleteOperationalSolutionSubtasks from 'queries/ITSolutions/DeleteOperationalSolutionSubtasks';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import { DeleteOperationalSolutionSubtaskVariables } from 'queries/ITSolutions/types/DeleteOperationalSolutionSubtask';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import { UpdateOperationalSolutionSubtasksVariables } from 'queries/ITSolutions/types/UpdateOperationalSolutionSubtasks';
import UpdateOperationalSolutionSubtasks from 'queries/ITSolutions/UpdateOperationalSolutionSubtasks';
import { OperationalSolutionSubtaskStatus } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { translateSubtasks } from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

const ManageSubtasks = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  const history = useHistory();

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

  const solution = solutionData?.operationalSolution;
  const subtasks = solution?.operationalSolutionSubtasks!;

  const [update] = useMutation<UpdateOperationalSolutionSubtasksVariables>(
    UpdateOperationalSolutionSubtasks
  );
  const [
    removeSubtask
  ] = useMutation<DeleteOperationalSolutionSubtaskVariables>(
    DeleteOperationalSolutionSubtasks
  );

  type InitialValueType = Omit<
    GetOperationalSolutionOperationalSolutionType,
    | '__typename'
    | 'id'
    | 'key'
    | 'needed'
    | 'name'
    | 'nameOther'
    | 'pocName'
    | 'pocEmail'
    | 'status'
    | 'mustFinishDts'
    | 'mustStartDts'
    | 'documents'
  >;
  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const initialValue: InitialValueType = {
    operationalSolutionSubtasks: [...subtasks]
  };

  const handleUpdate = (formikValues: InitialValueType) => {
    const { operationalSolutionSubtasks } = formikValues;
    operationalSolutionSubtasks.map(subtask =>
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
                {t('successfulUpdateMessage')}
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
    { text: t('manageSubtasks') }
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
            {t('manageSubtasks')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('manageSubtaskInfo')}</p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeedID={operationalNeedID}
              modelID={modelID}
              solution={solution}
              renderSolutionCardLinks={false}
            />

            <Formik
              initialValues={initialValue}
              onSubmit={handleUpdate}
              enableReinitialize
              innerRef={formikRef}
            >
              {({ errors, handleSubmit, setErrors, values }) => {
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
                      <FieldArray name="operationalSolutionSubtasks">
                        {fieldArrayProps => {
                          const { push } = fieldArrayProps;
                          const { operationalSolutionSubtasks } = values;

                          return (
                            <>
                              {operationalSolutionSubtasks &&
                                operationalSolutionSubtasks.map(
                                  (input, index) => (
                                    <div
                                      key={input.id}
                                      className={
                                        operationalSolutionSubtasks.length > 1
                                          ? 'border-bottom border-base-light'
                                          : ''
                                      }
                                    >
                                      <div className="margin-top-4">
                                        <p className="usa-label margin-0">
                                          {t('subtaskName')}
                                        </p>
                                        <p className="margin-0">
                                          {
                                            operationalSolutionSubtasks[index]
                                              .name
                                          }
                                        </p>
                                      </div>

                                      <FieldGroup className="margin-top-4">
                                        <Label
                                          htmlFor={`operationalSolutionSubtasks[${index}].status`}
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
                                                name={`operationalSolutionSubtasks[${index}].status`}
                                                label={translateSubtasks(
                                                  status
                                                )}
                                                value={status}
                                                checked={
                                                  values.operationalSolutionSubtasks &&
                                                  values
                                                    .operationalSolutionSubtasks[
                                                    index
                                                  ].status === status
                                                }
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
                                        {renderModal(input.name, input.id)}
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
                                      __typename: 'OperationalSolutionSubtask',
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

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="submit"
                          id="submit-subtasks"
                          disabled={
                            !!(
                              values.operationalSolutionSubtasks &&
                              values.operationalSolutionSubtasks.find(
                                input => input.name === ''
                              )
                            )
                          }
                          onClick={() => setErrors({})}
                        >
                          {t('updateSubtasks')}
                        </Button>
                      </div>

                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled display-flex flex-align-center margin-bottom-6"
                        onClick={() => {
                          history.push(
                            `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
                          );
                        }}
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

export default ManageSubtasks;
