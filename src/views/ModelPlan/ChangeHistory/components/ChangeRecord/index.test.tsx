import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  AuditFieldChangeType,
  DatabaseOperation,
  TranslationDataType
} from 'gql/gen/graphql';

import ChangeRecord, { ChangeRecordType } from './index';

describe('ChangeRecord', () => {
  const mockChangeRecord: ChangeRecordType = {
    id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
    tableName: 'plan_basics',
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
    expect(getByText('Model type')).toBeInTheDocument();
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
