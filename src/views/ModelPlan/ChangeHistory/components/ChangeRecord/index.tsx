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
import MentionTextArea from 'components/shared/MentionTextArea';
import { formatDateUtc, formatTime } from 'utils/date';

import {
  identifyChangeType,
  isDiscussionReplyWithMetaData,
  isHiddenRecord,
  isInitialCreatedSection,
  parseArray
} from '../../util';

import './index.scss';

export type ChangeRecordType = NonNullable<
  GetChangeHistoryQuery['translatedAuditCollection']
>[0];

type ChangeRecordProps = {
  changeRecord: ChangeRecordType;
};

type SingleChangeProps = {
  change: ChangeRecordType['translatedFields'][0];
  changeType: DatabaseOperation;
};

// Render a single change record, showing the field name, the change type, and the old and new values
const SingleChange = ({ change, changeType }: SingleChangeProps) => {
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

        {changeType !== DatabaseOperation.DELETE &&
          t(`changeType.${change.changeType}`)}
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
            {changeType !== DatabaseOperation.DELETE && (
              <div className="text-bold padding-y-105">
                {t('previousAnswer')}
              </div>
            )}
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
      {parentQuestion}
      <span>{value}</span>
    </>
  );
};

// Renders the questions changes before collapse link is clicked, as well as a note or follow-up question is present
const ChangedQuestion = ({ change, changeType }: SingleChangeProps) => {
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

// Render a single change record, showing the actor, the date, and the fields that were changed
const ChangeRecord = ({ changeRecord }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  const [isOpen, setOpen] = useState<boolean>(false);

  const changeRecordType = identifyChangeType(changeRecord);

  const showMoreData: boolean =
    changeRecordType === 'Standard update' ||
    changeRecordType === 'CR update' ||
    changeRecordType === 'TDL update' ||
    changeRecordType === 'Document update';

  const renderList: boolean = changeRecordType === 'Standard update';

  if (
    isInitialCreatedSection(changeRecord, changeRecordType) ||
    isHiddenRecord(changeRecord) ||
    changeRecord.translatedFields.length === 0
  ) {
    return null;
  }

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
        <span className="padding-top-05">
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

          {changeRecordType === 'Task list status update' && (
            <Trans
              i18nKey="changeHistory:taskStatusUpdate"
              values={{
                section: t(`sections.${changeRecord.tableName}`),
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
          )}

          {changeRecordType === 'Team update' &&
            (() => {
              const teamChange = (teamType: string | undefined) =>
                teamType === 'REMOVED' ? 'oldTranslated' : 'newTranslated';

              const teamChangeType = changeRecord.translatedFields.find(
                field => field.fieldName === 'team_roles'
              )?.changeType;

              const collaborator = changeRecord.translatedFields.find(
                field => field.fieldName === 'user_id'
              )?.[teamChange(teamChangeType)];

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
                  i18nKey={`changeHistory:team${teamChangeType}`}
                  values={{
                    action: t(`teamChangeType.${teamChangeType}`),
                    collaborator,
                    role: !!role && `[${formattedRoles(role)}]`,
                    date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                    time: formatTime(changeRecord.date)
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              );
            })()}

          {changeRecordType === 'Document update' &&
            (() => {
              const documentType =
                changeRecord.translatedFields.find(
                  field => field.fieldName === 'is_link'
                )?.newTranslated === 'true'
                  ? ' link'
                  : '';

              const documentChange = (docType: string | undefined) =>
                docType === 'DELETE' ? 'oldTranslated' : 'newTranslated';

              const updateType = (change: ChangeRecordType) => {
                if (change.action === 'INSERT') {
                  if (documentType === ' link') {
                    return 'added';
                  }
                  return 'uploaded';
                }
                if (change.action === 'DELETE') {
                  return 'removed';
                }
                return '';
              };

              const documentName = changeRecord.translatedFields.find(
                field => field.fieldName === 'file_name'
              )?.[documentChange(changeRecord.action)];

              return (
                <Trans
                  i18nKey="changeHistory:documentUpdate"
                  values={{
                    isLink: documentType,
                    action: t(`documentChangeType.${updateType(changeRecord)}`),
                    documentName,
                    toFrom: changeRecord.action === 'INSERT' ? 'to' : 'from',
                    date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                    time: formatTime(changeRecord.date)
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              );
            })()}

          {(changeRecordType === 'CR update' ||
            changeRecordType === 'TDL update') &&
            (() => {
              const crTdlType =
                changeRecord.tableName === 'plan_cr' ? 'CRs' : 'TDLs';

              const crTdlChange = (actionType: DatabaseOperation) =>
                actionType === 'DELETE' ? 'oldTranslated' : 'newTranslated';

              const crTdlName = changeRecord.translatedFields.find(
                field => field.fieldName === 'id_number'
              )?.[crTdlChange(changeRecord.action)];

              return (
                <Trans
                  i18nKey="changeHistory:crTdlUpdate"
                  values={{
                    action: t(`auditUpdateTye.${changeRecord.action}`),
                    crTdlName,
                    crTdlType,
                    toFrom: t(`toFromIn.${changeRecord.action}`),
                    date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                    time: formatTime(changeRecord.date)
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              );
            })()}

          {changeRecordType === 'Discussion update' && (
            <>
              <Trans
                i18nKey={`changeHistory:${changeRecord.tableName}Answered`}
                values={{
                  date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                  time: formatTime(changeRecord.date)
                }}
                components={{
                  datetime: <span />
                }}
              />
              <ul
                className={classNames(
                  {
                    'change-record__discussion-expanded': isOpen,
                    'padding-left-4': !isOpen,
                    'margin-bottom-0':
                      changeRecord.tableName === 'plan_discussion'
                  },
                  'margin-top-1'
                )}
              >
                <li>
                  <MentionTextArea
                    className={classNames('text-base-darkest', {
                      'margin-bottom-0':
                        changeRecord.tableName === 'plan_discussion'
                    })}
                    id={`mention-${changeRecord.id}`}
                    editable={false}
                    initialContent={
                      changeRecord.translatedFields.find(
                        field => field.fieldName === 'content'
                      )?.newTranslated
                    }
                  />
                </li>
              </ul>

              {changeRecord.tableName === 'discussion_reply' && (
                <CollapsableLink
                  id={changeRecord.id}
                  label={t('showDetails')}
                  closeLabel={t('hideDetails')}
                  labelPosition="bottom"
                  setParentOpen={setOpen}
                  styleLeftBar={false}
                >
                  <div className="margin-bottom-neg-1 padding-left-4 change-record__answer margin-top-neg-2">
                    <MentionTextArea
                      className="text-base-darkest"
                      id={`mention-${changeRecord.id}`}
                      editable={false}
                      initialContent={
                        changeRecord?.metaData &&
                        isDiscussionReplyWithMetaData(changeRecord?.metaData)
                          ? changeRecord?.metaData.relationContent
                          : ''
                      }
                    />
                  </div>
                </CollapsableLink>
              )}
            </>
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

      {!isOpen && renderList && (
        <ul className="margin-top-05 margin-bottom-1 margin-left-4">
          {changeRecord.translatedFields.map(change => (
            <li key={change.id}>
              <ChangedQuestion
                change={change}
                changeType={changeRecord.action}
              />
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
              <SingleChange
                change={change}
                key={change.id}
                changeType={changeRecord.action}
              />
            ))}
          </div>
        </CollapsableLink>
      )}
    </Card>
  );
};

export default ChangeRecord;
