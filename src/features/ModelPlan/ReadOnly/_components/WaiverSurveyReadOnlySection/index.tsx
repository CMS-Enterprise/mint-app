import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import {
  isTranslationFieldPropertiesWithOptions,
  isTranslationFieldPropertiesWithOptionsAndChildren,
  TranslationConfigType
} from 'types/translation';

import { formatID } from '../ReadOnlySection/util';

type SimpleReadOnlySectionProps<
  T extends keyof T | string,
  C extends keyof C | string
> = {
  field: string; // Any gql field name
  translations: Record<string, TranslationConfigType<T, C>>;
  values: any;
};

const WaiverSurveyReadOnlySection = <
  T extends keyof T | string,
  C extends keyof C | string
>({
  field,
  translations,
  values
}: SimpleReadOnlySectionProps<T, C>): React.ReactElement | null => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const config = translations[field];

  const value = values[config.gqlField];

  // Used for id's/classes/metadata
  const sectionName = formatID(config.label);

  return (
    <Grid desktop={{ col: 12 }}>
      <div
        className={`read-only-section read-only-section-${sectionName} margin-bottom-2`}
      >
        <div className="read-only-section--question">
          <span className="text-bold margin-y-0 mint-text-normal line-height-sans-4 text-pre-line">
            {config.label}
          </span>
        </div>

        {(value === null || value === undefined) && (
          <em className="text-base mint-text-medium">
            {miscellaneousT('notAnswered')}
          </em>
        )}

        <SingleValue
          field={field}
          values={values}
          translations={translations}
        />
      </div>
    </Grid>
  );
};

const SingleValue = <T extends string | keyof T, C extends string | keyof C>({
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

  if (!isTranslationFieldPropertiesWithOptions(config)) return null;

  const parentValue = config.options[value as T];

  const hasOptionsAndChildren =
    isTranslationFieldPropertiesWithOptionsAndChildren(config);

  if (!hasOptionsAndChildren) {
    return null;
  }

  const { childRelation } = config;

  const childConfig = childRelation[value as T]?.[0]();

  if (!childConfig) {
    return null;
  }

  const childValue = values[childConfig.gqlField];

  const childHasOptions =
    childConfig && isTranslationFieldPropertiesWithOptions(childConfig);

  const childFieldValue = childHasOptions
    ? childConfig.options[childValue]
    : childValue;

  return (
    <div className="margin-y-0 mint-text-medium line-height-sans-4 text-pre-line text-overflow-wrap-break-word">
      {childValue ? `${parentValue}, ${childFieldValue}` : parentValue}
    </div>
  );
};

export default WaiverSurveyReadOnlySection;
