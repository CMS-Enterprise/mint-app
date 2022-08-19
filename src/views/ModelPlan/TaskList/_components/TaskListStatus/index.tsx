import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer, IconEdit } from '@trussworks/react-uswds';

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
    <GridContainer className="padding-0">
      <Grid row style={{ gap: '10px' }}>
        <Grid
          col={modifiedDts ? 12 : 'auto'}
          desktop={{ col: 'auto' }}
          className="display-flex flex-align-center"
          style={{ gap: '10px' }}
        >
          <p className="margin-y-0">{t('status')}</p>
          <Tag className="bg-base text-white margin-right-0">
            {translateModelPlanStatus(status)}
          </Tag>
        </Grid>
        <Grid
          col={modifiedDts ? 12 : 'auto'}
          desktop={{ col: 'auto' }}
          className="display-flex flex-align-center flex-wrap"
          style={{ gap: '10px' }}
        >
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
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default TaskListStatus;
