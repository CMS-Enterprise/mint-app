import { CommonWaiverFilters } from 'features/HelpAndKnowledge/HKCWaiverLibrary/_components/WaivercardGroup';
import { getArrayFromParams } from 'features/ModelPlan/ModelToOperations/_components/MTOTableFilters/_utils';
import i18next from 'i18next';

import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import { CommonWaiverData } from '../..';

export const parseAppliedFilters = (
  searchParams: URLSearchParams
): CommonWaiverFilters => {
  return {
    type: getArrayFromParams<CommonWaiverFilters['type']>(searchParams, 'type'),
    focus: getArrayFromParams(searchParams, 'focus'),
    other: getArrayFromParams(searchParams, 'other')
  };
};

export const buildSearchParamsFromFilters = (
  filters: CommonWaiverFilters,
  currentParams: URLSearchParams
) => {
  const newParams = new URLSearchParams(currentParams);

  Object.entries(filters).forEach(([key, values]) => {
    if (values && values.length > 0) {
      newParams.set(convertCamelCaseToKebabCase(key), values.join(','));
    } else {
      newParams.delete(convertCamelCaseToKebabCase(key));
    }
  });

  // Reset pagination when filters change
  newParams.delete('page');

  return newParams;
};

export const searchCommonWaivers = (
  searchQuery: string,
  commonWaivers: CommonWaiverData[]
) => {
  if (!searchQuery) return commonWaivers;

  const query = searchQuery.trim().toLowerCase();

  return commonWaivers.filter(waiver => {
    const isNameMatch = waiver.name.toLowerCase().includes(query);

    const isTypeMatch =
      waiver.waiverType &&
      i18next
        .t(`waiverAssessmentSurveyMisc:${waiver.waiverType}.heading`)
        .toLowerCase()
        .includes(query);

    const isDescriptionMatch = waiver.description.toLowerCase().includes(query);

    return isNameMatch || isTypeMatch || isDescriptionMatch;
  });
};

export const filterCommonWaivers = (
  appliedFilters: CommonWaiverFilters,
  commonWaivers: CommonWaiverData[]
) => {
  return commonWaivers.filter(commonWaiver => {
    const isTypeMatch =
      appliedFilters.type.length > 0 &&
      commonWaiver.waiverType &&
      appliedFilters.type.includes(commonWaiver.waiverType);

    const isFocusMatch =
      appliedFilters.focus.length > 0 &&
      appliedFilters.focus.some(focus =>
        commonWaiver.waiverFocus.includes(focus)
      );

    const isOtherFilterMatch =
      appliedFilters.other.length > 0 &&
      appliedFilters.other.some(otherFilterKey => {
        if (otherFilterKey === 'WAIVERS_WITH_STANDARDIZATION_EFFORT_ONLY') {
          return commonWaiver.hasStandardizationEffort;
        }
        if (otherFilterKey === 'WAIVERS_WITH_CLAIMS_DATA_OR_RREG_ONLY') {
          return (
            commonWaiver.hasClaimsDataOrRREGAnalysis.toLowerCase() === 'yes' ||
            commonWaiver.hasClaimsDataOrRREGAnalysis.toLowerCase() ===
              'learning data only'
          );
        }
        return true;
      });

    return isTypeMatch || isFocusMatch || isOtherFilterMatch;
  });
};
