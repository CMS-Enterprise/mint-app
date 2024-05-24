import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card, Grid, Icon } from '@trussworks/react-uswds';
import {
  DatabaseOperation,
  GetChangeHistoryQuery,
  useGetChangeHistoryQuery
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import { AvatarCircle } from 'components/shared/Avatar';
import Spinner from 'components/Spinner';
import { formatDateUtc, formatTime } from 'utils/date';

import { sortAllChanges } from '../../util';

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

  let changeCount = 0;

  changeRecords.forEach(changeRecord => {
    changeCount +=
      changeRecord.action === DatabaseOperation.INSERT ||
      changeRecord.action === DatabaseOperation.DELETE ||
      changeRecord.tableName === 'operational_solution'
        ? 1
        : changeRecord.translatedFields.length || 1;
  });

  return (
    <Card className="mini-change-record">
      <Grid row className="padding-2" style={{ wordWrap: 'break-word' }}>
        <Grid tablet={{ col: 2 }}>
          <AvatarCircle user={changeRecords[0].actorName} />
        </Grid>

        <Grid tablet={{ col: 10 }}>
          <div className="padding-left-05">
            {changeRecords[0].actorName}{' '}
            <Trans
              i18nKey="changeHistory:change"
              count={changeCount}
              values={{
                count: changeCount,
                section: t(`sections.${changeRecords[0].tableName}`),
                date: formatDateUtc(changeRecords[0].date, 'MMMM d, yyyy'),
                time: formatTime(changeRecords[0].date)
              }}
              components={{
                datetime: <span className="text-base" />
              }}
            />
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

  const sortedChanges = sortAllChanges(changes).slice(0, 3);

  return (
    <div className="margin-bottom-6">
      <h3 className="margin-bottom-1">{t('recentChanges')}</h3>

      {loading ? (
        <div className="padding-y-4 padding-left-10">
          <Spinner />
        </div>
      ) : (
        <>
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
        </>
      )}

      <UswdsReactLink
        to={`/models/${modelID}/change-history`}
        className="display-flex flex-align-center"
      >
        <Icon.History className="margin-right-1" />

        {t('viewChangeHistory')}
      </UswdsReactLink>
    </div>
  );
};

export default RecentChanges;
