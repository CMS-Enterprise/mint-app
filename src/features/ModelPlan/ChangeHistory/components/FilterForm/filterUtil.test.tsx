import {
  AuditFieldChangeType,
  DatabaseOperation,
  TableName,
  TranslationDataType
} from 'gql/generated/graphql';

import { ChangeRecordType } from '../../util';

import { filterAuditsBetweenDates, getAllContributors } from './filterUtil';

describe('filterUtil.tsx', () => {
  // Mock data for testing
  const mockChangeRecord: ChangeRecordType = {
    id: 'test-id-1',
    tableName: TableName.PLAN_BASICS,
    date: '2024-01-15T10:30:00.000Z',
    action: DatabaseOperation.INSERT,
    translatedFields: [
      {
        id: 'field-id-1',
        changeType: AuditFieldChangeType.ANSWERED,
        fieldName: 'status',
        fieldNameTranslated: 'Status',
        old: null,
        oldTranslated: null,
        new: 'ACTIVE',
        newTranslated: 'Active',
        __typename: 'TranslatedAuditField',
        dataType: TranslationDataType.ENUM
      }
    ],
    actorName: 'John Doe',
    __typename: 'TranslatedAudit'
  };

  const mockChangeRecord2: ChangeRecordType = {
    id: 'test-id-2',
    tableName: TableName.PLAN_BASICS,
    date: '2024-01-16T11:30:00.000Z',
    action: DatabaseOperation.UPDATE,
    translatedFields: [
      {
        id: 'field-id-2',
        changeType: AuditFieldChangeType.ANSWERED,
        fieldName: 'model_name',
        fieldNameTranslated: 'Model Name',
        old: 'Old Name',
        oldTranslated: 'Old Name',
        new: 'New Name',
        newTranslated: 'New Name',
        __typename: 'TranslatedAuditField',
        dataType: TranslationDataType.STRING
      }
    ],
    actorName: 'Jane Smith',
    __typename: 'TranslatedAudit'
  };

  const mockChangeRecord3: ChangeRecordType = {
    id: 'test-id-3',
    tableName: TableName.PLAN_BASICS,
    date: '2024-01-17T12:30:00.000Z',
    action: DatabaseOperation.DELETE,
    translatedFields: [
      {
        id: 'field-id-3',
        changeType: AuditFieldChangeType.REMOVED,
        fieldName: 'description',
        fieldNameTranslated: 'Description',
        old: 'Old Description',
        oldTranslated: 'Old Description',
        new: null,
        newTranslated: null,
        __typename: 'TranslatedAuditField',
        dataType: TranslationDataType.STRING
      }
    ],
    actorName: 'Bob Johnson',
    __typename: 'TranslatedAudit'
  };

  describe('getAllContributors', () => {
    it('should return unique contributors excluding collaborators', () => {
      const changes: ChangeRecordType[][] = [
        [mockChangeRecord, mockChangeRecord2],
        [mockChangeRecord3]
      ];
      const collaborators = ['John Doe'];

      const result = getAllContributors(changes, collaborators);

      expect(result).toEqual(['Jane Smith', 'Bob Johnson']);
    });

    it('should handle duplicate actor names within changes', () => {
      const duplicateChange: ChangeRecordType = {
        ...mockChangeRecord,
        id: 'test-id-4',
        actorName: 'John Doe'
      };

      const changes: ChangeRecordType[][] = [
        [mockChangeRecord, duplicateChange],
        [mockChangeRecord2]
      ];
      const collaborators: string[] = [];

      const result = getAllContributors(changes, collaborators);

      expect(result).toEqual(['John Doe', 'Jane Smith']);
    });

    it('should return empty array when all contributors are collaborators', () => {
      const changes: ChangeRecordType[][] = [
        [mockChangeRecord, mockChangeRecord2],
        [mockChangeRecord3]
      ];
      const collaborators = ['John Doe', 'Jane Smith', 'Bob Johnson'];

      const result = getAllContributors(changes, collaborators);

      expect(result).toEqual([]);
    });
  });

  describe('filterAuditsBetweenDates', () => {
    const mockAudits: ChangeRecordType[][] = [
      [
        {
          ...mockChangeRecord,
          date: '2024-01-15T10:30:00.000Z'
        }
      ],
      [
        {
          ...mockChangeRecord2,
          date: '2024-01-20T11:30:00.000Z'
        }
      ],
      [
        {
          ...mockChangeRecord3,
          date: '2024-01-25T12:30:00.000Z'
        }
      ]
    ];

    it('should filter audits between start and end dates', () => {
      const startDate = '2024-01-16T00:00:00.000Z';
      const endDate = '2024-01-24T23:59:59.999Z';

      const result = filterAuditsBetweenDates(mockAudits, startDate, endDate);

      expect(result).toHaveLength(1);
      expect(result[0][0].date).toBe('2024-01-20T11:30:00.000Z');
    });

    it('should filter audits from start date onwards when no end date provided', () => {
      const startDate = '2024-01-20T00:00:00.000Z';

      const result = filterAuditsBetweenDates(mockAudits, startDate);

      expect(result).toHaveLength(2);
      expect(result[0][0].date).toBe('2024-01-20T11:30:00.000Z');
      expect(result[1][0].date).toBe('2024-01-25T12:30:00.000Z');
    });

    it('should filter audits up to end date when no start date provided', () => {
      const endDate = '2024-01-20T23:59:59.999Z';

      const result = filterAuditsBetweenDates(mockAudits, undefined, endDate);

      expect(result).toHaveLength(2);
      expect(result[0][0].date).toBe('2024-01-15T10:30:00.000Z');
      expect(result[1][0].date).toBe('2024-01-20T11:30:00.000Z');
    });

    it('should return all audits when no dates are provided', () => {
      const result = filterAuditsBetweenDates(mockAudits);

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockAudits);
    });

    it('should return empty array when no audits match date range', () => {
      const startDate = '2024-02-01T00:00:00.000Z';
      const endDate = '2024-02-28T23:59:59.999Z';

      const result = filterAuditsBetweenDates(mockAudits, startDate, endDate);

      expect(result).toHaveLength(0);
    });

    it('should handle audits with exact start date match', () => {
      const startDate = '2024-01-15T10:30:00.000Z';
      const endDate = '2024-01-25T12:30:00.000Z';

      const result = filterAuditsBetweenDates(mockAudits, startDate, endDate);

      expect(result).toHaveLength(3);
    });

    it('should handle audits with exact end date match', () => {
      const startDate = '2024-01-10T00:00:00.000Z';
      const endDate = '2024-01-25T12:30:00.000Z';

      const result = filterAuditsBetweenDates(mockAudits, startDate, endDate);

      expect(result).toHaveLength(3);
    });

    it('should handle empty audit groups', () => {
      const emptyAudits: ChangeRecordType[][] = [[], [mockChangeRecord], []];

      const result = filterAuditsBetweenDates(
        emptyAudits,
        '2024-01-10T00:00:00.000Z',
        '2024-01-20T23:59:59.999Z'
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([mockChangeRecord]);
    });
  });
});
