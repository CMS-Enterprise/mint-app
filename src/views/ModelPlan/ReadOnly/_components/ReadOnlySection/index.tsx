import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import Tooltip from 'components/shared/Tooltip';
import {
  isTranslationFieldProperties,
  isTranslationFieldPropertiesWithOptions,
  isTranslationFieldPropertiesWithOptionsAndChildren,
  isTranslationFieldPropertiesWithParentAndChildren,
  TranslationConfigType,
  TranslationFieldPropertiesWithOptions
} from 'types/translation';
import { formatDateUtc } from 'utils/date';

import { filterGroupKey } from '../FilterView/BodyContent/_filterGroupMapping';

import {
  formatID,
  formatListOtherValues,
  formatListTooltips,
  formatListValues,
  getFilterGroupInfo,
  getRelatedUneededQuestions,
  isEmpty,
  isHiddenByGrandParentCondition,
  isHiddenByParentCondition
} from './util';

export type ReadOnlySectionProps<
  T extends keyof T | string,
  C extends keyof C | string
> = {
  field: string; // Any gql field name
  translations: Record<string, TranslationConfigType<T, C>>;
  values: any;
  filteredView?: keyof typeof filterGroupKey;
};

const ReadOnlySection = <
  T extends keyof T | string,
  C extends keyof C | string
>({
  field,
  translations,
  values,
  filteredView
}: ReadOnlySectionProps<T, C>): React.ReactElement | null => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const config = translations[field];

  const value = values[config.gqlField];

  // Don't render if isOtherType - will be rendered as a part of parent value
  if (config.isOtherType) {
    return null;
  }

  // Checks if current view is filtered, then check if question belongs to filter group
  // If not, return null
  if (
    filteredView &&
    filterGroupKey[filteredView] &&
    !config?.filterGroups?.includes(filterGroupKey[filteredView])
  ) {
    return null;
  }

  if (
    isHiddenByParentCondition(config, values) ||
    isHiddenByGrandParentCondition(config, values)
  ) {
    return null;
  }

  const heading = config.readonlyLabel || config.label;

  // Used for id's/classes/metadata
  const sectionName = formatID(heading);

  // If no notes are written, do not render
  if (heading === miscellaneousT('notes') && !value) {
    return null;
  }

  return (
    <Grid desktop={{ col: 12 }}>
      <div
        className={`read-only-section read-only-section--${sectionName} margin-bottom-3`}
      >
        <div className="display-flex flex-align-center">
          <span className="text-bold margin-y-0 font-body-sm line-height-sans-4 text-pre-line display-block">
            {heading}
            {config.questionTooltip && (
              <span className="text-normal line-height-sans-2">
                <Tooltip
                  className="margin-left-1"
                  label={config.questionTooltip}
                  position="right"
                >
                  <Icon.Info className="text-base-light" />
                </Tooltip>
              </span>
            )}
          </span>
        </div>

        <RenderReadonlyValue
          field={field}
          translations={translations}
          values={values}
        />
      </div>

      <RelatedUnneededQuestions
        id={`related-${sectionName}`}
        config={config}
        value={value}
        childrenToCheck={
          filteredView
            ? getFilterGroupInfo(translations, filteredView)
            : undefined
        }
        hideAlert={config.hideRelatedQuestionAlert && !filteredView}
      />
    </Grid>
  );
};

/*
  Renders out either a single value/no value, a radio, or a list value
*/
const RenderReadonlyValue = <
  T extends string | keyof T,
  C extends string | keyof C
