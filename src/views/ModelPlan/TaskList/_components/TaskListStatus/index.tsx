import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import { ModelStatus } from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

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
  readOnly?: boolean;
  modifiedOrCreateLabel?: boolean;
};

const TaskListStatus = ({
  icon,
  modelID,
  status,
  hasEditAccess = false,
  statusLabel = false,
  updateLabel = false,
  modifiedDts,
  readOnly,
  modifiedOrCreateLabel
}: TaskListStatusProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('generalReadOnly');
  const { t: changeHistoryT } = useTranslation('changeHistory');
  const { t: modelPlanT } = useTranslation('modelPlan');

  const flags = useFlags();

  return (
    <div className="padding-0" data-testid="task-list-status">
      <Grid row style={{ gap: '16px' }}>
        <Grid
          className="display-flex flex-align-center"
          style={{ gap: '10px' }}
        >
          {statusLabel && <p className="margin-y-0">{t('status')}</p>}
          <Tag className="bg-base text-white margin-right-0">
            {modelPlanT(`status.options.${status}`)}
          </Tag>
        </Grid>
        <Grid className="display-flex flex-align-center flex-wrap">
          {!!modifiedDts && (
            <p className="margin-y-0 text-normal">
              {modifiedOrCreateLabel ? h('lastUpdate') : h('createdOn')}
              {formatDateLocal(modifiedDts, 'MM/dd/yyyy')}
            </p>
          )}

          {!readOnly && (
            <div className="mint-no-print">
              <UswdsReactLink
                to={`/models/${modelID}/status`}
                className="display-flex flex-align-center"
              >
                {icon && <Icon.Edit className="margin-right-1" />}
                {updateLabel && t('update')}
              </UswdsReactLink>
            </div>
          )}
        </Grid>
        {readOnly && (
          <div className="mint-no-print">
            {hasEditAccess && (
              <div className="display-flex flex-align-center">
                <div className="height-2 border-left-2px border-base-light margin-right-2 " />

                {flags.changeHistoryEnabled && (
                  <>
                    <UswdsReactLink
                      to={{
                        pathname: `/models/${modelID}/change-history`,
                        state: {
                          from: 'readview'
                        }
                      }}
                      className="display-flex flex-align-center margin-right-2"
                    >
                      <Icon.History className="margin-right-1" />

                      {changeHistoryT('viewChangeHistory')}
                    </UswdsReactLink>

                    <div className="height-2 border-left-2px border-base-light margin-right-2 " />
                  </>
                )}

                <UswdsReactLink
                  to={`/models/${modelID}/task-list`}
                  className="display-flex flex-align-center"
                >
                  <Icon.Edit className="margin-right-1" />
                  {t('edit')}
                </UswdsReactLink>
              </div>
            )}
          </div>
        )}
      </Grid>
    </div>
  );
};

export default TaskListStatus;
