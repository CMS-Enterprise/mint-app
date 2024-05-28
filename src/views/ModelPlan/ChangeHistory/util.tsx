import {
  GetChangeHistoryQuery,
  TranslatedAuditMetaData,
  TranslatedAuditMetaDiscussionReply,
  TranslationDataType
} from 'gql/gen/graphql';
import i18next from 'i18next';
import { DateTime } from 'luxon';

import { formatDateUtc, formatTime } from 'utils/date';

export type ChangeRecordType = NonNullable<
  GetChangeHistoryQuery['translatedAuditCollection']
>[0];

// Identifies the type of change
export type ChangeType =
  | 'New plan'
  | 'Status update'
  | 'Task list status update'
  | 'Team update'
  | 'Discussion update'
  | 'Document update'
  | 'CR update'
  | 'TDL update'
  | 'Subtask update'
  | 'Document solution link update'
  | 'Operational solution create'
  | 'Operational solution update'
  | 'Operational need create'
  | 'Operational need update'
  | 'Standard update';

export type TranslationTables =
  | 'model_plan'
  | 'plan_basics'
  | 'plan_general_characteristics'
  | 'plan_participants_and_providers'
  | 'plan_beneficiaries'
  | 'plan_ops_eval_and_learning'
  | 'plan_payments'
  | 'plan_collaborator'
  | 'plan_discussion'
  | 'discussion_reply'
  | 'plan_document'
  | 'plan_cr'
  | 'plan_tdl'
  | 'operational_need'
  | 'operational_solution'
  | 'operational_solution_subtask';

export type TranslationTaskListTable =
  | 'plan_basics'
  | 'plan_general_characteristics'
  | 'plan_participants_and_providers'
  | 'plan_beneficiaries'
  | 'plan_ops_eval_and_learning'
  | 'plan_payments';

export const isTranslationTaskListTable = (
  tableName: string
): tableName is TranslationTaskListTable => {
  return [
    'plan_basics',
    'plan_general_characteristics',
    'plan_participants_and_providers',
    'plan_beneficiaries',
    'plan_ops_eval_and_learning',
    'plan_payments'
  ].includes(tableName);
};

// Type guard to check union type
export const isDiscussionReplyWithMetaData = (
  data: TranslatedAuditMetaData
): data is TranslatedAuditMetaDiscussionReply => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TranslatedAuditMetaDiscussionReply';
};

type HiddenFieldTypes = {
  table: TranslationTables;
  fields: string[];
};

// Fields that are not displayed in the change history
const hiddenFields: HiddenFieldTypes[] = [
  {
    table: 'operational_need',
    fields: ['needed', 'need_type', 'model_plan_id']
  },
  {
    table: 'operational_solution',
    fields: ['operational_need_id', 'solution_type', 'is_other']
  },
  {
    table: 'plan_document',
    fields: [
      'model_plan_id',
      'virus_scanned',
      'file_key',
      'file_name',
      'file_size',
      'bucket',
      'file_type',
      'virus_clean'
    ]
  },
  {
    table: 'plan_cr',
    fields: ['model_plan_id']
  },
  {
    table: 'plan_tdl',
    fields: ['model_plan_id']
  }
];

export const batchedTables: string[] = [
  'operational_solution',
  'operational_need',
  'operational_solution_subtask'
];

