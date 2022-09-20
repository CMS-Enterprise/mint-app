import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { Parser, transforms } from 'json2csv';

import GetAllModelPlans from 'queries/GetAllModelPlans';
import {
  GetAllModelPlans as GetAllModelPlansType,
  GetAllModelPlans_modelPlanCollection as AllModelPlansType
} from 'queries/types/GetAllModelPlans';

import { csvFields, fieldsToUnwind } from './CsvData';

const csvFormatter = (csvData: AllModelPlansType[]) => {
  try {
    const transform = [
      transforms.unwind({ paths: fieldsToUnwind, blankOut: true })
    ];
    const parser = new Parser({
      // csvFields,
      fields: csvFields,
      transforms: transform
    });
    const csv = parser.parse(csvData);
    downloadFile(csv);
  } catch (err) {
    // TODO: add error handling: display a modal/message if things fail?
    console.error(err); // eslint-disable-line
  }
};

const downloadFile = (data: string) => {
  const element = document.createElement('a');
  const file = new Blob([data], {
    type: 'text/csv'
  });
  element.href = URL.createObjectURL(file);
  element.download = 'modelPlans.csv'; // TODO: make this configurable
  document.body.appendChild(element);
  element.click();
};

export const CsvExportLink = (): React.ReactElement => {
  const { t } = useTranslation(['home', 'exporting']);

  const [fetchModelCSVData] = useLazyQuery<GetAllModelPlansType>(
    GetAllModelPlans
  );

  const fetchData = async () => {
    const modelPlans = await fetchModelCSVData();
    csvFormatter(modelPlans?.data?.modelPlanCollection || []);
  };

  return (
    <div>
      <button type="button" onClick={() => fetchData()}>
        {t('downloadCSV')}
      </button>
    </div>
  );
};

export default CsvExportLink;
