import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetAnalyticsSummaryDocument,
  GetAnalyticsSummaryQuery,
  ModelStatus
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { expect, it } from 'vitest';

import Analytics from '.';

type GetAnalyticsSummaryType = GetAnalyticsSummaryQuery;

// Mock dependencies
vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: vi.fn()
}));

// Mock data
const mockAnalyticsData: GetAnalyticsSummaryType = {
  __typename: 'Query',
  analytics: {
    __typename: 'AnalyticsSummary',
    changesPerModel: [
      {
        __typename: 'ModelChangesAnalytics',
        modelName: 'Test Model 1',
        numberOfChanges: 10,
        numberOfRecordChanges: 5,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174000'
      },
      {
        __typename: 'ModelChangesAnalytics',
        modelName: 'Test Model 2',
        numberOfChanges: 15,
        numberOfRecordChanges: 8,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174001'
      }
    ],
    modelsByStatus: [
      {
        __typename: 'ModelsByStatusAnalytics',
        status: ModelStatus.ACTIVE,
        numberOfModels: 25
      },
      {
        __typename: 'ModelsByStatusAnalytics',
        status: ModelStatus.PLAN_DRAFT,
        numberOfModels: 15
      }
    ],
    numberOfFollowersPerModel: [
      {
        __typename: 'ModelFollowersAnalytics',
        modelName: 'Test Model 1',
        numberOfFollowers: 12,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174000'
      }
    ],
    totalNumberOfModels: {
      __typename: 'ModelCountAnalytics',
      totalNumberOfModels: 40
    },
    changesPerModelBySection: [
      {
        __typename: 'ModelChangesBySectionAnalytics',
        modelName: 'Test Model 1',
        tableName: 'plan_basics',
        numberOfChanges: 5,
        numberOfRecordChanges: 3,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174000'
      }
    ],
    changesPerModelOtherData: [
      {
        __typename: 'ModelChangesOtherDataAnalytics',
        modelName: 'Test Model 1',
        numberOfChanges: 3,
        numberOfRecordChanges: 2,
        section: 'plan_documents',
        modelPlanID: '123e4567-e89b-12d3-a456-426614174000'
      }
    ]
  }
};

const mocks = [
  {
    request: {
      query: GetAnalyticsSummaryDocument
    },
    result: {
      data: {
        analytics: mockAnalyticsData
      }
    }
  }
];

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot when analytics feature is enabled and data is loaded', async () => {
    (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename>
        <Analytics />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  //   it('matches the snapshot when analytics feature is disabled', () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: false });

  //     const { asFragment } = render(<Analytics />);
  //     expect(asFragment()).toMatchSnapshot();
  //   });

  //   it('matches the snapshot when loading', () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: null,
  //       loading: true,
  //       error: null
  //     });

  //     const { asFragment } = render(<Analytics />);
  //     expect(asFragment()).toMatchSnapshot();
  //   });

  //   it('matches the snapshot when there is an error', () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: null,
  //       loading: false,
  //       error: new Error('Failed to fetch analytics')
  //     });

  //     const { asFragment } = render(<Analytics />);
  //     expect(asFragment()).toMatchSnapshot();
  //   });

  //   it('matches the snapshot when no analytics data is available', () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: { analytics: null },
  //       loading: false,
  //       error: null
  //     });

  //     const { asFragment } = render(<Analytics />);
  //     expect(asFragment()).toMatchSnapshot();
  //   });

  //   it('renders analytics dashboard when feature is enabled and data is loaded', async () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: mockAnalyticsData,
  //       loading: false,
  //       error: null
  //     });

  //     render(<Analytics />);

  //     await waitFor(() => {
  //       expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  //       expect(screen.getByText('Download Analytics')).toBeInTheDocument();
  //       expect(screen.getByText('Changes Per Model')).toBeInTheDocument();
  //       expect(screen.getByText('Models by Status')).toBeInTheDocument();
  //     });
  //   });

  //   it('renders NotFound when analytics feature is disabled', () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: false });

  //     render(<Analytics />);

  //     // The NotFound component should be rendered
  //     expect(screen.queryByText('Analytics Dashboard')).not.toBeInTheDocument();
  //   });

  //   it('renders loading state when data is being fetched', () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: null,
  //       loading: true,
  //       error: null
  //     });

  //     render(<Analytics />);

  //     // PageLoading component should be rendered
  //     expect(screen.queryByText('Analytics Dashboard')).not.toBeInTheDocument();
  //   });

  //   it('renders error message when there is an error', () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: null,
  //       loading: false,
  //       error: new Error('Failed to fetch analytics')
  //     });

  //     render(<Analytics />);

  //     expect(screen.getByText('No analytics data available')).toBeInTheDocument();
  //   });

  //   it('renders no data message when analytics data is null', () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: { analytics: null },
  //       loading: false,
  //       error: null
  //     });

  //     render(<Analytics />);

  //     expect(screen.getByText('No analytics data available')).toBeInTheDocument();
  //   });

  //   it('displays chart data correctly when data is available', async () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: mockAnalyticsData,
  //       loading: false,
  //       error: null
  //     });

  //     render(<Analytics />);

  //     await waitFor(() => {
  //       expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  //       // Check that the chart data is displayed in the JSON output
  //       expect(screen.getByText(/Test Model 1/)).toBeInTheDocument();
  //       expect(screen.getByText(/ACTIVE/)).toBeInTheDocument();
  //     });
  //   });

  //   it('handles chart selection correctly', async () => {
  //     (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });
  //     (useGetAnalyticsSummaryQuery as any).mockReturnValue({
  //       data: mockAnalyticsData,
  //       loading: false,
  //       error: null
  //     });

  //     render(<Analytics />);

  //     await waitFor(() => {
  //       expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  //     });

  //     // The default selected chart should be 'changesPerModel'
  //     expect(screen.getByText('Changes Per Model')).toBeInTheDocument();
  //   });
});
