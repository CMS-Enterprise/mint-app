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

type ReadViewStatusBannerStatusBannerProps = {
  modelID: string;
  status: ModelStatus;
  hasEditAccess?: boolean;
  modifiedDts?: string | null;
  createdDts?: string | null;
  changeHistoryLink?: boolean;
  className?: string;
};

const Divider = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      'status-banner__border border-base-light margin-05 margin-right-2',
      className
    )}
  />
);

const ReadViewStatusBanner = ({
  modelID,
  status,
  hasEditAccess = false,
  modifiedDts,
  createdDts,
  changeHistoryLink = true,
  className
}: ReadViewStatusBannerStatusBannerProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('generalReadOnly');
  const { t: changeHistoryT } = useTranslation('changeHistory');

  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  return (
    <div data-testid="task-list-status" className={className}>
      <Grid
        row
        desktop={{ col: 12 }}
        className={classNames(
          'margin-bottom-2 flex-align-center flex-justify-start',
          {
            'line-height-large margin-bottom-0': isMobile
          }
        )}
      >
        <p className="margin-y-0 text-bold margin-right-1">{t('status')}</p>

        <ModelStatusTag status={status} classname="margin-right-2" />

        <Grid row>
          {!isMobile && <Divider className="margin-left-1" />}

          <div className="display-flex flex-align-center flex-wrap">
            {changeHistoryLink && (
              <UswdsReactLink
                to={{
                  pathname: `/models/${modelID}/change-history`,
                  state: { from: 'readview' }
                }}
                className={classNames(
                  'display-flex flex-align-center padding-right-2',
                  {
                    'padding-y-1': isMobile
                  }
                )}
              >
                <Icon.History className="margin-right-1" aria-label="history" />

                {changeHistoryT('viewChangeHistory')}
              </UswdsReactLink>
            )}

            <div className="display-flex flex-align-center flex-wrap margin-right-1">
              <p
                className={classNames('margin-y-0 text-normal margin-right-1')}
              >
                {modifiedDts ? h('lastUpdate') : h('createdOn')}
                {formatDateLocal(modifiedDts || createdDts || '', 'MM/dd/yyyy')}
              </p>
            </div>
          </div>

          {hasEditAccess && !isMobile && <Divider />}

          {hasEditAccess && (
            <div className="display-flex flex-align-center">
              <UswdsReactLink
                to={`/models/${modelID}/collaboration-area`}
                className={classNames('display-flex flex-align-center')}
              >
                <Icon.Edit className="margin-right-1" aria-label="edit" />
                {t('edit')}
              </UswdsReactLink>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ReadViewStatusBanner;
