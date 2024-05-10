import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card, Grid, Icon } from '@trussworks/react-uswds';
import {
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
  changeRecord: ChangeRecordType;
};

// Render a single min change record, showing the actor name, the section, the date, and the time
export const MiniChangeRecord = ({ changeRecord }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  return (
    <Card className="mini-change-record">
      <Grid row className="padding-2">
        <Grid tablet={{ col: 2 }}>
          <AvatarCircle user={changeRecord.actorName} />
        </Grid>

        <Grid tablet={{ col: 10 }}>
          <div className="padding-left-05">
            {changeRecord.actorName}{' '}
            <Trans
              i18nKey="changeHistory:change"
              count={changeRecord.translatedFields.length || 1}
              values={{
                count: changeRecord.translatedFields.length,
                section: t(`sections.${changeRecord.tableName}`),
                date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                time: formatTime(changeRecord.date)
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

          {sortedChanges.map(changeRecord => (
            <MiniChangeRecord
              changeRecord={changeRecord}
              key={changeRecord.id}
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
