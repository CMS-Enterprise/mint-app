import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card, Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetChangeHistoryQuery,
  useGetChangeHistoryQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { AvatarCircle } from 'components/Avatar';
import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { formatDateUtc, formatTime } from 'utils/date';

import {
  isLinkingTable,
  linkingTableQuestions,
  shouldRenderExistingLinkBatch,
  sortAllChanges
} from '../../util';
import { ChangeHeader } from '../ChangeRecord';

import './index.scss';

export type ChangeRecordType = NonNullable<
  GetChangeHistoryQuery['translatedAuditCollection']
>[0];

type ChangeRecordProps = {
  changeRecords: ChangeRecordType[];
};

// Render a single min change record, showing the actor name, the section, the date, and the time
export const MiniChangeRecord = ({ changeRecords }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

  return (
    <Card className="mini-change-record">
      <Grid row className="padding-2" style={{ wordWrap: 'break-word' }}>
        <Grid desktop={{ col: 2 }} tablet={{ col: 1 }} mobileLg={{ col: 1 }}>
          <AvatarCircle user={changeRecords[0].actorName} />
        </Grid>

        <Grid desktop={{ col: 10 }} tablet={{ col: 11 }} mobileLg={{ col: 11 }}>
          <div
            className={classNames('padding-left-05', {
              'padding-left-1': isMobile
            })}
          >
            {changeRecords[0].actorName}{' '}
            {shouldRenderExistingLinkBatch(changeRecords) ? (
              <Trans
                i18nKey="changeHistory:change"
                shouldUnescape
                count={changeRecords.length}
                values={{
                  count: isLinkingTable(changeRecords[0].tableName)
                    ? linkingTableQuestions(changeRecords).length
                    : changeRecords.length,
                  section: t(`sections.${changeRecords[0].tableName}`),
                  date: formatDateUtc(changeRecords[0].date, 'MMMM d, yyyy'),
                  time: formatTime(changeRecords[0].date)
                }}
                components={{
                  datetime: <span className="text-base" />
                }}
              />
            ) : (
              <ChangeHeader
                changeRecord={changeRecords[0]}
                miniRecord
                isOpen={false}
                setOpen={() => null}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

const RecentChanges = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('changeHistory');

  const { data, loading } = useGetChangeHistoryQuery({
    variables: {
      modelPlanID: modelID
    }
  });

  const changes = [...(data?.translatedAuditCollection || [])];

  // Sort the changes and only show the first 3
  const sortedChanges = sortAllChanges(changes).slice(0, 3);

  return (
    <div className="margin-bottom-6">
      <h3 className="margin-bottom-1">{t('recentChanges')}</h3>

      {loading ? (
        <div className="padding-y-4 padding-left-10">
          <Spinner />
        </div>
      ) : (
        <div className="margin-bottom-2">
          {sortedChanges.length === 0 && (
            <Alert type="info" slim className="margin-bottom-2">
              {t('noChanges')}
            </Alert>
          )}

          {sortedChanges.map(changeRecords => (
            <MiniChangeRecord
              changeRecords={changeRecords}
              key={changeRecords[0].id}
            />
          ))}
        </div>
      )}

      <UswdsReactLink
        to={`/models/${modelID}/change-history`}
        data-testid="view-change-history"
        className="display-flex flex-align-center"
      >
        <Icon.History className="margin-right-1" />

        {t('viewChangeHistory')}
      </UswdsReactLink>
    </div>
  );
};

export default RecentChanges;
