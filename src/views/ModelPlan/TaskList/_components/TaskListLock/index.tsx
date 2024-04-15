import React from 'react';
import { useTranslation } from 'react-i18next';
import { TaskListSubscription_onLockTaskListSectionContext_lockStatus_lockedByUserAccount as LockedByUserAccount } from 'gql/gen/types/TaskListSubscription';

import AssessmentIcon from 'components/shared/AssessmentIcon';
import { AvatarCircle } from 'components/shared/Avatar';

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
            <AvatarCircle user={lockedByUserAccount.commonName} />
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
