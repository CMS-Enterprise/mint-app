import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import {
  DataExchangeApproachStatus,
  ModelStatus,
  MtoStatus,
  TaskStatus
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { formatDateLocal } from 'utils/date';

import './index.scss';

type StatusBannerProps = {
  icon?: boolean;
  modelID: string;
  type?: 'model' | 'task';
  status: ModelStatus | TaskStatus | DataExchangeApproachStatus | MtoStatus;
  hasEditAccess?: boolean;
  statusLabel?: boolean;
  updateLabel?: boolean;
  changeHistoryLink?: boolean;
  modifiedDts?: string | null;
  isReadView?: boolean;
  isCollaborationArea?: boolean;
  modifiedOrCreateLabel?: boolean;
  condensed?: boolean;
  className?: string;
};

const StatusBanner = ({
  icon,
  modelID,
  type = 'model',
  status,
  hasEditAccess = false,
  statusLabel = false,
  updateLabel = false,
  changeHistoryLink = true,
  modifiedDts,
  isReadView,
  isCollaborationArea,
  modifiedOrCreateLabel,
  condensed,
  className
}: StatusBannerProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: modelPlanT } = useTranslation('modelPlan');
  const { t: h } = useTranslation('generalReadOnly');
  const { t: changeHistoryT } = useTranslation('changeHistory');
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  return (
    <div
      className={classNames('padding-0', className, {
        'task-list-status': isCollaborationArea || isReadView
      })}
      style={{ lineHeight: 'initial' }}
      data-testid={`task-list-status${condensed ? '-condensed' : ''}`}
    >
      <div
        className={classNames('display-flex flex-align-center', {
          'padding-y-05': isTablet
        })}
      >
        {statusLabel && (
          <p className="margin-y-0 text-bold margin-right-1">{t('status')}</p>
        )}

        {type === 'model' ? (
          <Tag className="bg-base text-white margin-right-1">
            {modelPlanT(`status.options.${status}`)}
          </Tag>
        ) : (
          <TaskListStatusTag
            status={status}
            classname="width-fit-content margin-right-1"
          />
        )}

        <div className="display-flex flex-align-center flex-wrap margin-right-1">
          {!!modifiedDts && (
            <p
              className={classNames('margin-y-0 text-normal margin-right-1', {
                'text-base': condensed
              })}
            >
              {modifiedOrCreateLabel ? h('lastUpdate') : h('createdOn')}
              {formatDateLocal(modifiedDts, 'MM/dd/yyyy')}
            </p>
          )}
        </div>

        {!isReadView && !condensed && (
          <div className="mint-no-print margin-right-2">
            <UswdsReactLink
              to={`/models/${modelID}/collaboration-area/status`}
              className="display-flex flex-align-center padding-right-2 task-list-status__border border-base-light"
            >
              {icon && <Icon.Edit className="margin-right-1" />}
              {updateLabel && t('update')}
            </UswdsReactLink>
          </div>
        )}
      </div>

      {!condensed && (
        <>
          {changeHistoryLink && (
            <div className="display-flex flex-align-center margin-right-2">
              <UswdsReactLink
                to={{
                  pathname: `/models/${modelID}/change-history`,
                  state: {
                    from: isCollaborationArea ? null : 'readview'
                  }
                }}
                className={classNames(
                  'display-flex flex-align-center padding-right-2 task-list-status__border border-base-light ',
                  {
                    'padding-y-2': isTablet
                  }
                )}
              >
                <Icon.History className="margin-right-1" />

                {changeHistoryT('viewChangeHistory')}
              </UswdsReactLink>
            </div>
          )}

          {hasEditAccess && !isCollaborationArea && (
            <div className="display-flex flex-align-center">
              <UswdsReactLink
                to={`/models/${modelID}/collaboration-area`}
                className={classNames('display-flex flex-align-center', {
                  'padding-y-2': isTablet
                })}
              >
                <Icon.Edit className="margin-right-1" />
                {t('edit')}
              </UswdsReactLink>
            </div>
          )}

          {isCollaborationArea && (
            <div className="display-flex flex-align-center">
              <UswdsReactLink
                to={`/models/${modelID}/read-view`}
                className="display-flex flex-align-center"
              >
                <Icon.Visibility className="margin-right-1" />
                {collaborationAreaT('switchToReadView')}
              </UswdsReactLink>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatusBanner;
