import {
  AuditFieldChangeType,
  DatabaseOperation,
  ExisitingModelLinkFieldType,
  GetChangeHistoryQuery,
  TableName,
  TranslatedAuditMetaBaseStruct,
  TranslatedAuditMetaData,
  TranslatedAuditMetaDiscussionReply,
  TranslatedAuditMetaDocumentSolutionLink,
  TranslatedAuditMetaGeneric,
  TranslatedAuditMetaOperationalSolution,
  TranslatedAuditMetaOperationalSolutionSubtask,
  TranslationDataType,
  TranslationQuestionType
} from 'gql/gen/graphql';
import i18next from 'i18next';

import { formatDateUtc, formatTime } from 'utils/date';

export type ChangeRecordType = NonNullable<
  GetChangeHistoryQuery['translatedAuditCollection']
>[0];

type HiddenFieldTypes = {
  table: TranslationTables;
  fields: string[];
};

// Identifies the type of change
export type ChangeType =
  | 'newPlan'
  | 'statusUpdate'
  | 'taskListStatusUpdate'
  | 'teamUpdate'
  | 'discussionUpdate'
  | 'documentUpdate'
  | 'cRUpdate'
  | 'tDLUpdate'
  | 'subtaskupdate'
  | 'documentSolutionLinkUpdate'
  | 'operationalSolutionCreate'
  | 'operationalSolutionUpdate'
  | 'operationalNeedCreate'
  | 'operationalNeedUpdate'
  | 'standardUpdate';

export type TranslationTables =
  | TableName.MODEL_PLAN
  | TableName.PLAN_BASICS
  | TableName.PLAN_GENERAL_CHARACTERISTICS
  | TableName.PLAN_PARTICIPANTS_AND_PROVIDERS
  | TableName.PLAN_BENEFICIARIES
  | TableName.PLAN_OPS_EVAL_AND_LEARNING
  | TableName.PLAN_PAYMENTS
  | TableName.PLAN_COLLABORATOR
  | TableName.PLAN_DISCUSSION
  | TableName.DISCUSSION_REPLY
  | TableName.PLAN_DOCUMENT
  | TableName.PLAN_CR
  | TableName.PLAN_TDL
  | TableName.OPERATIONAL_NEED
  | TableName.OPERATIONAL_SOLUTION
  | TableName.OPERATIONAL_SOLUTION_SUBTASK
  | TableName.PLAN_DOCUMENT_SOLUTION_LINK
  | TableName.EXISTING_MODEL_LINK;

export type TranslationTaskListTable =
  | TableName.PLAN_BASICS
  | TableName.PLAN_GENERAL_CHARACTERISTICS
  | TableName.PLAN_PARTICIPANTS_AND_PROVIDERS
  | TableName.PLAN_BENEFICIARIES
  | TableName.PLAN_OPS_EVAL_AND_LEARNING
  | TableName.PLAN_PAYMENTS;

export const isTranslationTaskListTable = (
  tableName: TableName
): tableName is TranslationTaskListTable => {
  return [
    TableName.PLAN_BASICS,
    TableName.PLAN_GENERAL_CHARACTERISTICS,
    TableName.PLAN_PARTICIPANTS_AND_PROVIDERS,
    TableName.PLAN_BENEFICIARIES,
    TableName.PLAN_OPS_EVAL_AND_LEARNING,
    TableName.PLAN_PAYMENTS
  ].includes(tableName);
};

// Type guard to check generic union type
export const isGenericWithMetaData = (
  data: TranslatedAuditMetaData
): data is TranslatedAuditMetaGeneric => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TranslatedAuditMetaGeneric';
};

// Type guard to check discussion or reply union type
export const isDiscussionReplyWithMetaData = (
  data: TranslatedAuditMetaData
): data is TranslatedAuditMetaDiscussionReply => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TranslatedAuditMetaDiscussionReply';
};

// Type guard to check solution union type
export const isOperationalSolutionWithMetaData = (
  data: TranslatedAuditMetaData
): data is TranslatedAuditMetaOperationalSolution => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TranslatedAuditMetaOperationalSolution';
};

