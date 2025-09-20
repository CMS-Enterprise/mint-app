import React from 'react';
import { toast } from 'react-toastify';
import {
  AnalyticsSummary,
  GetAnalyticsSummaryQuery,
  GetMtoMilestoneSummaryQuery,
  MtoRiskIndicator,
  TableName
} from 'gql/generated/graphql';
import html2canvas from 'html2canvas';
import i18next from 'i18next';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx-js-style';

import Alert from 'components/Alert';
import {
  columnHeaderTranslations,
  typenameTranslations
} from 'i18n/en-US/analytics';
import { milestoneMap } from 'i18n/en-US/modelPlan/modelToOperations';
import tables from 'i18n/en-US/modelPlan/tables';
import { getKeys } from 'types/translation';
import { formatDateUtc } from 'utils/date';

export type AnalyticsSummaryKey = keyof Omit<AnalyticsSummary, '__typename'>;

export type UsedAnalyticsSummaryKey = Exclude<
  AnalyticsSummaryKey,
  'totalNumberOfModels'
>;

export const analyticsSummaryConfig: Record<
  UsedAnalyticsSummaryKey,
  {
    xAxisDataKey: string;
    yAxisDataKey: string;
    xAxisLabel: string;
    chartType: 'bar' | 'line';
    hidden?: boolean;
  }
> = {
  changesPerModel: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfChanges',
    xAxisLabel: 'Model Name',
    chartType: 'bar'
  },
  changesPerModelBySection: {
    xAxisDataKey: 'tableName',
    yAxisDataKey: 'numberOfChanges',
    xAxisLabel: 'Model Name',
    chartType: 'bar'
  },
  changesPerModelOtherData: {
    xAxisDataKey: 'section',
    yAxisDataKey: 'numberOfChanges',
    xAxisLabel: 'Model Name',
    chartType: 'bar'
  },
  modelsByStatus: {
    xAxisDataKey: 'status',
    yAxisDataKey: 'numberOfModels',
    xAxisLabel: 'Model Status',
    chartType: 'bar'
  },
  numberOfFollowersPerModel: {
    xAxisDataKey: 'modelName',
    yAxisDataKey: 'numberOfFollowers',
    xAxisLabel: 'Model Name',
    chartType: 'bar'
  },
  numberOfModelsOverTime: {
    xAxisDataKey: 'monthYear',
    yAxisDataKey: 'numberOfModels',
    xAxisLabel: 'Month Year',
    chartType: 'line'
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

    // Apply column header translations
    if (sheet['!ref']) {
      const range = XLSX.utils.decode_range(sheet['!ref']);

      // Loop through all columns and apply translations
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
        if (sheet[headerCell] && sheet[headerCell].v) {
          const originalHeader = sheet[headerCell].v as string;
          const translatedHeader = columnHeaderTranslations[originalHeader];

          // Apply translation if available, otherwise keep original
          if (translatedHeader) {
            sheet[headerCell].v = translatedHeader;
          }
        }
      }

      // Apply cell value translations for specific columns
      for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
        for (let col = range.s.c; col <= range.e.c; col += 1) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          const cell = sheet[cellAddress];

          if (cell && cell.v) {
            const cellValue = cell.v as string;
            let translatedValue = cellValue;

            // Get the column header to determine what type of translation to apply
            const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
            const columnHeader = sheet[headerCell]?.v as string;

            // Handle __typename/Report name column - only populate first cell
            if (
              columnHeader === '__typename' ||
              columnHeader === 'Report name'
            ) {
              // Only keep the value in the first data row (row 1), clear all others
              if (row === 1) {
                // Keep the first cell value as is
                translatedValue = typenameTranslations[cellValue as string];
              } else {
                // Clear all other cells in this column
                translatedValue = '';
              }
            }
            // Translate status values
            else if (columnHeader === 'Status' || columnHeader === 'status') {
              // Translate status values (e.g., "ACTIVE" -> "Active")
              translatedValue = i18next.t(
                `modelPlan:status.options.${cellValue}`,
                cellValue
              );
            }
            // Translate table/section names
            else if (
              columnHeader === 'Table name' ||
              columnHeader === 'tableName' ||
              columnHeader === 'Section' ||
              columnHeader === 'section'
            ) {
              // Translate table names using the tables translation
              translatedValue = tables[cellValue as TableName].generalName;
            }
            // Format monthYear dates
            else if (columnHeader === 'monthYear' || columnHeader === 'Date') {
              // Format the monthYear value using formatDateUtc
              translatedValue = formatDateUtc(cellValue, 'MMMM yyyy');
            }

            // Update the cell value if translation was found or if we're clearing __typename cells
            if (translatedValue !== cellValue) {
              cell.v = translatedValue;
            }
          }
        }
      }
    }

    // Auto-fit columns
    const columnWidths = autoFitColumns(sheet);
    sheet['!cols'] = columnWidths;

    // Use translated yAxisDataKey for sheet name
    // Handle duplicates and truncate if needed to stay within 31 char limit
    const baseLabel = i18next.t(`analytics:${key as string}`);

    let sheetName: string;
    if (baseLabel) {
      // Start with the translated yAxis label
      let candidateName = baseLabel;

      // If it's too long, truncate it
      if (candidateName.length > 31) {
        candidateName = `${candidateName.substring(0, 28)}...`;
      }

      sheetName = candidateName;
    } else {
      sheetName = String(key);
    }
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
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

