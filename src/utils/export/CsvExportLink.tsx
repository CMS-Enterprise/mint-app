import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
// @ts-ignore
import { Parser, transforms } from 'json2csv';

import GetModelPlans from 'queries/GetModelPlans';
import {
  GetModelPlans as GetModelPlansType,
  GetModelPlans_modelPlanCollection as ModelPlanType
} from 'queries/types/GetModelPlans';

const fields = [
  // {
  //   label: t('modelName'),
  //   value: 'modelName'
  // },
  'modelName',
  'modifiedDts',
  'status',
  'id',
  'createdBy',
  'createdDts',
  'collaborators.fullName',
  'collaborators.id',
  'collaborators.teamRole',
  'discussions.status',
  'discussions.replies.resolution'
];
const unwindFields = ['collaborators', 'discussions', 'discussions.replies'];

const csvFormatter = (csvData: ModelPlanType[]) => {
  try {
    const transform = [
      transforms.unwind({ paths: unwindFields, blankOut: true })
      // transforms.flatten('__')
    ];
    const parser = new Parser({
      fields,
      transforms: transform
    });
    const csv = parser.parse(csvData);
    downloadFile(csv);
  } catch (err) {
    // TODO: Download error handling
  }
};

const downloadFile = (data: string) => {
  const element = document.createElement('a');
  const file = new Blob([data], {
    type: 'text/csv'
  });
  element.href = URL.createObjectURL(file);
  element.download = 'modelPlans.csv';
  document.body.appendChild(element);
  element.click();
};

export const CsvExportLink = (): React.ReactElement => {
  const { t } = useTranslation('home');
  const [fetchModelCSVData] = useLazyQuery<GetModelPlansType>(GetModelPlans);

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
