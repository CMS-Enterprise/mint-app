import React from 'react';
import { useTranslation } from 'react-i18next';
import { TaskListSubscription_onLockTaskListSectionContext_lockStatus_lockedByUserAccount as LockedByUserAccount } from 'gql/gen/types/TaskListSubscription';

import AssessmentIcon from 'components/shared/AssessmentIcon';
import { arrayOfColors } from 'components/shared/IconInitial';
import { getUserInitials } from 'utils/modelPlan';

import './index.scss';

type TaskListLockProps = {
  lockedByUserAccount: LockedByUserAccount | undefined;
  isAssessment: boolean;
  selfLocked: boolean;
};

const TaskListLock = ({
  lockedByUserAccount,
  isAssessment,
  selfLocked
}: TaskListLockProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  const randomColorIndex = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const lockMessage = isAssessment
    ? t('assessmentLocked', {
        assessmentUser: lockedByUserAccount?.commonName
      })
    : t('locked', {
        teamMember: lockedByUserAccount?.commonName
      });

  return (
    <>
      {lockedByUserAccount && (
        <div className="display-inline-flex">
          {isAssessment ? (
            <AssessmentIcon size={3} />
          ) : (
            <div
              className={`display-flex flex-align-center flex-justify-center circle-4 margin-right-1 flex-none ${
                arrayOfColors[randomColorIndex(0, 3)]
              }`}
            >
              {getUserInitials(lockedByUserAccount.commonName)}
            </div>
          )}

          <div className="display-flex flex-align-center line-height-body-4 text-base">
            {selfLocked ? t('selfLocked') : lockMessage}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskListLock;