const riskMap: Record<MtoRiskIndicator, string> = {
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
        Model: !addedModelPlans.includes(item.id) ? item.modelName : '',
        Milestone: milestone.name,
        Description: milestone.key
          ? milestoneMap[milestone.key]?.description
          : '',
        'Facilitated by': (milestone.facilitatedBy || [])
          ?.map(facilitator =>
            i18next.t(`mtoMilestone:facilitatedBy.options.${facilitator}`)
          )
          .join(', '),
        'Needed by': formatDateUtc(milestone.needBy, 'MM/dd/yyyy'),
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
  const concernsColumnIndex = 6; // Column E (0-indexed)
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

      if (!sheet[cellAddress]) {
        sheet[cellAddress] = { v: '', s: {} };
      }
      if (!sheet[cellAddress].s) {
        sheet[cellAddress].s = {};
      }

      // Ensure border is always applied with black color
      sheet[cellAddress].s.border = borderStyle;
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
      // Ensure black borders are preserved on header cells
      sheet[headerCell].s.border = borderStyle;
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
      // Ensure black borders are preserved
      cell.s.border = borderStyle;
    }
  }

  // NOT NEEDED ANYMORE, may need for future
  // Style "Needed By" column - make 'Completed' text grey
  const neededByColumnIndex = 4; // "Needed By" is the 3rd column (0-indexed)
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
  const quarterStartColumn = 7; // Quarters start after Concerns column (0-indexed)
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
        // Ensure black borders are preserved
        cell.s.border = borderStyle;
      }
    }
  }

  XLSX.utils.book_append_sheet(workbook, sheet, 'MTO Milestone Summary');

  // Write to file
  XLSX.writeFile(workbook, exportFileName);
};