// Type guard to check subtask union type
export const isSubtaskWithMetaData = (
  data: TranslatedAuditMetaData
): data is TranslatedAuditMetaOperationalSolutionSubtask => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TranslatedAuditMetaOperationalSolutionSubtask';
};

// Type guard to check solution document link union type
export const isSolutionDocumentLinkWithMetaData = (
  data: TranslatedAuditMetaData
): data is TranslatedAuditMetaDocumentSolutionLink => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TranslatedAuditMetaDocumentSolutionLink';
};

export const datesWithNoDay: string[] = ['date_implemented'];

// Fields that are not displayed in the change history
const unneededFields: HiddenFieldTypes[] = [
  {
    table: TableName.OPERATIONAL_NEED,
    fields: ['needed', 'need_type', 'model_plan_id']
  },
  {
    table: TableName.OPERATIONAL_SOLUTION,
    fields: ['operational_need_id', 'solution_type', 'is_other']
  },
  {
    table: TableName.PLAN_DOCUMENT,
    fields: [
      'model_plan_id',
      'is_link',
      'virus_scanned',
      'file_key',
      'file_size',
      'bucket',
      'file_type',
      'virus_clean'
    ]
  },
  {
    table: TableName.PLAN_CR,
    fields: ['model_plan_id']
  },
  {
    table: TableName.PLAN_TDL,
    fields: ['model_plan_id']
  }
];

export const hiddenFields: string[] = ['is_link'];

// Tables where similar audits are batched together
export const batchedTables: TableName[] = [
  TableName.OPERATIONAL_SOLUTION,
  TableName.OPERATIONAL_SOLUTION_SUBTASK,
  TableName.PLAN_DOCUMENT_SOLUTION_LINK,
  TableName.EXISTING_MODEL_LINK
];

// Tables where audits are batch with a different table
export const doubleBatchedTables: TableName[] = [
  TableName.PLAN_DOCUMENT,
  TableName.PLAN_DOCUMENT_SOLUTION_LINK
];

// Fields that are connected to other tables
export const connectedFields: HiddenFieldTypes[] = [
  {
    table: TableName.PLAN_TDL,
    fields: ['document_id']
  }
];

export const linkingTables = [TableName.EXISTING_MODEL_LINK];

// Determines if the table is a linking table
export const isLinkingTable = (tableName: TableName): boolean =>
  linkingTables.includes(tableName);

// Gets the linking table questions, in array, used to get audit count length
export const linkingTableQuestions = (
  changeRecords: ChangeRecordType[]
): string[] => {
  const changeQuestions = changeRecords.map(
    change =>
      change.translatedFields.find(record => record.fieldName === 'field_name')
        ?.newTranslated ||
      change.translatedFields.find(record => record.fieldName === 'field_name')
        ?.oldTranslated
  );

  // Removes duplicate questions, more accurate able to list changed questions
  const uniqueChangeQuestions = Array.from(new Set(changeQuestions));

  return uniqueChangeQuestions;
};

// Condenses the linking table changes into a single change record per question
export const condenseLinkingTableChanges = (
  changes: ChangeRecordType[]
): ChangeRecordType[] => {
  const condensedChanges: Record<
    ExisitingModelLinkFieldType,
    ChangeRecordType[]
  > = {} as Record<ExisitingModelLinkFieldType, ChangeRecordType[]>;

  changes.forEach(change => {
    const questionChange = change.translatedFields.find(
      record => record.fieldName === 'field_name'
    );

    const answerChange =
      change.translatedFields.find(
        record => record.fieldName === 'existing_model_id'
      ) ||
      change.translatedFields.find(
        record => record.fieldName === 'current_model_plan_id'
      );

    const question =
      (questionChange?.new as ExisitingModelLinkFieldType) ||
      (questionChange?.old as ExisitingModelLinkFieldType);

    if (!questionChange || !answerChange) return;

    // If the question does not exist in the condensed changes, create a new change record
    if (!condensedChanges[question]) {
      const newChange = { ...change };

      // Setting the question as metadata for all the related existing link changes
      newChange.metaData = {
        tableName:
          questionChange?.newTranslated || questionChange?.oldTranslated
      } as TranslatedAuditMetaBaseStruct;

      // Using the question translated field as the base object to merge in existing link data
      const newTranslated = { ...answerChange };

      // Changes the fieldNameTranslated using the tranlated field from newTranslated
      newTranslated.fieldNameTranslated =
        newTranslated.newTranslated || newTranslated.oldTranslated;

      // Setting the changeType of the field as the value
      newTranslated.newTranslated = change.action;

      newChange.translatedFields = [newTranslated];
      condensedChanges[question] = [newChange];
    } else {
      // Using the question translated field as the base object to merge in existing link data
      const newTranslated = { ...answerChange };

      // Changes the fieldNameTranslated using the tranlated field from newTranslated
      newTranslated.fieldNameTranslated =
        newTranslated.newTranslated || newTranslated.oldTranslated;

      // Setting the changeType of the field as the value
      newTranslated.newTranslated = change.action;

      condensedChanges[question][0].translatedFields.push(newTranslated);
    }
  });

  const flattenedChanges = Object.values(condensedChanges).map(
    change => change[0]
  );

  return flattenedChanges;
};