>({
  field,
  translations,
  values
}: {
  field: string;
  translations: Record<string, TranslationConfigType<T, C>>;
  values: any;
}) => {
  const config = translations[field];

  const value = values[config.gqlField];

  const listValues = formatListValues(config, value);

  const tooltips = formatListTooltips(config, value);

  const listOtherValues = formatListOtherValues(config, value, values);

  const id = formatID(config.readonlyLabel || config.label);

  // Renders a single value
  if (
    isTranslationFieldProperties(config) &&
    !isTranslationFieldPropertiesWithOptions(config) &&
    !config.isArray
  ) {
    return <SingleValue value={value} isDate={config.dataType === 'date'} />;
  }

  // Renders a single value with options (radio)
  // May also renders a conditinal followup value/s to the selection
  if (
    isTranslationFieldPropertiesWithOptions(config) &&
    config.formType === 'radio'
  ) {
    return (
      <RadioValue field={field} values={values} translations={translations} />
    );
  }

  // If no values for checkbox/multiselect type questions
  if (listValues.length === 0) {
    return <NoAddtionalInfo />;
  }

  // Renders a list of selected values - multiselect, checkboxes
  return (
    <ListItems
      id={id}
      listValues={listValues}
      listOtherValues={listOtherValues}
      tooltips={tooltips}
    />
  );
};

export const NoAddtionalInfo = ({ other }: { other?: boolean }) => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  return (
    <em className="text-base">
      {other ? miscellaneousT('noAdditionalInformation') : miscellaneousT('na')}
    </em>
  );
};

export const SingleValue = ({
  value,
  isDate
}: {
  value: string | null | undefined;
  isDate: boolean;
}) => {
  const formattedValue = () => {
    if (isEmpty(value)) {
      return <NoAddtionalInfo />;
    }
    if (isDate && value) {
      return formatDateUtc(value, 'MM/dd/yyyy');
    }
    return value;
  };

  return (
    <div className="margin-y-0 font-body-md line-height-sans-4 text-pre-line text-overflow-wrap-break-word">
      {formattedValue()}
    </div>
  );
};

export const RadioValue = <
  T extends string | keyof T,
  C extends string | keyof C
>({
  field,
  translations,
  values
}: {
  field: string;
  translations: Record<string, TranslationConfigType<T, C>>;
  values: any;
}) => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const config = translations[field];

  const value = values[config.gqlField];

  if (!isTranslationFieldPropertiesWithOptions(config)) return null;

  // Checks if configuration exists to optionally render a child's value with the radio value
  const childField = config.optionsRelatedInfo?.[value as T];

  const childFieldValue:
    | Partial<Record<T, string>>[T]
    | undefined
    | null = childField ? values[childField] : null;

  // Checks if the child field is an array to render as a bulleted list beneath the radio selection
  const isChildMultiple: boolean = Array.isArray(childFieldValue);

  // Ensures the the child has configuration to translate the options in array
  const childHasOptions = translations[
    childField as string
  ] as TranslationFieldPropertiesWithOptions<T>;

  // Checks if a single radio value has a mapped tooltip/optionsLabel
  let radioTooltip: string | undefined;

  if (config.tooltips) {
    radioTooltip = config.tooltips[value as T];
  }

  return (
    <div className="margin-y-0 font-body-md line-height-sans-4 text-pre-line text-overflow-wrap-break-word">
      {!isEmpty(value) && config.options[value as T]}

      {/* Renders a tooltip if mapped to the selected radio value */}
      {radioTooltip && (
        <span className="top-2px position-relative">
          <Tooltip
            label={radioTooltip}
            position="right"
            className="margin-left-05"
          >
            <Icon.Info className="text-base-light" />
          </Tooltip>
        </span>
      )}

      {/* Renders a string next to the hyphenated value of the radio option */}
      {childField && childFieldValue && !isChildMultiple && (
        <span data-testid="other-entry"> - {childFieldValue}</span>
      )}

      {/* Renders a list beneath a selection of a radio value */}
      {childHasOptions && childHasOptions.options && childField && (
        <RenderReadonlyValue
          field={childField}
          translations={translations}
          values={values}
        />
      )}

      {/* Render default empty value */}
      {(isEmpty(value) || (childField && !childFieldValue)) && (
        <i className="text-base">
          {!isEmpty(value) && ' - '}
          {childField
            ? miscellaneousT('noAdditionalInformation')
            : miscellaneousT('na')}
        </i>
      )}
    </div>
  );
};

