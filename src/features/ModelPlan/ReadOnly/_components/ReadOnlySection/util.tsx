import {
  getKeys,
  isTranslationFieldPropertiesWithOptions,
  isTranslationFieldPropertiesWithOptionsAndChildren,
  isTranslationFieldPropertiesWithParent,
  isTranslationFieldPropertiesWithParentAndChildren,
  TranslationConfigType,
  TranslationFieldPropertiesWithOptions,
  TranslationFieldPropertiesWithOptionsAndChildren,
  TranslationFieldPropertiesWithOptionsAndParent
} from 'types/translation';

import {
  FilterGroup,
  filterGroupKey
} from '../FilterView/BodyContent/_filterGroupMapping';

/*
  Util for prepping data to listItems prop of ReadOnlySection
  Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListValues = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  config:
    | TranslationConfigType<T, C>
    | TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined // field value/enum array
): string[] => {
  if (config.isArray || config.isModelLinks) return value as string[];

  if (!isTranslationFieldPropertiesWithOptions(config)) return [];

  return getKeys(config.options)
    .filter(option => Array.isArray(value) && value?.includes(option))
    .map((option): string => config.options[option]);
};

/*
  Util for prepping data to listOtherItems prop of ReadOnlySection
  Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListOtherValues = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  config:
    | TranslationConfigType<T, C>
    | TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined, // field value/enum array
  values: any // All data for the task list section returned from query
): (string | null | undefined)[] => {
  if (!isTranslationFieldPropertiesWithOptions(config)) return [];

  if (config.isModelLinks) {
    return (value as (string | null | undefined)[])?.map(option => {
      return option
        ? values[config.optionsRelatedInfo?.[option as T]]
        : undefined;
    });
  }

  return getKeys(config.options)
    .filter(option => Array.isArray(value) && value?.includes(option))
    .map((option): string | null | undefined => {
      if (config.optionsRelatedInfo?.[option]) {
        return values[config.optionsRelatedInfo?.[option]] || '';
      }

      // If the a child also has children, format them together to be rendered in a string
      if (isTranslationFieldPropertiesWithParentAndChildren(config)) {
        const childOption = config.childRelation[option as T];
        if (childOption) {
          return childOption
            .map(child => {
              const childConfig = child();
              if (
                isTranslationFieldPropertiesWithOptions(childConfig) &&
                Array.isArray(values[childConfig.gqlField])
              ) {
                return values[childConfig.gqlField]
                  .map((childValue: T) =>
                    childConfig.readonlyOptions
                      ? childConfig.readonlyOptions[childValue]
                      : childConfig.options[childValue]
                  )
                  .join(', ');
              }
              return undefined;
            })
            .join('');
        }
      }
      return undefined;
    });
};

/*  
  Util for prepping optionsLabels translation data to formatListTooltips prop of ReadOnlySection
  Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListTooltips = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  config:
    | TranslationConfigType<T, C>
    | TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined // field value/enum array
): (string | null | undefined)[] => {
  if (!isTranslationFieldPropertiesWithOptions(config)) return [];

  return getKeys(config.options)
    .filter(option => Array.isArray(value) && value?.includes(option))
    .map((option): string | null | undefined => {
      return config.tooltips?.[option];
    });
};

/*
  Util for getting related child questions that do not need to be rendered
  Using to render a toggle alert to show list of questions
*/
export const getRelatedUneededQuestions = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  config:
    | TranslationFieldPropertiesWithOptions<T>
    | TranslationFieldPropertiesWithOptionsAndChildren<T, C>
    | TranslationFieldPropertiesWithOptionsAndParent<T, C>, // Translation config
  value: T[] | undefined, // field value/enum array,
  valuesToCheck?: T[], // If only want to check unneeded children for a specific value of the parent
  childrenToCheck?: (string | undefined)[] // Only check a certain subset of child fields for their value
): (string | null | undefined)[] | null => {
  if (
    !isTranslationFieldPropertiesWithOptionsAndChildren(config) &&
    !isTranslationFieldPropertiesWithParentAndChildren(config)
  )
    return null;

  /* Creating to arrays to hold values of needed and unneeded hidden questions
     For instances like `providerOverlap` where the multiple parent evaluations triggers the same rendered question
     Allows to remove dupe neededRelations
  */
  let unneededRelations: string[] = [];
  const neededRelations: string[] = [];

  let children = config.childRelation;

  // Check if only checking for a single value, then reassign obj
  if (valuesToCheck) {
    children = {};
    valuesToCheck.forEach(val => {
      children[val] = config.childRelation[val];
    });
  }

  getKeys(children).forEach(option => {
    let childRelations = children[option];

    // Filters childRelations values if childrenToCheck array is present
    if (childrenToCheck) {
      childRelations = childRelations?.filter(child =>
        childrenToCheck.includes(child().gqlField)
      ) as (
        | Partial<Record<T, (() => TranslationConfigType<T, C>)[]>>
        | Partial<Record<T, (() => TranslationConfigType<T, void>)[]>>
      )[T];
    }

    // If the evaluation of the parent value triggers a child question, sort into appropriate arrays
    if (
      (Array.isArray(value) && !value?.includes(option)) ||
      (!Array.isArray(value) && value !== undefined && String(value) !== option)
    ) {
      childRelations?.forEach(childField => {
        neededRelations.push(childField().readonlyLabel || childField().label);
      });
    } else {
      unneededRelations = [
        ...unneededRelations,
        ...(childRelations?.map(
          childField => childField().readonlyLabel || childField().label
        ) as [])
      ];
    }
  });

  // Removes dupe relations and converts to translated string
  const uniqueQuestions = neededRelations
    .filter(relation => !unneededRelations.includes(relation))
    .map(relation => relation);

  return [...new Set(uniqueQuestions)];
};

