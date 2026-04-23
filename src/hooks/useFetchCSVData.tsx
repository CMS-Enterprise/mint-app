/*
Hook used to fetch all data for either a single model plan or all model plans
Then processes the data into CSV format as well as initiates a download
*/

import { useCallback, useRef } from 'react';
import { Parser } from '@json2csv/plainjs';
import { unwind } from '@json2csv/transforms';
import {
  FilterGroup,
  filterGroupKey
} from 'features/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';
import {
  GetAllModelDataQuery,
  GetAllModelDataQueryHookResult,
  GetAllSingleModelDataQuery,
  GetAllSingleModelDataQueryHookResult,
  ModelShareSection,
  TranslationDataType,
  useGetAllModelDataLazyQuery,
  useGetAllSingleModelDataLazyQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';

import {
  csvFields,
  fieldsToUnwind
} from 'components/CSVExportLink/fieldDefinitions';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys, PlanSection } from 'types/translation';
import { formatDateLocal, formatDateUtc } from 'utils/date';

type AllModelDataType = GetAllModelDataQuery['modelPlanCollection'][0];
type SingleModelPlanType = GetAllSingleModelDataQuery['modelPlan'];

interface CSVModelPlanType extends AllModelDataType, SingleModelPlanType {}

type FilterGroupType = keyof typeof filterGroupKey;
type ExportSection = FilterGroup | ModelShareSection;

const isFilterGroup = (
  exportSection: any
): exportSection is FilterGroupType => {
  return getKeys(filterGroupKey).includes(exportSection as FilterGroupType);
};

const mtoSections: PlanSection[] = [
  PlanSection.MTO_MILESTONE,
  PlanSection.MTO_SOLUTION,
  PlanSection.MTO_INFO
];

// TODO: Will use later once we introduce segmented model plan exports
// // Checks if the section is a model plan section rather than a filter group
// const isModelPlanSection = (
//   section: ModelShareSection | FilterGroupType
// ): section is ModelShareSection => {
//   return getKeys(ModelShareSection).includes(section as ModelShareSection);
// };

/**
 * @param dataField Dot notation of the nested field to be mapped to the header - ex: 'basics.goal'
 * @param allPlanTranslation Parent level obj containing all model plan tranlsation objects
 */

const getSectionAndFieldName = (csvHeader: string) => {
  // Gets the tasklist section from the csv map
  const sectionIndex = csvHeader.indexOf('.');

  // Default to parent level modelPlan if no task list section
  let section: string = 'modelPlan';

  const fieldName = csvHeader.slice(sectionIndex + 1);

  // If the first item in datafield is a valid model plan field
  if (sectionIndex !== -1) {
    section = csvHeader.substring(0, sectionIndex);
  }
  return {
    section,
    fieldName
  };
};

// Generic translation for Ready for review/marked complete fields
const getUserHeaderLabel = (fieldName: string, dataField: string): string => {
  if (fieldName === 'readyForReviewByUserAccount.commonName') {
    return i18next.t('modelPlanMisc:readyForReviewBy');
  }
  if (fieldName === 'readyForReviewDts') {
    return i18next.t('modelPlanMisc:readyForReviewAt');
  }
  if (fieldName === 'readyForClearanceByUserAccount.commonName') {
    return i18next.t('modelPlanMisc:readyForClearanceBy');
  }
  if (fieldName === 'readyForClearanceDts') {
    return i18next.t('modelPlanMisc:readyForClearanceAt');
  }
  if (fieldName === 'markedCompleteByUserAccount.commonName') {
    return i18next.t('dataExchangeApproach:markedCompleteBy.label');
  }
  if (fieldName === 'completedByUserAccount.commonName') {
    return i18next.t('iddocQuestionnaire:completedBy.label');
  }
  // If no translation, format using hardcoded label in csvFields
  return dataField;
};