// Replaces curly braces with square brackets and attempts to parse the value as JSON.  This may change as BE may be able to returned a parsed array
export const parseArray = (value: string | string[]) => {
  if (!value) return '';

  if (Array.isArray(value)) return value;

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

    if (aType === 'New plan') return direction === 'asc' ? -1 : 1;
    if (bType === 'New plan') return direction === 'asc' ? 1 : -1;

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

export const filterQueryAudits = (
  queryString: string,
  groupedAudits: ChangeRecordType[][]
): ChangeRecordType[][] => {
  return groupedAudits.filter(audits => {
    const filteredAudits = audits.filter(audit => {
      const lowerCaseQuery = queryString.toLowerCase();

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

          // Parsing date of audit data to check if it matches the query
          if (field.dataType === TranslationDataType.DATE) {
            if (
              formatDateUtc(
                field.newTranslated?.replace(' ', 'T'),
                'MM/dd/yyyy'
              )
                .toLowerCase()
                .includes(lowerCaseQuery) ||
              formatDateUtc(
                field.oldTranslated?.replace(' ', 'T'),
                'MM/dd/yyyy'
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
      change.tableName !== 'model_plan'
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
      (change.tableName === 'model_plan' &&
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
    change.tableName === 'model_plan' &&
    change.translatedFields.find(
      field => field.fieldName === 'status' && field.old === null
    )
  ) {
    return 'New plan';
  }

  // If the change is a model plan status update and not a new plan, return 'Status update'
  if (
    change.tableName === 'model_plan' &&
    change.translatedFields.find(
      field => field.fieldName === 'status' && field.old !== null
    )
  ) {
    return 'Status update';
  }

  // If the change is a task list status update, return 'Task list status update'
  if (
    isTranslationTaskListTable(change.tableName) &&
    change.translatedFields.find(field => field.fieldName === 'status')
  ) {
    return 'Task list status update';
  }

  if (change.tableName === 'plan_collaborator') {
    return 'Team update';
  }

  if (
    change.tableName === 'plan_discussion' ||
    change.tableName === 'discussion_reply'
  ) {
    return 'Discussion update';
  }

  if (change.tableName === 'plan_document') {
    return 'Document update';
  }

  if (change.tableName === 'plan_cr') {
    return 'CR update';
  }

  if (change.tableName === 'plan_tdl') {
    return 'TDL update';
  }

  if (change.tableName === 'operational_solution_subtask') {
    return 'Subtask update';
  }

  if (change.tableName === 'document_solution_link') {
    return 'Document solution link update';
  }

  // If the change is an operational solution create/no translatedFields, return 'Operational solution create'
  if (change.tableName === 'operational_solution') {
    if (change.action === 'INSERT') {
      return 'Operational solution create';
    }
    return 'Operational solution update';
  }

  // If the change is an operational need create/no translatedFields, return 'Operational need create'
  if (change.tableName === 'operational_need') {
    if (change.translatedFields.length === 0) {
      return 'Operational need create';
    }
    return 'Operational need update';
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

// Some fields exist in translation/audit data, but are not displayed in the change history. Filter out these fields
export const removedHiddenFields = (
  changeRecords: ChangeRecordType[]
): ChangeRecordType[] => {
  const filteredChangeRecords: ChangeRecordType[] = [];

  changeRecords.forEach(changeRecord => {
    const filteredChangeRecord = { ...changeRecord };
    const filteredFields = [...filteredChangeRecord.translatedFields];

    filteredChangeRecord.translatedFields = filteredFields.filter(
      field =>
        !hiddenFields.find(
          hiddenField =>
            hiddenField.table === changeRecord.tableName &&
            hiddenField.fields.includes(field.fieldName)
        )
    );

    filteredChangeRecords.push(filteredChangeRecord);
  });
  return filteredChangeRecords;
};

export const groupBatchedChanges = (changes: ChangeRecordType[]) => {
  const sharedChanges: Record<string, ChangeRecordType[]> = {};

  changes.forEach(change => {
    const sharedInsertTime = DateTime.fromISO(change.date).toLocaleString(
      DateTime.DATETIME_FULL_WITH_SECONDS
    );

    if (batchedTables.includes(change.tableName)) {
      if (!sharedChanges[sharedInsertTime]) {
        sharedChanges[sharedInsertTime] = [change];
      } else {
        sharedChanges[sharedInsertTime].push(change);
      }
    } else {
      sharedChanges[`${sharedInsertTime}-${change.id}`] = [change];
    }
  });

  const mergedChanges: ChangeRecordType[][] = [];

  Object.values(sharedChanges).forEach((change, i) => {
    mergedChanges.push([...change]);
  });
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

  const removedHiddenChangeFields = removedHiddenFields(
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
