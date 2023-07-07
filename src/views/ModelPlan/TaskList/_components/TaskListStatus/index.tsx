import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, IconEdit } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { ModelStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import { translateModelPlanStatus } from 'utils/modelPlan';

type TaskListStatusProps = {
  icon?: boolean;
  modelID: string;
  status: ModelStatus;
  statusLabel?: boolean;
  updateLabel?: boolean;
  modifiedDts?: string;
  readOnly?: boolean;
};

const TaskListStatus = ({
  icon,
  modelID,
  status,
  statusLabel = false,
  updateLabel = false,
  modifiedDts,
  readOnly
}: TaskListStatusProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('generalReadOnly');

  return (
    <div className="padding-0">
      <Grid row style={{ gap: '16px' }}>
        <Grid
          col={modifiedDts ? 12 : 'auto'}
          desktop={{ col: 'auto' }}
          className="display-flex flex-align-center"
          style={{ gap: '10px' }}
        >
          {statusLabel && <p className="margin-y-0">{t('status')}</p>}
          <Tag className="bg-base text-white margin-right-0">
            {translateModelPlanStatus(status)}
          </Tag>
        </Grid>
        <Grid
          col={modifiedDts ? 12 : 'auto'}
          desktop={{ col: 'auto' }}
          className="display-flex flex-align-center flex-wrap"
        >
          {!!modifiedDts && (
            <p className="margin-y-0 text-normal">
              {h('lastUpdate')}
              {formatDateLocal(modifiedDts, 'MM/dd/yyyy')}
            </p>
          )}

          {!readOnly && (
            <div>
              <UswdsReactLink
                to={`/models/${modelID}/status`}
                className="display-flex flex-align-center"
              >
                {icon && <IconEdit className="margin-right-1" />}
                {updateLabel && t('update')}
              </UswdsReactLink>
            </div>
          )}
        </Grid>
        {readOnly && (
          <div className="display-flex flex-align-center">
            <div className="height-2 border-left-2px border-base-light margin-right-2 " />
            <div>
              <UswdsReactLink
                to={`/models/${modelID}/task-list`}
                className="display-flex flex-align-center"
              >
                <IconEdit className="margin-right-1" />
                {t('edit')}
              </UswdsReactLink>
            </div>
          </div>
        )}
      </Grid>
    </div>
  );
};

export default TaskListStatus;
