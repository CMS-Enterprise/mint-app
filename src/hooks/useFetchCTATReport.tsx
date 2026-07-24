import { useCallback } from 'react';
import { Parser } from '@json2csv/plainjs';
import csvFieldsCTAT from 'features/ReportsAndAnalytics/ctatReportFields';
import {
  GetAllCtatRequestsQuery,
  GetAllCtatRequestsQueryResult,
  useGetAllCtatRequestsLazyQuery
} from 'gql/generated/graphql';

import { downloadFile } from 'hooks/useFetchCSVData';

export type CTATReportData =
  GetAllCtatRequestsQuery['ctatRequests']['ctatRequests'][0];

export type CTATDateRange = {
  startDate: string;
  endDate: string;
};

type UseFetchCTATReport = {
  fetchCTATReport: (
    range?: CTATDateRange
  ) => Promise<GetAllCtatRequestsQueryResult>;
};

export const isWithinRange = (createdDts: string, range: CTATDateRange) => {
  const created = new Date(createdDts).getTime();

  if (
    created < new Date(range.startDate).getTime() ||
    created > new Date(range.endDate).getTime()
  ) {
    return false;
  }

  return true;
};

export const filterAndSortCTATData = (
  data: CTATReportData[],
  range?: CTATDateRange
) => {
  const sortedData = [...data].sort(
    (a, b) => Date.parse(a.createdDts) - Date.parse(b.createdDts)
  );

  if (range?.startDate && range?.endDate) {
    return sortedData.filter(row => isWithinRange(row.createdDts, range));
  }
  return sortedData;
};

const formatCTATCsv = (data: CTATReportData[], range?: CTATDateRange) => {
  const hasRange = range?.startDate && range?.endDate;

  const exportFilename = hasRange
    ? `MINT-Contract_assistance_requests_${range.startDate.split('T')[0]}_to_${range.endDate.split('T')[0]}.csv`
    : 'MINT-Contract_assistance_requests.csv';

  const processedData = filterAndSortCTATData(data, range);

  const parser = new Parser({ fields: csvFieldsCTAT });

  const csv = parser.parse(processedData);

  downloadFile(csv, exportFilename);
};

const useFetchCTATReport = (): UseFetchCTATReport => {
  const [fetchAllCTATRequests] = useGetAllCtatRequestsLazyQuery();

  return {
    fetchCTATReport: useCallback(
      async range => {
        const result = await fetchAllCTATRequests();

        formatCTATCsv(result.data?.ctatRequests.ctatRequests ?? [], range);

        return result;
      },
      [fetchAllCTATRequests]
    )
  };
};

export default useFetchCTATReport;