// Formats headers for data from translations or hardcoded labels
export const headerFormatter = (dataField: string, allPlanTranslation: any) => {
  const { section, fieldName } = getSectionAndFieldName(dataField);

  let translation = dataField;

  translation = getUserHeaderLabel(fieldName, dataField);

  // Gets the label value from translation object
  if (allPlanTranslation[section]?.[fieldName]?.label) {
    translation = allPlanTranslation[section][fieldName]?.exportLabel
      ? allPlanTranslation[section][fieldName]?.exportLabel
      : allPlanTranslation[section][fieldName].label;
  }

  // Append Task list section to status headers so differentiate values
  if (
    fieldName === 'status' &&
    section !== 'modelPlan' &&
    !mtoSections.includes(section as PlanSection)
  ) {
    translation = `${i18next.t(`${section}Misc:heading`)}: ${translation}`;
  }

  // js2on@csv does not like commas in the header, and instead parses them into a new column, offsetting data
  translation = translation.replace(
    /[^?/.a-zA-Z ]/g, // TODO:  figure out why comma sanitization of string is needed to render some headers correctly
    ''
  );

  return translation;
};

const parentFieldsToTranslate: string[] = [
  'archived',
  'status',
  'taskListStatus'
];
const utcDateFieldsToFormat: string[] = [
  'createdDts',
  'readyForReviewDts',
  'readyForClearanceDts',
  'readyForReviewDTS',
  'latestClearanceDts'
];
const unwindSections: string[] = ['collaborators'];

/**
 * @param transformObj Data obj to transform from gql query for all/single model plan
 * @param allPlanTranslation Parent level obj containing all model plan tranlsation objects
 */

// Recursive function to map through data and apply translation transforms
export const dataFormatter = (
  transformObj: any,
  allPlanTranslation: any,
  parentKey?: string
) => {
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

    // Used to map timestamp values to a human readable date
    if (utcDateFieldsToFormat.includes(key)) {
      mappedObj[key] = transformObj[key]
        ? formatDateUtc(transformObj[key], 'MM/dd/yyyy')
        : transformObj[key];
    }

    // Flatten nested data for export - ex: milestone.solutions = [{name:  "Solution 1"}] => milestone.solutions = ["Solution 1"]
    else if (allPlanTranslation?.[key]?.flattenNestedData) {
      mappedObj[key] = transformObj[key]
        ? transformObj[key]
            .map(
              (item: any) => item[allPlanTranslation?.[key]?.flattenNestedData]
            )
            .join(', ')
        : transformObj[key];
    }

    // Translates any enum values - either single value or an array
    else if (
      allPlanTranslation?.[key]?.options &&
      !allPlanTranslation?.[key]?.isModelLinks
    ) {
      if (Array.isArray(transformObj[key])) {
        mappedObj[key] = transformObj[key]
          .map((field: any) => allPlanTranslation[key].options[field])
          .join(', ');
      } else {
        mappedObj[key] = allPlanTranslation[key].options[transformObj[key]];
      }
    }

    // Prepare for clearance is a model-level section that is not part of the shared plan translation map
    else if (parentKey === 'prepareForClearance' && key === 'status') {
      mappedObj[key] = transformObj[key]
        ? i18next.t(`modelPlanTaskList:taskListStatus.${transformObj[key]}`)
        : transformObj[key];
    }

    // Translates and predefined/custom date field to human readable date
    else if (
      allPlanTranslation?.[key]?.dataType === TranslationDataType.DATE &&
      transformObj[key]
    ) {
      mappedObj[key] = formatDateLocal(transformObj[key], 'MM/dd/yyyy');
    }

    // Translates unconfigured boolean fields to readable CSV values
    else if (typeof transformObj[key] === 'boolean') {
      mappedObj[key] = formatCSVBoolean(transformObj[key]);
    }

    // If parent is an array - ex: Collaborators, Discussions etc
    else if (parentKey && unwindSections.includes(parentKey)) {
      mappedObj[key] = i18next.t(
        `${parentKey}:${key}.options.${transformObj[key]}`
      );
    }

    // Converts any arrays of entered text into a comma-separated array - ex: Previous names
    else if (
      Array.isArray(transformObj[key]) &&
      !allPlanTranslation?.[key]?.options
    ) {
      mappedObj[key] = transformObj[key].join(', ');

      // TODO: Remove once/if discussion translations work has been completed - can use parentKey and unwindSections once translations are implemented
    } else if (key === 'userRole') {
      mappedObj[key] = i18next.t(`discussions:userRole.${transformObj[key]}`);
    }

    // If the value is a nested task list item - Basics, Payments, etc - apply it to the current value
    else if (
      transformObj[key] &&
      typeof transformObj[key] === 'object' &&
      !allPlanTranslation?.[key]?.isModelLinks &&
      !Array.isArray(transformObj[key])
    ) {
      mappedObj[key] = transformObj[key];
    }

    // Translates the Existing Model Links names
    else if (allPlanTranslation?.[key]?.isModelLinks && transformObj[key]) {
      mappedObj[key] = formatExistingModelLinkNames(
        key,
        transformObj[key],
        transformObj
      );
    }

    // Strip html tags from TipTap RTE rawContent value
    else if (
      transformObj[key] &&
      typeof transformObj[key] === 'string' &&
      key === 'rawContent'
    ) {
      mappedObj[key] = transformObj[key].replace(/<[^>]*>?/gm, '');
    }

    // If the current value can be further iterated and translated, call the recursive function again
    if (
      transformObj[key] &&
      typeof transformObj[key] === 'object' &&
      !allPlanTranslation?.[key]?.isModelLinks &&
      !allPlanTranslation?.[key]?.options &&
      !Array.isArray(transformObj[key])
    ) {
      mappedObj[key] = dataFormatter(
        transformObj[key],
        allPlanTranslation?.[key],
        key
      );
    }
  });
  return mappedObj;
};

