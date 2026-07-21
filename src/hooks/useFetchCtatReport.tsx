import { useCallback } from 'react';
import { Parser } from '@json2csv/plainjs';
import {
  GetAllCtatRequestsQuery,
  GetAllCtatRequestsQueryResult,
  useGetAllCtatRequestsLazyQuery
} from 'gql/generated/graphql';

import { downloadFile } from 'hooks/useFetchCSVData';

type CTATReportRow = GetAllCtatRequestsQuery['ctatRequests']['ctatRequests'][0];

export interface CTATDateRange {
  startDate: string;
  endDate: string;
}

type UseFetchCTATReport = {
  fetchCTATReport: (
    range?: CTATDateRange
  ) => Promise<GetAllCtatRequestsQueryResult>;
};

const isWithinRange = (createdDts: string, range: CTATDateRange) => {
  const created = new Date(createdDts).getTime();

  if (
    created < new Date(range.startDate).getTime() ||
    created > new Date(range.endDate).getTime()
  ) {
    return false;
  }

  return true;
};

const useFetchCTATReport = (): UseFetchCTATReport => {
  const [fetchAllCTATRequests] = useGetAllCtatRequestsLazyQuery();

  return {
    fetchCTATReport: useCallback(
      async range => {
        const result = await fetchAllCTATRequests();

        const rows: CTATReportRow[] =
          result.data?.ctatRequests.ctatRequests ?? [];

        const hasRange = range?.startDate && range?.endDate;

        const filteredRows = hasRange
          ? rows.filter(row => isWithinRange(row.createdDts, range))
          : rows;

        const parser = new Parser();
        const csv = parser.parse(filteredRows);

        downloadFile(csv, 'MINT-Contract_assistance_requests.csv');

        return result;
      },
      [fetchAllCTATRequests]
    )
  };
};

export default useFetchCTATReport;
