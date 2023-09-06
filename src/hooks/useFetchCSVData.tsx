/*
Hook used to fetch all data for either a single model plan or all model plans
Then processes the data into CSV format as well as initiates a download
*/

import { useCallback } from 'react';
import { FetchResult, useLazyQuery } from '@apollo/client';
import { Parser } from '@json2csv/plainjs';
import { unwind } from '@json2csv/transforms';

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
import { csvFields, fieldsToUnwind } from 'utils/export/CsvData';

interface CSVModelPlanType extends AllModelDataType, SingleModelPlanType {}

// Initiates the downloading of the formatted csv data
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

const csvFormatter = (csvData: CSVModelPlanType[]) => {
  try {
    const transform = [unwind({ paths: fieldsToUnwind, blankOut: true })];

    const parser = new Parser({
      fields: csvFields, // @ts-ignore
      transforms: transform // @ts-ignore
      // formatters: {
      //   string: (str: any) => console.log(str)
      // }
    });
    const csv = parser.parse(csvData);
    downloadFile(csv);
  } catch (err) {
    // TODO: add more robust error handling: display a modal/message if download fails?
    console.error(err); // eslint-disable-line
  }
};

type UseFetchCSVData = {
  fetchSingleData: (
    input: string
  ) => Promise<FetchResult<GetAllSingleModelData>>;
  fetchAllData: () => Promise<FetchResult<GetAllModelDataType>>;
};

const useFetchCSVData = (): UseFetchCSVData => {
  // Get data for a single model plan
  const [fetchSingleData] = useLazyQuery<
    GetAllSingleModelData,
    GetAllSingleModelDataVariables
  >(GetAllSingleModelPlan, {
    onCompleted: data => {
      csvFormatter(data?.modelPlan ? [data?.modelPlan] : []);
    }
  });

  // Get data for all model plans
  const [fetchAllData] = useLazyQuery<GetAllModelDataType>(GetAllModelPlans, {
    onCompleted: data => {
      csvFormatter(data?.modelPlanCollection || []);
    }
  });

  return {
    fetchSingleData: useCallback(
      async id => fetchSingleData({ variables: { id } }),
      [fetchSingleData]
    ),
    fetchAllData: useCallback(async () => fetchAllData(), [fetchAllData])
  };
};

export default useFetchCSVData;