// Filters out columns for csv based on selected FilterGroup mappings in translation file
export const selectFilteredFields = (
  allPlanTranslation: any,
  exportSection: FilterGroupType
) => {
  const selectedFields: string[] = [];
  // Loop through task list sections of translation obj
  getKeys(allPlanTranslation).forEach((taskListSection: any) => {
    if (taskListSection === 'nameHistory') {
      if (
        allPlanTranslation[taskListSection]?.filterGroups?.includes(
          filterGroupKey[exportSection]
        )
      ) {
        // Push to array to become a column in exported csv
        selectedFields.push(`${taskListSection}`);
      }
    }
    // Loop through all fields of task list sections to identify if they belong to a filter group
    getKeys(allPlanTranslation[taskListSection]).forEach((field: any) => {
      if (
        allPlanTranslation[taskListSection][field]?.filterGroups?.includes(
          filterGroupKey[exportSection]
        )
      ) {
        // Push to array to become a column in exported csv
        selectedFields.push(`${taskListSection}.${field}`);
      }
    });
  });
  return selectedFields;
};

// Initiates the downloading of the formatted csv data
export const downloadFile = (data: string, filename: string) => {
  const element = document.createElement('a');
  const file = new Blob([data], {
    type: 'text/csv'
  });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
};

const formatCSVBoolean = (value?: boolean | null) => {
  if (typeof value !== 'boolean') {
    return value;
  }

  return i18next.t(value ? 'general:yes' : 'general:no');
};

const formatExistingModelLinkNames = (
  fieldName: string,
  modelLinks: { names?: string[] },
  sectionData: any
) => {
  const names = [...(modelLinks.names || [])];

  if (
    fieldName === 'resemblesExistingModelWhich' &&
    sectionData.resemblesExistingModelOtherSelected
  ) {
    names.push('Other');
  }

  if (
    fieldName === 'participationInModelPreconditionWhich' &&
    sectionData.participationInModelPreconditionOtherSelected
  ) {
    names.push('Other');
  }

  return names.join(', ');
};

const formatMTOStatus = (status?: string | null) => {
  return status
    ? i18next.t(`modelPlanTaskList:taskListStatus.${status}`)
    : status;
};

const formatMTOCategories = (categories: any[] = []) => {
  return {
    primaryCategories: categories
      .map(category => category.name)
      .filter(Boolean)
      .join(', '),
    primaryCategoryPositions: categories
      .map(category =>
        category.name && category.position !== undefined
          ? `${category.name}: ${category.position}`
          : undefined
      )
      .filter(Boolean)
      .join(', '),
    subCategories: categories
      .flatMap(category =>
        (category.subCategories || []).map((subCategory: any) =>
          category.name && subCategory.name
            ? `${category.name}: ${subCategory.name}`
            : subCategory.name
        )
      )
      .filter(Boolean)
      .join(', '),
    subCategoryPositions: categories
      .flatMap(category =>
        (category.subCategories || []).map((subCategory: any) =>
          category.name &&
          subCategory.name &&
          subCategory.position !== undefined
            ? `${category.name}: ${subCategory.name}: ${subCategory.position}`
            : undefined
        )
      )
      .filter(Boolean)
      .join(', ')
  };
};

