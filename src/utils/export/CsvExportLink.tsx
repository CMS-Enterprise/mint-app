import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { IconFileDownload } from '@trussworks/react-uswds';
import { Parser, transforms } from 'json2csv';

import GetAllModelPlans from 'queries/GetAllModelData';
import {
  GetAllModelData as GetAllModelDataType,
  GetAllModelData_modelPlanCollection as AllModelDataType
} from 'queries/types/GetAllModelData';

import { csvFields, fieldsToUnwind } from './CsvData';

const csvFormatter = (csvData: AllModelDataType[]) => {
  try {
    const transform = [
      transforms.unwind({ paths: fieldsToUnwind, blankOut: true })
    ];
    const parser = new Parser({
      fields: csvFields,
      transforms: transform
    });
    const csv = parser.parse(csvData);
    downloadFile(csv);
  } catch (err) {
    // TODO: add more robust error handling: display a modal/message if download fails?
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

type CsvExportLinkType = {
  includeAll: boolean;
};

export const CsvExportLink = ({
  includeAll
}: CsvExportLinkType): React.ReactElement => {
  const { t } = useTranslation('home');

  const [fetchModelCSVData] = useLazyQuery<GetAllModelDataType>(
    GetAllModelPlans,
    {
      variables: {
        includeAll
      }
    }
  );

  const fetchData = async () => {
    const modelPlans = await fetchModelCSVData();
    csvFormatter(modelPlans?.data?.modelPlanCollection || []);
  };

  return (
    <div>
      <button
        type="button"
        className="usa-button usa-button--unstyled display-flex"
        onClick={() => fetchData()}
      >
        <IconFileDownload />
        <span className="padding-left-1">{t('downloadCSV')}</span>
      </button>
    </div>
  );
};

export default CsvExportLink;
