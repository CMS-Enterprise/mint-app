import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, { date }: { date: string }) => `Last updated: ${date}`
  })
}));

vi.mock('utils/date', () => ({
  formatDateUtc: vi.fn(() => '09/24/2024')
}));

// Since githubApolloClient is used in the component and not wrapped in an ApolloProvider, we need to manually mock useQuery
// Rather than using the MockedProvider from @apollo/client/testing
let useQueryMock: ReturnType<typeof vi.fn>;

vi.mock('@apollo/client', async () => {
  const actual = await import('@apollo/client');
  useQueryMock = vi.fn();
  return {
    ...actual,
    useQuery: useQueryMock
  };
});

const file: string = 'testFile.ts';
const commitDate: string = '2024-09-30T17:29:16Z';

describe('LatestContentUpdate', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('renders last updated date when query is successful', async () => {
    // We need to import the component after mocking useQuery to ensure the mock is available
    const { default: LatestContentUpdate } = await import('./index');
    useQueryMock.mockReturnValue({
      data: {
        repository: {
          object: {
            history: {
              edges: [
                {
                  node: {
                    committedDate: commitDate,
                    oid: 'SOME_COMMIT_ID',
                    __typename: 'Commit'
                  },
                  __typename: 'CommitEdge'
                }
              ],
              __typename: 'CommitHistoryConnection'
            },
            __typename: 'Commit'
          },
          __typename: 'Repository'
        }
      },
      loading: false,
      error: undefined
    });
    render(<LatestContentUpdate file={file} />);
    expect(screen.getByText('Last updated: 09/24/2024')).toBeInTheDocument();
  });

  it('renders null if query returns no commits', async () => {
    const { default: LatestContentUpdate } = await import('./index');
    useQueryMock.mockReturnValue({
      data: {
        repository: {
          object: {
            history: {
              edges: []
            }
          }
        }
      },
      loading: false,
      error: undefined
    });

    const { formatDateUtc } = await import('utils/date');
    (formatDateUtc as ReturnType<typeof vi.fn>).mockReturnValue('');

    render(<LatestContentUpdate file={file} />);
    expect(screen.queryByText('Last updated:')).not.toBeInTheDocument();
  });

  it('renders null if query returns error', async () => {
    const { default: LatestContentUpdate } = await import('./index');
    useQueryMock.mockReturnValue({
      data: undefined,
      loading: false,
      error: new Error('Test error')
    });
    render(<LatestContentUpdate file={file} />);
    expect(screen.queryByText('Last updated:')).not.toBeInTheDocument();
  });

  it('renders null when query is loading', async () => {
    const { default: LatestContentUpdate } = await import('./index');
    useQueryMock.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined
    });
    render(<LatestContentUpdate file={file} />);
    expect(screen.queryByText('Last updated:')).not.toBeInTheDocument();
  });
});
