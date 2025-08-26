import { GetAnalyticsSummaryQuery } from 'gql/generated/graphql';
import * as XLSX from 'xlsx';

import { getKeys } from 'types/translation';

const downloadAnalytics = (
  data: GetAnalyticsSummaryQuery | undefined,
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
    XLSX.utils.book_append_sheet(workbook, sheet, key);
  });

  // Write to file
  XLSX.writeFile(workbook, exportFileName);
};

export default downloadAnalytics;
