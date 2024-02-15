import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import Tooltip from 'components/shared/Tooltip';
import {
  getKeys,
  isTranslationFieldProperties,
  isTranslationFieldPropertiesWithOptions,
  isTranslationFieldPropertiesWithOptionsAndChildren,
  isTranslationFieldPropertiesWithOptionsAndParent,
  isTranslationFieldPropertiesWithParent,
  TranslationConfigType,
  TranslationFieldPropertiesWithOptions,
  TranslationFieldPropertiesWithOptionsAndChildren,
  TranslationFieldPropertiesWithOptionsAndParent
} from 'types/translation';

import { filterGroupKey } from '../FilterView/BodyContent/_filterGroupMapping';

/*
  Util function for prepping data to listItems prop of ReadOnlySection
  Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListItems = <T extends string | keyof T>(
  config: TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined // field value/enum array
): string[] => {
  return getKeys(config.options)
    .filter(option => value?.includes(option))
    .map((option): string => config.options[option]);
};

/*
  Util function for prepping data to listOtherItems prop of ReadOnlySection
  Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListOtherItems = <T extends string | keyof T>(
  config: TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined, // field value/enum array
  values: any // All data for the task list section returned from query
): (string | null | undefined)[] => {
  return getKeys(config.options)
    .filter(option => value?.includes(option))
    .map((option): string | null | undefined => {
      return values[config.optionsRelatedInfo?.[option]];
    });
};

/*
  Util function for getting related child questions that do not need to be rendered
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
  value: T[] | undefined // field value/enum array,
): (string | null | undefined)[] | null => {
  if (!isTranslationFieldPropertiesWithOptionsAndChildren(config)) return null;

  // Creating to arrays to hold values of needed and unneeded hidden questions
  // For instances like `providerOverlap` where the multiple parent evaluations triggers the same rendered question
  // Allows to remove dupe neededRelations
  let unneededRelations: string[] = [];
  const neededRelations: string[] = [];

  getKeys(config.childRelation).forEach(option => {
    // If the evaluation of the parent value triggers a child question, sort into appropriate arrays
    if (
      (Array.isArray(value) && !value?.includes(option as T)) ||
      (!Array.isArray(value) && value !== undefined && String(value) !== option)
    ) {
      config.childRelation?.[option]?.forEach(childField => {
        neededRelations.push(childField().label);
      });
    } else {
      unneededRelations = [
        ...unneededRelations,
        ...(config.childRelation?.[option]?.map(
          childField => childField().label
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
  Util function for checking if question should not be rendered based on parent's answer/condition
*/
export const isHiddenByParentCondition = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  config: TranslationConfigType<T, C>,
  values: any
): boolean => {
  if (isTranslationFieldPropertiesWithParent(config)) {
    // If parent value is an array, check if evaluation exists

    const parentConfig = config.parentRelation() as TranslationFieldPropertiesWithOptionsAndChildren<
      T,
      C
    >;

    const parentValue: T = values[parentConfig.gqlField];

    if (Array.isArray(parentValue)) {
      if (
        !values[parentConfig.gqlField]?.some((fieldValue: T) => {
          return parentConfig.childRelation[fieldValue]?.includes(() => config);
        })
      ) {
        return true;
      }
      return false;
    }
    // If parent value is a single value, check if evaluation exits
    if (!parentConfig.childRelation[parentValue]?.includes(() => config)) {
      return true;
    }
    return false;
  }
  return false;
};

