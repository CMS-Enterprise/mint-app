import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  Header,
  Link,
  PrimaryNav,
  Select
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import downloadAnalytics, {
  analyticsSummaryConfig,
  downloadChartAsPDF,
  downloadMTOMilestoneSummary,
  downloadMultipleChartsAsPDF,
  getChangesByOtherData,
  getChangesBySection,
  UsedAnalyticsSummaryKey
} from 'features/ReportsAndAnalytics/util';
import {
  TableName,
  useGetAnalyticsSummaryQuery,
  useGetMtoMilestoneSummaryQuery
} from 'gql/generated/graphql';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import CheckboxField from 'components/CheckboxField';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import Spinner from 'components/Spinner';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useFetchCSVData from 'hooks/useFetchCSVData';
import { reports } from 'i18n/en-US/analytics';
import tables from 'i18n/en-US/modelPlan/tables';
import { formatDateUtc } from 'utils/date';

export type ReportsType = 'mtoMilestoneSummary' | 'allModels';

const ReportsAndAnalytics = () => {
  const { t: modelPlanT } = useTranslation('modelPlan');
  const { t } = useTranslation('analytics');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');
  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  // Responsive margins and height for the chart
  const chartMargins = useMemo(() => {
    if (isMobile) {
      return { top: 40, right: 120, left: 40, bottom: 100 };
    }
    if (isTablet) {
      return { top: 40, right: 140, left: 80, bottom: 150 };
    }
    return { top: 40, right: 160, left: 120, bottom: 200 };
  }, [isMobile, isTablet]);

  const chartHeight = useMemo(() => {
    if (isMobile) return 400;
    if (isTablet) return 600;
    return 1000;
  }, [isMobile, isTablet]);

  // Format X-axis labels for date-based charts
  const formatXAxisLabel = (value: any) => {
    if (selectedChart === 'numberOfModelsOverTime') {
      // Format the monthYear value (e.g., "2023-01-01T00:00:00Z") to a readable date
      return formatDateUtc(value, 'MMMM yyyy');
    }
    return value;
  };

  const [selectedChart, setSelectedChart] = useState<string>('changesPerModel');

  const [appendTableToChart, setAppendTableToChart] = useState<boolean>(true);

  const [isDownloadingAllCharts, setIsDownloadingAllCharts] =
    useState<boolean>(false);

  // Fetch all data for CSV export of all model plans
  const { fetchAllData } = useFetchCSVData();

  const { data, loading, error } = useGetAnalyticsSummaryQuery({
    fetchPolicy: 'network-only' // Don't use cache for analytics summary
  });

  const analyticsData = data?.analytics || ({} as any);

  const { data: mtoMilestoneSummary, loading: mtoMilestoneSummaryLoading } =
    useGetMtoMilestoneSummaryQuery();

  const mtoMilestoneSummaryData = useMemo(() => {
    return mtoMilestoneSummary?.modelPlanCollection ?? [];
  }, [mtoMilestoneSummary?.modelPlanCollection]);

  // Some data is not an array, so we need to handle that
  let chartData: any = !Array.isArray(
    analyticsData[selectedChart as UsedAnalyticsSummaryKey]
  )
    ? [analyticsData[selectedChart as UsedAnalyticsSummaryKey]]
    : analyticsData[selectedChart as UsedAnalyticsSummaryKey];

  // Custom logic for changes per model by section and other data
  if (selectedChart === 'changesPerModelBySection') {
    chartData = getChangesBySection(analyticsData.changesPerModelBySection);
  } else if (selectedChart === 'changesPerModelOtherData') {
    chartData = getChangesByOtherData(analyticsData.changesPerModelOtherData);
  }

  // Onclick handler for downloading multiple charts as PDF
  const downloadMultipleChartsPDF = async () => {
    setIsDownloadingAllCharts(true);
    const originalChart = selectedChart; // Store the original chart
    const chartTypes = Object.keys(analyticsSummaryConfig);
    const singleChartData =
      analyticsData[selectedChart as UsedAnalyticsSummaryKey];
    const chartDataForPDF = Array.isArray(singleChartData)
      ? singleChartData
      : [];
    await downloadMultipleChartsAsPDF(
      chartTypes,
      'MINT-Analytics-All-Charts.pdf',
      setSelectedChart,
      chartDataForPDF
    );
    setIsDownloadingAllCharts(false);
    setSelectedChart(originalChart); // Restore the orignal chart
  };

  // If loading any data, show loading spinner
  if (loading || mtoMilestoneSummaryLoading)
    return <PageLoading data-testid="analytics-loading" />;

  return (
    <MainContent className="mint-body-normal">
      <GridContainer>
        <h1 className="margin-top-10 margin-bottom-2">{t('heading')}</h1>

        <p
          className="mint-body-large margin-top-0 margin-bottom-1"
          data-testid="analytics-description"
        >
          {t('description')}
        </p>

        <Trans
          i18nKey="analytics:contactMINTTeam"
          components={{
            email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
          }}
        />

        <h2 className="margin-top-6 margin-bottom-2">
          {t('downloadableReports')}
        </h2>

        <p className="mint-body-normal margin-top-0">
          {t('downloadableReportsDescription')}
        </p>

        <CardGroup className="padding-x-1 margin-y-4">
          <Grid desktop={{ col: 12 }}>
            <Grid row gap={1}>
              {Object.keys(reports).map(reportKey => (
                <Grid desktop={{ col: 4 }} tablet={{ col: 6 }} key={reportKey}>
                  <Card
                    containerProps={{
                      className: 'radius-md padding-0 margin-0',
                      style: {
                        minHeight: '350px'
                      }
                    }}
                    className="margin-bottom-2"
                  >
                    <CardHeader className="padding-3 padding-bottom-0">
                      <h3 className="line-height-normal margin-top-1">
                        {t(reports[reportKey as ReportsType].heading)}
                      </h3>
                    </CardHeader>

                    <CardBody className="padding-x-3 ">
                      <p>{t(reports[reportKey as ReportsType].description)}</p>

                      <p className="text-base-dark">
                        {t(reports[reportKey as ReportsType].formatExcel)}
                      </p>
                    </CardBody>

                    <CardFooter className="padding-3">
                      <Button
                        type="button"
                        className="margin-right-2"
                        disabled={mtoMilestoneSummaryLoading}
                        data-testid={`download-${reportKey}-button`}
                        onClick={() => {
                          if (reportKey === 'mtoMilestoneSummary') {
                            downloadMTOMilestoneSummary(
                              mtoMilestoneSummaryData,
                              'MINT-MTO_Milestone_Summary.xlsx'
                            );
                          } else if (reportKey === 'allModels') {
                            fetchAllData();
                          }
                        }}
                      >
                        {t('download')}
                      </Button>
                    </CardFooter>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </CardGroup>

        <h2 className="margin-top-6 margin-bottom-2">{t('mintAnalytics')}</h2>

        <p className="mint-body-normal margin-top-0">
          {t('mintAnalyticsDescription')}
        </p>

        {!analyticsData || error ? (
          <p data-testid="no-analytics-data">{t('noAnalyticsData')}</p>
        ) : (
          <>
            <Header
              basic
              extended={false}
              className={classNames(
                'model-to-operations__nav-container margin-top-4',
                {
                  'border-bottom border-base-lighter': !isTablet
                }
              )}
              data-testid="chart-navigation"
            >
              <div className="usa-nav-container padding-0">
                <PrimaryNav
                  items={Object.keys(analyticsSummaryConfig).map(item => (
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedChart(item);
                      }}
                      key={item}
                      data-testid={`chart-tab-${item}`}
                      style={{
                        textAlign: 'center'
                      }}
                      className={classNames(
                        'usa-nav__link margin-left-neg-2 margin-right-2',
                        {
                          'usa-current': selectedChart === item
                        }
                      )}
                    >
                      <span
                        className={classNames({
                          'text-primary': selectedChart === item
                        })}
                      >
                        {t(item)}
                      </span>
                    </Button>
                  ))}
                  mobileExpanded={false}
                  className="flex-justify-start margin-0 padding-0"
                />
              </div>
            </Header>

            {isTablet && (
              <div className="maxw-mobile-lg">
                <p className="margin-y-0 text-bold">{t('report')}</p>
                <Select
                  id="selected-chart"
                  name="selectedChart"
                  value={selectedChart}
                  data-testid="mobile-chart-selector"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSelectedChart(e.target.value);
                  }}
                  className="margin-bottom-0 text-primary text-bold margin-top-1"
                >
                  {Object.keys(analyticsSummaryConfig).map(item => {
                    return (
                      <option key={item} value={item}>
                        {t(item)}
                      </option>
                    );
                  })}
                </Select>
              </div>
            )}

            {/* <div> */}
            <Button
              type="button"
              className="margin-top-4 margin-right-2"
              unstyled
              data-testid="download-analytics-button"
              onClick={() => {
                downloadAnalytics(analyticsData, 'MINT-Analytics.xlsx');
              }}
            >
              {t('downloadExcel')}
            </Button>

            <Button
              type="button"
              className="margin-top-1 margin-right-2"
              unstyled
              data-testid="download-chart-pdf-button"
              onClick={() => {
                downloadChartAsPDF(
                  `analytics-chart-${selectedChart}`,
                  'MINT-Analytics-Chart.pdf',
                  chartData,
                  selectedChart
                );
              }}
            >
              {t('downloadPDF')}
            </Button>

            <Button
              type="button"
              className="margin-top-1 margin-right-4"
              unstyled
              data-testid="download-multiple-charts-pdf-button"
              disabled={isDownloadingAllCharts}
              onClick={downloadMultipleChartsPDF}
            >
              {t('downloadMultipleChartsPDF')}
              {isDownloadingAllCharts && (
                <Spinner size="small" className="margin-right-1" />
              )}
            </Button>

            <div className="display-inline-block">
              <CheckboxField
                id="append-table-to-chart"
                name="appendTableToChart"
                onBlur={() => {}}
                value="true"
                label={t('appendTableToChart')}
                checked={appendTableToChart}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAppendTableToChart(e.target.checked);
                }}
              />
            </div>
            {/* </div> */}

            <ResponsiveContainer
              width="100%"
              height={chartHeight}
              data-testid="chart-container"
              id={`analytics-chart-${selectedChart}`}
            >
              {analyticsSummaryConfig[selectedChart as UsedAnalyticsSummaryKey]
                .chartType === 'bar' ? (
                <BarChart data={chartData as any[]} margin={chartMargins}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey={
                      analyticsSummaryConfig[
                        selectedChart as UsedAnalyticsSummaryKey
                      ].xAxisDataKey
                    }
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tickFormatter={value => {
                      // Format different types of X-axis labels
                      if (selectedChart === 'modelsByStatus') {
                        // Format status values (e.g., "ACTIVE" -> "Active")
                        return modelPlanT(`status.options.${value}`);
                      }
                      if (
                        selectedChart === 'changesPerModelBySection' ||
                        selectedChart === 'changesPerModelOtherData'
                      ) {
                        // Format table names (e.g., "plan_basics" -> "Plan Basics")
                        return tables[value as TableName].generalName;
                      }
                      // For model names and other text, truncate if too long
                      if (typeof value === 'string' && value.length > 15) {
                        return `${value.substring(0, 12)}...`;
                      }
                      return value;
                    }}
                  />
                  <YAxis />

                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      t(name as UsedAnalyticsSummaryKey)
                    ]}
                  />

                  <Bar
                    dataKey={
                      analyticsSummaryConfig[
                        selectedChart as UsedAnalyticsSummaryKey
                      ].yAxisDataKey
                    }
                    fill="#008480"
                    animationDuration={300}
                    animationEasing="ease-out"
                  />
                </BarChart>
              ) : (
                <LineChart data={chartData as any[]} margin={chartMargins}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={
                      analyticsSummaryConfig[
                        selectedChart as UsedAnalyticsSummaryKey
                      ].xAxisDataKey
                    }
                    tickFormatter={formatXAxisLabel}
                  />
                  <YAxis />

                  <Tooltip
                    formatter={(value, name, props: any) => {
                      // Format the tooltip based on chart type
                      if (selectedChart === 'numberOfModelsOverTime') {
                        return [value, `${t(name as UsedAnalyticsSummaryKey)}`];
                      }
                      return [value, t(name as UsedAnalyticsSummaryKey)];
                    }}
                    labelFormatter={label => {
                      // Format the label (X-axis value) for date-based charts
                      if (selectedChart === 'numberOfModelsOverTime') {
                        return formatDateUtc(label, 'MMMM yyyy');
                      }
                      return label;
                    }}
                  />

                  <Line
                    dataKey={
                      analyticsSummaryConfig[
                        selectedChart as UsedAnalyticsSummaryKey
                      ].yAxisDataKey
                    }
                    stroke="#008480"
                    strokeWidth={3}
                    animationDuration={300}
                    animationEasing="ease-out"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </>
        )}
      </GridContainer>
    </MainContent>
  );
};

export default ReportsAndAnalytics;
