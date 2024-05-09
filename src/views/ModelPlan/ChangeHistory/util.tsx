import { GetChangeHistoryQuery } from 'gql/gen/graphql';

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
  | 'Operational need create'
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

// Sorts the changes so that new plans are first
export const sortCreateChangeFirst = (
  a: ChangeRecordType,
  b: ChangeRecordType
) => {
  const aType = identifyChangeType(a);
  const bType = identifyChangeType(b);

  if (aType === 'New plan') return 1;
  if (bType === 'New plan') return -1;

  return 0;
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

// Extracts status changes from the list of changes and separates them from other changes
export const separateStatusChanges = (
  changes: ChangeRecordType[]
): ChangeRecordType[] => {
  const filteredStatusChanges: ChangeRecordType[] = [];

  changes.forEach(change => {
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

    // Split the status change from the other changes and create a new change record
    const statusChange = { ...change };
    statusChange.id = `${change.id}-status`; // Change the id to be unique
    const translatedFields = [...change.translatedFields];
    // Split the status change from the other changes
    translatedFields?.splice(0, statusIndex);
    translatedFields?.splice(statusIndex + 1);
    statusChange.translatedFields = translatedFields;
    filteredStatusChanges.push(statusChange);

    // Create a new change record for the other changes without the status change
    const otherChanges = { ...change };
    const otherTranslatedFields = [...change.translatedFields];
    // Remove the status change from the other changes
    otherTranslatedFields.splice(statusIndex, 1);
    otherChanges.translatedFields = otherTranslatedFields;
    filteredStatusChanges.push(otherChanges);
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

  if (change.tableName === 'plan_discussion') {
    return 'Discussion update';
  }

  if (change.tableName === 'plan_document') {
    return 'Document update';
  }

  // If the change is an operational need create/no translatedFields, return 'Operational need create'
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

export const isHiddenRecord = (changeRecord: ChangeRecordType): boolean => {
  const hiddenFields = [
    {
      table: 'operational_need',
      field: 'needed'
    }
  ];

  return !!hiddenFields.find(
    hiddenField =>
      hiddenField.table === changeRecord.tableName &&
      changeRecord.translatedFields.filter(
        field => field.fieldName === hiddenField.field
      ).length > 0
  );
};
