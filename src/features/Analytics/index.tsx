import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, GridContainer } from '@trussworks/react-uswds';
import downloadAnalytics, {
  analyticsSummaryConfig,
  AnalyticsSummaryKey,
  getChangesByOtherData,
  getChangesBySection
} from 'features/Analytics/util';
import NotFound from 'features/NotFound';
import { useGetAnalyticsSummaryQuery } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';

const Analytics = () => {
  const { t } = useTranslation('analytics');

  const flags = useFlags();

  const [selectedChart, setSelectedChart] = useState<string>('changesPerModel');

  const { data, loading, error } = useGetAnalyticsSummaryQuery({
    skip: !flags?.mintAnalyticsEnabled,
    fetchPolicy: 'network-only'
  });

  if (!flags?.mintAnalyticsEnabled) {
    return <NotFound />;
  }

  if (loading) return <PageLoading />;

  if (!data?.analytics || error)
    return (
      <MainContent>
        <GridContainer>{t('noAnalyticsData')}</GridContainer>
      </MainContent>
    );

  let chartData: any = !Array.isArray(
    data.analytics[selectedChart as AnalyticsSummaryKey]
  )
    ? [data.analytics[selectedChart as AnalyticsSummaryKey]]
    : data.analytics[selectedChart as AnalyticsSummaryKey];

  if (selectedChart === 'changesPerModelBySection') {
    chartData = getChangesBySection(data.analytics.changesPerModelBySection);
  } else if (selectedChart === 'changesPerModelOtherData') {
    chartData = getChangesByOtherData(data.analytics.changesPerModelOtherData);
  }

  return (
    <MainContent>
      <GridContainer>
        <Breadcrumbs
          items={[BreadcrumbItemOptions.HOME, BreadcrumbItemOptions.ANALYTICS]}
        />

        <h1>{t('heading')}</h1>

        <Button
          type="button"
          className="margin-bottom-6"
          onClick={() => downloadAnalytics(data.analytics, 'analytics.xlsx')}
        >
          {t('downloadAnalytics')}
        </Button>

        <ButtonGroup type="segmented" className="margin-bottom-6">
          {Object.keys(analyticsSummaryConfig).map(key => (
            <Button
              type="button"
              outline={selectedChart === key}
              key={`${key}-button`}
              onClick={() => {
                setSelectedChart(key);
              }}
            >
              {t(key)}
            </Button>
          ))}
        </ButtonGroup>

        <h3 className="margin-bottom-2" style={{ marginLeft: '20rem' }}>
          {t(selectedChart)}
        </h3>

        <BarChart
          width={800}
          height={800}
          data={chartData as any[]}
          margin={{ top: 20, right: 30, left: 60, bottom: 200 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={
              analyticsSummaryConfig[selectedChart as AnalyticsSummaryKey]
                .xAxisDataKey
            }
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />

          <Tooltip
            formatter={(value, name) => [value, t(name as AnalyticsSummaryKey)]}
          />

          <Bar
            dataKey={
              analyticsSummaryConfig[selectedChart as AnalyticsSummaryKey]
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
