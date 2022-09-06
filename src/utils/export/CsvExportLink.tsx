import React, { useState } from 'react';
import { CSVLink } from 'react-csv';

import GetModelPlan from 'queries/GetModelPlan';

type ExportProps = {
  fileName: string;
  client?: any;
  modelIDs: string[]; // NJD: replace this with callback/query to call?
};

export const CsvExportLink = ({
  fileName,
  client,
  modelIDs,
  ...props
}: ExportProps): React.ReactElement => {
  const csvLink = React.createRef<any>();

  const [dataToExport, setDataToExport] = useState<any[]>([]);

  const fetchData = () => {
    const tempData: any[] = [];
    for (let i = 0; i < modelIDs.length; i += 1) {
      client
        .query({
          query: GetModelPlan,
          variables: { id: modelIDs[i] }
        })
        .then((result: any) => {
          tempData.push(result.data.modelPlan);
        })
        .catch(() => {
          // throw i18next.t('documents:urlFail'); // NJD TODO: add csv download error to i18n
          // eslint-disable-next-line no-throw-literal
          throw 'Failed to fetch data';
        });
    }

    setDataToExport(tempData);

    // Need this setTimeout in order for query to have time to return before using react-csv, otherwise you only get Ôªø in csv file - NJD: NOT WORKING!!
    setTimeout(() => {
      // click the CSVLink component to trigger the CSV download
      csvLink.current.link.click();

      // Reset data array - NJD: is this necessary with useState?
      // setDataToExport([]);
    });
  };

  // useEffect(() => {
  //   if (dataToExport && csvLink && csvLink.current && csvLink.current.link) {
  //     // Need this setTimeout in order for query to have time to return before using react-csv, otherwise you only get Ôªø in csv file - NJD: NOT WORKING!!
  //     setTimeout(() => {
  //       // click the CSVLink component to trigger the CSV download
  //       csvLink.current.link.click();

  //       // Reset data NJD: is this necessary?
  //       // setDataToExport([]);
  //     });
  //   }
  // }, [csvLink, dataToExport]);

  return (
    <div>
      <button
        className="usa-button usa-button--unstyled"
        type="button"
        onClick={fetchData}
      >
        Download CSV NJD Change this
      </button>

      <CSVLink
        data={dataToExport}
        filename={fileName}
        className="hidden"
        ref={csvLink}
        target="_blank"
        onClick={() => {
          // eslint-disable-next-line no-console
          console.log('NJD Clicked CSVLink');
          // eslint-disable-next-line no-console
          console.log(dataToExport);
        }}
      />
    </div>
  );
};

export default CsvExportLink;