/*
  Util for comparing closures of parent/child
  Allows to map and conditionally hide/render child based on parent value
*/
export const checkIfParentContainsChildClosure = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  parentValue: T,
  parentConfig: TranslationFieldPropertiesWithOptionsAndChildren<T, C>,
  childConfig: TranslationConfigType<T, C>
): boolean => {
  if (isEmpty(parentValue)) return false;

  // Default to false if there is no child/parent relationship defined for the value
  const hidden = !parentConfig.childRelation[parentValue.toString() as T];

  if (hidden) {
    return false;
  }

  // Returns true if parent has configuration for child
  return !!parentConfig.childRelation[parentValue]?.some(child => {
    return child() === childConfig;
  });
};

// Util for checking if question should not be rendered based on parent's answer/condition
export const isHiddenByParentCondition = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  config: TranslationConfigType<T, C> | undefined,
  values: any
): boolean => {
  if (
    !config ||
    !values ||
    (!isTranslationFieldPropertiesWithParent(config) &&
      !isTranslationFieldPropertiesWithParentAndChildren(config))
  )
    return false;

  // Typescript is not inferring the parent config type, but we know it has options with children
  const parentConfig =
    config.parentRelation() as TranslationFieldPropertiesWithOptionsAndChildren<
      T,
      C
    >;

  const parentValue: T = values[parentConfig.gqlField];

  // If parent value is an array, check if evaluation exists
  if (Array.isArray(parentValue)) {
    // Check is values of parent field are populated
    const containsParentRelationship = values[parentConfig.gqlField]?.filter(
      (fieldValue: T) => {
        return getKeys(parentConfig.childRelation).includes(fieldValue);
      }
    );

    if (containsParentRelationship.length === 0) {
      return true;
    }

    // Returns true to hide question if parent condition isn't met, false if met
    return !containsParentRelationship?.some((fieldValue: T) => {
      return checkIfParentContainsChildClosure(
        fieldValue,
        parentConfig,
        config
      );
    });
  }

  return !checkIfParentContainsChildClosure(parentValue, parentConfig, config);
};

// Checks if config is both a parent and a child.  Hide children if grandparent hides the parent
export const isHiddenByGrandParentCondition = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  config: TranslationConfigType<T, C>,
  values: any
): boolean => {
  if (
    isTranslationFieldPropertiesWithParentAndChildren(config) ||
    isTranslationFieldPropertiesWithParent(config)
  ) {
    const parentConfig = config.parentRelation();

    if (
      isTranslationFieldPropertiesWithParentAndChildren(parentConfig) ||
      isTranslationFieldPropertiesWithParent(parentConfig)
    ) {
      const grandParentConfig = parentConfig.parentRelation();

      if (isHiddenByParentCondition(grandParentConfig, values)) {
        return true;
      }
    }

    if (isHiddenByParentCondition(parentConfig, values)) {
      return true;
    }
  }
  return false;
};

// Util to get any configurations that contain the specified filter group value
export const getFilterGroupInfo = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  configs: Record<string, TranslationConfigType<T, C>>,
  filteredView: FilterGroup | undefined
) => [
  ...new Set(
    getKeys(configs)
      .filter(
        config =>
          filteredView &&
          configs[config]?.filterGroups?.includes(filterGroupKey[filteredView])
      )
      .map(config => configs[config]?.gqlField)
      .flat(1)
  )
];

// Used to count 'false' values as a truthy value
export const isEmpty = (value: any) => {
  return value == null || value.length === 0;
};

export const formatID = (heading: string) =>
  heading.toLowerCase().replace(/\W*$/g, '').replace(/\W/g, '-');
