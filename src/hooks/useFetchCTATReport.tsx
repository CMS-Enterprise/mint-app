import { useCallback } from 'react';
import { Parser } from '@json2csv/plainjs';
import csvFieldsCTAT, {
  utcDateFieldsToFormat
} from 'features/ReportsAndAnalytics/ctatReportFields';
import {
  GetAllCtatRequestsQuery,
  GetAllCtatRequestsQueryResult,
  useGetAllCtatRequestsLazyQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';

import { downloadFile } from 'hooks/useFetchCSVData';
import {
  getKeys,
  isTranslationFieldPropertiesWithOptions,
  TranslationContractAssistance
} from 'types/translation';
import { formatDateUtc } from 'utils/date';

import usePlanTranslation from './usePlanTranslation';

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

const dataFormatter = (
  transformDataObj: any,
  translations: TranslationContractAssistance
) => {
  const translatedDataObj: any = { ...transformDataObj };

  getKeys(transformDataObj).forEach((key: any) => {
    const fieldConfig =
      translations[key as keyof TranslationContractAssistance];

    const flattenNestedData = fieldConfig?.flattenNestedData;

    const enumOptions =
      fieldConfig &&
      isTranslationFieldPropertiesWithOptions(fieldConfig) &&
      fieldConfig.options;

    // Used to map timestamp values to a human readable date
    if (utcDateFieldsToFormat.includes(key)) {
      translatedDataObj[key] = transformDataObj[key]
        ? formatDateUtc(transformDataObj[key], 'MM/dd/yyyy')
        : transformDataObj[key];
    }

    // Translates any enum values - either single value or an array
    else if (enumOptions) {
      if (Array.isArray(transformDataObj[key])) {
        translatedDataObj[key] = transformDataObj[key]
          .map((field: any) => enumOptions[field as keyof typeof enumOptions])
          .join(', ');
      } else {
        translatedDataObj[key] =
          enumOptions[transformDataObj[key] as keyof typeof enumOptions];
      }
    }

    // Flatten nested data for export - ex: relatedMINTModels = [{modelNamee:  "Model 1"}] => relatedMINTModels = ["Model 1"]
    else if (flattenNestedData) {
      translatedDataObj[key] = transformDataObj[key]
        .map((item: Record<string, string>) => item[flattenNestedData])
        .join(', ');
    }

    // requester combines name and email for export
    else if (key === 'requesterUserAccount') {
      translatedDataObj[key] =
        `${transformDataObj[key]?.commonName} (${transformDataObj[key]?.email})`;
    }
  });

  return translatedDataObj;
};

// Formats headers for data from translations or hardcoded labels
export const headerFormatter = (
  fieldName: string,
  translations: TranslationContractAssistance
) => {
  let translation = fieldName;

  if (fieldName in translations) {
    const field =
      translations[fieldName as keyof TranslationContractAssistance];
    translation = field.exportLabel ?? field.label;
  }

  return translation;
};

const formatCTATCsv = (
  data: CTATReportData[],
  translations: TranslationContractAssistance,
  range?: CTATDateRange
) => {
  const hasRange = range?.startDate && range?.endDate;

  const exportFilename = hasRange
    ? `MINT-Contract_assistance_requests_${range.startDate.split('T')[0]}_to_${range.endDate.split('T')[0]}.csv`
    : 'MINT-Contract_assistance_requests.csv';

  const fields = csvFieldsCTAT(i18next.t);

  const processedData = filterAndSortCTATData(data, range);

  const parser = new Parser({
    fields,
    transforms: [
      (transformObj: any) => dataFormatter(transformObj, translations)
    ],
    formatters: {
      header: (value: any) => headerFormatter(value, translations)
    }
  });

  const csv = parser.parse(processedData);

  downloadFile(csv, exportFilename);
};

const useFetchCTATReport = (): UseFetchCTATReport => {
  const [fetchAllCTATRequests] = useGetAllCtatRequestsLazyQuery();

  const allPlanTranslation = usePlanTranslation();

  return {
    fetchCTATReport: useCallback(
      async range => {
        const result = await fetchAllCTATRequests();

        formatCTATCsv(
          result.data?.ctatRequests.ctatRequests ?? [],
          allPlanTranslation.contractAssistance,
          range
        );

        return result;
      },
      [fetchAllCTATRequests, allPlanTranslation]
    )
  };
};

export default useFetchCTATReport;
