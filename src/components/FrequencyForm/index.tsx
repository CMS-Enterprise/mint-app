import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, TextInput } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field } from 'formik';
import { FrequencyType } from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import CheckboxField from 'components/CheckboxField';
import FieldGroup from 'components/FieldGroup';
import {
  getKeys,
  TranslationFieldPropertiesWithOptions,
  TranslationPlan
} from 'types/translation';

type FrequencyFormType = {
  field: string;
  values: FrequencyType[] | null | undefined;
  config: TranslationFieldPropertiesWithOptions<FrequencyType>;
  nameSpace: keyof TranslationPlan;
  label: string;
  boldLabel?: boolean;
  id: string;
  disabled: boolean;
  className?: string;
  addNote?: boolean;
};

/*
Form component for rendering generic FrenquencyType checkbox options
Additional renders additional TextInput component for selctions of Other and Continually
Additionally renders the AddNote component for all instances
*/

const FrequencyForm = ({
  field: fieldName,
  values,
  config,
  nameSpace,
  label,
  boldLabel = true,
  id,
  disabled = false,
  addNote = true,
  className
}: FrequencyFormType) => {
  const { t } = useTranslation();

  return (
    <FieldGroup scrollElement={fieldName} className={classNames(className)}>
      <Label
        htmlFor={id}
        className={classNames('maxw-none', {
          'text-normal': !boldLabel
        })}
      >
        {label}
      </Label>

      {getKeys(config.options).map(type => {
        return (
          <Fragment key={type}>
            <Field
              as={CheckboxField}
              id={`${id}-${type.toLowerCase()}`}
              name={fieldName}
              disabled={disabled}
              label={config.options[type]}
              value={type}
              checked={values?.includes(type)}
            />

            {type === FrequencyType.CONTINUALLY && values?.includes(type) && (
              <div className="margin-left-4">
                <Label
                  htmlFor={`${id}-continually`}
                  className="text-normal margin-top-1"
                >
                  {t(`${nameSpace}:${config.optionsRelatedInfo?.[type]}.label`)}
                </Label>

                <Field
                  as={TextInput}
                  id={`${id}-continually-text`}
                  data-testid={`${id}-continually-text`}
                  name={`${fieldName}Continually`}
                  disabled={disabled}
                />
              </div>
            )}

            {type === FrequencyType.OTHER && values?.includes(type) && (
              <div className="margin-left-4">
                <Label
                  htmlFor={`${id}-other`}
                  className="text-normal margin-top-1"
                >
                  {t(`${nameSpace}:${config.optionsRelatedInfo?.[type]}.label`)}
                </Label>

                <Field
                  as={TextInput}
                  id={`${id}-other-text`}
                  data-testid={`${id}-other-text`}
                  name={`${fieldName}Other`}
                  disabled={disabled}
                />
              </div>
            )}
          </Fragment>
        );
      })}

      {addNote && <AddNote id={`${id}-note`} field={`${fieldName}Note`} />}
    </FieldGroup>
  );
};

export default FrequencyForm;
