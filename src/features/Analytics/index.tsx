import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, GridContainer } from '@trussworks/react-uswds';
import {
  AnalyticsSummary,
  useGetAnalyticsSummaryQuery
} from 'gql/generated/graphql';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';

import downloadAnalytics from './util';

type AnalyticsSummaryKey = keyof Omit<AnalyticsSummary, '__typename'>;

const analyticsSumamryConfig: Record<
  AnalyticsSummaryKey,
  {
    xAxisDataKey: string;
    yAxisDataKey: string;
  }
> = {
  changesPerModel: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfChanges'
  },
  changesPerModelBySection: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfChanges'
  },
  changesPerModelOtherData: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfChanges'
  },
  modelsByStatus: {
    xAxisDataKey: 'status',
    yAxisDataKey: 'numberOfModels'
  },
  numberOfFollowersPerModel: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfFollowers'
  },
  totalNumberOfModels: {
    xAxisDataKey: 'totalNumberOfModels',
    yAxisDataKey: 'totalNumberOfModels'
  }
};

const Analytics = () => {
  const { t } = useTranslation('analytics');

  const [selectedChart, setSelectedChart] = useState<string>('changesPerModel');

  const { data, loading, error } = useGetAnalyticsSummaryQuery();

  if (loading) return <PageLoading />;

  if (!data?.analytics)
    return (
      <MainContent>
        <GridContainer>No analytics data found</GridContainer>
      </MainContent>
    );

  const chartData = !Array.isArray(
    data.analytics[selectedChart as AnalyticsSummaryKey]
  )
    ? [data.analytics[selectedChart as AnalyticsSummaryKey]]
    : data.analytics[selectedChart as AnalyticsSummaryKey];

  return (
    <MainContent>
      <GridContainer>
        <Breadcrumbs
          items={[BreadcrumbItemOptions.HOME, BreadcrumbItemOptions.ANALYTICS]}
        />

        <h1>Analytics</h1>

        {error && <div>Error: {error.message}</div>}

        <Button
          type="button"
          className="margin-bottom-6"
          onClick={() => downloadAnalytics(data.analytics, 'analytics.xlsx')}
        >
          Download Analytics as XLSX
        </Button>

        <ButtonGroup type="segmented" className="margin-bottom-6">
          {Object.keys(analyticsSumamryConfig).map(key => (
            <Button
              type="button"
              outline={selectedChart === key}
              onClick={() => {
                setSelectedChart(key);
              }}
            >
              {t(key)}
            </Button>
          ))}
        </ButtonGroup>

        <h3 className="margin-bottom-2 margin-left-10">{t(selectedChart)}</h3>

        <BarChart
          width={800}
          height={800}
          data={chartData as any[]}
          margin={{ top: 20, right: 30, left: 20, bottom: 200 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={
              analyticsSumamryConfig[selectedChart as AnalyticsSummaryKey]
                .xAxisDataKey
            }
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />

          <Tooltip />

          <Bar
            dataKey={
              analyticsSumamryConfig[selectedChart as AnalyticsSummaryKey]
                .yAxisDataKey
            }
            fill="#008480"
          />
        </BarChart>

        <pre>{JSON.stringify(data.analytics, null, 2)}</pre>
      </GridContainer>
    </MainContent>
  );
};

export default Analytics;
