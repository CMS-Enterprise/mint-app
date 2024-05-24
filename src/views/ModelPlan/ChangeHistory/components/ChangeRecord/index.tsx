import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { table } from 'console';
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
  parseArray,
  TranslationTables
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
  tableName: TranslationTables;
};

// Render a single change record, showing the field name, the change type, and the old and new values
const SingleChange = ({ change, changeType, tableName }: SingleChangeProps) => {
  const { t } = useTranslation('changeHistory');

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
          {(() => {
            // If the change is an insert, render created text rather than answered/updated, etc.
            if (tableName === 'operational_need' && changeType === 'INSERT') {
              return (
                <span className="text-normal">{t(`changeType.CREATED`)}</span>
              );
            }
            // Render the change type - answered, removed, updated
            if (changeType !== DatabaseOperation.DELETE) {
              return (
                <span className="text-normal">
                  {t(`changeType.${change.changeType}`)}
                </span>
              );
            }
            return <span />;
          })()}
        </span>
      </div>

      <div className="change-record__answer margin-y-1">
        {/* Renders the new value of a change record */}
        <RenderValue
          value={change.newTranslated}
          dataType={change.dataType}
          referenceLabel={change.referenceLabel}
          questionType={change.questionType}
        />

        {/* Renders the old value of a change record */}
        {change.old && (
          <>
            {changeType !== DatabaseOperation.DELETE && (
              <div className={classNames('text-bold padding-y-105')}>
                {change.questionType === TranslationQuestionType.NOTE
                  ? t('previousNote')
                  : t('previousAnswer')}
              </div>
            )}

            <RenderValue
              value={change.oldTranslated}
              dataType={change.dataType}
              referenceLabel={change.referenceLabel}
              questionType={change.questionType}
              previous={!!change.old}
            />
          </>
        )}

        {/* Render addtional information of the new answers have questions that are no longer applicable */}
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

  // Replaces curly braces with square brackets and attempts to parse the value as JSON
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

// Renders the questions changes before collapse link is clicked, as well as a note or follow-up question is present
const ChangedQuestion = ({
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
  return <>{change.fieldNameTranslated}</>;
};

// Render a single change record, showing the actor, the date, and the fields that were changed
const ChangeRecord = ({ changeRecord }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  const [isOpen, setOpen] = useState<boolean>(false);

  // Identify the type of change record
  const changeRecordType = identifyChangeType(changeRecord);

  // Change record types that generate table insertions into the db.  These types should be expanded to show more data
  const uploadAudit: boolean =
    changeRecordType === 'CR update' ||
    changeRecordType === 'TDL update' ||
    changeRecordType === 'Subtask update' ||
    changeRecordType === 'Operational solution create' ||
    changeRecordType === 'Operational solution update' ||
    changeRecordType === 'Operational need update' ||
    changeRecordType === 'Document update';

  // Determine if the change record should be expanded to show more data
  const showMoreData: boolean =
    uploadAudit || changeRecordType === 'Standard update';

  // Determines if the change record should show a list of translated fields before expanding
  const renderList: boolean =
    changeRecordType === 'Standard update' ||
    changeRecordType === 'Operational solution create';

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

          {/* New Plan audit */}
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

          {/* Task list and status audits */}
          {(changeRecordType === 'Task list status update' ||
            changeRecordType === 'Status update') && (
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

          {/* Team audits */}
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

          {/* Document audits */}
          {changeRecordType === 'Document update' &&
            (() => {
              const documentType =
                changeRecord.translatedFields.find(
                  field => field.fieldName === 'is_link'
                )?.newTranslated === 'true' ||
                changeRecord.translatedFields.find(
                  field => field.fieldName === 'is_link'
                )?.oldTranslated === 'true'
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

          {/* CR and TDL audits */}
          {(changeRecordType === 'CR update' ||
            changeRecordType === 'TDL update') &&
            (() => {
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

          {/* Subtask audits */}
          {changeRecordType === 'Subtask update' &&
            (() => {
              const subtaskChange = (actionType: DatabaseOperation) =>
                actionType === 'DELETE' ? 'oldTranslated' : 'newTranslated';

              const subtaskName = changeRecord.translatedFields.find(
                field => field.fieldName === 'name'
              )?.[subtaskChange(changeRecord.action)];

              return (
                <Trans
                  i18nKey="changeHistory:subtaskUpdate"
                  values={{
                    action: t(`auditUpdateTye.${changeRecord.action}`),
                    subtaskName,
                    solutionName: 'Temp Solution', // TODO: Replace with actual solution name
                    date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                    time: formatTime(changeRecord.date)
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              );
            })()}

          {/* Document solution link audits */}
          {changeRecordType === 'Document solution link update' &&
            (() => {
              return (
                <Trans
                  i18nKey="changeHistory:documentSolutionLinkUpdate"
                  values={{
                    action: t(`documentLinkType.${changeRecord.action}`),
                    documentName: 'Temp document', // TODO: replace with actual document name
                    solutionName: 'Temp solution', // TODO: replace with actual solution name
                    date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                    time: formatTime(changeRecord.date)
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              );
            })()}

          {/* Operational solution create audits */}
          {changeRecordType === 'Operational solution create' &&
            (() => {
              return (
                <Trans
                  i18nKey="changeHistory:solutionCreate"
                  count={changeRecord.translatedFields.length}
                  values={{
                    count: changeRecord.translatedFields.length,
                    solutionName: 'Temp solution', // TODO: replace with actual solution name
                    needName: 'Temp need', // TODO: replace with actual need name
                    date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                    time: formatTime(changeRecord.date)
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              );
            })()}

          {/* Operations soltutiin update audits */}
          {changeRecordType === 'Operational solution update' &&
            (() => {
              return (
                <Trans
                  i18nKey="changeHistory:solutionUpdate"
                  values={{
                    action: t(`auditUpdateTye.${changeRecord.action}`),
                    solutionName: 'Temp Solution', // TODO: replace with actual solution name
                    needName: 'Temp need', // TODO: replace with actual need name
                    date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                    time: formatTime(changeRecord.date)
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              );
            })()}

          {/* Operational need update audits */}
          {changeRecordType === 'Operational need update' &&
            (() => {
              return (
                <Trans
                  i18nKey="changeHistory:needUpdate"
                  values={{
                    action: t(`auditUpdateTye.${changeRecord.action}`),
                    date: formatDateUtc(changeRecord.date, 'MMMM d, yyyy'),
                    time: formatTime(changeRecord.date)
                  }}
                  components={{
                    datetime: <span />
                  }}
                />
              );
            })()}

          {/* Discussion audits */}
          {changeRecordType === 'Discussion update' &&
            (() => {
              const metaDiscussion =
                changeRecord?.metaData &&
                isDiscussionReplyWithMetaData(changeRecord?.metaData)
                  ? changeRecord?.metaData.discussionContent
                  : '';

              const content = changeRecord.translatedFields.find(
                field => field.fieldName === 'content'
              )?.newTranslated;

              return (
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
                        'change-record__discussion-expanded margin-bottom-2': isOpen,
                        'padding-left-4': !isOpen
                      },
                      'margin-y-1'
                    )}
                  >
                    <li>
                      <MentionTextArea
                        className={classNames(
                          'text-base-darkest margin-bottom-0'
                        )}
                        id={`mention-${changeRecord.id}`}
                        editable={false}
                        initialContent={
                          changeRecord.tableName === 'discussion_reply'
                            ? metaDiscussion
                            : content
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
                      <div className="margin-bottom-neg-1 padding-left-3 change-record__answer margin-top-neg-2">
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
            })()}

          {/* Standard update audits */}
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
                tableName={changeRecord.tableName as TranslationTables}
              />
            </li>
          ))}
        </ul>
      )}

      {showMoreData && (
        <CollapsableLink
          className="margin-left-5"
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
