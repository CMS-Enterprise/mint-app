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
import { getKeys } from 'types/translation';
import { formatDateLocal, formatDateUtc } from 'utils/date';
import { csvFields, fieldsToUnwind } from 'utils/export/CsvData';

import usePlanTranslation from './usePlanTranslation';

interface CSVModelPlanType extends AllModelDataType, SingleModelPlanType {}

// Formats headers for data from translations or hardcoded labels
const headerFormatter = (dataField: string, allPlanTranslation: any) => {
  // If no hardcoded label, format using translation

  // Gets the tasklist section from the csv map
  const sectionIndex = dataField.indexOf('.');

  // Default to parent level modelPlan if no task list section
  let section: string = 'modelPlan';

  const fieldName = dataField.slice(sectionIndex + 1);

  if (sectionIndex !== -1) {
    section = dataField.substring(0, sectionIndex);
  }

  let translation = dataField;

  // Gets the label value from translation object
  if (allPlanTranslation[section][fieldName]?.label) {
    translation = allPlanTranslation[section][fieldName].label;
  }

  return translation;
};

const dataFormatter = (transformObj: any, allPlanTranslation: any) => {
  const mappedObj: any = { ...transformObj };
  getKeys(transformObj).forEach(key1 => {
    // Used to mapped Status/etc field on parent level of model plan
    if (allPlanTranslation.modelPlan[key1]?.options) {
      mappedObj[key1] =
        allPlanTranslation.modelPlan[key1].options[transformObj[key1]];
    }

    if (key1 === 'createdDts') {
      mappedObj[key1] = formatDateUtc(transformObj[key1], 'MM/dd/yyyy');
    }

    if (transformObj[key1] && typeof transformObj[key1] === 'object') {
      mappedObj[key1] = { ...transformObj[key1] };

      getKeys(transformObj[key1]).forEach(key2 => {
        if (allPlanTranslation[key1]?.[key2]?.options) {
          mappedObj[key1][key2] =
            allPlanTranslation[key1][key2].options[transformObj[key1][key2]];
        } else if (
          allPlanTranslation[key1]?.[key2]?.dataType === 'date' &&
          transformObj[key1][key2]
        ) {
          mappedObj[key1][key2] = formatDateLocal(
            transformObj[key1][key2],
            'MM/dd/yyyy'
          );
        } else {
          mappedObj[key1][key2] = transformObj[key1][key2];
        }
      });
    }
  });

  return mappedObj;
};

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

const csvFormatter = (csvData: CSVModelPlanType[], allPlanTranslation: any) => {
  try {
    const transform = unwind({ paths: fieldsToUnwind, blankOut: true });

    const parser = new Parser({
      fields: csvFields,
      transforms: [
        // transform,
        (transformObj: any) => {
          const mappedTransformObj = dataFormatter(
            transformObj,
            allPlanTranslation
          );
          return mappedTransformObj;
        }
      ],
      formatters: {
        header: (value: any) => {
          const translatedHeader = headerFormatter(value, allPlanTranslation);
          return translatedHeader;
        }
      }
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
      csvFormatter(
        data?.modelPlan ? [data?.modelPlan] : [],
        allPlanTranslation
      );
    }
  });

  const allPlanTranslation = usePlanTranslation();

  // Get data for all model plans
  const [fetchAllData] = useLazyQuery<GetAllModelDataType>(GetAllModelPlans, {
    onCompleted: data => {
      csvFormatter(data?.modelPlanCollection || [], allPlanTranslation);
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