const ListItems = <T extends string | keyof T, C extends string | keyof C>({
  id,
  listValues,
  listOtherValues,
  tooltips
}: {
  id: string;
  listValues: (string | null | undefined)[];
  listOtherValues: (string | null | undefined)[];
  tooltips: (string | null | undefined)[];
}) => {
  return (
    <ul className="margin-y-0 padding-left-3">
      {listValues.map((item: any, index: number) => (
        <Fragment key={`${id}--${item}`}>
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

          {listOtherValues && (
            <ul>
              <ListOtherItem index={index} listOtherItems={listOtherValues} />
            </ul>
          )}
        </Fragment>
      ))}
    </ul>
  );
};

/*
  Renders a nested list item.  If no value exists, render <NoAddtionalInfo />
*/
const ListOtherItem = ({
  index,
  listOtherItems
}: {
  index: number;
  listOtherItems: any;
}) => {
  // If there is no optionalRelatedInfo mapped to the index return undefined
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
  // If there is optionalRelatedInfo mapped, but no value
  return (
    <li className="font-sans-md line-height-sans-4 ">
      <NoAddtionalInfo other />
    </li>
  );
};

export const RelatedUnneededQuestions = <
  T extends string | keyof T,
  C extends string | keyof C
>({
  id,
  config,
  value,
  values,
  valuesToCheck,
  childrenToCheck,
  hideAlert
}: {
  id: string;
  config: TranslationConfigType<T, C>;
  value: any;
  values?: any;
  valuesToCheck?: T[]; // If only want to check unneeded children for a specific value of the parent
  childrenToCheck?: (string | undefined)[];
  hideAlert?: boolean;
}) => {
  const { t: readOnlyT } = useTranslation('generalReadOnly');

  let relatedConditions = isTranslationFieldPropertiesWithOptions(config)
    ? getRelatedUneededQuestions(config, value, valuesToCheck, childrenToCheck)
    : [];

  // If config is parent and child, check if is hidden by parent, and then get all the child questions
  if (
    isTranslationFieldPropertiesWithParentAndChildren(config) &&
    isHiddenByParentCondition(config, values)
  ) {
    relatedConditions = getRelatedUneededQuestions(
      config,
      [],
      valuesToCheck,
      childrenToCheck
    );
  }

  if (!relatedConditions?.length || hideAlert) {
    return null;
  }

  // Render an alt label for the alert of configured for it
  const disconnectedLabel =
    isTranslationFieldPropertiesWithOptionsAndChildren(config) &&
    config.disconnectedLabel
      ? config.disconnectedLabel
      : 'questionNotApplicableSpecific';

  return (
    <>
      <Alert type="info" noIcon className="margin-bottom-3">
        {isTranslationFieldPropertiesWithOptionsAndChildren(config) &&
        (config.disconnectedChildren || config.disconnectedLabel)
          ? // Render a disconnected translations text
            readOnlyT(disconnectedLabel, {
              count: relatedConditions.length,
              question: config.readonlyLabel || config.label
            })
          : // Render default alert text
            readOnlyT('questionNotApplicable', {
              count: relatedConditions.length
            })}
      </Alert>

      <CollapsableLink
        id={id}
        label={readOnlyT('showOtherQuestions', {
          count: relatedConditions.length
        })}
        closeLabel={readOnlyT('hideOtherQuestions', {
          count: relatedConditions.length
        })}
        styleLeftBar={false}
        className="margin-bottom-3"
        expandOnExport
      >
        <ul className="margin-y-0">
          {relatedConditions.map(question => (
            <li
              key={question}
              className="text-bold margin-bottom-1 line-height-sans-4"
            >
              {question}
            </li>
          ))}
        </ul>
      </CollapsableLink>
    </>
  );
};

export default ReadOnlySection;
