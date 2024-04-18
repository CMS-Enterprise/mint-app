import React, { useState } from 'react';
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

  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <Card className="change-record">
      <div className="display-flex flex-align-center">
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

      {!isOpen && (
        <ul className="margin-top-05 margin-bottom-1 margin-left-4">
          {changeRecord.translatedFields.map(change => (
            <li key={change.id}>{change.fieldNameTranslated}</li>
          ))}
        </ul>
      )}

      <CollapsableLink
        className="margin-left-6"
        id={changeRecord.id}
        label={t('showDetails')}
        closeLabel={t('hideDetails')}
        labelPosition="bottom"
        setParentOpen={setOpen}
        styleLeftBar={false}
      >
        <div className="margin-bottom-neg-1">
          {changeRecord.translatedFields.map(change => (
            <div className="margin-bottom-2 margin-top-neg-1">
              <div className="display-flex">
                <span className="text-bold margin-right-05">
                  {change.fieldNameTranslated}
                </span>
                {t(`changeType.${change.changeType}`)}
              </div>

              <div className="change-record__answer margin-y-1">
                {change.newTranslated}
                {change.oldTranslated && (
                  <>
                    <div className="text-bold padding-y-105">
                      {t('previousAnswer')}
                    </div>
                    {change.oldTranslated}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsableLink>
    </Card>
  );
};

export default ChangeRecord;
