import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import Tooltip from 'components/shared/Tooltip';
import {
  isTranslationFieldProperties,
  isTranslationFieldPropertiesWithOptions,
  TranslationConfigType,
  TranslationFieldPropertiesWithOptions
} from 'types/translation';

import { filterGroupKey } from '../FilterView/BodyContent/_filterGroupMapping';

import {
  formatID,
  formatListItems,
  formatListOtherItems,
  formatListTooltips,
  getRelatedUneededQuestions,
  isEmpty,
  isHiddenByParentCondition
} from './util';

export type ReadOnlySectionNewProps<
  T extends keyof T | string,
  C extends keyof C | string
> = {
  field: string; // Any gql field name
  translations: Record<string, TranslationConfigType<T, C>>;
  values: any;
  filteredView?: keyof typeof filterGroupKey;
};

const ReadOnlySectionNew = <
  T extends keyof T | string,
  C extends keyof C | string
>({
  field,
  translations,
  values,
  filteredView
}: ReadOnlySectionNewProps<T, C>): React.ReactElement | null => {
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

  if (isHiddenByParentCondition(config, values)) {
    return null;
  }

  const heading = config.readonlyLabel || config.label;

  // Used for id's/classes/metadata
  const sectionName = formatID(heading);

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

        <RenderReadonlyValue
          field={field}
          translations={translations}
          values={values}
        />
      </div>

      <RelatedUnneededQuestions
        id={`related-${sectionName}`}
        relatedConditions={relatedConditions}
        hideAlert={config.hideRelatedQuestionAlert}
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

  const listItemValues = formatListItems(config, value);

  const tooltipValues = formatListTooltips(config, value);

  const listOtherItems = formatListOtherItems(config, value, values);

  const id = formatID(config.readonlyLabel || config.label);

  // Renders a single value
  if (
    isTranslationFieldProperties(config) &&
    !isTranslationFieldPropertiesWithOptions(config)
  ) {
    return <SingleValue value={value} />;
  }

  // Renders a single value with options (radio)
  // May also renders a conditinal followup value/s to the selection
  if (
    isTranslationFieldPropertiesWithOptions(config) &&
    config.formType === 'radio'
  ) {
    <RadioValue field={field} values={values} translations={translations} />;
  }

  // If no values for checkbox/multiselect type questions
  if (listItemValues.length === 0) {
    return <NoAddtionalInfo />;
  }

  // Renders a list of selected values - multiselect, checkboxes
  return (
    <ListItems
      id={id}
      listItemValues={listItemValues}
      listOtherItems={listOtherItems}
      tooltipValues={tooltipValues}
    />
  );
};

export const NoAddtionalInfo = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  return (
    <em className="text-base">{miscellaneousT('noAdditionalInformation')}</em>
  );
};

export const SingleValue = ({
  value
}: {
  value: string | null | undefined;
}) => {
  return (
    <div className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
      {!isEmpty(value) ? value : <NoAddtionalInfo />}
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

  const childFieldValue = childField ? values[childField] : null;

  // Checks if the child field is an array to render as a bulleted list beneath the radio selection
  const isChildMultiple: boolean = Array.isArray(childFieldValue);

  // Ensures the the child has configuration to translate the options in array
  const childHasOptions = translations[
    childField as string
  ] as TranslationFieldPropertiesWithOptions<T>;

  // Checks if a single radio value has a mapped tooltip/optionsLabel
  let radioTooltip: string | undefined;
  if (config.optionsLabels) {
    radioTooltip = config.optionsLabels[value as T];
  }

  return (
    <div className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
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
      {childHasOptions && childHasOptions.options && (
        <RenderReadonlyValue
          field={field}
          translations={translations}
          values={values}
        />
      )}

      {/* Render default empty value */}
      {(isEmpty(value) || (childField && !childFieldValue)) && (
        <i className="text-base">
          {!isEmpty(value) && ' - '}
          {miscellaneousT('noAdditionalInformation')}
        </i>
      )}
    </div>
  );
};

const ListItems = <T extends string | keyof T, C extends string | keyof C>({
  id,
  listItemValues,
  tooltipValues,
  listOtherItems
}: {
  id: string;
  listItemValues: (string | null | undefined)[];
  tooltipValues: (string | null | undefined)[];
  listOtherItems: (string | null | undefined)[];
}) => {
  return (
    <ul className="margin-y-0 padding-left-3">
      {listItemValues.map((item: any, index: number) => (
        <React.Fragment key={`${id}--${item}`}>
          <li className="font-sans-md line-height-sans-4">
            {item}

            {tooltipValues && tooltipValues[index] && (
              <span className="top-2px position-relative">
                <Tooltip
                  label={tooltipValues[index]!}
                  position="right"
                  className="margin-left-05"
                >
                  <Icon.Info className="text-base-light" />
                </Tooltip>
              </span>
            )}
          </li>

          {listOtherItems && (
            <ul>
              {listOtherItems && (
                <ListOtherItem index={index} listOtherItems={listOtherItems} />
              )}
            </ul>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

// Can render a single "Other" option or multiple additional information options
// As well as default text for both if not specified
const ListOtherItem = ({
  index,
  listOtherItems
}: {
  index: number;
  listOtherItems: any;
}) => {
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
      <NoAddtionalInfo />
    </li>
  );
};

export const RelatedUnneededQuestions = ({
  id,
  relatedConditions,
  hideAlert
}: {
  id: string;
  relatedConditions: (string | null | undefined)[] | null;
  hideAlert?: boolean;
}) => {
  const { t: readOnlyT } = useTranslation('generalReadOnly');

  if (!relatedConditions?.length || hideAlert) {
    return null;
  }

  return (
    <>
      <Alert type="info" noIcon className="margin-bottom-3">
        {readOnlyT('questionNotApplicable', {
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
  );
};

export default ReadOnlySectionNew;
