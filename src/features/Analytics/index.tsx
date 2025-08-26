import React from 'react';
import { Button, GridContainer } from '@trussworks/react-uswds';
import { useGetAnalyticsSummaryQuery } from 'gql/generated/graphql';

import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';

import downloadAnalytics from './util';

const Analytics = () => {
  const { data, loading, error } = useGetAnalyticsSummaryQuery();

  if (loading) return <PageLoading />;

  if (!data?.analytics)
    return (
      <MainContent>
        <GridContainer>No analytics data found</GridContainer>
      </MainContent>
    );

  return (
    <MainContent>
      <GridContainer>
        <h1>Analytics</h1>

        <Button
          type="button"
          onClick={() => downloadAnalytics(data.analytics, 'analytics.xlsx')}
        >
          Download Analytics as XLSX
        </Button>

        {error && <div>Error: {error.message}</div>}

        <pre>{JSON.stringify(data.analytics, null, 2)}</pre>
      </GridContainer>
    </MainContent>
  );
};

export default Analytics;
