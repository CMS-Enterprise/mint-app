import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { IconFileDownload } from '@trussworks/react-uswds';
import { client } from 'index';
import { Parser, transforms } from 'json2csv';

import GetAllModelPlans from 'queries/GetAllModelData';
import GetAllSingleModelPlan from 'queries/GetAllSingleModelPlan';
import {
  GetAllModelData as GetAllModelDataType,
  GetAllModelData_modelPlanCollection as AllModelDataType
} from 'queries/types/GetAllModelData';
import {
  GetAllSingleModelData,
  GetAllSingleModelData_modelPlan as SingleModelPlanType,
  GetAllSingleModelDataVariables
} from 'queries/types/GetAllSingleModelData';

import { csvFields, fieldsToUnwind } from './CsvData';

interface CSVModelPlanType extends AllModelDataType, SingleModelPlanType {}

const csvFormatter = (csvData: CSVModelPlanType[]) => {
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

export const fetchCSVData = async (modelPlanID?: string) => {
  if (modelPlanID) {
    // Fetches all data from a single model plan
    const singlePlan = await client.query<
      GetAllSingleModelData,
      GetAllSingleModelDataVariables
    >({
      query: GetAllSingleModelPlan,
      variables: {
        id: modelPlanID || ''
      }
    });
    csvFormatter(
      singlePlan?.data?.modelPlan ? [singlePlan?.data?.modelPlan] : []
    );
  } else {
    // Fetches all data from all model plans
    const allPlans = await client.query<GetAllModelDataType>({
      query: GetAllModelPlans
    });
    csvFormatter(allPlans?.data?.modelPlanCollection || []);
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
  modelPlanID?: string;
};

export const CsvExportLink = ({
  modelPlanID
}: CsvExportLinkType): React.ReactElement => {
  const { t } = useTranslation('home');

  return (
    <div>
      <button
        type="button"
        className="usa-button usa-button--unstyled display-flex"
        onClick={() => fetchCSVData(modelPlanID)}
      >
        {!modelPlanID && <IconFileDownload className="margin-right-1" />}
        <span>
          {modelPlanID ? t('downloadSingleCSV') : t('downloadAllCSV')}
        </span>
      </button>
    </div>
  );
};

export default CsvExportLink;
