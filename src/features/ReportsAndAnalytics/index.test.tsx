import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { analyticsSummaryMock, mockAnalyticsData } from 'tests/mock/general';
import { mtoMilestoneSummaryMock } from 'tests/mock/mto';
import { expect, it } from 'vitest';

import { ASSESSMENT } from 'constants/jobCodes';

import { getChangesByOtherData, getChangesBySection } from './util';
import ReportsAndAnalytics from '.';

// Mock ResizeObserver for ResponsiveContainer
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

const mockStore = configureMockStore();
const store = mockStore({ auth: { euaId: 'MINT' } });

describe('ReportsAndAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const router = createMemoryRouter(
    [
      {
        path: '/reports-and-analytics',
        element: <ReportsAndAnalytics />
      }
    ],
    {
      initialEntries: ['/reports-and-analytics']
    }
  );

  it('matches the snapshot when analytics feature is enabled and data is loaded', async () => {
    const { asFragment } = render(
      <MockedProvider
        mocks={[...analyticsSummaryMock, ...mtoMilestoneSummaryMock]}
      >
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Changes per model')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders ctat report for assessment users', async () => {
    const assessmentStore = mockStore({
      auth: { euaId: 'MINT', groups: [ASSESSMENT] }
    });

    render(
      <MockedProvider
        mocks={[...analyticsSummaryMock, ...mtoMilestoneSummaryMock]}
      >
        <Provider store={assessmentStore}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Changes per model')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Contract assistance requests')
    ).toBeInTheDocument();
  });

  it('renders without ctat report for non-assessment users', async () => {
    render(
      <MockedProvider
        mocks={[...analyticsSummaryMock, ...mtoMilestoneSummaryMock]}
      >
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Changes per model')).toBeInTheDocument();
    });

    expect(
      screen.queryByText('Contract assistance requests')
    ).not.toBeInTheDocument();
  });

  it('returns cumulative changes by section', async () => {
    const expected = getChangesBySection(
      mockAnalyticsData.analytics.changesPerModelBySection
    );

    expect(expected).toEqual([
      { tableName: 'plan_basics', numberOfChanges: 8 }
    ]);
  });

  it('returns cumulative changes by other data', async () => {
    const expected = getChangesByOtherData(
      mockAnalyticsData.analytics.changesPerModelOtherData
    );

    expect(expected).toEqual([
      { section: 'plan_documents', numberOfChanges: 5 }
    ]);
  });
});
