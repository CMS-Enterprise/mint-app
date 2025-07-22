import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import i18next from 'i18next';

import '@testing-library/jest-dom';

import LatestContentUpdate from './index';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('LatestContentUpdate', () => {
  const file = 'testFile.ts';
  const apiUrl = `https://api.github.com/repos/cms-enterprise/mint-app/commits?path=src/i18n/en-US/helpAndKnowledge/Articles/${file}&per_page=1`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders last updated date when fetch is successful', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { commit: { committer: { date: '2024-01-01T00:00:00Z' } } }
      ]
    });

    render(<LatestContentUpdate file={file} />);

    expect(mockFetch).toHaveBeenCalledWith(apiUrl);

    await waitFor(() => {
      expect(
        screen.getByText(
          i18next.t('helpAndKnowledge:lastUpdated', { date: '01/01/2024' })
        )
      ).toBeInTheDocument();
    });
  });

  it('renders nothing if fetch returns no commits', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<LatestContentUpdate file={file} />);

    await waitFor(() => {
      expect(screen.queryByText(/Last updated/)).not.toBeInTheDocument();
    });
  });

  it('renders nothing if fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<LatestContentUpdate file={file} />);

    await waitFor(() => {
      expect(screen.queryByText(/Last updated/)).not.toBeInTheDocument();
    });
  });

  it('renders nothing if fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<LatestContentUpdate file={file} />);

    await waitFor(() => {
      expect(screen.queryByText(/Last updated/)).not.toBeInTheDocument();
    });
  });
});
