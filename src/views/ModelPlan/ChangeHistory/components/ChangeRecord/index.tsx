import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@trussworks/react-uswds';
import { TranslatedAuditCollectionQuery } from 'gql/gen/graphql';

import { Avatar } from 'components/shared/Avatar';
import CollapsableLink from 'components/shared/CollapsableLink';
import { formatDateUtc, formatTime } from 'utils/date';

import './index.scss';

type ChangeRecordType = NonNullable<
  TranslatedAuditCollectionQuery['translatedAuditCollection']
>[0];

type ChangeRecordProps = {
  changeRecord: ChangeRecordType;
};

const ChangeRecord = ({ changeRecord }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  return (
    <Card className="change-record">
      <div className="display-flex  flex-align-center">
        <Avatar
          user={changeRecord.actorName}
          bold
          className="margin-right-05"
        />
        <span>
          {t('change', {
            count: changeRecord.translatedFields.length,
            section: t(`sections.${changeRecord.tableName}`),
            date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
            time: formatTime(changeRecord.date)
          })}
        </span>
      </div>

      <ul className="margin-y-05 margin-left-4">
        {changeRecord.translatedFields.map(change => (
          <li>{change.fieldNameTranslated}</li>
        ))}
      </ul>
    </Card>
  );
};

export default ChangeRecord;
