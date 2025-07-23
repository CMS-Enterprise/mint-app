import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GetLastCommit from 'gql/externalOperations/Github/GetLastCommit';
import i18next from 'i18next';
import VerboseMockedProvider from 'tests/MockedProvider';

import { filePath, owner, repo } from 'constants/github';
import * as dateUtils from 'utils/date';

import '@testing-library/jest-dom';

import LatestContentUpdate from './index';

beforeEach(() => {
  vi.restoreAllMocks();
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: any) => `Last updated ${opts?.date ?? ''}`
  })
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

  it('renders last updated date when query is successful', async () => {
    vi.spyOn(dateUtils, 'formatDateUtc').mockImplementationOnce(
      () => '01/01/2024'
    );

    render(
      <VerboseMockedProvider mocks={mocks}>
        <LatestContentUpdate file={file} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Last updated 01/01/2024')).toBeInTheDocument();
    });
  });

  it('renders nothing if query returns no commits', async () => {
    vi.spyOn(dateUtils, 'formatDateUtc').mockImplementationOnce(() => '');

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
    vi.spyOn(dateUtils, 'formatDateUtc').mockImplementationOnce(() => '');

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
});
