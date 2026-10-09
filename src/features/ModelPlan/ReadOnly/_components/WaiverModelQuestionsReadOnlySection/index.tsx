import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import { CombinedConfigType } from 'features/ModelPlan/AdditionalQuestionnaires/WaiverAssessmentSurvey/_components/ModelPlanQuestionsForm';
import { getReadOnlySubQuestionFields } from 'features/ModelPlan/AdditionalQuestionnaires/WaiverAssessmentSurvey/util';
import { TranslationFormType } from 'gql/generated/graphql';

import {
  isTranslationFieldProperties,
  isTranslationFieldPropertiesWithOptions,
  TranslationConfigType
} from 'types/translation';

import { formatID, formatListValues, isEmpty } from '../ReadOnlySection/util';

type WaiverModelQuestionsReadOnlySectionProps = {
  field: keyof CombinedConfigType;
  translations: CombinedConfigType;
  values: any;
};

const WaiverModelQuestionsReadOnlySection = ({
  field,
  translations,
  values
}: WaiverModelQuestionsReadOnlySectionProps): React.ReactElement | null => {
  const config = translations[field];

  if (!config) return null;

  const { subQuestionFields } = getReadOnlySubQuestionFields(
    field,
    values,
    translations
  );

  // Used for id's/classes/metadata
  const sectionName = formatID(config.label);

  return (
    <Grid desktop={{ col: 12 }}>
      <div
        className={`read-only-section read-only-section--${sectionName} margin-bottom-2`}
      >
        <div className="read-only-section--question">
          <span className="text-bold margin-y-0 mint-text-normal line-height-sans-4 text-pre-line">
            {config.label}
          </span>
        </div>

        <RenderReadonlyValue
          field={field}
          translations={translations}
          values={values}
        />
      </div>

      {subQuestionFields.length > 0 &&
        subQuestionFields.map(subField => {
          const subFieldConfig =
            translations[subField as keyof CombinedConfigType];

          if (!subFieldConfig) return null;

          // Used for id's/classes/metadata
          const subSectionName = formatID(subFieldConfig.label);

          return (
            <div
              key={subField}
              className={`read-only-section read-only-section--${subSectionName} margin-bottom-2`}
            >
              <div className="read-only-section--question">
                <span className="text-bold margin-y-0 mint-text-normal line-height-sans-4 text-pre-line">
                  {subFieldConfig.label}
                </span>
              </div>

              <RenderReadonlyValue
                field={subField}
                translations={translations}
                values={values}
              />
            </div>
          );
        })}
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

  if (value === null || value === undefined) {
    return <NoAnswerEntered />;
  }

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

  if (listValues.length === 0) {
    return <NoAnswerEntered />;
  }

  // Renders a list of selected values - multiselect, checkboxes
  return <div className="margin-y-0">{listValues.join(', ')}</div>;
};

const NoAnswerEntered = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  return (
    <em className="text-base mint-text-medium">
      {miscellaneousT('notAnswered')}
    </em>
  );
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
  const config = translations[field];

  const value = values[config.gqlField];

  if (!isTranslationFieldPropertiesWithOptions(config)) return null;

  return (
    <div className="margin-y-0 mint-text-medium line-height-sans-4 text-pre-line text-overflow-wrap-break-word">
      {isEmpty(value) ? <NoAnswerEntered /> : config.options[value as T]}
    </div>
  );
};

export default WaiverModelQuestionsReadOnlySection;
