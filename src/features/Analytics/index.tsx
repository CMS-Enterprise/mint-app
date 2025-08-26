import React from 'react';
import { GridContainer } from '@trussworks/react-uswds';
import { useGetAnalyticsSummaryQuery } from 'gql/generated/graphql';

import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';

const Analytics = () => {
  const { data, loading, error } = useGetAnalyticsSummaryQuery();

  const { analytics } = data || {};

  if (loading) return <PageLoading />;

  return (
    <MainContent>
      <GridContainer>
        <h1>Analytics</h1>

        {error && <div>Error: {error.message}</div>}

        {analytics && <pre>{JSON.stringify(analytics, null, 2)}</pre>}
      </GridContainer>
    </MainContent>
  );
};

export default Analytics;
