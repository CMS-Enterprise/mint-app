/*
Hook used to fetch all data for either a single model plan or all model plans
Then processes the data into CSV format as well as initiates a download
*/

import { useCallback } from 'react';
import { FetchResult, useLazyQuery } from '@apollo/client';
import { Parser } from '@json2csv/plainjs';
import { unwind } from '@json2csv/transforms';
import i18next from 'i18next';

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

/**
 * @param dataField Dot notation of the nested field to be mapped to the header - ex: 'basics.goal'
 * @param allPlanTranslation Parent level obj containing all model plan tranlsation objects
 */

// Formats headers for data from translations or hardcoded labels
export const headerFormatter = (dataField: string, allPlanTranslation: any) => {
  // Gets the tasklist section from the csv map
  const sectionIndex = dataField.indexOf('.');

  // Default to parent level modelPlan if no task list section
  let section: string = 'modelPlan';

  const fieldName = dataField.slice(sectionIndex + 1);

  // If the first item in datafield is a valid model plan field
  if (sectionIndex !== -1) {
    section = dataField.substring(0, sectionIndex);
  }

  let translation = dataField;

  // Gets the label value from translation object
  if (allPlanTranslation[section][fieldName]?.label) {
    translation = allPlanTranslation[section][fieldName].label;
  }
  // Generic translation for Ready for review fields
  else if (fieldName === 'readyForReviewByUserAccount.commonName') {
    translation = 'Ready for review by';
  } else if (fieldName === 'readyForReviewDts') {
    translation = 'Ready for review';
  }
  // If no translation, format using hardcoded label in csvFields
  else {
    translation = dataField;
  }

  // Append Task list section to status headers so differentiate values
  if (fieldName === 'status' && section !== 'modelPlan') {
    translation = `${i18next.t<string>(
      `${section}Misc:heading`
    )}: ${translation}`;
  }

  // js2on@csv does not like commas in the header, and instead parses them into a new column, offsetting data
  translation = translation.replace(
    /[^?.a-zA-Z ]/g, // TODO:  figure out why comma sanitization of string is needed to render some headers correctly
    ''
  );

  return translation;
};

const parentFieldsToTranslate = ['archived', 'status'];

/**
 * @param transformObj Data obj to transform from gql query for all/single model plan
 * @param allPlanTranslation Parent level obj containing all model plan tranlsation objects
 */

// Recursive function to map through data and apply translation transforms
export const dataFormatter = (transformObj: any, allPlanTranslation: any) => {
  const mappedObj: any = { ...transformObj };

  getKeys(transformObj).forEach((key: any) => {
    // Used to map fields on the parent level of the model plan
    // These fields exists under 'modelPlan' translation/ not on any parent level translation
    if (
      parentFieldsToTranslate.includes(key) &&
      transformObj?.__typename ===
        'ModelPlan' /* eslint no-underscore-dangle: 0 */
    ) {
      mappedObj[key] =
        allPlanTranslation?.modelPlan?.[key]?.options?.[transformObj[key]];
    }

    // Used to map any general date/createdDts to a human readable date
    if (key === 'createdDts' || key === 'readyForReviewDts') {
      mappedObj[key] = transformObj[key]
        ? formatDateUtc(transformObj[key], 'MM/dd/yyyy')
        : transformObj[key];
    }
    // Translates any enum values - either single value or an array
    else if (allPlanTranslation?.[key]?.options) {
      if (Array.isArray(transformObj[key])) {
        mappedObj[key] = transformObj[key]
          .map((field: any) => allPlanTranslation[key].options[field])
          .join(', ');
      } else {
        mappedObj[key] = allPlanTranslation[key].options[transformObj[key]];
      }
    }
    // Translates and predefined/custom date field to human readable date
    else if (
      allPlanTranslation?.[key]?.dataType === 'date' &&
      transformObj[key]
    ) {
      mappedObj[key] = formatDateLocal(transformObj[key], 'MM/dd/yyyy');
    }
    // Converts any arrays of entered text into a comma-separated array - ex: Previous names
    else if (
      Array.isArray(transformObj[key]) &&
      !allPlanTranslation?.[key]?.options
    ) {
      mappedObj[key] = transformObj[key].join(', ');

      // TODO: Remove once/if discussion translations work has been completed
    } else if (key === 'userRole') {
      mappedObj[key] = i18next.t<string>(
        `discussions:userRole.${transformObj[key]}`
      );
    }
    // If the value is a nested task list item - Basics, Payments, etc - apply it to the current value
    else if (
      transformObj[key] &&
      typeof transformObj[key] === 'object' &&
      !Array.isArray(transformObj[key])
    ) {
      mappedObj[key] = transformObj[key];
    }

    // If the current value can be further iterated and translated, call the recursive function again
    if (
      transformObj[key] &&
      typeof transformObj[key] === 'object' &&
      !allPlanTranslation?.[key]?.options &&
      !Array.isArray(transformObj[key])
    ) {
      mappedObj[key] = dataFormatter(
        transformObj[key],
        allPlanTranslation?.[key]
      );
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
        transform,
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
