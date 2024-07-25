import {
  AuditFieldChangeType,
  DatabaseOperation,
  TableName,
  TranslationDataType
} from 'gql/gen/graphql';

import {
  ChangeRecordType,
  ChangeType,
  condenseLinkingTableChanges,
  documentUpdateType,
  extractReadyForReviewChanges,
  filterQueryAudits,
  getActionText,
  getSolutionOperationStatus,
  groupBatchedChanges,
  handleSortOptions,
  identifyChangeType,
  isInitialCreatedSection,
  isTranslationTaskListTable,
  linkingTableQuestions,
  parseArray,
  removedUnneededFields,
  separateStatusChanges,
  sortChangesByDay,
  sortCreateChangeFirst
} from './util';

const sortData: ChangeRecordType[][] = [
  [
    {
      id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
      tableName: TableName.OPERATIONAL_NEED,
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
          __typename: 'TranslatedAuditField',
          dataType: TranslationDataType.ENUM
        }
      ],
      actorName: 'Cosmo Kramer',
      __typename: 'TranslatedAudit'
    }
  ],
  [
    {
      id: 'e9e1129d-2317-4acd-8d2b-7ca37b33452',
      tableName: TableName.OPERATIONAL_NEED,
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
          __typename: 'TranslatedAuditField',
          dataType: TranslationDataType.ENUM
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
    expect(isTranslationTaskListTable(TableName.PLAN_BASICS)).toBe(true);
    expect(
      isTranslationTaskListTable(TableName.OPERATIONAL_SOLUTION_SUBTASK)
    ).toBe(false);
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
          tableName: TableName.PLAN_BASICS,
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
              __typename: 'TranslatedAuditField',
              dataType: TranslationDataType.ENUM
            }
          ],
          actorName: 'MINT Doe',
          __typename: 'TranslatedAudit'
        }
      ],
      [
        {
          id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
          tableName: TableName.MODEL_PLAN,
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
              __typename: 'TranslatedAuditField',
              dataType: TranslationDataType.ENUM
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
        tableName: TableName.PLAN_BASICS,
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
            __typename: 'TranslatedAuditField',
            dataType: TranslationDataType.ENUM
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
            __typename: 'TranslatedAuditField',
            dataType: TranslationDataType.ENUM
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
            dataType: TranslationDataType.ENUM,
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
        tableName: TableName.PLAN_BASICS,
        date: '2024-04-22T13:55:13.725192Z',
        action: DatabaseOperation.INSERT,
        translatedFields: [
          {
            id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
            changeType: AuditFieldChangeType.ANSWERED,
            dataType: TranslationDataType.ENUM,
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
            dataType: TranslationDataType.ENUM,
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
            dataType: TranslationDataType.ENUM,
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
            dataType: TranslationDataType.ENUM,
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
      tableName: TableName.PLAN_BASICS,
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
          __typename: 'TranslatedAuditField',
          dataType: TranslationDataType.ENUM
        }
      ],
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };
    expect(identifyChangeType(change)).toBe('taskListStatusUpdate');
  });

  // Test for isInitialCreatedSection
  it('isInitialCreatedSection', () => {
    const change: ChangeRecordType = {
      id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
      tableName: TableName.PLAN_BASICS,
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
          __typename: 'TranslatedAuditField',
          dataType: TranslationDataType.ENUM
        }
      ],
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };
    const changeType: ChangeType = 'taskListStatusUpdate';
    expect(isInitialCreatedSection(change, changeType)).toBe(true);
  });

  // Test for isHiddenRecord
  it('removedHiddenFields', () => {
    const changeRecords: ChangeRecordType[] = [
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: TableName.OPERATIONAL_NEED,
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
            __typename: 'TranslatedAuditField',
            dataType: TranslationDataType.ENUM
          }
        ],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      }
    ];
    expect(removedUnneededFields(changeRecords)).toStrictEqual([
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
                dataType: TranslationDataType.ENUM,
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
                dataType: TranslationDataType.ENUM,
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

  // Test for handleSortOptions
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

  // Test for groupBatchedChanges
  it('should group changes that are within 1 second of each other', () => {
    const changes: ChangeRecordType[] = [
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
        tableName: TableName.OPERATIONAL_SOLUTION_SUBTASK,
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
            __typename: 'TranslatedAuditField',
            dataType: TranslationDataType.ENUM
          }
        ],
        actorName: 'Cosmo Kramer',
        __typename: 'TranslatedAudit'
      },
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b33452',
        tableName: TableName.OPERATIONAL_SOLUTION_SUBTASK,
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
            __typename: 'TranslatedAuditField',
            dataType: TranslationDataType.ENUM
          }
        ],
        actorName: 'MINT Doe',
        __typename: 'TranslatedAudit'
      },
      {
        id: 'e9e1129d-2317-4acd-8d2b-7ca37b33453',
        tableName: TableName.OPERATIONAL_SOLUTION_SUBTASK,
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
            __typename: 'TranslatedAuditField',
            dataType: TranslationDataType.ENUM
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
    changes[0].tableName = TableName.PLAN_DOCUMENT;
    changes[1].tableName = TableName.PLAN_DOCUMENT_SOLUTION_LINK;

    const expected2: ChangeRecordType[][] = [
      [changes[0], changes[1]],
      [changes[2]]
    ];

    expect(groupBatchedChanges([...changes])).toEqual(expected2);
  });

  // Test for linkingTableQuestions
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

  // Test for condenseLinkingTableChanges
  it('should condense changes into a single change record per question', () => {
    const changes = [
      {
        __typename: 'TranslatedAudit',
        id: '4a380e4d-9c81-4515-8994-c25f6f533de8',
        tableName: 'existing_model_link',
        date: '2024-06-07T19:14:30.145659Z',
        action: DatabaseOperation.INSERT,
        actorName: 'MINT Doe',
        translatedFields: [
          {
            __typename: 'TranslatedAuditField',
            id: '8c4fe6e4-705e-4fcf-b9e0-edd035b71dd5',
            changeType: AuditFieldChangeType.ANSWERED,
            dataType: TranslationDataType.STRING,
            fieldName: 'field_name',
            fieldNameTranslated: 'What question is this link for?',
            referenceLabel: null,
            questionType: null,
            notApplicableQuestions: null,
            old: null,
            oldTranslated: null,
            new: 'GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH',
            newTranslated:
              'Which existing models does your proposed track/model most closely resemble?'
          },
          {
            __typename: 'TranslatedAuditField',
            id: '631e0ac6-1f52-4ed4-8c1e-f94fd742011f',
            changeType: AuditFieldChangeType.ANSWERED,
            dataType: TranslationDataType.STRING,
            fieldName: 'existing_model_id',
            fieldNameTranslated: 'Existing Model ID',
            referenceLabel: null,
            questionType: null,
            notApplicableQuestions: null,
            old: null,
            oldTranslated: null,
            new: '100109',
            newTranslated:
              'Accountable Care Organization Realizing Equity, Access, and Community Health Model (ACO REACH) '
          }
        ],
        metaData: null
      },
      {
        __typename: 'TranslatedAudit',
        id: 'b2e38af2-caea-4b56-a53f-604685d79a46',
        tableName: 'existing_model_link',
        date: '2024-06-07T19:14:30.145659Z',
        action: DatabaseOperation.INSERT,
        actorName: 'MINT Doe',
        translatedFields: [
          {
            __typename: 'TranslatedAuditField',
            id: 'b7dd0a66-30ff-4e55-9b23-ab7bd5564b57',
            changeType: AuditFieldChangeType.ANSWERED,
            dataType: TranslationDataType.STRING,
            fieldName: 'field_name',
            fieldNameTranslated: 'What question is this link for?',
            referenceLabel: null,
            questionType: null,
            notApplicableQuestions: null,
            old: null,
            oldTranslated: null,
            new: 'GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH',
            newTranslated:
              'Which existing models does your proposed track/model most closely resemble?'
          },
          {
            __typename: 'TranslatedAuditField',
            id: '127c0a19-9ab0-47f9-9d17-14120622163d',
            changeType: AuditFieldChangeType.ANSWERED,
            dataType: TranslationDataType.STRING,
            fieldName: 'existing_model_id',
            fieldNameTranslated: 'Existing Model ID',
            referenceLabel: null,
            questionType: null,
            notApplicableQuestions: null,
            old: null,
            oldTranslated: null,
            new: '100066',
            newTranslated: 'Accountable Health Communities Model (AHC)'
          }
        ],
        metaData: null
      }
    ];
    const result = condenseLinkingTableChanges(changes as ChangeRecordType[]);

    expect(result[0].metaData?.tableName).toBe(
      'Which existing models does your proposed track/model most closely resemble?'
    );

    expect(result).toEqual([
      {
        __typename: 'TranslatedAudit',
        id: '4a380e4d-9c81-4515-8994-c25f6f533de8',
        tableName: 'existing_model_link',
        date: '2024-06-07T19:14:30.145659Z',
        action: DatabaseOperation.INSERT,
        actorName: 'MINT Doe',
        translatedFields: [
          {
            __typename: 'TranslatedAuditField',
            id: '631e0ac6-1f52-4ed4-8c1e-f94fd742011f',
            changeType: AuditFieldChangeType.ANSWERED,
            dataType: TranslationDataType.STRING,
            fieldName: 'existing_model_id',
            fieldNameTranslated:
              'Accountable Care Organization Realizing Equity, Access, and Community Health Model (ACO REACH) ',
            referenceLabel: null,
            questionType: null,
            notApplicableQuestions: null,
            old: null,
            oldTranslated: null,
            new: '100109',
            newTranslated: DatabaseOperation.INSERT
          },
          {
            __typename: 'TranslatedAuditField',
            id: '127c0a19-9ab0-47f9-9d17-14120622163d',
            changeType: AuditFieldChangeType.ANSWERED,
            dataType: TranslationDataType.STRING,
            fieldName: 'existing_model_id',
            fieldNameTranslated: 'Accountable Health Communities Model (AHC)',
            referenceLabel: null,
            questionType: null,
            notApplicableQuestions: null,
            old: null,
            oldTranslated: null,
            new: '100066',
            newTranslated: DatabaseOperation.INSERT
          }
        ],
        metaData: {
          tableName:
            'Which existing models does your proposed track/model most closely resemble?'
        }
      }
    ]);
  });

  // Test for getSolutionOperationStatus
  it('should return the correct database operation based on if needed field', () => {
    const change = {
      __typename: 'TranslatedAudit',
      id: '4a380e4d-9c81-4515-8994-c25f6f533de8',
      tableName: 'operational_solution',
      date: '2024-06-07T19:14:30.145659Z',
      action: DatabaseOperation.UPDATE,
      actorName: 'MINT Doe',
      translatedFields: [
        {
          __typename: 'TranslatedAuditField',
          id: '631e0ac6-1f52-4ed4-8c1e-f94fd742011f',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.STRING,
          fieldName: 'needed',
          fieldNameTranslated:
            'Accountable Care Organization Realizing Equity, Access, and Community Health Model (ACO REACH) ',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'false',
          newTranslated: 'false'
        }
      ]
    };

    const result = getSolutionOperationStatus(change as ChangeRecordType);

    expect(result).toEqual(DatabaseOperation.DELETE);

    change.translatedFields[0].new = 'true';

    const result2 = getSolutionOperationStatus(change as ChangeRecordType);

    expect(result2).toEqual(DatabaseOperation.INSERT);

    change.translatedFields[0].fieldName = 'other_field';

    const result3 = getSolutionOperationStatus(change as ChangeRecordType);

    expect(result3).toEqual(DatabaseOperation.UPDATE);
  });

  it('should return the correct action text for the database operation', () => {
    const change = {
      id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
      changeType: AuditFieldChangeType.ANSWERED,
      fieldName: 'status',
      fieldNameTranslated: 'Model Plan status',
      old: null,
      oldTranslated: null,
      new: 'READY',
      newTranslated: 'Ready',
      __typename: 'TranslatedAuditField',
      dataType: TranslationDataType.ENUM
    } as ChangeRecordType['translatedFields'][0];

    // should return created text for insert operation on OPERATIONAL_NEED table
    const result1 = getActionText(
      change,
      DatabaseOperation.INSERT,
      TableName.OPERATIONAL_NEED
    );
    expect(result1).toBe('created');

    // should return team change type text for non-delete operation with questionType NOTE
    const result2 = getActionText(
      change,
      DatabaseOperation.UPDATE,
      TableName.OPERATIONAL_NEED
    );
    expect(result2).toBe('answered');

    // should return change type text for non-delete operation with non-NOTE questionType
    const changeWithDifferentQuestionType = {
      ...change,
      questionType: 'OTHER'
    } as ChangeRecordType['translatedFields'][0];

    const result3 = getActionText(
      changeWithDifferentQuestionType,
      DatabaseOperation.UPDATE,
      TableName.OPERATIONAL_NEED
    );
    expect(result3).toBe('answered');

    // should return empty string for delete operation
    const result4 = getActionText(
      change,
      DatabaseOperation.DELETE,
      TableName.OPERATIONAL_NEED
    );
    expect(result4).toBe('');
  });

  // Test for getSolutionOperationStatus
  it('should return the correct text for document changes', () => {
    const change = {
      __typename: 'TranslatedAudit',
      id: '4a380e4d-9c81-4515-8994-c25f6f533de8',
      tableName: 'operational_solution',
      date: '2024-06-07T19:14:30.145659Z',
      action: DatabaseOperation.INSERT,
      actorName: 'MINT Doe',
      translatedFields: [
        {
          __typename: 'TranslatedAuditField',
          id: '631e0ac6-1f52-4ed4-8c1e-f94fd742011f',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.STRING,
          fieldName: 'url',
          fieldNameTranslated:
            'Accountable Care Organization Realizing Equity, Access, and Community Health Model (ACO REACH) ',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'false',
          newTranslated: 'http://google.com'
        }
      ]
    };

    const result = documentUpdateType(change as ChangeRecordType);

    expect(result).toEqual('added');

    change.translatedFields[0].newTranslated = '';

    const result2 = documentUpdateType(change as ChangeRecordType);

    expect(result2).toEqual('uploaded');

    change.action = DatabaseOperation.DELETE;

    const result3 = documentUpdateType(change as ChangeRecordType);

    expect(result3).toEqual('removed');
  });
});