// Helper function to add data table to PDF
const addDataTableToPDF = (
  pdf: any,
  chartData: any[],
  chartType: string | undefined,
  pageWidth: number,
  startY: number,
  maxHeight: number,
  analyticsData?: any
): void => {
  if (!chartData || chartData.length === 0) return;

  const margin = 20;
  const tableWidth = pageWidth - margin * 2;
  const cellHeight = 20;
  const headerHeight = 25;

  // Get the appropriate data for this specific chart type (same as Excel export)
  let processedData = chartData;

  // Apply the same data processing logic as the main component
  if (chartType && analyticsData) {
    if (chartType === 'changesPerModelBySection') {
      processedData = getChangesBySection(
        analyticsData.changesPerModelBySection
      );
    } else if (chartType === 'changesPerModelOtherData') {
      processedData = getChangesByOtherData(
        analyticsData.changesPerModelOtherData
      );
    } else {
      // Use the specific chart data from analyticsData
      const specificChartData =
        analyticsData[chartType as UsedAnalyticsSummaryKey];
      processedData = !Array.isArray(specificChartData)
        ? [specificChartData]
        : specificChartData;
    }
  }

  if (!processedData || processedData.length === 0) return;

  // Get column headers and keys from the processed data structure (same as Excel export)
  const firstItem = processedData[0];

  // Remove __typename key from the keys
  const keys = Object.keys(firstItem).filter(key => key !== '__typename');

  // Use all available keys from the data (same as Excel export)
  const headers = keys.map(
    key =>
      columnHeaderTranslations[key] ||
      key.charAt(0).toUpperCase() + key.slice(1)
  );
  const dataKeys = keys;

  const colWidth = tableWidth / headers.length;
  let currentY = startY;
  let currentPage = 0;
  let isFirstPage = true;
  const pageHeight = 600; // Full page height for new pages

  currentY += 30;

  // Add headers
  const addHeaders = () => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    headers.forEach((header, index) => {
      const x = margin + index * colWidth;
      pdf.rect(x, currentY, colWidth, headerHeight);
      pdf.text(header, x + 5, currentY + 15);
    });
    currentY += headerHeight;
  };

  // Add headers on first page
  addHeaders();

  // Add data rows with pagination
  pdf.setFont('helvetica', 'normal');
  processedData.forEach((item, rowIndex) => {
    // Check if we need a new page
    const remainingSpace = isFirstPage
      ? startY + maxHeight - currentY
      : pageHeight - currentY - 50;
    const spaceNeeded = cellHeight;

    if (remainingSpace < spaceNeeded) {
      // Add new page
      pdf.addPage();
      currentPage += 1;
      currentY = 50; // Start from top of new page
      isFirstPage = false;

      // Add headers on new page
      addHeaders();
    }

    // Add data row
    dataKeys.forEach((key, colIndex) => {
      const x = margin + colIndex * colWidth;
      const value = item[key];
      let displayValue = value;

      // Apply the same formatting logic as Excel export
      const columnHeader =
        columnHeaderTranslations[key] ||
        key.charAt(0).toUpperCase() + key.slice(1);
      // Handle __typename/Report name column - only populate first cell (same as Excel)
      if (key === '__typename' || columnHeader === 'Report name') {
        // Only keep the value in the first data row (row 1), clear all others
        if (rowIndex === 0) {
          // Keep the first cell value as is
          displayValue = typenameTranslations[value as string] || value;
        } else {
          // Clear all other cells in this column
          displayValue = '';
        }
      }
      // Translate status values
      else if (columnHeader === 'Status' || key === 'status') {
        // Translate status values (e.g., "ACTIVE" -> "Active")
        displayValue = i18next.t(`modelPlan:status.options.${value}`, value);
      }
      // Translate table/section names
      else if (
        columnHeader === 'Table name' ||
        key === 'tableName' ||
        columnHeader === 'Section' ||
        key === 'section'
      ) {
        // Translate table names using the tables translation
        displayValue = tables[value as TableName]?.generalName || value;
      }
      // Format monthYear dates
      else if (key === 'monthYear' || columnHeader === 'Date') {
        // Format the monthYear value using formatDateUtc
        displayValue = formatDateUtc(value, 'MMMM yyyy');
      }
      // Don't truncate model names - show full text
      else if (key === 'modelName') {
        displayValue = value;
      }
      // Truncate other long strings for display
      else if (typeof value === 'string' && value.length > 20) {
        displayValue = `${value.substring(0, 17)}...`;
      }

      pdf.rect(x, currentY, colWidth, cellHeight);
      pdf.text(String(displayValue), x + 5, currentY + 12);
    });
    currentY += cellHeight;
  });

  // Add page numbers if multiple pages
  if (currentPage > 0) {
    for (let pageNum = 0; pageNum <= currentPage; pageNum += 1) {
      pdf.setPage(pageNum + 1);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Page ${pageNum + 1} of ${currentPage + 1}`,
        pageWidth - 60,
        pageHeight - 10
      );
    }
  }
};

// Downloads a chart as PDF using html2canvas and jsPDF
export const downloadChartAsPDF = async (
  chartElementId: string,
  filename: string = 'MINT-Chart.pdf',
  chartData?: any[],
  chartType?: string,
  analyticsData?: any
): Promise<void> => {
  try {
    const chartElement = document.getElementById(chartElementId);
    if (!chartElement) {
      toast.error(
        <Alert
          type="error"
          heading={i18next.t('error:global.generalError')}
          isClosable={false}
        >
          <p className="margin-0">
            {i18next.t('analytics:errorGeneratingPDF')}
          </p>
        </Alert>
      );
      return;
    }

    // Create canvas from the chart element
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Calculate dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Create PDF with space for chart and data table
    const Pdf = jsPDF;
    const pageWidth = 600; // Portrait width
    const pageHeight = 800; // Portrait height
    const hasData = chartData && chartData.length > 0;
    const titleSpace = chartType ? 50 : 20; // Space for title if present
    const chartHeight = hasData
      ? 400 - titleSpace
      : pageHeight - titleSpace - 20; // Fill page if no data
    const tableHeight = pageHeight - chartHeight - titleSpace - 50; // Remaining space for table

    const pdf = new Pdf({
      orientation: 'portrait',
      unit: 'px',
      format: [pageWidth, pageHeight]
    });

    // Scale chart to fit allocated space
    const chartScale = Math.min(
      pageWidth / imgWidth,
      chartHeight / imgHeight,
      1
    );
    const scaledChartWidth = imgWidth * chartScale;
    const scaledChartHeight = imgHeight * chartScale;
    // Add chart title first
    if (chartType) {
      const chartTitle = i18next.t(`analytics:${chartType}`);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(chartTitle, pageWidth / 2, 30, { align: 'center' });
    }

    // Position chart below the title
    const chartX = (pageWidth - scaledChartWidth) / 2;
    const chartY = 50; // Move chart down to make room for title

    // Add the chart image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(
      imgData,
      'PNG',
      chartX,
      chartY,
      scaledChartWidth,
      scaledChartHeight
    );

    // Add data table if chart data is provided
    if (hasData) {
      addDataTableToPDF(
        pdf,
        chartData,
        chartType,
        pageWidth,
        chartY + scaledChartHeight + 10,
        tableHeight,
        analyticsData
      );
    }

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    toast.error(
      <Alert
        type="error"
        heading={i18next.t('error:global.generalError')}
        isClosable={false}
      >
        <p className="margin-0">{i18next.t('analytics:errorGeneratingPDF')}</p>
      </Alert>
    );
  }
};

// Downloads multiple charts as a single PDF by temporarily switching chart types
export const downloadMultipleChartsAsPDF = async (
  chartTypes: string[],
  filename: string = 'MINT-Charts.pdf',
  setSelectedChart?: (chartType: string) => void,
  chartData?: any[],
  analyticsData?: any
): Promise<void> => {
  try {
    const Pdf = jsPDF;
    const pageWidth = 600; // Portrait width (same as single PDF)
    const pageHeight = 800; // Portrait height (same as single PDF)
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    const pdf = new Pdf({
      orientation: 'portrait',
      unit: 'px',
      format: [pageWidth, pageHeight]
    });

    // Process each chart type by switching to it and capturing
    for (let i = 0; i < chartTypes.length; i += 1) {
      const chartType = chartTypes[i];

      // Switch to this chart type if callback provided
      if (setSelectedChart) {
        setSelectedChart(chartType);

        // Wait a bit for the chart to render
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 350));
      }

      // Look for the chart element with the current chart type
      const chartElement = document.getElementById(
        `analytics-chart-${chartType}`
      );

      if (!chartElement) {
        toast.error(
          <Alert
            type="error"
            heading={i18next.t('error:global.generalError')}
            isClosable={false}
          >
            <p className="margin-0">
              {i18next.t('analytics:errorGeneratingMultiChartPDF')}
            </p>
          </Alert>
        );
        // eslint-disable-next-line no-continue
        continue;
      }

      // Create canvas from the chart element
      // eslint-disable-next-line no-await-in-loop
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // Calculate scaling to fit allocated chart space
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Check if this chart has data to determine chart height
      const hasData = chartData && chartData.length > 0;
      const chartHeight = hasData ? 400 : pageHeight - 40; // Fill page if no data
      const maxChartHeight = chartHeight - 60; // Space for title

      const scaleX = maxWidth / imgWidth;
      const scaleY = maxChartHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      // Add new page for each chart (except the first one)
      if (i > 0) {
        pdf.addPage();
      }

      // Add chart title
      const chartTitle = i18next.t(`analytics:${chartType}`);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(chartTitle, pageWidth / 2, 30, { align: 'center' });

      // Position chart in allocated space
      const chartX = (pageWidth - scaledWidth) / 2;
      const chartY = 50; // Below title

      // Add the chart image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', chartX, chartY, scaledWidth, scaledHeight);

      // Add data table if chart data is provided
      if (hasData) {
        const tableHeight = pageHeight - chartHeight - 50; // Calculate table height dynamically
        addDataTableToPDF(
          pdf,
          chartData,
          chartType,
          pageWidth,
          chartY + scaledHeight + 10,
          tableHeight,
          analyticsData
        );
      }
    }

    // Add page numbers to all pages
    const totalPages = chartTypes.length; // Each chart gets its own page
    for (let pageNum = 1; pageNum <= totalPages; pageNum += 1) {
      pdf.setPage(pageNum);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth - 60,
        pageHeight - 10
      );
    }

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    toast.error(
      <Alert
        type="error"
        heading={i18next.t('error:global.generalError')}
        isClosable={false}
      >
        <p className="margin-0">
          {i18next.t('analytics:errorGeneratingMultiChartPDF')}
        </p>
        <p className="margin-0">{i18next.t('error:global.generalBody')}</p>
      </Alert>
    );
  }
};

export default downloadAnalytics;
