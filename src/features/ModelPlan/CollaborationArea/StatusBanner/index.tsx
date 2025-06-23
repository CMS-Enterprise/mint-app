import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { ModelStatus } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import ModelStatusTag from 'components/ModelStatusTag';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { formatDateLocal } from 'utils/date';

import './index.scss';

type CollaborationStatusBannerProps = {
  modelID: string;
  status: ModelStatus;
  mostRecentEdit: string;
  className?: string;
};

const CollaborationStatusBanner = ({
  modelID,
  status,
  mostRecentEdit,
  className
}: CollaborationStatusBannerProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('generalReadOnly');
  const { t: changeHistoryT } = useTranslation('changeHistory');
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  return (
    <div className={classNames(className)}>
      <Grid
        row
        gap="05"
        desktop={{ col: 10 }}
        tablet={{ col: 12 }}
        className={classNames(
          'margin-bottom-2 flex-align-center flex-justify-start',
          {
            'line-height-large margin-bottom-0': isMobile
          }
        )}
      >
        <p className="margin-y-0 text-bold margin-right-1">{t('status')}</p>

        <ModelStatusTag status={status} classname="margin-right-2" />

        <div className="mint-no-print margin-right-2">
          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area/status`}
            className="display-flex flex-align-center padding-right-2 collab-banner__border border-base-light"
          >
            {collaborationAreaT('updateStatus')}
          </UswdsReactLink>
        </div>

        {!isMobile && (
          <UswdsReactLink
            to={`/models/${modelID}/read-view`}
            className="display-flex flex-align-center"
          >
            <Icon.Visibility
              className="margin-right-1 padding-top-2px"
              aria-label="visibility"
            />
            {collaborationAreaT('switchToReadView')}
          </UswdsReactLink>
        )}
      </Grid>

      <Grid
        row
        desktop={{ col: 10 }}
        tablet={{ col: 12 }}
        className={classNames('flex-align-center flex-justify-start', {
          'row-reverse flex-justify-end': isMobile
        })}
      >
        <div className="display-flex flex-align-center flex-wrap margin-right-1">
          <p className={classNames('margin-y-0 text-normal margin-right-1')}>
            {h('lastUpdate')}
            {formatDateLocal(mostRecentEdit || '', 'MM/dd/yyyy')}
          </p>
        </div>

        <UswdsReactLink
          to={`/models/${modelID}/change-history`}
          className={classNames(
            'display-flex flex-align-center padding-right-2',
            {
              'padding-y-2': isMobile
            }
          )}
        >
          <Icon.History className="margin-right-1" aria-label="history" />

          {changeHistoryT('viewChangeHistory')}
        </UswdsReactLink>
      </Grid>

      {isMobile && (
        <Grid
          row
          desktop={{ col: 10 }}
          tablet={{ col: 12 }}
          className={classNames('flex-align-center flex-justify-start', {
            'row-reverse flex-justify-end': isMobile
          })}
        >
          <UswdsReactLink
            to={`/models/${modelID}/read-view`}
            className="display-flex flex-align-center"
          >
            <Icon.Visibility
              className="margin-right-1 padding-top-2px"
              aria-label="visibility"
            />
            {collaborationAreaT('switchToReadView')}
          </UswdsReactLink>
        </Grid>
      )}
    </div>
  );
};

export default CollaborationStatusBanner;
