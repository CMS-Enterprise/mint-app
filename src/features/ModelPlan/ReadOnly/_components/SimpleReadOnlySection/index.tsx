import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import { TranslationFormType } from 'gql/generated/graphql';

import {
  isTranslationFieldProperties,
  isTranslationFieldPropertiesWithOptions,
  TranslationConfigType,
  TranslationFieldPropertiesWithOptions
} from 'types/translation';

import {
  formatID,
  formatListValues,
  isEmpty,
  isHiddenByGrandParentCondition,
  isHiddenByParentCondition
} from '../ReadOnlySection/util';

type SimpleReadOnlySectionProps<
  T extends keyof T | string,
  C extends keyof C | string
> = {
  field: string; // Any gql field name
  translations: Record<string, TranslationConfigType<T, C>>;
  values: any;
};

const SimpleReadOnlySection = <
  T extends keyof T | string,
  C extends keyof C | string
>({
  field,
  translations,
  values
}: SimpleReadOnlySectionProps<T, C>): React.ReactElement | null => {
  const config = translations[field];

  const value = values[config.gqlField];

  // Don't render if isOtherType - will be rendered as a part of parent value
  if (config.isOtherType) {
    return null;
  }

  // Dont render if config hideIfFalsy and value is falsy - ex: dataWillNotBeCollectedFromParticipants
  if (config.hideIfFalsy && !value) {
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

  return (
    <Grid desktop={{ col: 12 }}>
      <div
        className={`read-only-section read-only-section--${sectionName} margin-bottom-3`}
      >
        <div className="read-only-section--question">
          <span className="text-bold margin-y-0 mint-text-normal line-height-sans-4 text-pre-line">
            {heading}
          </span>
        </div>

        <RenderReadonlyValue
          field={field}
          translations={translations}
          values={values}
        />
      </div>
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

  // Renders a single select value
  if (
    isTranslationFieldPropertiesWithOptions(config) &&
    config.formType === TranslationFormType.SELECT
  ) {
    return <SingleValue value={config.options[value as T]} />;
  }

  // Renders a single value
  if (
    isTranslationFieldProperties(config) &&
    !isTranslationFieldPropertiesWithOptions(config) &&
    !config.isArray
  ) {
    return <SingleValue value={value} />;
  }

  // Renders a single value with options (radio)
  // May also renders a conditinal followup value/s to the selection
  if (
    isTranslationFieldPropertiesWithOptions(config) &&
    config.formType === TranslationFormType.RADIO
  ) {
    return (
      <RadioValue field={field} values={values} translations={translations} />
    );
  }

  // If no values for checkbox/multiselect type questions
  if (listValues.length === 0) {
    return (
      <>
        {config.otherParentField ? ' - ' : ''} <NoAnswerEntered />
      </>
    );
  }

  // Renders a list of selected values - multiselect, checkboxes
  return <div className="margin-y-0">{listValues.join(', ')}</div>;
};

const NoAnswerEntered = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  return <em className="text-base mint-text-medium">{miscellaneousT('na')}</em>;
};

const SingleValue = ({ value }: { value: string | null | undefined }) => (
  <div className="margin-y-0 mint-text-medium line-height-sans-4 text-pre-line text-overflow-wrap-break-word">
    {isEmpty(value) ? <NoAnswerEntered /> : value}
  </div>
);

const RadioValue = <T extends string | keyof T, C extends string | keyof C>({
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

  const childFieldValue: Partial<Record<T, string>>[T] | undefined | null =
    childField ? values[childField] : null;

  // Ensures the the child has configuration to translate the options in array
  const childHasOptions = translations[
    childField as string
  ] as TranslationFieldPropertiesWithOptions<T>;

  return (
    <div className="margin-y-0 mint-text-medium line-height-sans-4 text-pre-line text-overflow-wrap-break-word">
      {!isEmpty(value) && config.options[value as T]}

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

export default SimpleReadOnlySection;
