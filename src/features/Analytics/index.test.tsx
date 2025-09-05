import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetAnalyticsSummaryDocument,
  GetAnalyticsSummaryQuery,
  GetAnalyticsSummaryQueryVariables,
  ModelStatus
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { expect, it } from 'vitest';

import { getChangesByOtherData, getChangesBySection } from './util';
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
      },
      {
        __typename: 'ModelChangesBySectionAnalytics',
        modelName: 'Test Model 2',
        tableName: 'plan_basics',
        numberOfChanges: 3,
        numberOfRecordChanges: 2,
        modelPlanID: '123e4567-e89b-12d3-a456-426614174001'
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
      },
      {
        __typename: 'ModelChangesOtherDataAnalytics',
        modelName: 'Test Model 2',
        numberOfChanges: 2,
        numberOfRecordChanges: 1,
        section: 'plan_documents',
        modelPlanID: '123e4567-e89b-12d3-a456-426614174001'
      }
    ]
  }
};

const mocks: MockedResponse<
  GetAnalyticsSummaryQuery,
  GetAnalyticsSummaryQueryVariables
>[] = [
  {
    request: {
      query: GetAnalyticsSummaryDocument
    },
    result: {
      data: mockAnalyticsData
    }
  }
];

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const router = createMemoryRouter(
    [
      {
        path: '/analytics',
        element: <Analytics />
      }
    ],
    {
      initialEntries: ['/analytics']
    }
  );

  it('matches the snapshot when analytics feature is enabled and data is loaded', async () => {
    (useFlags as any).mockReturnValue({ mintAnalyticsEnabled: true });

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Download Analytics summary as XLSX')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
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
