import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { IconFileDownload } from '@trussworks/react-uswds';
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
import { ModelPlanFilter } from 'types/graphql-global-types';

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
  modelPlanID?: string;
};

export const CsvExportLink = ({
  includeAll,
  modelPlanID
}: CsvExportLinkType): React.ReactElement => {
  const { t } = useTranslation('home');

  // Fetches all data from all model plans
  const [fetchAllModelCSVData] = useLazyQuery<GetAllModelDataType>(
    GetAllModelPlans,
    {
      variables: {
        filter: ModelPlanFilter.INCLUDE_ALL
      }
    }
  );

  // Fetches all data from a single model plan
  const [fetchSingleModelCSVData] = useLazyQuery<
    GetAllSingleModelData,
    GetAllSingleModelDataVariables
  >(GetAllSingleModelPlan, {
    variables: {
      id: modelPlanID || ''
    }
  });

  const fetchData = async () => {
    if (modelPlanID) {
      const singlePlan = await fetchSingleModelCSVData();
      csvFormatter(
        singlePlan?.data?.modelPlan ? [singlePlan?.data?.modelPlan] : []
      );
    } else {
      const allPlans = await fetchAllModelCSVData();
      csvFormatter(allPlans?.data?.modelPlanCollection || []);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="usa-button usa-button--unstyled display-flex"
        onClick={() => fetchData()}
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
