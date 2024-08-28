import React from 'react';
import { GridContainer } from '@trussworks/react-uswds';
import { ModelPlanFilter, useGetFavoriteAnalyticsQuery } from 'gql/gen/graphql';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';

const UserAnalytics = () => {
  const { data, loading } = useGetFavoriteAnalyticsQuery({
    variables: {
      filter: ModelPlanFilter.INCLUDE_ALL
    }
  });

  const modelPlanCount = data?.modelPlanCollection?.length || 0;

  if (loading) {
    return <PageLoading />;
  }

  return (
    <MainContent>
      <GridContainer>
        <PageHeading>User Analytics</PageHeading>

        <div>Model plan count: {modelPlanCount}</div>
      </GridContainer>
    </MainContent>
  );
};

export default UserAnalytics;
