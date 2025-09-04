import {
  AnalyticsSummary,
  GetAnalyticsSummaryQuery,
  GetMtoMilestoneSummaryQuery,
  MtoRiskIndicator
} from 'gql/generated/graphql';
import i18next from 'i18next';
import * as XLSX from 'xlsx';

import { getKeys } from 'types/translation';
import { formatDateUtc } from 'utils/date';

export type AnalyticsSummaryKey = keyof Omit<AnalyticsSummary, '__typename'>;

export const analyticsSummaryConfig: Record<
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
    xAxisDataKey: 'tableName',
    yAxisDataKey: 'numberOfChanges',
    xAxisLabel: 'Model Name'
  },
  changesPerModelOtherData: {
    xAxisDataKey: 'section',
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

export const getChangesBySection = (
  data: GetAnalyticsSummaryQuery['analytics']['changesPerModelBySection']
) => {
  const sectionData: Record<string, number> = {};
  data.forEach(item => {
    if (!sectionData[item.tableName]) {
      sectionData[item.tableName] = 0;
    }
    sectionData[item.tableName] += item.numberOfChanges;
  });
  return Object.keys(sectionData).map(tableName => ({
    tableName,
    numberOfChanges: sectionData[tableName]
  }));
};

export const getChangesByOtherData = (
  data: GetAnalyticsSummaryQuery['analytics']['changesPerModelOtherData']
) => {
  const otherData: Record<string, number> = {};
  data.forEach(item => {
    if (!otherData[item.section]) {
      otherData[item.section] = 0;
    }
    otherData[item.section] += item.numberOfChanges;
  });
  return Object.keys(otherData).map(section => ({
    section,
    numberOfChanges: otherData[section]
  }));
};

// Prepares the analytics data for download as an XLSX file
function downloadAnalytics<T>(data: T, exportFileName: string): void {
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

    XLSX.utils.book_append_sheet(workbook, sheet, key as string);
  });

  // Write to file
  XLSX.writeFile(workbook, exportFileName);
}

// Auto-fits the columns in the worksheet to the width of the longest cell in the column
function autoFitColumns(worksheet: XLSX.WorkSheet): { wch: number }[] {
  const columnWidths: { wch: number }[] = [];

  const worksheetKeys = Object.keys(worksheet);

  // Get all column keys
  const columns = new Set<string>();
  worksheetKeys.forEach(key => {
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
    worksheetKeys.forEach(key => {
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

// Prepares the analytics data for download as an XLSX file
export const downloadMTOMilestoneSummary = (
  data: GetMtoMilestoneSummaryQuery['modelPlanCollection'],
  exportFileName: string
): void => {
  if (!data) return;

  const flattenedData: any = [];
  data.forEach(item => {
    item.mtoMatrix.milestones.forEach(milestone => {
      flattenedData.push({
        'Model Plan': item.modelName,
        Milestone: milestone.name,
        'Needed By': formatDateUtc(milestone.needBy, 'MM/dd/yyyy'),
        Status: i18next.t(`mtoMilestone:status.options.${milestone.status}`),
        Concerns: getRiskDescription(milestone.riskIndicator)
      });
    });
  });

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(flattenedData);

  const columnWidths = autoFitColumns(sheet);
  sheet['!cols'] = columnWidths;

  // Set row heights for better readability
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  if (!sheet['!rows']) {
    sheet['!rows'] = [];
  }

  // Set row height for all rows (including header)
  for (let row = 0; row <= range.e.r; row += 1) {
    sheet['!rows'][row] = { hpt: 25 }; // 25 points height (default is ~15)
  }

  XLSX.utils.book_append_sheet(workbook, sheet, 'MTO Milestone Summary');

  // Write to file
  XLSX.writeFile(workbook, exportFileName);
};

// Helper function to get risk description
function getRiskDescription(riskIndicator: MtoRiskIndicator): string {
  switch (riskIndicator) {
    case MtoRiskIndicator.ON_TRACK:
      return '🟢';
    case MtoRiskIndicator.OFF_TRACK:
      return '🟡';
    case MtoRiskIndicator.AT_RISK:
      return '🔴';
    default:
      return 'Unknown';
  }
}

export default downloadAnalytics;
