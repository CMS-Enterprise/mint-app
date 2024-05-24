import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  DatabaseOperation,
  GetChangeHistoryQuery,
  TranslationDataType,
  TranslationQuestionType
} from 'gql/gen/graphql';

import { AvatarCircle } from 'components/shared/Avatar';
import CollapsableLink from 'components/shared/CollapsableLink';
import { formatDateUtc, formatTime } from 'utils/date';

import { batchedTables, parseArray } from '../../util';

import '../ChangeRecord/index.scss';

export type ChangeRecordType = NonNullable<
  GetChangeHistoryQuery['translatedAuditCollection']
>[0];

type ChangeRecordProps = {
  changeRecords: ChangeRecordType[];
};

type SingleChangeProps = {
  change: ChangeRecordType;
};

// Render a single change record, showing the field name, the change type, and the old and new values
const SolutionChanges = ({ change }: SingleChangeProps) => {
  const { t } = useTranslation('changeHistory');

  return (
    <div className="margin-bottom-2 margin-top-neg-05" key={change.id}>
      <div className="text-bold margin-right-05">
        {/* Operational solution header */}
        {change.tableName === 'operational_solution' && (
          <>
            Recruit participants{' '}
            <span className="text-normal">
              solution {t(`auditUpdateType.${change.action}`)}
            </span>{' '}
            : Contractor
          </>
        )}

        {/* Subtask header */}
        {change.tableName === 'operational_solution_subtask' && (
          <>
            <span className="text-normal">
              Subtask {t(`auditUpdateType.${change.action}`)} for
            </span>{' '}
            Recruit participants: Contractor
          </>
        )}
      </div>

      <div className="change-record__answer margin-y-1">
        {(() => {
          return change.translatedFields.map(field => (
            <div key={field.id}>
              {field.newTranslated && (
                <span>{field.fieldNameTranslated}: </span>
              )}
              <RenderValue
                value={field.newTranslated}
                dataType={field.dataType}
                referenceLabel={field.referenceLabel}
                questionType={field.questionType}
              />
            </div>
          ));
        })()}

        {(() => {
          return (
            <>
              {change.action !== DatabaseOperation.DELETE &&
                !!change.translatedFields.find(field => field.old) && (
                  <div className="text-bold padding-y-105">
                    {t('previousDetails')}
                  </div>
                )}
              {change.translatedFields.map(field => {
                if (!field.old) return <div key={field.id} />;
                return (
                  <div key={field.id}>
                    {field.old && (
                      <>
                        <span>{field.fieldNameTranslated}: </span>
                        <RenderValue
                          value={field.oldTranslated}
                          dataType={field.dataType}
                          referenceLabel={field.referenceLabel}
                          questionType={field.questionType}
                          previous={!!field.old}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>
    </div>
  );
};

// Render a single value, either as a string or as a list of strings
const RenderValue = ({
  value,
  dataType,
  referenceLabel,
  questionType,
  previous = false
}: {
  value: string | string[];
  dataType: TranslationDataType | null | undefined;
  referenceLabel?: string | null | undefined;
  questionType?: TranslationQuestionType | null | undefined;
  previous?: boolean;
}) => {
  const { t } = useTranslation('changeHistory');

  // Contains the label and parent question if the change record is a follow-up/OTHER type
  const parentQuestion =
    referenceLabel && questionType === TranslationQuestionType.OTHER ? (
      <div className="text-italic padding-bottom-1">
        ({t('followUp')}
        {referenceLabel})
      </div>
    ) : null;

  const parsedValue = parseArray(value);

  // If the data type is an array, render the array as a list and parent question
  if (Array.isArray(parsedValue)) {
    return (
      <>
        {parentQuestion}
        <ul className="padding-left-3 margin-y-0">
          {parsedValue.map((val, index) => (
            <li key={val}>{val}</li>
          ))}
        </ul>
      </>
    );
  }

  // If the data type is a date, format the date and parent question
  if (dataType === TranslationDataType.DATE && typeof value === 'string') {
    return (
      <>
        {parentQuestion}
        <span>{formatDateUtc(value.replace(' ', 'T'), 'MM/dd/yyyy')}</span>
      </>
    );
  }

  return (
    <>
      {!previous && parentQuestion}
      <span>{value}</span>
    </>
  );
};

// Render a single change record, showing the actor, the date, and the fields that were changed
const BatchRecord = ({ changeRecords }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  const [isOpen, setOpen] = useState<boolean>(false);

  // Determine if the change record should be expanded to show more data
  const showMoreData: boolean =
    changeRecords[0].action !== DatabaseOperation.INSERT ||
    changeRecords[0].tableName !== 'operational_solution';

  return (
    <Card className="change-record">
      <div className={classNames('display-flex flex-align-center')}>
        <AvatarCircle
          user={changeRecords[0].actorName}
          className="margin-right-1 flex-align-self-start"
        />
        <span className={classNames('padding-top-05')}>
          <span className="text-bold">{changeRecords[0].actorName} </span>

          <Trans
            i18nKey="changeHistory:change"
            count={changeRecords.length}
            values={{
              count: changeRecords.length,
              section: t(`sections.${changeRecords[0].tableName}`),
              date: formatDateUtc(changeRecords[0].date, 'MMMM d, yyyy'),
              time: formatTime(changeRecords[0].date)
            }}
            components={{
              datetime: <span />
            }}
          />
        </span>
      </div>

      {!isOpen && (
        <ul className="margin-top-1 margin-bottom-1 margin-left-4">
          {changeRecords.map(change => (
            <li key={change.id}>
              {changeRecords[0].tableName === 'operational_solution' && (
                <Trans
                  i18nKey="changeHistory:solutionUpdate"
                  values={{
                    action: t(`auditUpdateType.${change.action}`),
                    needName: 'Recruit participants', // TODO: change to dynamic value
                    solutionName: 'Contractor' // TODO: change to dynamic value
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              )}

              {changeRecords[0].tableName ===
                'operational_solution_subtask' && (
                <Trans
                  i18nKey="changeHistory:subtaskUpdate"
                  values={{
                    action: t(`auditUpdateType.${change.action}`),
                    needName: 'Recruit participants', // TODO: change to dynamic value
                    solutionName: 'Contractor' // TODO: change to dynamic value
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {showMoreData && (
        <CollapsableLink
          className="margin-left-5"
          id={changeRecords[0].id}
          label={t('showDetails')}
          closeLabel={t('hideDetails')}
          labelPosition="bottom"
          setParentOpen={setOpen}
          styleLeftBar={false}
        >
          <div className="margin-bottom-neg-1">
            {batchedTables.includes(changeRecords[0].tableName) &&
              (() => {
                return changeRecords.map(change => (
                  <SolutionChanges change={change} key={change.id} />
                ));
              })()}
          </div>
        </CollapsableLink>
      )}
    </Card>
  );
};

export default BatchRecord;
