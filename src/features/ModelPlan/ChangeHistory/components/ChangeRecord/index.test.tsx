import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  AuditFieldChangeType,
  DatabaseOperation,
  TableName,
  TranslationDataType
} from 'gql/generated/graphql';

import ChangeRecord, { ChangeRecordType } from './index';

describe('ChangeRecord', () => {
  const mockChangeRecord: ChangeRecordType = {
    id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
    tableName: TableName.PLAN_BASICS,
    date: '2024-04-22T13:55:13.725192Z',
    action: DatabaseOperation.INSERT,
    translatedFields: [
      {
        id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
        changeType: AuditFieldChangeType.ANSWERED,
        dataType: TranslationDataType.BOOLEAN,
        fieldName: 'model_type',
        fieldNameTranslated: 'Model type',
        referenceLabel: null,
        questionType: null,
        notApplicableQuestions: null,
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

  it('renders without crashing', () => {
    render(<ChangeRecord changeRecord={mockChangeRecord} index={1} />);
  });

  it('displays actor name', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} index={1} />
    );
    expect(getByText('MINT Doe')).toBeInTheDocument();
  });

  it('displays translated fields', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} index={1} />
    );
    expect(getByText('Model type')).toBeInTheDocument();
  });

  it('uses generic metadata for custom timeline date-only updates', () => {
    const customTimelineDateRecord: ChangeRecordType = {
      id: 'bfbf2c34-7e6c-4c12-9d97-605e3aa3aace',
      tableName: TableName.CUSTOM_TIMELINE_DATE,
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.UPDATE,
      translatedFields: [
        {
          id: 'efad5c6d-c7e5-47a4-8981-27b14d9424c3',
          changeType: AuditFieldChangeType.UPDATED,
          dataType: TranslationDataType.DATE,
          fieldName: 'start_date',
          fieldNameTranslated: 'Start date',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: '2026-01-01T00:00:00Z',
          oldTranslated: '01/01/2026',
          new: '2026-02-01T00:00:00Z',
          newTranslated: '02/01/2026',
          __typename: 'TranslatedAuditField'
        }
      ],
      metaData: {
        __typename: 'TranslatedAuditMetaGeneric',
        version: 0,
        tableName: TableName.CUSTOM_TIMELINE_DATE,
        relation: 'title',
        relationContent: 'Custom date title'
      },
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };

    const { getByText } = render(
      <ChangeRecord changeRecord={customTimelineDateRecord} index={1} />
    );

    expect(
      getByText(/updated Custom date title in model timeline/)
    ).toBeInTheDocument();
  });

  it('toggles details when "showDetails" and "hideDetails" are clicked', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} index={1} />
    );
    const showDetailsButton = getByText('Show details');
    fireEvent.click(showDetailsButton);

    expect(getByText('Hide details')).toBeInTheDocument();
    const hideDetailsButton = getByText('Hide details');

    fireEvent.click(hideDetailsButton);
    expect(showDetailsButton).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <ChangeRecord changeRecord={mockChangeRecord} index={1} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
