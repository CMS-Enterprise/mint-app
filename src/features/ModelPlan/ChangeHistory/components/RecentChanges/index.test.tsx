import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list',
          element: (
            <RecentChanges modelID="ce3405a0-3399-4e3a-88d7-3cfc613d2905" />
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
  });

  it('renders change records', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list',
          element: (
            <RecentChanges modelID="ce3405a0-3399-4e3a-88d7-3cfc613d2905" />
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]
      }
    );

    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => getByText(/MINT Doe/i));
    expect(getByText(/MINT Doe/i)).toBeInTheDocument();
    expect(getByText(/April 22, 2024/i)).toBeInTheDocument();
    expect(getByText(/1:55 pm/i)).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list',
          element: (
            <RecentChanges modelID="ce3405a0-3399-4e3a-88d7-3cfc613d2905" />
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