// Determines if the batch component should render
export const shouldRenderExistingLinkBatch = (
  changeRecords: ChangeRecordType[]
): boolean => batchedTables.includes(changeRecords[0].tableName);

// Returns metadata for both subtasks and solutions
export const getOperationalMetadata = (
  type: 'solution' | 'subtask',
  metaData: TranslatedAuditMetaData | undefined | null,
  fieldName: 'solutionName' | 'needName' | 'subtaskName'
): string => {
  if (type === 'solution') {
    return metaData &&
      isOperationalSolutionWithMetaData(metaData) &&
      fieldName !== 'subtaskName'
      ? metaData[fieldName]
      : '';
  }

  if (type === 'subtask') {
    return metaData && isSubtaskWithMetaData(metaData)
      ? metaData[fieldName] || ''
      : '';
  }
  return '';
};

/* 
  Returns the operation status of the solution.  
  Solutions are not deleted, they are marked as not needed/needed
  Mimics the database operation based on the neeeded property
*/
export const getSolutionOperationStatus = (
  change: ChangeRecordType
): DatabaseOperation => {
  if (
    change.translatedFields.find(field => field.fieldName === 'needed')?.new ===
    'false'
  ) {
    return DatabaseOperation.DELETE;
  }
  if (
    change.translatedFields.find(field => field.fieldName === 'needed')?.new ===
    'true'
  ) {
    return DatabaseOperation.INSERT;
  }
  return change.action;
};

// Looks at the database operation to determine if the new or old value is needed
export const documentChange = (docType: string | undefined) =>
  docType === 'DELETE' ? 'oldTranslated' : 'newTranslated';

// Returns the document name based on the action
export const documentName = (change: ChangeRecordType) =>
  change.translatedFields.find(field => field.fieldName === 'file_name')?.[
    documentChange(change.action)
  ];

// Returns the document type (link/upload)
export const documentType = (change: ChangeRecordType): boolean =>
  !!(
    !!change.translatedFields.find(field => field.fieldName === 'url')
      ?.newTranslated ||
    !!change.translatedFields.find(field => field.fieldName === 'url')
      ?.oldTranslated
  );

export const getSolutionName = (change: ChangeRecordType) =>
  change.translatedFields.find(field => field.fieldName === 'solution_id')
    ?.newTranslated ||
  change.translatedFields.find(field => field.fieldName === 'solution_id')
    ?.oldTranslated;

export const documentUpdateType = (change: ChangeRecordType) => {
  if (change.action === 'INSERT') {
    if (documentType(change)) {
      return 'added';
    }
    return 'uploaded';
  }
  if (change.action === 'DELETE') {
    return 'removed';
  }
  return '';
};

// Replaces curly braces with square brackets and attempts to parse the value as JSON.  This may change as BE may be able to returned a parsed array
export const parseArray = (value: string | string[]) => {
  if (!value) return '';

  if (Array.isArray(value)) return value;

  if (Number.isInteger(value)) return value;

  const formattedString = value.replace(/{/g, '[').replace(/}/g, ']');

  try {
    return JSON.parse(formattedString);
  } catch {
    return value;
  }
};

