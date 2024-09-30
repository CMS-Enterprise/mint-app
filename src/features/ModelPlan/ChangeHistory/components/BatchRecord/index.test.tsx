import React from 'react';
import { render } from '@testing-library/react';
import {
  AuditFieldChangeType,
  DatabaseOperation,
  TableName,
  TranslationDataType
} from 'gql/generated/graphql';

import { ChangeRecordType } from '../../util';

import BatchRecord from '.';

describe('ChangeRecord', () => {
  const mockChangeRecord: ChangeRecordType[] = [
    {
      __typename: 'TranslatedAudit',
      id: '1fb71b77-9bf9-418f-be42-f3adb3747c02',
      tableName: TableName.OPERATIONAL_SOLUTION,
      date: '2024-06-06T21:54:49.713741Z',
      action: DatabaseOperation.INSERT,
      actorName: 'QWER Doe',
      translatedFields: [
        {
          __typename: 'TranslatedAuditField',
          id: '45e18967-7ede-4ad2-be3c-9bc9e6e788b8',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.BOOLEAN,
          fieldName: 'status',
          fieldNameTranslated: 'Status',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'NOT_STARTED',
          newTranslated: 'Not started'
        },
        {
          __typename: 'TranslatedAuditField',
          id: 'e963974c-9dd5-4f9a-89f1-90e86cbdaa16',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.BOOLEAN,
          fieldName: 'needed',
          fieldNameTranslated: 'Is the solution needed?',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'true',
          newTranslated: 'Needed'
        }
      ],
      metaData: {
        __typename: 'TranslatedAuditMetaOperationalSolution',
        version: 0,
        tableName: TableName.OPERATIONAL_SOLUTION,
        needName: 'Helpdesk support',
        needIsOther: false,
        solutionName: 'Consolidated Business Operations Support Center (CBOSC)',
        solutionOtherHeader: null,
        solutionIsOther: false,
        numberOfSubtasks: 0,
        solutionStatus: 'NOT_STARTED',
        solutionMustStart: null,
        solutionMustFinish: null
      }
    },
    {
      __typename: 'TranslatedAudit',
      id: '252b58f3-bc16-4ab1-9a40-4688d4c03668',
      tableName: TableName.OPERATIONAL_SOLUTION,
      date: '2024-06-06T21:54:49.713245Z',
      action: DatabaseOperation.INSERT,
      actorName: 'QWER Doe',
      translatedFields: [
        {
          __typename: 'TranslatedAuditField',
          id: '8caa5860-9b03-4622-9823-b57029a49340',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.BOOLEAN,
          fieldName: 'needed',
          fieldNameTranslated: 'Is the solution needed?',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'true',
          newTranslated: 'Needed'
        },
        {
          __typename: 'TranslatedAuditField',
          id: '12107930-e776-4e90-8c3a-97091a8c1198',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.BOOLEAN,
          fieldName: 'status',
          fieldNameTranslated: 'Status',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'NOT_STARTED',
          newTranslated: 'Not started'
        }
      ],
      metaData: {
        __typename: 'TranslatedAuditMetaOperationalSolution',
        version: 0,
        tableName: TableName.OPERATIONAL_SOLUTION,
        needName: 'Helpdesk support',
        needIsOther: false,
        solutionName: 'Contractor',
        solutionOtherHeader: null,
        solutionIsOther: false,
        numberOfSubtasks: 2,
        solutionStatus: 'NOT_STARTED',
        solutionMustStart: null,
        solutionMustFinish: null
      }
    }
  ];

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <BatchRecord changeRecords={mockChangeRecord} index={1} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