// Flattens the Questionnaire and MTO data to be in a single row for each model plan, rather than all nested
const flattenMTOData = (data: CSVModelPlanType[]) => {
  const flattenedData: any = [...data];

  flattenedData.forEach((plan: any, index: number) => {
    const dataObj = { ...flattenedData[index] };

    dataObj.dataExchangeApproach = plan.questionnaires.dataExchangeApproach;
    dataObj.iddocQuestionnaire = plan.questionnaires.iddocQuestionnaire;
    dataObj.mtoMilestone = plan.mtoMatrix.milestones.map((milestone: any) => ({
      ...milestone,
      addedFromMilestoneLibrary: formatCSVBoolean(
        milestone.addedFromMilestoneLibrary
      )
    }));
    dataObj.mtoSolution = plan.mtoMatrix.solutions.map((solution: any) => ({
      ...solution,
      addedFromSolutionLibrary: formatCSVBoolean(
        solution.addedFromSolutionLibrary
      )
    }));
    dataObj.mtoCategory = formatMTOCategories(plan.mtoMatrix.categories);
    dataObj.modelToOperations = {
      ...plan.mtoMatrix.info,
      status: formatMTOStatus(plan.mtoMatrix.status)
    };
    flattenedData[index] = dataObj;
  });

  return flattenedData;
};

const csvFormatter = (
  csvData: CSVModelPlanType[],
  allPlanTranslation: any,
  exportSection: FilterGroupType | ModelShareSection
) => {
  try {
    const transform = unwind({ paths: fieldsToUnwind, blankOut: true });

    const flattenedData = flattenMTOData(csvData);

    const selectedCSVFields = isFilterGroup(exportSection)
      ? selectFilteredFields(allPlanTranslation, exportSection)
      : csvFields(i18next.t)[exportSection];

    const modelName = csvData.length > 1 ? 'All models' : csvData[0].modelName;

    const modelNameFormatted = modelName.replace(/ /g, '_');

    const exportSectionFormatted =
      csvData.length > 1 ? '' : `-${exportSection.toUpperCase()}`;

    const exportFileName = `MINT-${modelNameFormatted}${exportSectionFormatted}.csv`;

    const parser = new Parser({
      fields: selectedCSVFields,
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
    const csv = parser.parse(flattenedData);
    downloadFile(csv, exportFileName);
  } catch (err) {
    // TODO: add more robust error handling: display a modal/message if download fails?
    console.error(err); // eslint-disable-line
  }
};

type UseFetchCSVData = {
  fetchSingleData: (
    input: string,
    exportSection?: ExportSection
  ) => Promise<GetAllSingleModelDataQueryHookResult>;
  fetchAllData: (
    exportSection?: ExportSection
  ) => Promise<GetAllModelDataQueryHookResult>;
  setExportSection: (exportSection: ExportSection) => void;
};

const useFetchCSVData = (): UseFetchCSVData => {
  const exportSectionRef = useRef<ExportSection>(ModelShareSection.MODEL_PLAN);
  const allPlanTranslation = usePlanTranslation();

  const setExportSection = useCallback((exportSection: ExportSection) => {
    exportSectionRef.current = exportSection;
  }, []);

  // Get data for a single model plan
  const [fetchSingleData] = useGetAllSingleModelDataLazyQuery({
    onCompleted: data => {
      csvFormatter(
        data.modelPlan ? [data.modelPlan] : [],
        allPlanTranslation,
        exportSectionRef.current
      );
    }
  });

  // Get data for all model plans
  const [fetchAllData] = useGetAllModelDataLazyQuery({
    onCompleted: data => {
      csvFormatter(
        data.modelPlanCollection || [],
        allPlanTranslation,
        exportSectionRef.current
      );
    }
  });

  return {
    fetchSingleData: useCallback(
      async (id, exportSection) => {
        if (exportSection) setExportSection(exportSection);
        return fetchSingleData({ variables: { id } });
      },
      [fetchSingleData, setExportSection]
    ),
    fetchAllData: useCallback(
      async exportSection => {
        if (exportSection) setExportSection(exportSection);
        return fetchAllData();
      },
      [fetchAllData, setExportSection]
    ),
    setExportSection
  };
};

export default useFetchCSVData;
