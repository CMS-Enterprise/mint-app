import { AuditFieldChangeType, DatabaseOperation } from 'gql/gen/graphql';

import {
  ChangeRecordType,
  ChangeType,
  extractReadyForReviewChanges,
  identifyChangeType,
  isInitialCreatedSection,
  isTranslationTaskListTable,
  parseArray,
  removedHiddenFields,
  separateStatusChanges,
  sortCreateChangeFirst
} from './util';

describe('util.tsx', () => {
  // Test for isTranslationTaskListTable
  test('isTranslationTaskListTable', () => {
    expect(isTranslationTaskListTable('plan_basics')).toBe(true);
    expect(isTranslationTaskListTable('invalid_table')).toBe(false);
  });

  // Test for parseArray
  test('parseArray', () => {
    expect(parseArray('{1,2,3}')).toEqual([1, 2, 3]);
    expect(parseArray('invalid')).toBe('invalid');
  });

  // Test for sortCreateChangeFirst
  test('sortCreateChangeFirst', () => {
    const a: ChangeRecordType = {
      id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
      tableName: 'plan_basics',
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.INSERT,
      translatedFields: [
        {
          id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          fieldName: 'status',
          fieldNameTranslated: 'Model Plan status',
          old: null,
          oldTranslated: null,
          new: 'READY',
          newTranslated: 'Ready',
          __typename: 'TranslatedAuditField'
        }
      ],
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };
    const b: ChangeRecordType = {
      id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
      tableName: 'model_plan',
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.INSERT,
      translatedFields: [
        {
          id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          fieldName: 'status',
          fieldNameTranslated: 'Model Plan status',
          old: null,
          oldTranslated: null,
          new: 'READY',
          newTranslated: 'Ready',
          __typename: 'TranslatedAuditField'
        }
      ],
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };
    expect(sortCreateChangeFirst(a, b)).toBe(-1);
  });

  // Test for extractReadyForReviewChanges
  test('extractReadyForReviewChanges', () => {
    const changes: ChangeRecordType[] = [
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: 'plan_basics',
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'status',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          },
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'ready_for_review_by',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          }
        ],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      }
    ];
    expect(extractReadyForReviewChanges(changes)).toEqual([
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: 'plan_basics',
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'status',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          }
        ],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      }
    ]);
  });

  // Test for separateStatusChanges
  test('separateStatusChanges', () => {
    const changes: ChangeRecordType[] = [
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: 'plan_basics',
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'status',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          },
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'model_type',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          }
        ],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      }
    ];
    expect(separateStatusChanges(changes)).toEqual([
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: 'plan_basics',
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'model_type',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          }
        ],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      },
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802-status',
        tableName: 'plan_basics',
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'status',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          }
        ],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      }
    ]);
  });

  // Test for identifyChangeType
  test('identifyChangeType', () => {
    const change: ChangeRecordType = {
      id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
      tableName: 'plan_basics',
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.INSERT,
      translatedFields: [
        {
          id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          fieldName: 'status',
          fieldNameTranslated: 'Model Plan status',
          old: null,
          oldTranslated: null,
          new: 'READY',
          newTranslated: 'Ready',
          __typename: 'TranslatedAuditField'
        }
      ],
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };
    expect(identifyChangeType(change)).toBe('Task list status update');
  });

  // Test for isInitialCreatedSection
  test('isInitialCreatedSection', () => {
    const change: ChangeRecordType = {
      id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
      tableName: 'plan_basics',
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.INSERT,
      translatedFields: [
        {
          id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          fieldName: 'status',
          fieldNameTranslated: 'Model Plan status',
          old: null,
          oldTranslated: null,
          new: 'READY',
          newTranslated: 'Ready',
          __typename: 'TranslatedAuditField'
        }
      ],
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };
    const changeType: ChangeType = 'Task list status update';
    expect(isInitialCreatedSection(change, changeType)).toBe(true);
  });

  // Test for isHiddenRecord
  test('removedHiddenFields', () => {
    const changeRecords: ChangeRecordType[] = [
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: 'operational_need',
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'needed',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          }
        ],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      }
    ];
    expect(removedHiddenFields(changeRecords)).toBe(true);
  });
});
