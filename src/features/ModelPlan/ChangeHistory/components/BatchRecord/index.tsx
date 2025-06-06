import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  AuditFieldChangeType,
  DatabaseOperation,
  GetChangeHistoryQuery,
  TableName,
  TranslationDataType
} from 'gql/generated/graphql';

import { AvatarCircle } from 'components/Avatar';
import CollapsableLink from 'components/CollapsableLink';
import properlyCapitalizeInitiator from 'components/CRAndTDLSidePanel/_utils';
import { formatDateUtc, formatTime } from 'utils/date';

import {
  condenseLinkingTableChanges,
  connectedFields,
  documentName,
  documentType,
  documentUpdateType,
  getOperationalMetadata,
  getSolutionName,
  getSolutionOperationStatus,
  getTranslatedFieldValue,
  hiddenFields,
  isGenericWithMetaData,
  isLinkingTable,
  isMTOCategoryWithMetaData,
  isOperationalSolutionWithMetaData,
  isSolutionDocumentLinkWithMetaData,
  linkingTableQuestions,
  mtoTables,
  solutionDeleteFields,
  solutionDocumentLinkFields,
  solutionInsertFields
} from '../../util';
import { RenderChangeValue } from '../ChangeRecord';

import '../ChangeRecord/index.scss';

export type ChangeRecordType = NonNullable<
  GetChangeHistoryQuery['translatedAuditCollection']
>[0];

type ChangeRecordProps = {
  changeRecords: ChangeRecordType[];
  index: number;
};

type BatchChangeProps = {
  change: ChangeRecordType;
  connected: boolean;
};

