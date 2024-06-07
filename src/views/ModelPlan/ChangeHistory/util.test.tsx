import { AuditFieldChangeType, DatabaseOperation } from 'gql/gen/graphql';

import {
  ChangeRecordType,
  ChangeType,
  extractReadyForReviewChanges,
  filterQueryAudits,
  groupBatchedChanges,
  handleSortOptions,
  identifyChangeType,
  isInitialCreatedSection,
  isTranslationTaskListTable,
  linkingTableQuestions,
  parseArray,
  removedHiddenFields,
  separateStatusChanges,
  sortChangesByDay,
  sortCreateChangeFirst
} from './util';

const sortData: ChangeRecordType[][] = [
  [
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
      actorName: 'Cosmo Kramer',
      __typename: 'TranslatedAudit'
    }
  ],
  [
    {
      id: 'e9e1129d-2317-4acd-8d2b-7ca37b33452',
      tableName: 'operational_need',
      date: '2024-05-22T13:55:13.725192Z',
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
  ]
];

describe('util.tsx', () => {
  // Test for isTranslationTaskListTable
  it('isTranslationTaskListTable', () => {
    expect(isTranslationTaskListTable('plan_basics')).toBe(true);
    expect(isTranslationTaskListTable('invalid_table')).toBe(false);
  });

  // Test for parseArray
  it('parseArray', () => {
    expect(parseArray('{1,2,3}')).toEqual([1, 2, 3]);
    expect(parseArray('invalid')).toBe('invalid');
  });

  // Test for sortCreateChangeFirst
  it('sortCreateChangeFirst', () => {
    const changes: ChangeRecordType[][] = [
      [
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
      ],
      [
        {
          id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
          tableName: 'model_plan',
          date: '2024-05-22T13:55:13.725192Z',
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
      ]
    ];

    expect(sortCreateChangeFirst([...changes], 'asc')).toStrictEqual([
      changes[1],
      changes[0]
    ]);
  });

  // Test for extractReadyForReviewChanges
  it('extractReadyForReviewChanges', () => {
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
  it('separateStatusChanges', () => {
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
  it('identifyChangeType', () => {
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
  it('isInitialCreatedSection', () => {
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
  it('removedHiddenFields', () => {
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
    expect(removedHiddenFields(changeRecords)).toStrictEqual([
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: 'operational_need',
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      }
    ]);
  });

  // Test for sortChangesByDay - Sorts the changes by day - { day: [changes] }
  it('should sort changes by day', () => {
    const changes = [...sortData];

    const expected = {
      '2024-04-22': [
        [
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
            actorName: 'Cosmo Kramer',
            __typename: 'TranslatedAudit'
          }
        ]
      ],
      '2024-05-22': [
        [
          {
            id: 'e9e1129d-2317-4acd-8d2b-7ca37b33452',
            tableName: 'operational_need',
            date: '2024-05-22T13:55:13.725192Z',
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
        ]
      ]
    };

    expect(sortChangesByDay(changes)).toEqual(expected);
  });

  it('should sort changes from newest to oldest', () => {
    const changes = [...sortData];

    expect(handleSortOptions([...changes], 'newest')).toEqual([
      changes[1],
      changes[0]
    ]);

    expect(handleSortOptions([...changes], 'oldest')).toEqual([
      changes[0],
      changes[1]
    ]);
  });

  it('should filter audits based on query string', () => {
    const changes = [...sortData];

    // Testing with query string for user
    const queryString = 'Cosmo';
    expect(filterQueryAudits(queryString, changes)).toEqual([changes[0]]);

    // Testing with translated table name
    const queryString2 = 'Operational';
    expect(filterQueryAudits(queryString2, changes)).toEqual(changes);

    // Testing with date
    const queryString3 = 'May 22, 2024';
    expect(filterQueryAudits(queryString3, changes)).toEqual([changes[1]]);

    // Testing with translated field name
    const queryString4 = 'Ready';
    expect(filterQueryAudits(queryString4, changes)).toEqual(changes);
  });

  it('should group changes that are within 1 second of each other', () => {
    const changes: ChangeRecordType[] = [
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: 'operational_solution_subtask',
        date: '2024-04-22T13:55:23.725192Z',
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
        actorName: 'Cosmo Kramer',
        __typename: 'TranslatedAudit'
      },
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b33452',
        tableName: 'operational_solution_subtask',
        date: '2024-04-22T13:55:24.625192Z',
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
      },
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b33453',
        tableName: 'operational_solution_subtask',
        date: '2024-04-22T13:59:13.725192Z',
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

    const expected: ChangeRecordType[][] = [
      [changes[0], changes[1]],
      [changes[2]]
    ];

    expect(groupBatchedChanges([...changes])).toEqual(expected);

    // Test double batched changes
    changes[0].tableName = 'plan_document';
    changes[1].tableName = 'plan_document_solution_link';

    const expected2: ChangeRecordType[][] = [
      [changes[0], changes[1]],
      [changes[2]]
    ];

    expect(groupBatchedChanges([...changes])).toEqual(expected2);
  });

  it('should return unique questions from change records', () => {
    const changeRecords = [
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: 'operational_need',
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'field_name',
            fieldNameTranslated: 'Model Plan status',
            old: null,
            oldTranslated: null,
            new: 'READY',
            newTranslated: 'Ready',
            __typename: 'TranslatedAuditField'
          }
        ],
        actorName: 'Cosmo Kramer',
        __typename: 'TranslatedAudit'
      },
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b33452',
        tableName: 'operational_need',
        date: '2024-05-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            fieldName: 'field_name',
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

    const result = linkingTableQuestions(changeRecords as ChangeRecordType[]);

    expect(result).toEqual(['Ready']);

    changeRecords[1].translatedFields[0].newTranslated = 'Name';

    const result2 = linkingTableQuestions(changeRecords as ChangeRecordType[]);

    expect(result2).toEqual(['Ready', 'Name']);
  });
});