// Sorts the changes based on the sort option
export const handleSortOptions = (
  changes: ChangeRecordType[][],
  sort: 'newest' | 'oldest'
) => {
  let sortedChanges: ChangeRecordType[][] = [];
  if (sort === 'newest') {
    sortedChanges = [...changes].sort((a, b) =>
      b[0].date.localeCompare(a[0].date)
    );
    // Sorts the changes so that new plans are first
    sortedChanges = sortCreateChangeFirst(sortedChanges, 'desc');
  } else if (sort === 'oldest') {
    sortedChanges = [...changes].sort((a, b) =>
      a[0].date.localeCompare(b[0].date)
    );
    // Sorts the changes so that new plans are first
    sortedChanges = sortCreateChangeFirst(sortedChanges, 'asc');
  }

  return sortedChanges;
};

// Sorts the changes so that new plans are first
export const sortCreateChangeFirst = (
  changes: ChangeRecordType[][],
  direction: 'asc' | 'desc'
) => {
  return changes.sort((a: ChangeRecordType[], b: ChangeRecordType[]) => {
    const aType = identifyChangeType(a[0]);
    const bType = identifyChangeType(b[0]);

    if (aType === 'newPlan') return direction === 'asc' ? -1 : 1;
    if (bType === 'newPlan') return direction === 'asc' ? 1 : -1;

    return 0;
  });
};

const readyForReviewFields = [
  'ready_for_review_by',
  'ready_for_review_dts',
  'ready_for_clearance_by',
  'ready_for_clearance_dts'
];

// Removes the fields that are ready for review from the list of translatedFields changes
export const extractReadyForReviewChanges = (changes: ChangeRecordType[]) => {
  const filteredReviewChanges: ChangeRecordType[] = [];

  changes.forEach(change => {
    const singleChange = { ...change };
    singleChange.translatedFields = singleChange.translatedFields.filter(
      field => !readyForReviewFields.includes(field.fieldName)
    );
    filteredReviewChanges.push(singleChange);
  });

  return filteredReviewChanges;
};

export const getNestedActionText = (
  change: ChangeRecordType['translatedFields'][0],
  changeType: DatabaseOperation,
  tableName: TranslationTables
) => {
  // If the change is an insert, render created text rather than answered/updated, etc.
  if (
    tableName === TableName.OPERATIONAL_NEED &&
    changeType === DatabaseOperation.INSERT
  ) {
    return i18next.t(`changeHistory:changeType.CREATED`);
  }
  // Render the change type - answered, removed, updated
  if (changeType !== DatabaseOperation.DELETE) {
    return change.questionType === TranslationQuestionType.NOTE ||
      tableName === TableName.PLAN_COLLABORATOR
      ? i18next.t(`changeHistory:teamChangeType.${change.changeType}`)
      : i18next.t(`changeHistory:changeType.${change.changeType}`);
  }

  return '';
};

