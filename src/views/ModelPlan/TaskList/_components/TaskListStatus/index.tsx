import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { ModelStatus } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { formatDateLocal } from 'utils/date';

type TaskListStatusProps = {
  icon?: boolean;
  modelID: string;
  status: ModelStatus;
  hasEditAccess?: boolean;
  statusLabel?: boolean;
  updateLabel?: boolean;
  modifiedDts?: string;
  isReadView?: boolean;
  isCollaborationArea?: boolean;
  modifiedOrCreateLabel?: boolean;
  className?: string;
};

const TaskListStatus = ({
  icon,
  modelID,
  status,
  hasEditAccess = false,
  statusLabel = false,
  updateLabel = false,
  modifiedDts,
  isReadView,
  isCollaborationArea,
  modifiedOrCreateLabel,
  className
}: TaskListStatusProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('generalReadOnly');
  const { t: changeHistoryT } = useTranslation('changeHistory');
  const { t: modelPlanT } = useTranslation('modelPlan');
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  return (
    <div
      className={classNames('padding-0', className)}
      data-testid="task-list-status"
    >
      <Grid row style={{ gap: '8px' }}>
        <Grid
          className="display-flex flex-align-center"
          style={{ gap: '10px' }}
        >
          {statusLabel && <p className="margin-y-0 text-bold">{t('status')}</p>}
          <Tag className="bg-base text-white margin-right-0">
            {modelPlanT(`status.options.${status}`)}
          </Tag>
        </Grid>
        <Grid className="display-flex flex-align-center flex-wrap margin-right-1">
          {!!modifiedDts && (
            <p className="margin-y-0 text-normal">
              {modifiedOrCreateLabel ? h('lastUpdate') : h('createdOn')}
              {formatDateLocal(modifiedDts, 'MM/dd/yyyy')}
            </p>
          )}
        </Grid>
        <div className="mint-no-print display-flex flex-align-center">
          <div className="display-flex flex-align-center">
            <div className="border-base-light" />

            {!isReadView && (
              <div className="mint-no-print border-right-2px border-base-light margin-right-2">
                <UswdsReactLink
                  to={`/models/${modelID}/collaboration-area/status`}
                  className="display-flex flex-align-center margin-right-2"
                >
                  {icon && <Icon.Edit className="margin-right-1" />}
                  {updateLabel && t('update')}
                </UswdsReactLink>
              </div>
            )}

            <div className="border-right-2px border-base-light margin-right-2">
              <UswdsReactLink
                to={{
                  pathname: `/models/${modelID}/change-history`,
                  state: {
                    from: isCollaborationArea ? null : 'readview'
                  }
                }}
                className="display-flex flex-align-center margin-right-2"
              >
                <Icon.History className="margin-right-1" />

                {changeHistoryT('viewChangeHistory')}
              </UswdsReactLink>
            </div>

            {hasEditAccess && !isCollaborationArea && (
              <UswdsReactLink
                to={`/models/${modelID}/collaboration-area`}
                className="display-flex flex-align-center"
              >
                <Icon.Edit className="margin-right-1" />
                {t('edit')}
              </UswdsReactLink>
            )}

            {isCollaborationArea && (
              <UswdsReactLink
                to={`/models/${modelID}/read-view`}
                className="display-flex flex-align-center"
              >
                <Icon.Visibility className="margin-right-1" />
                {collaborationAreaT('switchToReadView')}
              </UswdsReactLink>
            )}
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default TaskListStatus;
