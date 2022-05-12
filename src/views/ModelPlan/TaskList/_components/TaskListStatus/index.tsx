import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { ModelStatus } from 'types/graphql-global-types';
import { translateModelPlanStatus } from 'utils/modelPlan';

type TaskListStatusProps = {
  modelId: string;
  status: ModelStatus;
};

const TaskListStatus = ({ modelId, status }: TaskListStatusProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  return (
    <div className="display-flex flex-align-center" style={{ gap: '10px' }}>
      <p className="margin-y-0">{t('status')}</p>
      <Tag className="bg-base text-white margin-right-0">
        {translateModelPlanStatus(status)}
      </Tag>
      <div>
        <UswdsReactLink to={`/models/${modelId}/status`}>
          {t('update')}
        </UswdsReactLink>
      </div>
    </div>
  );
};

export default TaskListStatus;
