import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { AuditFieldChangeType, DatabaseOperation } from 'gql/gen/graphql';

import ChangeRecord, { ChangeRecordType, parseArray } from './index';

describe('ChangeRecord', () => {
  const mockChangeRecord: ChangeRecordType = {
    id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
    modelName: 'test',
    tableID: 2,
    tableName: 'plan_basics',
    primaryKey: '69378be4-0766-489a-9dbe-941425b6ef5d',
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
        metaData: {
          version: 0,
          __typename: 'TranslatedAuditFieldMetaBaseStruct'
        },
        __typename: 'TranslatedAuditField'
      }
    ],
    actorID: '072e76aa-709d-4021-9480-16966b04f6c1',
    actorName: 'MINT Doe',
    changeID: 7,
    metaData: {
      version: 0,
      tableName: 'plan_basics',
      __typename: 'TranslatedAuditMetaBaseStruct'
    },
    __typename: 'TranslatedAudit'
  };

  it('renders without crashing', () => {
    render(<ChangeRecord changeRecord={mockChangeRecord} />);
  });

  it('displays actor name', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} />
    );
    expect(getByText('MINT Doe')).toBeInTheDocument();
  });

  it('displays translated fields', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} />
    );
    expect(getByText('Model Plan status')).toBeInTheDocument();
  });

  it('toggles details when "showDetails" and "hideDetails" are clicked', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} />
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
      <ChangeRecord changeRecord={mockChangeRecord} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('parseArray', () => {
  it('should replace curly braces with square brackets and parse as JSON', () => {
    const input = '{"One","Two","Three"}';
    const output = parseArray(input);
    expect(output).toEqual(['One', 'Two', 'Three']);
  });

  it('should return the original value if JSON parsing fails', () => {
    const input = 'not a json string';
    const output = parseArray(input);
    expect(output).toEqual('not a json string');
  });
});
