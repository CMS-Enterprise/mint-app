import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '@trussworks/react-uswds';
import {
  GetChangeHistoryQuery,
  TranslationDataType,
  TranslationQuestionType
} from 'gql/gen/graphql';

import { AvatarCircle } from 'components/shared/Avatar';
import CollapsableLink from 'components/shared/CollapsableLink';
import { formatDateUtc, formatTime } from 'utils/date';

import './index.scss';

export type ChangeRecordType = NonNullable<
  GetChangeHistoryQuery['translatedAuditCollection']
>[0];

type ChangeRecordProps = {
  changeRecord: ChangeRecordType;
};

type SingleChangeProps = {
  change: ChangeRecordType['translatedFields'][0];
};

// Render a single change record, showing the field name, the change type, and the old and new values
const SingleChange = ({ change }: SingleChangeProps) => {
  const { t } = useTranslation('changeHistory');

  return (
    <div className="margin-bottom-2 margin-top-neg-1" key={change.id}>
      <div className="display-flex">
        <span className="text-bold margin-right-05">
          {change.questionType !== TranslationQuestionType.NOTE &&
            change.fieldNameTranslated}

          {change.referenceLabel &&
          change.questionType === TranslationQuestionType.NOTE ? (
            <span className="text-bold">
              {t('noteFor')}
              <span className="text-italic">{change.referenceLabel}</span>
            </span>
          ) : (
            <></>
          )}
        </span>
        {t(`changeType.${change.changeType}`)}
      </div>

      <div className="change-record__answer margin-y-1">
        <RenderValue
          value={change.newTranslated}
          dataType={change.dataType}
          referenceLabel={change.referenceLabel}
          questionType={change.questionType}
        />

        {change.oldTranslated && (
          <>
            <div className="text-bold padding-y-105">{t('previousAnswer')}</div>
            <RenderValue
              value={change.oldTranslated}
              dataType={change.dataType}
              referenceLabel={change.referenceLabel}
              questionType={change.questionType}
            />
          </>
        )}

        {!!change.notApplicableQuestions?.length && (
          <>
            <div className="text-bold padding-y-105">{t('notApplicable')}</div>
            <RenderValue
              value={change.notApplicableQuestions}
              dataType={change.dataType}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Replaces curly braces with square brackets and attempts to parse the value as JSON.  This may change as BE may be able to returned a parsed array
export const parseArray = (value: string | string[]) => {
  if (Array.isArray(value)) return value;

  const formattedString = value.replace(/{/g, '[').replace(/}/g, ']');

  try {
    return JSON.parse(formattedString);
  } catch {
    return value;
  }
};

// Render a single value, either as a string or as a list of strings
const RenderValue = ({
  value,
  dataType,
  referenceLabel,
  questionType
}: {
  value: string | string[];
  dataType: TranslationDataType | null | undefined;
  referenceLabel?: string | null | undefined;
  questionType?: TranslationQuestionType | null | undefined;
}) => {
  const { t } = useTranslation('changeHistory');

  const parentQuestion =
    referenceLabel && questionType === TranslationQuestionType.OTHER ? (
      <div className="text-italic padding-bottom-1">
        ({t('followUp')}
        {referenceLabel})
      </div>
    ) : null;

  const parsedValue = parseArray(value);

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
      {parentQuestion}
      <span>{value}</span>
    </>
  );
};

const ChangedQuestion = ({ change }: SingleChangeProps) => {
  const { t } = useTranslation('changeHistory');

  if (change.referenceLabel) {
    if (change.questionType === TranslationQuestionType.OTHER) {
      return (
        <>
          {change.fieldNameTranslated}
          <div className="text-italic">
            ({t('followUp')}
            {change.referenceLabel})
          </div>
        </>
      );
    }
    if (change.questionType === TranslationQuestionType.NOTE) {
      return (
        <span>
          {t('noteFor')}
          <span className="text-italic">{change.referenceLabel}</span>
        </span>
      );
    }
  }
  return <>{change.fieldNameTranslated}</>;
};

type ChangeType =
  | 'New plan'
  | 'Status update'
  | 'Task list status update'
  | 'Team update'
  | 'Discussion update'
  | 'Document update'
  | 'Operational need create'
  | 'Standard update';

export const identifyChangeType = (change: ChangeRecordType): ChangeType => {
  if (
    change.tableName === 'model_plan' &&
    change.translatedFields.find(
      field => field.fieldName === 'status' && field.old === null
    )
  ) {
    return 'New plan';
  }
  if (
    change.tableName === 'model_plan' &&
    change.translatedFields.find(
      field => field.fieldName === 'status' && field.old !== null
    )
  ) {
    return 'Status update';
  }
  if (
    change.tableName !== 'model_plan' &&
    change.translatedFields.find(field => field.fieldName === 'status')
  ) {
    return 'Task list status update';
  }
  if (change.tableName === 'plan_collaborator') {
    return 'Team update';
  }
  if (change.tableName === 'plan_discussion') {
    return 'Discussion update';
  }
  if (change.tableName === 'plan_document') {
    return 'Document update';
  }
  if (
    change.tableName === 'operational_need' &&
    change.translatedFields.length === 0
  ) {
    return 'Operational need create';
  }
  return 'Standard update';
};

export const isInitialCreatedSection = (
  change: ChangeRecordType,
  changeType: ChangeType
): boolean =>
  !!(
    (changeType === 'Task list status update' &&
      change.translatedFields.find(
        field => field.fieldName === 'status' && field.old === null
      )) ||
    identifyChangeType(change) === 'Operational need create'
  );

// Render a single change record, showing the actor, the date, and the fields that were changed
const ChangeRecord = ({ changeRecord }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  const [isOpen, setOpen] = useState<boolean>(false);

  const changeRecordType = identifyChangeType(changeRecord);

  const showMoreData: boolean = changeRecordType === 'Standard update';

  if (isInitialCreatedSection(changeRecord, changeRecordType)) {
    return null;
  }

  return (
    <Card className="change-record">
      <div className="display-flex flex-align-center">
        <AvatarCircle
          user={changeRecord.actorName}
          className="margin-right-1"
        />
        <span>
          <span className="text-bold">{changeRecord.actorName} </span>

          {changeRecordType === 'New plan' && (
            <Trans
              i18nKey="changeHistory:planCreate"
              values={{
                plan_name: changeRecord.translatedFields.find(
                  field => field.fieldName === 'model_name'
                )?.new,
                date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                time: formatTime(changeRecord.date)
              }}
              components={{
                datetime: <span />
              }}
            />
          )}

          {changeRecordType === 'Standard update' && (
            <Trans
              i18nKey="changeHistory:change"
              count={changeRecord.translatedFields.length}
              values={{
                count: changeRecord.translatedFields.length,
                section: t(`sections.${changeRecord.tableName}`),
                date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                time: formatTime(changeRecord.date)
              }}
              components={{
                datetime: <span />
              }}
            />
          )}
        </span>
      </div>

      {!isOpen && showMoreData && (
        <ul className="margin-top-05 margin-bottom-1 margin-left-4">
          {changeRecord.translatedFields.map(change => (
            <li key={change.id}>
              <ChangedQuestion change={change} />
            </li>
          ))}
        </ul>
      )}

      {showMoreData && (
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
              <SingleChange change={change} key={change.id} />
            ))}
          </div>
        </CollapsableLink>
      )}
    </Card>
  );
};

export default ChangeRecord;