/* Util function for prepping optionsLabels translation data to formatListTooltips prop of ReadOnlySection
  Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListTooltips = <T extends string | keyof T>(
  config: TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined // field value/enum array
): (string | null | undefined)[] => {
  return getKeys(config.options)
    .filter(option => value?.includes(option))
    .map((option): string | null | undefined => {
      return config.optionsLabels?.[option];
    });
};

// Used to count 'false' values as a truthy value
const isEmpty = (value: any) => {
  return value == null || value.length === 0;
};

export type ReadOnlySectionNewProps<
  T extends keyof T | string,
  C extends string | keyof C
> = {
  config: TranslationConfigType<T, C>;
  values: any;
  filteredView?: keyof typeof filterGroupKey;
};

const ReadOnlySectionNew = <
  T extends keyof T | string,
  C extends string | keyof C
>({
  config,
  values,
  filteredView
}: ReadOnlySectionNewProps<T, C>): React.ReactElement | null => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: readOnlyT } = useTranslation('generalReadOnly');

  const value = values[config.gqlField];

  // Checks if current view is filtered, then check if question belongs to filter group
  // If not, return null
  if (
    filteredView &&
    filterGroupKey[filteredView] &&
    !config?.filterGroups?.includes(filterGroupKey[filteredView])
  ) {
    return null;
  }

  if (isHiddenByParentCondition(config, values)) {
    return null;
  }

  const heading = config.readonlyLabel || config.label;

  // Used for id's/classes/metadata
  const sectionName = heading
    .toLowerCase()
    .replace(/\W*$/g, '')
    .replace(/\W/g, '-');

  const hasOptionsManyOptions =
    (isTranslationFieldPropertiesWithOptions(config) ||
      isTranslationFieldPropertiesWithOptionsAndParent(config)) &&
    config.formType !== 'radio';

  const listItems = hasOptionsManyOptions ? formatListItems(config, value) : [];

  const tooltips = hasOptionsManyOptions
    ? formatListTooltips(config, value)
    : [];

  const listOtherItems = hasOptionsManyOptions
    ? formatListOtherItems(config, value, values)
    : [];

  // Can render a single "Other" option or multiple additional information options
  // As well as default text for both if not specified
  const renderListItemOthers = (index: number) => {
    if (listOtherItems) {
      if (listOtherItems[index] === undefined) {
        return null;
      }
      if (listOtherItems[index]) {
        return (
          <li className="font-sans-md line-height-sans-4">
            {listOtherItems[index]}
          </li>
        );
      }
      return (
        <li className="font-sans-md line-height-sans-4 ">
          <em className="text-base">
            {miscellaneousT('noAdditionalInformation')}
          </em>
        </li>
      );
    }
    return null;
  };

  const renderCopyOrList = () => {
    // Renders a single value
    if (
      isTranslationFieldProperties(config) &&
      !isTranslationFieldPropertiesWithOptions(config)
    ) {
      return (
        <div className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
          {!isEmpty(value) && value}
          {isEmpty(value) && (
            <em className="text-base">
              {miscellaneousT('noAdditionalInformation')}
            </em>
          )}
        </div>
      );
    }

    // Renders a single value with options (radio)
    // May also renders a conditinal follow to the selection
    if (
      isTranslationFieldPropertiesWithOptions(config) &&
      config.formType === 'radio'
    ) {
      const hasChildField = config.optionsRelatedInfo?.[value as T];

      const childField = hasChildField ? values[hasChildField] : null;

      return (
        <p className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
          {!isEmpty(value) && config.options[value as T]}
          {hasChildField && childField && (
            <span data-testid="other-entry"> - {childField}</span>
          )}
          {(isEmpty(value) || (hasChildField && !childField)) && (
            <i className="text-base">
              {!isEmpty(value) && ' - '}
              {miscellaneousT('noAdditionalInformation')}
            </i>
          )}
        </p>
      );
    }

    // If no values for checkbox/multiselect type questions
    if (listItems.length === 0) {
      return (
        <p className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
          <em className="text-base">
            {miscellaneousT('noAdditionalInformation')}
          </em>
        </p>
      );
    }

    // Renders a list of selected values - multiselect, checkboxes
    return (
      <ul className="margin-y-0 padding-left-3">
        {listItems.map((item, index) => (
          <React.Fragment key={`${sectionName}--${item}`}>
            <li className="font-sans-md line-height-sans-4">
              {item}
              {tooltips && tooltips[index] && (
                <span className="top-2px position-relative">
                  <Tooltip
                    label={tooltips[index]!}
                    position="right"
                    className="margin-left-05"
                  >
                    <Icon.Info className="text-base-light" />
                  </Tooltip>
                </span>
              )}
            </li>
            {listOtherItems && (
              <ul>{listOtherItems && renderListItemOthers(index)}</ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    );
  };

  // If no notes are written, do not render
  if (heading === miscellaneousT('notes') && !value) {
    return null;
  }

  const relatedConditions = isTranslationFieldPropertiesWithOptions(config)
    ? getRelatedUneededQuestions(config, value)
    : [];

  return (
    <Grid desktop={{ col: 12 }}>
      <div
        className={`read-only-section read-only-section--${sectionName} margin-bottom-3`}
      >
        <p className="text-bold margin-y-0 font-body-sm line-height-sans-4 text-pre-line">
          {heading}
        </p>
        {renderCopyOrList()}
      </div>

      {!!relatedConditions?.length && (
        <>
          <Alert type="info" noIcon className="margin-bottom-3">
            {readOnlyT('questionNotApplicable', {
              count: relatedConditions.length
            })}
          </Alert>

          <CollapsableLink
            id={heading}
            label={readOnlyT('showOtherQuestions', {
              count: relatedConditions.length
            })}
            closeLabel={readOnlyT('hideOtherQuestions', {
              count: relatedConditions.length
            })}
            styleLeftBar={false}
            className="margin-bottom-3"
          >
            <ul className="margin-y-0">
              {relatedConditions.map(question => (
                <li key={question} className="text-bold margin-bottom-1">
                  {question}
                </li>
              ))}
            </ul>
          </CollapsableLink>
        </>
      )}
    </Grid>
  );
};

export default ReadOnlySectionNew;
