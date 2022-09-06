import React from 'react';
import CsvDownloader from 'react-csv-downloader';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';

import GetModelPlans from 'queries/GetModelPlans';
import { GetModelPlans as ModelPlansType } from 'queries/types/GetModelPlans';

type ExportProps = {
  fileName: string;
};

export const CsvExportLink = ({
  fileName
}: ExportProps): React.ReactElement => {
  const { t } = useTranslation('home');
  const [fetchModelCSVData] = useLazyQuery<ModelPlansType>(GetModelPlans);

  const fetchData = async () => {
    const modelPlans = await fetchModelCSVData();
    // TODO: Formatting response to flatten nested fields, etc
    return (modelPlans?.data?.modelPlanCollection as []) || [];
  };

  return (
    <div>
      <CsvDownloader datas={fetchData} filename={fileName}>
        {t('downloadCSV')}
      </CsvDownloader>
    </div>
  );
};

export default CsvExportLink;
