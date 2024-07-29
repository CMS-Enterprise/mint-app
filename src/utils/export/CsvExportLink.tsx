import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';

import useFetchCSVData from 'hooks/useFetchCSVData';

type CsvExportLinkType = {
  modelPlanID?: string;
};

export const CsvExportLink = ({
  modelPlanID
}: CsvExportLinkType): React.ReactElement => {
  const { t } = useTranslation('customHome');

  const { fetchSingleData, fetchAllData } = useFetchCSVData();

  return (
    <div>
      <button
        type="button"
        className="usa-button usa-button--unstyled display-flex"
        onClick={() =>
          modelPlanID ? fetchSingleData(modelPlanID) : fetchAllData()
        }
      >
        {!modelPlanID && <Icon.FileDownload className="margin-right-1" />}
        <span>
          {modelPlanID ? t('downloadSingleCSV') : t('downloadAllCSV')}
        </span>
      </button>
    </div>
  );
};

export default CsvExportLink;
