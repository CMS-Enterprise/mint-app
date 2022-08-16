import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconEdit } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { ModelStatus } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import { translateModelPlanStatus } from 'utils/modelPlan';

type TaskListStatusProps = {
  icon?: boolean;
  modelID: string;
  status: ModelStatus;
  updateLabel?: string;
  modifiedDts?: string;
  readOnly?: boolean;
};

const TaskListStatus = ({
  icon,
  modelID,
  status,
  updateLabel,
  modifiedDts,
  readOnly
}: TaskListStatusProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('generalReadOnly');

  return (
    <div className="display-flex flex-align-center" style={{ gap: '10px' }}>
      <p className="margin-y-0">{t('status')}</p>
      <Tag className="bg-base text-white margin-right-0">
        {translateModelPlanStatus(status)}
      </Tag>
      {!!modifiedDts && (
        <p className="margin-y-0 text-normal">
          {h('lastUpdate')}
          {formatDate(modifiedDts, 'M/d/yyyy')}
        </p>
      )}

      <div>
        <UswdsReactLink
          to={
            readOnly
              ? `/models/${modelID}/status#read-only`
              : `/models/${modelID}/status`
          }
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
