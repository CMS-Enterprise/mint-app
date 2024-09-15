import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Select } from '@trussworks/react-uswds';
import { StatusMessageType } from 'features/ModelPlan/TaskList';
import {
  ModelPhase,
  ModelStatus,
  PhaseSuggestion,
  useUpdateModelPlanMutation
} from 'gql/gen/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';

type MutationErrorModalType = {
  isOpen: boolean;
  closeModal: () => void;
  setStatusMessage: Dispatch<SetStateAction<StatusMessageType | null>>;
  modelID: string;
  currentStatus: ModelStatus;
  suggestedPhase: PhaseSuggestion;
  refetch: () => void;
};

const UpdateStatusModal = ({
  isOpen,
  closeModal,
  setStatusMessage,
  modelID,
  currentStatus,
  suggestedPhase,
  refetch
}: MutationErrorModalType) => {
  const { t: modelPlanTaskListT } = useTranslation('modelPlanTaskList');

  const history = useHistory();

  const { status: statusConfig } = usePlanTranslation('modelPlan');

  const [updateModelStatus] = useUpdateModelPlanMutation();

  const [status, setStatus] = useState<ModelStatus>(
    suggestedPhase.suggestedStatuses[0]
  );

  const handleUpdateStatus = () => {
    const translatedStatus = statusConfig.options[status];

    updateModelStatus({
      variables: {
        id: modelID,
        changes: {
          status
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          refetch();
          setStatusMessage({
            message: modelPlanTaskListT('statusUpdateSuccess', {
              status: translatedStatus
            }),
            status: 'success'
          });
          closeModal();
        }
      })
      .catch(errors => {
        setStatusMessage({
          message: modelPlanTaskListT('statusUpdateError', {
            status: translatedStatus
          }),
          status: 'error'
        });
        closeModal();
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      className="maxw-mobile-lg radius-lg"
      navigation={false}
    >
      <div data-testid="update-status-modal">
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-2"
        >
          {modelPlanTaskListT('statusModal.heading')}
        </PageHeading>

        <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-2">
          {modelPlanTaskListT(`statusModal.statusText.${suggestedPhase.phase}`)}
        </p>

        <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-2 text-bold">
          {modelPlanTaskListT('statusModal.currentStatus')}
          <span className="text-normal">
            {statusConfig.options[currentStatus]}
          </span>
        </p>

        <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-2 text-bold">
          {suggestedPhase.phase !== ModelPhase.IN_CLEARANCE ? (
            <span className="display-flex">
              {modelPlanTaskListT('statusModal.newStatus')}
              <span className="margin-right-05">: </span>
              <span className="text-normal">
                {statusConfig.options[suggestedPhase.suggestedStatuses[0]]}
              </span>
            </span>
          ) : (
            <>
              {modelPlanTaskListT('statusModal.newStatus')}
              <div className="text-normal text-base">
                {modelPlanTaskListT('statusModal.hint')}
              </div>
              <Select
                id="sort"
                className="margin-bottom-2 margin-top-1"
                name="status"
                value={status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setStatus(e.target.value as ModelStatus);
                }}
              >
                {getKeys(statusConfig.options)
                  .filter(statusOption =>
                    suggestedPhase.suggestedStatuses.includes(statusOption)
                  )
                  .map(statusOption => {
                    return (
                      <option
                        key={`Status-Dropdown-${statusConfig.options[statusOption]})}`}
                        value={statusOption}
                      >
                        {statusConfig.options[statusOption]}
                      </option>
                    );
                  })}
              </Select>
            </>
          )}
        </p>

        <div className="margin-top-4 margin-bottom-1">
          <Button
            type="button"
            data-testid="update-status"
            onClick={() => {
              handleUpdateStatus();
            }}
          >
            {modelPlanTaskListT('statusModal.update')}
          </Button>

          <Button
            type="button"
            className="margin-left-2"
            data-testid="go-to-timeline"
            unstyled
            onClick={() => {
              closeModal();
              history.push(
                `/models/${modelID}/collaboration-area/task-list/basics/milestones`
              );
            }}
          >
            {modelPlanTaskListT('statusModal.goToTimeline')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateStatusModal;