export const filterQueryAudits = (
  queryString: string,
  groupedAudits: ChangeRecordType[][]
): ChangeRecordType[][] => {
  return groupedAudits.filter(audits => {
    const filteredAudits = audits.filter(audit => {
      const lowerCaseQuery = queryString.toLowerCase().trim();

      const actionText = getActionText(audit);

      if (actionText.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      // Gets translated nested action text for fields and checks for a match
      const nestedActionTexts = audit.translatedFields.map(field =>
        getNestedActionText(
          field,
          audit.action,
          audit.tableName as TranslationTables
        )
      );

      if (
        nestedActionTexts.some(text =>
          text.toLowerCase().includes(lowerCaseQuery)
        )
      ) {
        return true;
      }

      // Check for a match on the header text
      if (getHeaderText(audit).toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      // Check for a match on any part of metdata
      const metaDataMatch =
        audit.metaData &&
        Object.values(audit.metaData).find(
          field =>
            typeof field === 'string' &&
            field?.toLowerCase().includes(lowerCaseQuery)
        );

      if (metaDataMatch) return true;

      const translatedFieldsMatchQuery = audit.translatedFields.filter(
        field => {
          if (
            field.fieldNameTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.newTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.oldTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.referenceLabel?.toLowerCase().includes(lowerCaseQuery)
          ) {
            return true;
          }

          const dateFormatType = datesWithNoDay.includes(field.fieldName)
            ? 'MMMM yyyy'
            : 'MM/dd/yyyy';

          // Parsing date of audit data to check if it matches the query
          if (field.dataType === TranslationDataType.DATE) {
            if (
              formatDateUtc(
                field.newTranslated?.replace(' ', 'T'),
                dateFormatType
              )
                .toLowerCase()
                .includes(lowerCaseQuery) ||
              formatDateUtc(
                field.oldTranslated?.replace(' ', 'T'),
                dateFormatType
              )
                .toLowerCase()
                .includes(lowerCaseQuery)
            ) {
              return true;
            }
          }
          return false;
        }
      );

      // Check if the actor name matches the query
      if (audit.actorName.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      // Check if the date of the audit entry matches the query
      if (
        formatDateUtc(audit.date.replace(' ', 'T'), 'MMMM d, yyyy')
          .toLowerCase()
          .includes(lowerCaseQuery) ||
        formatTime(audit.date.replace(' ', 'T'))
          .toLowerCase()
          .includes(lowerCaseQuery)
      ) {
        return true;
      }

      // Check if the section name matches the query
      if (
        i18next
          .t(`changeHistory:sections:${audit.tableName}`)
          .toLowerCase()
          .includes(lowerCaseQuery)
      ) {
        return true;
      }

      if (translatedFieldsMatchQuery.length > 0) {
        return true;
      }

      return false;
    });

    if (filteredAudits.length > 0) {
      return true;
    }
    return false;
  });
};

// Extracts status changes from the list of changes and separates them from other changes
export const separateStatusChanges = (
  changes: ChangeRecordType[]
): ChangeRecordType[] => {
  const filteredStatusChanges: ChangeRecordType[] = [];

  changes.forEach(change => {
    if (
      !isTranslationTaskListTable(change.tableName) &&
      change.tableName !== TableName.MODEL_PLAN
    ) {
      filteredStatusChanges.push(change);
      return;
    }

    // Find the index of the status field
    const statusIndex = change.translatedFields.findIndex(
      field => field.fieldName === 'status'
    );

    // If the status field is not present, leave as is
    if (
      statusIndex === -1 ||
      // Check if the change is a new plan, if so group the name change with the status change, leave as is
      (change.tableName === TableName.MODEL_PLAN &&
        change.translatedFields.find(
          field => field.fieldName === 'status' && field.old === null
        ))
    ) {
      filteredStatusChanges.push(change);
      return;
    }

    // Create a new change record for the other changes without the status change
    const otherChanges = { ...change };
    const otherTranslatedFields = [...change.translatedFields];
    // Remove the status change from the other changes
    otherTranslatedFields.splice(statusIndex, 1);
    otherChanges.translatedFields = otherTranslatedFields;
    filteredStatusChanges.push(otherChanges);

    // Split the status change from the other changes and create a new change record
    const statusChange = { ...change };
    statusChange.id = `${change.id}-status`; // Change the id to be unique
    const translatedFields = [...change.translatedFields];
    // Split the status change from the other changes
    statusChange.translatedFields = [translatedFields[statusIndex]];
    filteredStatusChanges.push(statusChange);
  });
  return filteredStatusChanges;
};

export const identifyChangeType = (change: ChangeRecordType): ChangeType => {
  // If the change is a new plan, return 'New plan'
  if (
    change.tableName === TableName.MODEL_PLAN &&
    change.translatedFields.find(
      field => field.fieldName === 'status' && field.old === null
    )
  ) {
    return 'newPlan';
  }

  // If the change is a model plan status update and not a new plan, return 'Status update'
  if (
    change.tableName === TableName.MODEL_PLAN &&
    change.translatedFields.find(
      field => field.fieldName === 'status' && field.old !== null
    )
  ) {
    return 'statusUpdate';
  }

  // If the change is a task list status update, return 'Task list status update'
  if (
    isTranslationTaskListTable(change.tableName) &&
    change.translatedFields.find(field => field.fieldName === 'status')
  ) {
    return 'taskListStatusUpdate';
  }

  if (change.tableName === TableName.PLAN_COLLABORATOR) {
    return 'teamUpdate';
  }

  if (
    change.tableName === TableName.PLAN_DISCUSSION ||
    change.tableName === TableName.DISCUSSION_REPLY
  ) {
    return 'discussionUpdate';
  }

  if (change.tableName === TableName.PLAN_DOCUMENT) {
    return 'documentUpdate';
  }

  if (change.tableName === TableName.PLAN_CR) {
    return 'cRUpdate';
  }

  if (change.tableName === TableName.PLAN_TDL) {
    return 'tDLUpdate';
  }

  if (change.tableName === TableName.OPERATIONAL_SOLUTION_SUBTASK) {
    return 'subtaskupdate';
  }

  if (change.tableName === TableName.PLAN_DOCUMENT_SOLUTION_LINK) {
    return 'documentSolutionLinkUpdate';
  }

  // If the change is an operational solution create/no translatedFields, return 'Operational solution create'
  if (change.tableName === TableName.OPERATIONAL_SOLUTION) {
    if (change.action === 'INSERT') {
      return 'operationalSolutionCreate';
    }
    return 'operationalSolutionUpdate';
  }

  // If the change is an operational need create/no translatedFields, return 'Operational need create'
  if (change.tableName === TableName.OPERATIONAL_NEED) {
    if (change.translatedFields.length === 0) {
      return 'operationalNeedCreate';
    }
    return 'operationalNeedUpdate';
  }

  return 'standardUpdate';
};

export const getHeaderText = (change: ChangeRecordType): string => {
  let headerText: string = '';

  const status = change.translatedFields.find(
    field => field.fieldName === 'status'
  )?.newTranslated;

  const teamChangeType = change.translatedFields.find(
    field => field.fieldName === 'team_roles'
  )?.changeType;

  switch (identifyChangeType(change)) {
    case 'newPlan':
      headerText = i18next.t(`changeHistory:planCreate`);
      break;
    case 'statusUpdate':
      headerText = i18next.t(`changeHistory:planStatusUpdate`);
      break;
    case 'taskListStatusUpdate':
      if (status === 'In progress') {
        headerText = i18next.t(`changeHistory:taskStartedUpdate`);
      } else {
        headerText = i18next.t(`changeHistory:taskStatusUpdate`);
      }
      break;
    case 'teamUpdate':
      headerText = i18next.t(`changeHistory:team${teamChangeType}`);
      break;
    case 'discussionUpdate':
      headerText = i18next.t(`changeHistory:${change.tableName}Answered`);
      break;
    case 'cRUpdate':
    case 'tDLUpdate':
      headerText = i18next.t('changeHistory:crTdlUpdate');
      break;
    case 'standardUpdate':
    case 'operationalNeedUpdate':
      headerText = i18next.t('changeHistory:change');
      break;
    case 'documentUpdate':
      headerText = i18next.t('changeHistory:documentUpdate');
      break;
    default:
      break;
  }

  return headerText;
};

export const getActionText = (change: ChangeRecordType): string => {
  let actionText: string = '';

  const teamChangeType = change.translatedFields.find(
    field => field.fieldName === 'team_roles'
  )?.changeType;

  switch (identifyChangeType(change)) {
    case 'teamUpdate':
      actionText = i18next.t(`changeHistory:teamChangeType.${teamChangeType}`);
      break;
    case 'discussionUpdate':
      actionText = i18next.t(`changeHistory:${change.tableName}Answered`);
      break;
    case 'cRUpdate':
    case 'tDLUpdate':
      actionText = i18next.t(`changeHistory:auditUpdateType.${change.action}`);
      break;
    case 'documentUpdate':
      actionText = i18next.t(
        `changeHistory:documentChangeType.${documentUpdateType(change)}`
      );
      break;
    default:
      break;
  }

  return actionText;
};

export const isInitialCreatedSection = (
  change: ChangeRecordType,
  changeType: ChangeType
): boolean =>
  !!(
    (changeType === 'taskListStatusUpdate' &&
      change.translatedFields.find(
        field => field.fieldName === 'status' && field.old === null
      )) ||
    identifyChangeType(change) === 'operationalNeedCreate'
  );

// Some fields exist in translation/audit data, but are not displayed in the change history. Filter out these fields
export const removedUnneededFields = (
  changeRecords: ChangeRecordType[]
): ChangeRecordType[] => {
  const filteredChangeRecords: ChangeRecordType[] = [];

  changeRecords.forEach(changeRecord => {
    const filteredChangeRecord = { ...changeRecord };
    const filteredFields = [...filteredChangeRecord.translatedFields];

    filteredChangeRecord.translatedFields = filteredFields.filter(
      field =>
        !unneededFields.find(
          hiddenField =>
            hiddenField.table === changeRecord.tableName &&
            hiddenField.fields.includes(field.fieldName)
        )
    );

    filteredChangeRecords.push(filteredChangeRecord);
  });
  return filteredChangeRecords;
};

// Groups changes that are within 1 second of each other
export const groupBatchedChanges = (changes: ChangeRecordType[]) => {
  const mergedChanges = [...changes].reduce(
    (acc: ChangeRecordType[][], change, currentIndex) => {
      const date = new Date(change.date);
      const lastGroup = acc[acc.length - 1];

      // Returns a string array of list of existing batched tablenames prior to this change
      const prevousGroups = lastGroup?.map(group => group.tableName) || [];

      let canBatch = false;

      // If change belongs to a batch for a single table, group all together
      if (batchedTables.includes(change.tableName)) {
        if (prevousGroups.includes(change.tableName)) {
          canBatch = true;
        } else {
          canBatch = false;
        }
      }

      // OR if two tables should be group together, batch them - Documents, Document Solution Link
      if (doubleBatchedTables.includes(change.tableName)) {
        if (doubleBatchedTables.some(item => prevousGroups.includes(item))) {
          canBatch = true;
        } else {
          canBatch = false;
        }
      }

      // If the last group is empty or the date of the change is more than 1 second from the last change, create a new group
      if (
        !lastGroup ||
        !canBatch ||
        Math.abs(
          date.getTime() -
            new Date(lastGroup[lastGroup.length - 1].date).getTime()
        ) > 1000
      ) {
        acc.push([change]);
      } else {
        lastGroup.push(change);
      }

      return acc;
    },
    []
  );

  return mergedChanges;
};

// Sorts the changes by day - { day: [changes] }
export const sortChangesByDay = (
  changes: ChangeRecordType[][]
): { [key: string]: ChangeRecordType[][] } => {
  const sortedChanges: { [key: string]: ChangeRecordType[][] } = {};

  changes.forEach(change => {
    const date = change[0].date.split('T')[0];
    if (!sortedChanges[date]) {
      sortedChanges[date] = [];
    }
    sortedChanges[date].push(change);
  });

  return sortedChanges;
};

// Removes changes that are not needed for the change history.  Used to get accurate page count of audits
const removeUnneededAudits = (changes: ChangeRecordType[]) =>
  changes.filter(
    change =>
      !isInitialCreatedSection(change, identifyChangeType(change)) &&
      change.translatedFields.length !== 0
  );

export const sortAllChanges = (changes: ChangeRecordType[]) => {
  const changesWithStatusSeparation = separateStatusChanges(changes);

  const removedHiddenChangeFields = removedUnneededFields(
    changesWithStatusSeparation
  );

  const changesWithoutReadyForReview = extractReadyForReviewChanges(
    removedHiddenChangeFields
  );

  const changesWithoutUnneededAudits = removeUnneededAudits(
    changesWithoutReadyForReview
  );

  const changesSortedByDate = changesWithoutUnneededAudits?.sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const changesGroupedByTime = groupBatchedChanges(changesSortedByDate);

  const changesSortedWithCreateFirst = sortCreateChangeFirst(
    changesGroupedByTime,
    'desc'
  );

  return changesSortedWithCreateFirst;
};

// Returns pseudo translated fields for the operational solution from its metadata
export const solutionInsertFields = (
  metaData: TranslatedAuditMetaOperationalSolution
): ChangeRecordType['translatedFields'] => {
  return [
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.ANSWERED,
      dataType: TranslationDataType.ENUM,
      fieldName: 'status',
      fieldNameTranslated: 'Status',
      id: '1',
      new: metaData.solutionStatus,
      newTranslated: metaData.solutionStatus,
      notApplicableQuestions: null,
      old: null,
      oldTranslated: null,
      questionType: null,
      referenceLabel: null
    }
  ];
};

// Returns pseudo translated fields for the operational solution from its metadata
export const solutionDeleteFields = (
  metaData: TranslatedAuditMetaOperationalSolution
): ChangeRecordType['translatedFields'] => {
  return [
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.NUMBER,
      fieldName: 'numberOfSubtasks',
      fieldNameTranslated: 'Subtasks',
      id: '1',
      new: null,
      newTranslated: null,
      notApplicableQuestions: null,
      old: metaData.numberOfSubtasks,
      oldTranslated: metaData.numberOfSubtasks,
      questionType: null,
      referenceLabel: null
    },
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.ENUM,
      fieldName: 'status',
      fieldNameTranslated: 'Status',
      id: '2',
      new: null,
      newTranslated: null,
      notApplicableQuestions: null,
      old: metaData.solutionStatus,
      oldTranslated: metaData.solutionStatus,
      questionType: null,
      referenceLabel: null
    },
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.NUMBER,
      fieldName: 'must_start_dts',
      fieldNameTranslated: 'Must start by',
      id: '3',
      new: null,
      newTranslated: null,
      notApplicableQuestions: null,
      old: metaData.solutionMustStart,
      oldTranslated: metaData.solutionMustStart
        ? formatDateUtc(
            metaData.solutionMustStart.replace(' ', 'T'),
            'MM/dd/yyyy'
          )
        : '',
      questionType: null,
      referenceLabel: null
    },
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.NUMBER,
      fieldName: 'must_finish_dts',
      fieldNameTranslated: 'Must finish by',
      id: '4',
      new: null,
      newTranslated: null,
      notApplicableQuestions: null,
      old: metaData.solutionMustFinish,
      oldTranslated: metaData.solutionMustFinish
        ? formatDateUtc(
            metaData.solutionMustFinish.replace(' ', 'T'),
            'MM/dd/yyyy'
          )
        : '',
      questionType: null,
      referenceLabel: null
    }
  ];
};