// Render a single change record, showing the field name, the change type, and the old and new values
const BatchChanges = ({ change, connected }: BatchChangeProps) => {
  const { t } = useTranslation('changeHistory');

  let fieldsToMap: ChangeRecordType['translatedFields'][0][] =
    change.translatedFields;

  // Remove hidden fields from the fields to map
  fieldsToMap = fieldsToMap.filter(
    field =>
      !hiddenFields.find(
        f => f.fields.includes(field.fieldName) && f.table === change.tableName
      )
  );

  // If the change is connected to another table, only show the fields that are connected
  if (connected) {
    const connectedConfig = connectedFields.find(
      connection => connection.table === change.tableName
    );

    if (connectedConfig) {
      fieldsToMap = change.translatedFields.filter(field =>
        connectedConfig.fields.includes(field.fieldName)
      );
    }
  }

  // Get the action change, if it's a solution operation - check 'needed' value to get the correct action
  const databaseAction =
    change.tableName === TableName.OPERATIONAL_SOLUTION
      ? getSolutionOperationStatus(change)
      : change.action;

  return (
    <div
      className={classNames('margin-bottom-2 margin-top-neg-05')}
      key={change.id}
    >
      <div className="margin-right-05">
        {/* Existing model link header */}
        {change.tableName === TableName.EXISTING_MODEL_LINK &&
          (() => {
            return (
              <span className="text-bold">
                {change.metaData?.tableName}{' '}
                <span className="text-normal">
                  {t('auditUpdateType.UPDATE')}
                </span>
              </span>
            );
          })()}

        {/* Documents header */}
        {change.tableName === TableName.PLAN_DOCUMENT &&
          (() => {
            // Remove the 'file_name' field from the fields to map - already in header, doesn't need to be in changes
            fieldsToMap = fieldsToMap.filter(
              field => field.fieldName !== 'file_name'
            );

            return (
              <Trans
                i18nKey="changeHistory:documentBatchUpdate"
                shouldUnescape
                values={{
                  isLink: documentType(change) ? ' link' : '',
                  action: t(`documentChangeType.${documentUpdateType(change)}`),
                  documentName: documentName(change) || 'Temp document',
                  toFrom: t(`toFrom.${databaseAction}`),
                  date: formatDateUtc(change.date, 'MMMM d, yyyy'),
                  time: formatTime(change.date)
                }}
                components={{
                  datetime: <span />,
                  bold: <span className="text-bold" />
                }}
              />
            );
          })()}

        {/* Document solution link header */}
        {change.tableName === TableName.PLAN_DOCUMENT_SOLUTION_LINK &&
          (() => {
            if (!connected) {
              fieldsToMap =
                change.metaData &&
                isSolutionDocumentLinkWithMetaData(change.metaData)
                  ? solutionDocumentLinkFields(change.metaData)
                  : fieldsToMap;
            }

            return (
              <div className="text-bold">
                <Trans
                  i18nKey="changeHistory:documentSolutionLinkUpdate"
                  shouldUnescape
                  values={{
                    action: t(`documentLinkType.${databaseAction}`),
                    toFrom: t(`toFrom.${databaseAction}`),
                    solutionName: getSolutionName(change),
                    date: formatDateUtc(change.date, 'MMMM d, yyyy'),
                    time: formatTime(change.date)
                  }}
                  components={{
                    normal: <span className="text-normal" />
                  }}
                />
              </div>
            );
          })()}

        {/* Operational solution header */}
        {change.tableName === TableName.OPERATIONAL_SOLUTION &&
          (() => {
            const solutionName = getOperationalMetadata(
              'solution',
              change?.metaData,
              'solutionName'
            );

            const needName = getOperationalMetadata(
              'solution',
              change?.metaData,
              'needName'
            );

            // Remove the 'needed' field from the fields to map
            fieldsToMap = fieldsToMap.filter(
              field => field.fieldName !== 'needed'
            );

            // Added metadata fields as translated fields when the database method is DELETE
            if (
              change.metaData &&
              isOperationalSolutionWithMetaData(change.metaData)
            ) {
              // If solution needed/INSERT, and the status field is unchanged/not present, add it/metadata status to the translated fields
              if (
                databaseAction === DatabaseOperation.INSERT &&
                change.translatedFields.find(
                  field => field.fieldName === 'status'
                ) === undefined
              ) {
                fieldsToMap = solutionInsertFields(change.metaData);
              }

              // If solution not needed/DELETE, add all the solution metadata fields to the translated fields
              if (databaseAction === DatabaseOperation.DELETE) {
                fieldsToMap = solutionDeleteFields(change.metaData);
              }
            }

            return (
              <div className="text-bold">
                {needName}{' '}
                <span className="text-normal">
                  {t('solution')} {t(`auditUpdateType.${databaseAction}`)}:
                </span>
                {solutionName}
              </div>
            );
          })()}

        {/* Subtask header */}
        {change.tableName === TableName.OPERATIONAL_SOLUTION_SUBTASK &&
          (() => {
            const solutionName = getOperationalMetadata(
              'subtask',
              change?.metaData,
              'solutionName'
            );

            const needName = getOperationalMetadata(
              'subtask',
              change?.metaData,
              'needName'
            );

            const subtaskName = getOperationalMetadata(
              'subtask',
              change?.metaData,
              'subtaskName'
            );

            // Add the subtask name to the fields to map if it's not already there
            if (!fieldsToMap.find(field => field.fieldName === 'name')) {
              fieldsToMap.unshift({
                __typename: 'TranslatedAuditField',
                changeType: AuditFieldChangeType.UPDATED,
                dataType: TranslationDataType.STRING,
                fieldName: 'name',
                fieldNameTranslated: 'Subtask',
                id: '1',
                new: null,
                newTranslated: subtaskName,
                notApplicableQuestions: null,
                old: null,
                oldTranslated: null,
                questionType: null,
                referenceLabel: null
              });
            }

            return (
              <Trans
                i18nKey="changeHistory:subtaskUpdate"
                shouldUnescape
                values={{
                  action: t(`auditUpdateType.${change.action}`),
                  forFrom: t(`forFrom.${change.action}`),
                  needName,
                  solutionName
                }}
                components={{
                  datetime: <span />,
                  bold: <span className="text-bold" />
                }}
              />
            );
          })()}

        {/* MTO category header */}
        {change.tableName === TableName.MTO_CATEGORY &&
          (() => {
            fieldsToMap = fieldsToMap.filter(
              field =>
                field.fieldName !== 'name' ||
                change.action !== DatabaseOperation.DELETE
            );

            const categoryName = getTranslatedFieldValue(change, 'name');

            const isSubCategory =
              change.metaData &&
              isMTOCategoryWithMetaData(change.metaData) &&
              change.metaData?.isSubCategory;

            const subCategoryName =
              change.metaData &&
              isMTOCategoryWithMetaData(change.metaData) &&
              change.metaData?.categoryName;

            return (
              <span className="text-bold">
                {isSubCategory ? t('subCategory') : t('category')}{' '}
                <span className="text-normal">
                  {t(`auditUpdateType.${change.action}`)}
                  {': '}
                </span>
                {categoryName || subCategoryName || t('dataNotAvailable')}
              </span>
            );
          })()}

        {/* MTO milestone header */}
        {change.tableName === TableName.MTO_MILESTONE &&
          (() => {
            const milestoneKey = getTranslatedFieldValue(
              change,
              'mto_common_milestone_key'
            );

            const milestoneName = getTranslatedFieldValue(change, 'name');

            let milestoneValue = milestoneName || milestoneKey;

            if (
              change.action === DatabaseOperation.UPDATE &&
              change.metaData &&
              isGenericWithMetaData(change.metaData)
            ) {
              milestoneValue = change.metaData.relationContent;
            }

            return (
              <span className="text-bold">
                {t('milestone')}{' '}
                <span className="text-normal">
                  {t(`auditUpdateType.${change.action}`)}:
                </span>{' '}
                {milestoneValue || t('dataNotAvailable')}
              </span>
            );
          })()}

        {/* MTO solution header */}
        {change.tableName === TableName.MTO_SOLUTION &&
          (() => {
            const solutionKey = getTranslatedFieldValue(
              change,
              'mto_common_solution_key'
            );

            const solutionName = getTranslatedFieldValue(change, 'name');

            let solutionValue = solutionName || solutionKey;

            if (
              change.action === DatabaseOperation.UPDATE &&
              change.metaData &&
              isGenericWithMetaData(change.metaData)
            ) {
              solutionValue = change.metaData.relationContent;
            }

            return (
              <span className="text-bold">
                {properlyCapitalizeInitiator(t('solution'))}{' '}
                <span className="text-normal">
                  {t(`auditUpdateType.${change.action}`)}:
                </span>{' '}
                {solutionValue || t('dataNotAvailable')}
              </span>
            );
          })()}

        {/* MTO solution link  header */}
        {change.tableName === TableName.MTO_MILESTONE_SOLUTION_LINK &&
          (() => {
            return (
              <Trans
                shouldUnescape
                i18nKey="changeHistory:milestoneAndSolution"
                values={{
                  action: t(`solutionLinkType.${change.action}`)
                }}
                components={{
                  bold: <span className="text-bold" />
                }}
              />
            );
          })()}
      </div>

      {/* Render the fields that were changed */}
      <div className="change-record__answer margin-y-1">
        {(() => {
          if (
            change.action === DatabaseOperation.DELETE &&
            change.tableName === TableName.MTO_CATEGORY
          ) {
            return <div className="margin-top-neg-1" />;
          }
          // If the table is a linking table, show the fields in a list
          if (isLinkingTable(change.tableName)) {
            return (
              <ul className="padding-left-3 margin-top-0">
                {fieldsToMap.map(field => (
                  <li>
                    {t(`linkUpdateType.${field.newTranslated}`)}:{' '}
                    {field.fieldNameTranslated}
                  </li>
                ))}
              </ul>
            );
          }

          return fieldsToMap.map(field => (
            <div key={field.id}>
              {field.newTranslated && (
                <span>{field.fieldNameTranslated}: </span>
              )}

              <RenderChangeValue change={field} valueType="newTranslated" />
            </div>
          ));
        })()}

        {/* Render previous details/values */}
        {(() => {
          const renderPreviousDetails =
            databaseAction !== DatabaseOperation.DELETE &&
            !!fieldsToMap.find(field => field.oldTranslated);
          // If the table is a linking table, don't show previous details

          const hideCategoryDetails =
            change.tableName === TableName.MTO_CATEGORY &&
            change.action === DatabaseOperation.DELETE &&
            fieldsToMap.length === 1 &&
            fieldsToMap[0].fieldName === 'name';

          if (
            isLinkingTable(change.tableName) ||
            change.action === DatabaseOperation.INSERT ||
            !renderPreviousDetails ||
            hideCategoryDetails
          )
            return <></>;

          return (
            <>
              {/* If the database action is not DELETE and there are fields with old values, show the previous details header */}
              <div className="text-bold padding-top-105 padding-bottom-1">
                {t('previousDetails')}
              </div>

              {fieldsToMap.map(field => {
                if (!field.oldTranslated) return <div key={field.id} />;

                return (
                  <div key={field.id}>
                    {field.oldTranslated && (
                      <>
                        <span>{field.fieldNameTranslated}: </span>
                        <RenderChangeValue
                          change={field}
                          valueType="oldTranslated"
                          previous={!!field.oldTranslated}
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

// Render a single change record, showing the actor, the date, and the fields that were changed
const BatchRecord = ({ changeRecords, index }: ChangeRecordProps) => {
  const { t } = useTranslation('changeHistory');

  const [isOpen, setOpen] = useState<boolean>(false);

  // Use solution document link as the table name if it's a batch of solution document links
  const isSolutionDocumentLinkBatch: boolean = !!changeRecords.find(change => {
    return change.tableName === TableName.PLAN_DOCUMENT_SOLUTION_LINK;
  });

  // Use the first table name in the batch as the table name, unless it's a batch of solution document links
  const tableName: TableName = isSolutionDocumentLinkBatch
    ? TableName.PLAN_DOCUMENT_SOLUTION_LINK
    : changeRecords[0].tableName;

  // If the table is a linking table, condense the changes to show only the relevant fields
  const batchRecords = isLinkingTable(tableName)
    ? condenseLinkingTableChanges(changeRecords)
    : changeRecords;

  const shouldShowCollapse = !changeRecords.find(
    change =>
      change.action === DatabaseOperation.DELETE &&
      change.tableName === TableName.MTO_CATEGORY &&
      change.translatedFields.length === 1
  );

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
            shouldUnescape
            count={changeRecords.length}
            values={{
              count: isLinkingTable(tableName)
                ? linkingTableQuestions(changeRecords).length
                : changeRecords.length,
              section: t(`sections.${tableName}`),
              date: formatDateUtc(changeRecords[0].date, 'MMMM d, yyyy'),
              time: formatTime(changeRecords[0].date),
              inOrTo: mtoTables.includes(tableName) ? t('to') : t('in')
            }}
            components={{
              datetime: <span />
            }}
          />
        </span>
      </div>

      {!isOpen && (
        <ul className="margin-top-1 margin-bottom-1 margin-left-4">
          {batchRecords.map(change => (
            <li key={change.id}>
              {/* Existing link audits */}
              {tableName === 'existing_model_link' &&
                (() => {
                  return <span>{change.metaData?.tableName}</span>;
                })()}

              {/* Document audits */}
              {change.tableName === 'plan_document' &&
                (() => {
                  return (
                    <Trans
                      i18nKey="changeHistory:documentBatchUpdate"
                      shouldUnescape
                      values={{
                        isLink: documentType(change) ? ' link' : '',
                        action: t(
                          `documentChangeType.${documentUpdateType(change)}`
                        ),
                        documentName: documentName(change) || 'Temp document',
                        toFrom: t(`toFrom.${change.action}`),
                        date: formatDateUtc(change.date, 'MMMM d, yyyy'),
                        time: formatTime(change.date)
                      }}
                      components={{
                        datetime: <span />,
                        bold: <></>
                      }}
                    />
                  );
                })()}

              {/* Document solution link audits */}
              {change.tableName === 'plan_document_solution_link' && (
                <Trans
                  i18nKey="changeHistory:documentSolutionLinkUpdate"
                  shouldUnescape
                  values={{
                    action: t(`documentLinkType.${change.action}`),
                    toFrom: t(`toFrom.${change.action}`),
                    solutionName: getSolutionName(change),
                    date: formatDateUtc(change.date, 'MMMM d, yyyy'),
                    time: formatTime(change.date)
                  }}
                  components={{
                    normal: <></>
                  }}
                />
              )}

              {/* Operational solution audits */}
              {change.tableName === TableName.OPERATIONAL_SOLUTION &&
                (() => {
                  const solutionName = getOperationalMetadata(
                    'solution',
                    change?.metaData,
                    'solutionName'
                  );

                  const needName = getOperationalMetadata(
                    'solution',
                    change?.metaData,
                    'needName'
                  );

                  return (
                    <Trans
                      i18nKey="changeHistory:solutionUpdate"
                      shouldUnescape
                      values={{
                        action: t(
                          `auditUpdateType.${getSolutionOperationStatus(
                            change
                          )}`
                        ),
                        needName,
                        solutionName
                      }}
                      components={{
                        datetime: <span />
                      }}
                    />
                  );
                })()}

              {/* Operational solution subtask audits */}
              {change.tableName === TableName.OPERATIONAL_SOLUTION_SUBTASK &&
                (() => {
                  const solutionName = getOperationalMetadata(
                    'subtask',
                    change?.metaData,
                    'solutionName'
                  );

                  const needName = getOperationalMetadata(
                    'subtask',
                    change?.metaData,
                    'needName'
                  );

                  return (
                    <Trans
                      shouldUnescape
                      i18nKey="changeHistory:subtaskUpdate"
                      values={{
                        action: t(`auditUpdateType.${change.action}`),
                        forFrom: t(`forFrom.${change.action}`),
                        needName,
                        solutionName
                      }}
                      components={{
                        datetime: <span />,
                        bold: <span className="text-normal" />
                      }}
                    />
                  );
                })()}

              {/* MTO category audits */}
              {change.tableName === TableName.MTO_CATEGORY &&
                (() => {
                  const categoryName = getTranslatedFieldValue(change, 'name');

                  const isSubCategory =
                    change.metaData &&
                    isMTOCategoryWithMetaData(change.metaData) &&
                    change.metaData?.isSubCategory;

                  const subCategoryName =
                    change.metaData &&
                    isMTOCategoryWithMetaData(change.metaData) &&
                    change.metaData?.categoryName;

                  return (
                    <Trans
                      shouldUnescape
                      i18nKey="changeHistory:mtoUpdate"
                      values={{
                        action: t(`auditUpdateType.${change.action}`),
                        mtoType: isSubCategory
                          ? t('subCategory')
                          : t('category'),
                        name:
                          categoryName ||
                          subCategoryName ||
                          t('dataNotAvailable')
                      }}
                    />
                  );
                })()}

              {/* MTO milestone audits */}
              {change.tableName === TableName.MTO_MILESTONE &&
                (() => {
                  const milestoneKey = getTranslatedFieldValue(
                    change,
                    'mto_common_milestone_key'
                  );

                  const milestoneName = getTranslatedFieldValue(change, 'name');

                  let milestoneValue = milestoneName || milestoneKey;

                  if (
                    change.action === DatabaseOperation.UPDATE &&
                    change.metaData &&
                    isGenericWithMetaData(change.metaData)
                  ) {
                    milestoneValue = change.metaData.relationContent;
                  }

                  return (
                    <Trans
                      shouldUnescape
                      i18nKey="changeHistory:mtoUpdate"
                      values={{
                        action: t(`auditUpdateType.${change.action}`),
                        mtoType: t('milestone'),
                        name: milestoneValue || t('dataNotAvailable')
                      }}
                    />
                  );
                })()}

              {/* MTO solution audits */}
              {change.tableName === TableName.MTO_SOLUTION &&
                (() => {
                  const solutionKey = getTranslatedFieldValue(
                    change,
                    'mto_common_solution_key'
                  );

                  const solutionName = getTranslatedFieldValue(change, 'name');

                  let solutionValue = solutionName || solutionKey;

                  if (
                    change.action === DatabaseOperation.UPDATE &&
                    change.metaData &&
                    isGenericWithMetaData(change.metaData)
                  ) {
                    solutionValue = change.metaData.relationContent;
                  }

                  return (
                    <Trans
                      shouldUnescape
                      i18nKey="changeHistory:mtoUpdate"
                      values={{
                        action: t(`auditUpdateType.${change.action}`),
                        mtoType: properlyCapitalizeInitiator(t('solution')),
                        name: solutionValue || t('dataNotAvailable')
                      }}
                    />
                  );
                })()}

              {/* MTO solution link audits */}
              {change.tableName === TableName.MTO_MILESTONE_SOLUTION_LINK &&
                (() => {
                  return (
                    <Trans
                      shouldUnescape
                      i18nKey="changeHistory:mtoLinkUpdate"
                      values={{
                        action: t(`solutionLinkType.${change.action}`)
                      }}
                    />
                  );
                })()}
            </li>
          ))}
        </ul>
      )}

      {shouldShowCollapse && (
        <CollapsableLink
          className="margin-left-5"
          id={`batch-record-${index}`}
          label={t('showDetails')}
          closeLabel={t('hideDetails')}
          labelPosition="bottom"
          setParentOpen={setOpen}
          styleLeftBar={false}
        >
          <div className="margin-bottom-neg-1">
            {batchRecords.map(change => (
              <BatchChanges
                change={change}
                connected={changeRecords.length > 1}
                key={change.id}
              />
            ))}
          </div>
        </CollapsableLink>
      )}
    </Card>
  );
};

export default BatchRecord;
