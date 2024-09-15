import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  DatabaseOperation,
  GetChangeHistoryQuery,
  TableName,
  TranslationDataType,
  TranslationQuestionType
} from 'gql/generated/graphql';

import { AvatarCircle } from 'components/Avatar';
import CollapsableLink from 'components/CollapsableLink';
import MentionTextArea from 'components/MentionTextArea';
import { formatDateUtc, formatTime } from 'utils/date';

import {
  datesWithNoDay,
  documentName,
  documentType,
  getActionText,
  getHeaderText,
  getNestedActionText,
  hiddenFields,
  identifyChangeType,
  isDiscussionReplyWithMetaData,
  isGenericWithMetaData,
  parseArray,
  TranslationTables
} from '../../util';

import './index.scss';

export type ChangeRecordType = NonNullable<
  GetChangeHistoryQuery['translatedAuditCollection']
>[0];

type ChangeRecordProps = {
  changeRecord: ChangeRecordType;
  index: number;
};

type ChangeHeaderProps = {
  changeRecord: ChangeRecordType;
  miniRecord?: boolean;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

type SingleChangeProps = {
  change: ChangeRecordType['translatedFields'][0];
  changeType: DatabaseOperation;
  tableName: TranslationTables;
};

export const ChangeHeader = ({
  changeRecord,
  miniRecord = false,
  isOpen,
  setOpen
}: ChangeHeaderProps) => {
  const { t } = useTranslation('changeHistory');

  // Identify the type of change record
  const changeRecordType = identifyChangeType(changeRecord);

  const DateSpan = miniRecord ? <span className="text-base" /> : <span />;

  // New plan audit
  if (changeRecordType === 'newPlan') {
    return (
      <Trans
        i18nKey={getHeaderText(changeRecord)}
        shouldUnescape
        values={{
          plan_name: t('thisModelPlan'),
          date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
          time: formatTime(changeRecord.date)
        }}
        components={{
          datetime: DateSpan,
          // data-testid is used for cypress testing/sorting
          planName: <span data-testid="new-plan" />
        }}
      />
    );
  }

  // Model plan status audits
  if (changeRecordType === 'statusUpdate') {
    return (
      <Trans
        i18nKey={getHeaderText(changeRecord)}
        shouldUnescape
        values={{
          status: changeRecord.translatedFields.find(
            field => field.fieldName === 'status'
          )?.newTranslated,
          date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
          time: formatTime(changeRecord.date)
        }}
        components={{
          datetime: <span />
        }}
      />
    );
  }

  // Task list status audits
  if (changeRecordType === 'taskListStatusUpdate') {
    const status = changeRecord.translatedFields.find(
      field => field.fieldName === 'status'
    )?.newTranslated;

    return (
      <Trans
        i18nKey={getHeaderText(changeRecord)}
        shouldUnescape
        values={{
          section: t(`sections.${changeRecord.tableName}`),
          status,
          date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
          time: formatTime(changeRecord.date)
        }}
        components={{
          datetime: DateSpan
        }}
      />
    );
  }

  // Team audits
  if (changeRecordType === 'teamUpdate') {
    const teamChange = (teamType: string | undefined) =>
      teamType === 'REMOVED' ? 'oldTranslated' : 'newTranslated';

    const teamChangeType = changeRecord.translatedFields.find(
      field => field.fieldName === 'team_roles'
    )?.changeType;

    let collaborator =
      changeRecord?.metaData && isGenericWithMetaData(changeRecord?.metaData)
        ? changeRecord?.metaData.relationContent
        : '';

    if (collaborator === changeRecord.actorName) {
      collaborator = t('self');
    }

    const role = changeRecord.translatedFields.find(
      field => field.fieldName === 'team_roles'
    )?.[teamChange(teamChangeType)];

    const formattedRoles = (inputString: string) => {
      return inputString
        .replace(/{|}|\\|"|'/g, '')
        .split(',')
        .join(', ');
    };

    return (
      <Trans
        i18nKey={getHeaderText(changeRecord)}
        shouldUnescape
        values={{
          action: getActionText(changeRecord),
          collaborator,
          role: !!role && `${formattedRoles(role)}`,
          date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
          time: formatTime(changeRecord.date)
        }}
        components={{
          datetime: DateSpan
        }}
      />
    );
  }

  // Document add/upload audits
  if (changeRecordType === 'documentUpdate') {
    return (
      <Trans
        i18nKey={getHeaderText(changeRecord)}
        shouldUnescape
        values={{
          isLink: documentType(changeRecord) ? ' link' : '',
          action: getActionText(changeRecord),
          documentName: documentName(changeRecord),
          toFrom: changeRecord.action === 'INSERT' ? 'to' : 'from',
          date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
          time: formatTime(changeRecord.date)
        }}
        components={{
          datetime: DateSpan
        }}
      />
    );
  }

  // CR and TDL audits
  if (changeRecordType === 'cRUpdate' || changeRecordType === 'tDLUpdate') {
    const crTdlName =
      changeRecord?.metaData && isGenericWithMetaData(changeRecord?.metaData)
        ? changeRecord?.metaData.relationContent
        : '';

    return (
      <Trans
        i18nKey={getHeaderText(changeRecord)}
        shouldUnescape
        values={{
          action: getActionText(changeRecord),
          crTdlName,
          toFrom: t(`toFromIn.${changeRecord.action}`),
          date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
          time: formatTime(changeRecord.date)
        }}
        components={{
          datetime: DateSpan
        }}
      />
    );
  }

  // Discussion audits
  if (changeRecordType === 'discussionUpdate') {
    const metaDiscussion =
      changeRecord?.metaData &&
      isDiscussionReplyWithMetaData(changeRecord?.metaData)
        ? changeRecord?.metaData.discussionContent
        : '';

    const content = changeRecord.translatedFields.find(
      field => field.fieldName === 'content'
    )?.newTranslated;

    const replyCount =
      changeRecord?.metaData &&
      isDiscussionReplyWithMetaData(changeRecord?.metaData)
        ? changeRecord?.metaData.numberOfReplies - 1
        : 0;

    return (
      <>
        <Trans
          i18nKey={getHeaderText(changeRecord)}
          shouldUnescape
          values={{
            date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
            time: formatTime(changeRecord.date)
          }}
          components={{
            datetime: DateSpan
          }}
        />
        <ul
          className={classNames(
            {
              'change-record__discussion-expanded margin-bottom-2': isOpen,
              'padding-left-4': !isOpen
            },
            'margin-y-1'
          )}
        >
          <li>
            <MentionTextArea
              className={classNames('text-base-darkest margin-bottom-0')}
              id={`mention-${changeRecord.id}`}
              editable={false}
              initialContent={
                changeRecord.tableName === TableName.DISCUSSION_REPLY
                  ? metaDiscussion
                  : content
              }
            />
          </li>
        </ul>

        {changeRecord.tableName === TableName.DISCUSSION_REPLY && (
          <CollapsableLink
            id={changeRecord.id}
            label={t('showDetails')}
            closeLabel={t('hideDetails')}
            labelPosition="bottom"
            setParentOpen={setOpen}
            styleLeftBar={false}
          >
            <div className="margin-bottom-neg-1 padding-left-3 change-record__answer margin-top-neg-2">
              {replyCount > 0 && (
                <div className="padding-bottom-1 text-italic">
                  {t('replyCount', {
                    count: replyCount
                  })}
                </div>
              )}
              <MentionTextArea
                className="text-base-darkest"
                id={`mention-${changeRecord.id}`}
                editable={false}
                initialContent={content}
              />
            </div>
          </CollapsableLink>
        )}
      </>
    );
  }

  // Standard update audits
  if (
    changeRecordType === 'standardUpdate' ||
    changeRecordType === 'operationalNeedUpdate'
  ) {
    return (
      <Trans
        i18nKey={getHeaderText(changeRecord)}
        shouldUnescape
        count={changeRecord.translatedFields.length}
        values={{
          count: changeRecord.translatedFields.length,
          section: t(`sections.${changeRecord.tableName}`),
          date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
          time: formatTime(changeRecord.date)
        }}
        components={{
          datetime: DateSpan
        }}
      />
    );
  }

  return <></>;
};

// Render a single change record, showing the field name, the change type, and the old and new values
const SingleChange = ({ change, changeType, tableName }: SingleChangeProps) => {
  const { t } = useTranslation('changeHistory');

  // If the field name is in the hidden fields list, do not render the change record
  if (hiddenFields.includes(change.fieldName)) {
    return <></>;
  }

  return (
    <div className="margin-bottom-2" key={change.id}>
      <div className="display-flex">
        <span className="text-bold margin-right-05">
          {/* If change is not a note */}
          {change.questionType !== TranslationQuestionType.NOTE &&
            change.fieldNameTranslated}
          {/* If the change is note type and pertains to multiple questions */}
          {change.referenceLabel &&
          change.questionType === TranslationQuestionType.NOTE ? (
            <span className="text-bold">
              {t('noteFor')}
              <span className="text-italic">{change.referenceLabel}</span>
            </span>
          ) : (
            <span />
          )}{' '}
          {/* Post text action - updated, created, removed, etc */}
          <span className="text-normal">
            {getNestedActionText(change, changeType, tableName)}
          </span>
        </span>
      </div>

      <div className="change-record__answer margin-y-1">
        {/* Renders the new value of a change record */}
        <RenderChangeValue change={change} valueType="newTranslated" />

        {/* Renders the old value of a change record */}
        {change.old && (
          <>
            {changeType !== DatabaseOperation.DELETE && (
              <div
                className={classNames(
                  'text-bold padding-bottom-1 padding-top-105',
                  {
                    'padding-top-0': !change.newTranslated
                  }
                )}
              >
                {change.questionType === TranslationQuestionType.NOTE
                  ? t('previousNote')
                  : t('previousAnswer')}
              </div>
            )}

            <RenderChangeValue
              change={change}
              valueType="oldTranslated"
              previous={!!change.old}
            />
          </>
        )}

        {/* Render addtional information of the new answers have questions that are no longer applicable */}
        {!!change.notApplicableQuestions?.length && (
          <>
            <div className="text-bold padding-y-105">{t('notApplicable')}</div>
            <RenderChangeValue
              valueType="notApplicableQuestions"
              change={change}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Render a single value, either as a string or as a list of strings
export const RenderChangeValue = ({
  change,
  valueType,
  previous = false
}: {
  change: ChangeRecordType['translatedFields'][0];
  valueType: 'oldTranslated' | 'newTranslated' | 'notApplicableQuestions';
  previous?: boolean;
}) => {
  const { t } = useTranslation('changeHistory');

  const value = change[valueType];

  // Contains the label and parent question if the change record is a follow-up/OTHER type
  const parentQuestion =
    change.referenceLabel &&
    change.questionType === TranslationQuestionType.OTHER ? (
      <div className="text-italic padding-bottom-1">
        ({t('followUp')}
        {change.referenceLabel})
      </div>
    ) : null;

  // Replaces curly braces with square brackets and attempts to parse the value as JSON
  const parsedValue = parseArray(value);

  // If the data type is an array, render the array as a list and parent question
  if (Array.isArray(parsedValue)) {
    return (
      <>
        {parentQuestion}
        <ul className="padding-left-3 margin-y-0">
          {parsedValue.map(val => (
            <li key={val}>{val}</li>
          ))}
        </ul>
      </>
    );
  }

  // If the data type is a date, format the date and parent question
  if (
    change.dataType === TranslationDataType.DATE &&
    typeof value === 'string'
  ) {
    return (
      <>
        {parentQuestion}
        <span>
          {datesWithNoDay.includes(change.fieldName)
            ? formatDateUtc(value.replace(' ', 'T'), 'MMMM yyyy')
            : formatDateUtc(value.replace(' ', 'T'), 'MM/dd/yyyy')}
        </span>
      </>
    );
  }

  return (
    <>
      {!previous && parentQuestion}
      <span data-testid="shown-value">{value}</span>
    </>
  );
};

// Renders the questions changes before collapse link is clicked, as well as a note or follow-up question is present
export const ChangedQuestion = ({
  change,
  changeType,
  tableName
}: SingleChangeProps) => {
  const { t } = useTranslation('changeHistory');

  // If the change contains a reference label, render the field name with the reference label
  if (change.referenceLabel) {
    // Type OTHER
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
    // Type NOTE
    if (change.questionType === TranslationQuestionType.NOTE) {
      return (
        <span>
          {t('noteFor')}
          <span className="text-italic">{change.referenceLabel}</span>
        </span>
      );
    }
  }

  // Normal translated field
  return (
    <>
      {change.fieldNameTranslated}{' '}
      {/* Post text action - updated, created, removed, etc */}
      {tableName === TableName.OPERATIONAL_NEED && (
        <span className="text-normal">
          {getNestedActionText(change, changeType, tableName)}
        </span>
      )}
    </>
  );
};

// Render a single change record, showing the actor, the date, and the fields that were changed
const ChangeRecord = ({ changeRecord, index }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  const [isOpen, setOpen] = useState<boolean>(false);

  // Identify the type of change record
  const changeRecordType = identifyChangeType(changeRecord);

  // Change record types that generate table insertions into the db.  These types should be expanded to show more data
  const uploadAudit: boolean =
    changeRecordType === 'cRUpdate' ||
    changeRecordType === 'tDLUpdate' ||
    changeRecordType === 'documentUpdate' ||
    changeRecordType === 'operationalNeedUpdate';

  // Determine if the change record should be expanded to show more data
  const showMoreData: boolean =
    uploadAudit || changeRecordType === 'standardUpdate';

  // Determines if the change record should show a list of translated fields before expanding
  const renderList: boolean =
    changeRecordType === 'standardUpdate' ||
    changeRecordType === 'operationalNeedUpdate' ||
    changeRecordType === 'operationalNeedCreate';

  return (
    <Card className="change-record">
      <div
        className={classNames('display-flex flex-align-center', {
          'padding-0': !showMoreData
        })}
      >
        <AvatarCircle
          user={changeRecord.actorName}
          className="margin-right-1 flex-align-self-start"
        />
        <span
          className={classNames(
            {
              'padding-bottom-1': uploadAudit && !isOpen
            },
            'padding-top-05'
          )}
        >
          <span className="text-bold">{changeRecord.actorName} </span>

          <ChangeHeader
            changeRecord={changeRecord}
            isOpen={isOpen}
            setOpen={setOpen}
          />
        </span>
      </div>

      {!isOpen && renderList && (
        <ul className="margin-top-05 margin-bottom-1 margin-left-4">
          {changeRecord.translatedFields.map(change => (
            <li key={change.id}>
              <ChangedQuestion
                change={change}
                changeType={changeRecord.action}
                tableName={changeRecord.tableName as TranslationTables}
              />
            </li>
          ))}
        </ul>
      )}

      {showMoreData && (
        <CollapsableLink
          className="margin-left-5"
          id={`change-record-${index}`}
          label={t('showDetails')}
          closeLabel={t('hideDetails')}
          labelPosition="bottom"
          setParentOpen={setOpen}
          styleLeftBar={false}
        >
          <div className="margin-bottom-neg-1">
            {changeRecord.translatedFields.map(change => (
              <SingleChange
                change={change}
                key={change.id}
                changeType={changeRecord.action}
                tableName={changeRecord.tableName as TranslationTables}
              />
            ))}
          </div>
        </CollapsableLink>
      )}
    </Card>
  );
};

export default ChangeRecord;