// Returns pseudo translated fields for the solution document link from its metadata
export const solutionDocumentLinkFields = (
  metaData: TranslatedAuditMetaDocumentSolutionLink
): ChangeRecordType['translatedFields'] => {
  return [
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.NUMBER,
      fieldName: 'documentName',
      fieldNameTranslated: 'Document',
      id: '1',
      new: null,
      newTranslated: metaData.documentName,
      notApplicableQuestions: null,
      old: null,
      oldTranslated: null,
      questionType: null,
      referenceLabel: null
    },
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.NUMBER,
      fieldName: 'documentURL',
      fieldNameTranslated: 'Link',
      id: '2',
      new: null,
      newTranslated: metaData.documentURL,
      notApplicableQuestions: null,
      old: null,
      oldTranslated: null,
      questionType: null,
      referenceLabel: null
    },
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.ENUM,
      fieldName: 'documentType',
      fieldNameTranslated: 'Document type',
      id: '3',
      new: null,
      newTranslated: metaData.documentType,
      notApplicableQuestions: null,
      old: null,
      oldTranslated: null,
      questionType: null,
      referenceLabel: null
    },
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.NUMBER,
      fieldName: 'documentOtherType',
      fieldNameTranslated: 'What kind of document is this?',
      id: '4',
      new: null,
      newTranslated: metaData.documentOtherType,
      notApplicableQuestions: null,
      old: null,
      oldTranslated: null,
      questionType: null,
      referenceLabel: null
    },
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.NUMBER,
      fieldName: 'documentVisibility',
      fieldNameTranslated: 'Visibility',
      id: '5',
      new: null,
      newTranslated: metaData.documentVisibility,
      notApplicableQuestions: null,
      old: null,
      oldTranslated: null,
      questionType: null,
      referenceLabel: null
    },
    {
      __typename: 'TranslatedAuditField',
      changeType: AuditFieldChangeType.REMOVED,
      dataType: TranslationDataType.NUMBER,
      fieldName: 'documentNote',
      fieldNameTranslated: 'Notes',
      id: '6',
      new: null,
      newTranslated: metaData.documentNote,
      notApplicableQuestions: null,
      old: null,
      oldTranslated: null,
      questionType: null,
      referenceLabel: null
    }
  ];
};
