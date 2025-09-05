import {
  AnalyticsSummary,
  GetAnalyticsSummaryQuery,
  GetMtoMilestoneSummaryQuery,
  MtoMilestoneStatus,
  MtoRiskIndicator
} from 'gql/generated/graphql';
import i18next from 'i18next';
import * as XLSX from 'xlsx-js-style';

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

const riskMap = {
  [MtoRiskIndicator.ON_TRACK]: 'G',
  [MtoRiskIndicator.OFF_TRACK]: 'Y',
  [MtoRiskIndicator.AT_RISK]: 'R'
};

// Prepares the analytics data for download as an XLSX file
export const downloadMTOMilestoneSummary = (
  data: GetMtoMilestoneSummaryQuery['modelPlanCollection'],
  exportFileName: string
): void => {
  if (!data) return;

  const addedModelPlans: string[] = [];

  // Helper function to get quarter key from date
  const getQuarterKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${year}`;
  };

  // Helper function to generate all quarters for the next 2 years
  const generateQuarterKeys = (): string[] => {
    const quarters: string[] = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year <= currentYear + 2; year += 1) {
      for (let quarter = 1; quarter <= 4; quarter += 1) {
        quarters.push(`Q${quarter} ${year}`);
      }
    }
    return quarters;
  };

  const allQuarters = generateQuarterKeys();

  const flattenedData: any = [];
  data.forEach(item => {
    item.mtoMatrix.milestones.forEach(milestone => {
      // Create quarter object with all quarters initialized to empty string
      const quarterObject: { [key: string]: string } = {};
      allQuarters.forEach(quarter => {
        quarterObject[quarter] = '';
      });

      // Mark the relevant quarter with 'X' based on needBy date
      if (milestone.needBy) {
        const needByDate = new Date(milestone.needBy);
        const quarterKey = getQuarterKey(needByDate);
        if (Object.prototype.hasOwnProperty.call(quarterObject, quarterKey)) {
          quarterObject[quarterKey] = 'X';
        }
      }

      flattenedData.push({
        'Model Plan': !addedModelPlans.includes(item.id) ? item.modelName : '',
        Milestone: milestone.name,
        'Needed By':
          milestone.status === MtoMilestoneStatus.COMPLETED
            ? 'Completed'
            : formatDateUtc(milestone.needBy, 'MM/dd/yyyy'),
        Status: i18next.t(`mtoMilestone:status.options.${milestone.status}`),
        Concerns: riskMap[milestone.riskIndicator],
        ...quarterObject
      });

      if (!addedModelPlans.includes(item.id)) {
        addedModelPlans.push(item.id);
      }
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
    sheet['!rows'][row] = { hpt: 20 }; // 20 points height (default is ~15)
  }

  // Add borders to all cells in the sheet
  const concernsColumnIndex = 4; // Column E (0-indexed)
  const borderStyle = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  };

  // Apply borders to all cells
  for (let row = 0; row <= range.e.r; row += 1) {
    for (let col = 0; col <= range.e.c; col += 1) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];

      if (!cell) {
        sheet[cellAddress] = { v: '', s: { border: borderStyle } };
      } else {
        if (!cell.s) {
          cell.s = {};
        }
        cell.s.border = borderStyle;
      }
    }
  }

  // Style the header row with background color
  for (let col = 0; col <= range.e.c; col += 1) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
    if (sheet[headerCell]) {
      if (!sheet[headerCell].s) {
        sheet[headerCell].s = {};
      }
      sheet[headerCell].s.fill = { fgColor: { rgb: 'F0F0F0' } };
      sheet[headerCell].s.font = { bold: true };
      sheet[headerCell].s.alignment = { horizontal: 'center' };
    }
  }

  // Add background colors to the Concerns column based on risk indicators
  for (let row = 1; row <= range.e.r; row += 1) {
    const cellAddress = XLSX.utils.encode_cell({
      r: row,
      c: concernsColumnIndex
    });
    const cell = sheet[cellAddress];

    if (cell && cell.v) {
      let backgroundColor = '';
      let textColor = '000000';

      // Determine colors based on risk indicators
      if (cell.v.includes('G')) {
        backgroundColor = 'c6efce'; // Green
      } else if (cell.v.includes('Y')) {
        backgroundColor = 'f5e295'; // Yellow/Orange
      } else if (cell.v.includes('R')) {
        backgroundColor = 'fec7cd'; // Red
      } else {
        backgroundColor = 'CCCCCC'; // Gray for unknown
        textColor = '000000';
      }

      // Apply background color and text styling
      if (!cell.s) {
        cell.s = {};
      }
      cell.s.fill = { fgColor: { rgb: backgroundColor } };
      cell.s.font = { color: { rgb: textColor }, bold: true };
      cell.s.alignment = { horizontal: 'center' };
    }
  }

  // Style "Needed By" column - make 'Completed' text grey
  const neededByColumnIndex = 2; // "Needed By" is the 3rd column (0-indexed)
  for (let row = 1; row <= range.e.r; row += 1) {
    const cellAddress = XLSX.utils.encode_cell({
      r: row,
      c: neededByColumnIndex
    });
    const cell = sheet[cellAddress];

    if (cell && cell.v === 'Completed') {
      // Apply grey text color for completed milestones
      if (!cell.s) {
        cell.s = {};
      }
      cell.s.font = { color: { rgb: '808080' } }; // Grey text color
    }
  }

  // Style quarter columns - add grey background for cells with 'X'
  const quarterStartColumn = 5; // Quarters start after Concerns column (0-indexed)
  for (let row = 1; row <= range.e.r; row += 1) {
    for (let col = quarterStartColumn; col <= range.e.c; col += 1) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];

      if (cell && cell.v === 'X') {
        // Apply grey background and center alignment for X cells
        if (!cell.s) {
          cell.s = {};
        }
        cell.s.fill = { fgColor: { rgb: 'D3D3D3' } }; // Light grey background
        cell.s.alignment = { horizontal: 'center' };
        cell.s.font = { bold: true };
      }
    }
  }

  XLSX.utils.book_append_sheet(workbook, sheet, 'MTO Milestone Summary');

  // Write to file
  XLSX.writeFile(workbook, exportFileName);
};

export default downloadAnalytics;
