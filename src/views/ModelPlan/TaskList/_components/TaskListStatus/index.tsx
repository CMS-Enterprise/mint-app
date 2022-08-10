import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconEdit } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { ModelStatus } from 'types/graphql-global-types';
import { translateModelPlanStatus } from 'utils/modelPlan';

type TaskListStatusProps = {
  icon?: boolean;
  modelID: string;
  status: ModelStatus;
  updateLabel?: string;
};

const TaskListStatus = ({
  icon,
  modelID,
  status,
  updateLabel
}: TaskListStatusProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  return (
    <div className="display-flex flex-align-center" style={{ gap: '10px' }}>
      <p className="margin-y-0">{t('status')}</p>
      <Tag className="bg-base text-white margin-right-0">
        {translateModelPlanStatus(status)}
      </Tag>
      <div>
        <UswdsReactLink
          to={`/models/${modelID}/status`}
          className="display-flex flex-align-center"
        >
          {icon && <IconEdit className="margin-right-1" />}
          {updateLabel ?? t('update')}
        </UswdsReactLink>
      </div>
    </div>
  );
};

export default TaskListStatus;
