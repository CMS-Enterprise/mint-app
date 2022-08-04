import React from 'react';
import { useTranslation } from 'react-i18next';

import { arrayOfColors } from 'components/shared/IconInitial';
import { GetModelCollaborators_modelPlan_collaborators as GetCollaboratorsType } from 'queries/Collaborators/types/GetModelCollaborators';
import { getUserInitials } from 'utils/modelPlan';

type TaskListLockProps = {
  collaborator: GetCollaboratorsType | undefined;
  //   userType: 'ADMIN' | 'BASIC' // TODO: Once roles are implemented
};

const TaskListLock = ({ collaborator }: TaskListLockProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  const randomColorIndex = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <>
      {collaborator && (
        <div className="display-inline-flex">
          <div
            className={`display-flex flex-align-center flex-justify-center circle-4 margin-right-1 flex-none ${
              arrayOfColors[randomColorIndex(0, 3)]
            }`}
          >
            {getUserInitials(collaborator.fullName)}
          </div>
          <div className="display-flex flex-align-center">{t('locked')}</div>
        </div>
      )}
    </>
  );
};

export default TaskListLock;
