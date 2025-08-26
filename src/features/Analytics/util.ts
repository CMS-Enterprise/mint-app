import {
  AnalyticsSummary,
  GetAnalyticsSummaryQuery
} from 'gql/generated/graphql';
import * as XLSX from 'xlsx';

import { getKeys } from 'types/translation';

export type AnalyticsSummaryKey = keyof Omit<AnalyticsSummary, '__typename'>;

export const analyticsSumamryConfig: Record<
  AnalyticsSummaryKey,
  {
    xAxisDataKey: string;
    yAxisDataKey: string;
    xAxisLabel: string;
  }
> = {
  changesPerModel: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfChanges',
    xAxisLabel: 'Model Name'
  },
  changesPerModelBySection: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfChanges',
    xAxisLabel: 'Model Name'
  },
  changesPerModelOtherData: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfChanges',
    xAxisLabel: 'Model Name'
  },
  modelsByStatus: {
    xAxisDataKey: 'status',
    yAxisDataKey: 'numberOfModels',
    xAxisLabel: 'Model Status'
  },
  numberOfFollowersPerModel: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfFollowers',
    xAxisLabel: 'Model Name'
  },
  totalNumberOfModels: {
    xAxisDataKey: 'totalNumberOfModels',
    yAxisDataKey: 'totalNumberOfModels',
    xAxisLabel: 'Total Number of Models'
  }
};

// Prepares the analytics data for download as an XLSX file
const downloadAnalytics = (
  data: GetAnalyticsSummaryQuery['analytics'],
  exportFileName: string
) => {
  if (!data) return;

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  getKeys(data).forEach(key => {
    const sheetData = data[key];

    // Skip if the sheetData is undefined or a string/'AnalyticsSummary'
    if (sheetData === undefined || typeof sheetData === 'string') return;

    // If the sheetData is not an array, wrap it in an array
    const formattedSheetData = !Array.isArray(sheetData)
      ? [sheetData]
      : sheetData;

    const sheet = XLSX.utils.json_to_sheet(formattedSheetData);

    // Auto-fit columns
    const columnWidths = autoFitColumns(sheet);
    sheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, sheet, key);
  });

  // Write to file
  XLSX.writeFile(workbook, exportFileName);
};

// Auto-fits the columns in the worksheet to the width of the longest cell in the column
function autoFitColumns(worksheet: XLSX.WorkSheet): { wch: number }[] {
  const columnWidths: { wch: number }[] = [];

  // Get all column keys
  const columns = new Set<string>();
  Object.keys(worksheet).forEach(key => {
    if (key !== '!ref') {
      const colKey = key.replace(/\d+$/, '');
      columns.add(colKey);
    }
  });

  // Calculate width for each column
  columns.forEach(colKey => {
    let maxLength = 0;

    // First, check the header (row 1)
    const headerKey = `${colKey}1`;
    if (worksheet[headerKey] && worksheet[headerKey].v) {
      maxLength = Math.max(maxLength, worksheet[headerKey].v.toString().length);
    }

    // Then check all data rows
    Object.keys(worksheet).forEach(key => {
      if (key.startsWith(colKey) && key !== headerKey) {
        const cell = worksheet[key];
        if (cell && cell.v) {
          maxLength = Math.max(maxLength, cell.v.toString().length);
        }
      }
    });

    // Set reasonable bounds (min 10, max 50) with extra padding for headers
    const width = Math.max(10, Math.min(maxLength + 3, 50));
    columnWidths.push({ wch: width });
  });

  return columnWidths;
}

export default downloadAnalytics;
