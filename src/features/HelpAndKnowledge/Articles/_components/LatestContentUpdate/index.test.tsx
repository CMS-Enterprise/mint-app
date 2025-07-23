import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GetLastCommit from 'gql/externalOperations/Github/GetLastCommit';
import i18next from 'i18next';
import VerboseMockedProvider from 'tests/MockedProvider';

import { filePath, owner, repo } from 'constants/github';

import '@testing-library/jest-dom';

import LatestContentUpdate from './index';

// Mock formatDateUtc for predictable output
vi.mock('utils/date', () => ({
  formatDateUtc: () => '01/01/2024'
}));

describe('LatestContentUpdate', () => {
  const file = 'testFile.ts';
  const variables = {
    owner,
    repo,
    path: `${filePath}${file}`
  };

  const commitDate = '2024-01-01T00:00:00Z';

  const mocks = [
    {
      request: {
        query: GetLastCommit,
        variables
      },
      result: {
        data: {
          repository: {
            object: {
              history: {
                edges: [
                  {
                    node: {
                      committedDate: commitDate,
                      oid: 'abc123'
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  ];

  it('renders nothing if query returns no commits', async () => {
    const noCommitMocks = [
      {
        request: {
          query: GetLastCommit,
          variables
        },
        result: {
          data: {
            repository: {
              object: {
                history: {
                  edges: []
                }
              }
            }
          }
        }
      }
    ];

    render(
      <VerboseMockedProvider mocks={noCommitMocks}>
        <LatestContentUpdate file={file} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Last updated/)).not.toBeInTheDocument();
    });
  });

  it('renders nothing if query errors', async () => {
    const errorMocks = [
      {
        request: {
          query: GetLastCommit,
          variables
        },
        error: new Error('Network error')
      }
    ];

    render(
      <VerboseMockedProvider mocks={errorMocks}>
        <LatestContentUpdate file={file} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Last updated/)).not.toBeInTheDocument();
    });
  });

  it('renders last updated date when query is successful', async () => {
    render(
      <VerboseMockedProvider mocks={mocks}>
        <LatestContentUpdate file={file} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          i18next.t('helpAndKnowledge:lastUpdated', { date: '01/01/2024' })
        )
      ).toBeInTheDocument();
    });
  });
});
