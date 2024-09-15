import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import {
  AuditFieldChangeType,
  DatabaseOperation,
  GetChangeHistoryDocument,
  TranslationDataType
} from 'gql/generated/graphql';

import RecentChanges from '.';

const mocks = [
  {
    request: {
      query: GetChangeHistoryDocument,
      variables: {
        modelPlanID: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905'
      }
    },
    result: {
      data: {
        translatedAuditCollection: [
          {
            id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
            tableName: 'plan_basics',
            date: '2024-04-22T13:55:13.725192Z',
            action: DatabaseOperation.INSERT,
            metaData: {
              version: 1,
              tableName: 'plan_basics'
            },
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
          }
        ]
      }
    }
  }
];

vi.mock('./Trans', () => {
  return {
    Trans: ({ i18nKey }: { i18nKey: string }) => {
      return <span>{i18nKey}</span>;
    }
  };
});

describe('RecentChanges', () => {
  it('renders without error', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <RecentChanges modelID="ce3405a0-3399-4e3a-88d7-3cfc613d2905" />
        </MockedProvider>
      </MemoryRouter>
    );
  });

  it('renders change records', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <RecentChanges modelID="ce3405a0-3399-4e3a-88d7-3cfc613d2905" />
        </MockedProvider>{' '}
      </MemoryRouter>
    );

    await waitFor(() => getByText(/MINT Doe/i));
    expect(getByText(/MINT Doe/i)).toBeInTheDocument();
    expect(getByText(/April 22, 2024/i)).toBeInTheDocument();
    expect(getByText(/1:55 pm/i)).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <RecentChanges modelID="ce3405a0-3399-4e3a-88d7-3cfc613d2905" />
        </MockedProvider>{' '}
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
