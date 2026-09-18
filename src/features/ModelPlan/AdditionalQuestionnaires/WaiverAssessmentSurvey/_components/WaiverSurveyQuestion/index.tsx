import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Fieldset,
  FormGroup,
  Label,
  Radio,
  Select
} from '@trussworks/react-uswds';

import TextAreaField from 'components/TextAreaField';
import {
  Bool,
  getKeys,
  isTranslationFieldPropertiesWithOptions,
  TranslationFieldPropertiesWithOptionsAndChildren
} from 'types/translation';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

const WaiverSurveyQuestion = ({
  fieldName,
  questionConfig,
  value,
  methods,
  inputRef
}: {
  fieldName: string;
  questionConfig: TranslationFieldPropertiesWithOptionsAndChildren<Bool, void>;
  value: boolean | null | undefined;
  methods: ReturnType<typeof useForm<any>>;
  inputRef?: React.Ref<any>;
}) => {
  const { control, setValue, watch } = methods;
  const { gqlField, childRelation } = questionConfig;

  const kebabName = convertCamelCaseToKebabCase(gqlField);

  const yesChildConfig = childRelation?.[Bool.true]?.[0]?.();
  const yesChildName = yesChildConfig?.gqlField || '';

  const noChildConfig = childRelation?.[Bool.false]?.[0]?.();
  const noChildName = noChildConfig?.gqlField || '';

  return (
    <>
      <div className="display-flex flex-column">
        <Fieldset>
          <Radio
            id={`${kebabName}-true`}
            data-testid={`${kebabName}-true`}
            className="margin-top-0 margin-right-1"
            name={fieldName}
            inputRef={inputRef}
            label={
              <span
                className="display-flex flex-align-center"
                style={{ gap: '4px' }}
              >
                {questionConfig.options[Bool.true]}
              </span>
            }
            value="TRUE"
            checked={value === true}
            onChange={() => {
              setValue(gqlField, true, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              });

              if (noChildName && watch(noChildName) !== null) {
                setValue(noChildName, null, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }
            }}
          />
        </Fieldset>

        {value && yesChildConfig && (
          <FormGroup className="margin-left-4 margin-top-1">
            <Label
              htmlFor={convertCamelCaseToKebabCase(yesChildName)}
              className="text-normal"
            >
              {yesChildConfig.label}
            </Label>

            <Controller
              name={yesChildName}
              control={control}
              render={({ field: { ref: childRef, ...childField } }) => (
                <TextAreaField
                  {...childField}
                  id={convertCamelCaseToKebabCase(yesChildName)}
                  data-testid={convertCamelCaseToKebabCase(yesChildName)}
                  maxLength={5000}
                  className="height-card"
                />
              )}
            />
          </FormGroup>
        )}
      </div>

      <div className="display-flex flex-column">
        <Fieldset>
          <Radio
            id={`${kebabName}-false`}
            data-testid={`${kebabName}-false`}
            className="margin-top-0 margin-right-1"
            name={fieldName}
            label={
              <span
                className="display-flex flex-align-center"
                style={{ gap: '4px' }}
              >
                {questionConfig.options[Bool.false]}
              </span>
            }
            value="FALSE"
            checked={value === false}
            onChange={() => {
              setValue(gqlField, false, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              });

              if (yesChildName && watch(yesChildName) !== '') {
                setValue(yesChildName, '', {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }
            }}
          />
        </Fieldset>

        {value === false && noChildConfig && (
          <FormGroup className="margin-left-4 margin-top-1">
            <Label
              htmlFor={convertCamelCaseToKebabCase(noChildName)}
              className="text-normal"
            >
              {noChildConfig.label}
            </Label>

            <Controller
              name={noChildName}
              control={control}
              render={({ field: { ref: childRef, ...childField } }) => {
                const selectOptions = isTranslationFieldPropertiesWithOptions(
                  noChildConfig
                )
                  ? noChildConfig.options
                  : {};

                return (
                  <Select
                    {...childField}
                    id={convertCamelCaseToKebabCase(noChildName)}
                    value={childField.value || 'default'}
                    onChange={e => {
                      const selectedVal = e.target.value;

                      childField.onChange(
                        selectedVal === 'default' ? '' : selectedVal
                      );
                    }}
                  >
                    <option value="default">- Select -</option>
                    {getKeys(selectOptions).map(option => {
                      return (
                        <option
                          key={`select-${convertCamelCaseToKebabCase(option)}`}
                          value={option}
                        >
                          {selectOptions[option]}
                        </option>
                      );
                    })}
                  </Select>
                );
              }}
            />
          </FormGroup>
        )}
      </div>
    </>
  );
};

export default WaiverSurveyQuestion;
