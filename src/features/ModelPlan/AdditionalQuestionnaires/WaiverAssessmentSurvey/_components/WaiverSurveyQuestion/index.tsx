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
  questionConfig,
  control,
  setValue
}: {
  questionConfig: TranslationFieldPropertiesWithOptionsAndChildren<Bool, void>;
  setValue: ReturnType<typeof useForm<any>>['setValue'];
  control: ReturnType<typeof useForm<any>>['control'];
}) => {
  const { gqlField, childRelation } = questionConfig;

  const kebabName = convertCamelCaseToKebabCase(gqlField);

  return (
    <FormGroup key={gqlField} className="margin-top-0 margin-bottom-2">
      <Label htmlFor={kebabName} className="text-normal text-bold">
        {questionConfig.label}
      </Label>

      {questionConfig.sublabel && (
        <p className="text-base margin-bottom-1 margin-top-1">
          {questionConfig.sublabel}
        </p>
      )}

      <Controller
        name={gqlField}
        control={control}
        render={({
          field: { ref, value: parentValue, onChange, ...field }
        }) => (
          <Fieldset>
            {[Bool.true, Bool.false].map(enumOption => {
              const isOptionChecked = parentValue === enumOption;

              const activeChildRelations = childRelation?.[enumOption];

              const childConfig =
                activeChildRelations?.length === 1
                  ? activeChildRelations[0]()
                  : null;

              const childName = childConfig?.gqlField || '';

              const childKebabName = childName
                ? convertCamelCaseToKebabCase(childName)
                : '';

              return (
                <div
                  key={String(enumOption)}
                  className="display-flex flex-column"
                >
                  <Radio
                    {...field}
                    id={`${kebabName}-${enumOption}`}
                    data-testid={`${kebabName}-${enumOption}`}
                    className="margin-top-0 margin-right-1"
                    name={gqlField}
                    label={
                      <span
                        className="display-flex flex-align-center"
                        style={{ gap: '4px' }}
                      >
                        {questionConfig.options[enumOption]}
                      </span>
                    }
                    value={enumOption}
                    checked={isOptionChecked}
                    onChange={() => {
                      onChange(enumOption);

                      const alternateKey =
                        enumOption === Bool.true ? Bool.false : Bool.true;

                      const alternateRelation =
                        childRelation?.[alternateKey]?.[0]?.();

                      if (alternateRelation?.gqlField) {
                        setValue(alternateRelation.gqlField, '', {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true
                        });
                      }
                    }}
                  />

                  {isOptionChecked && childConfig && childName && (
                    <FormGroup className="margin-left-4 margin-top-1">
                      <Label htmlFor={childKebabName} className="text-normal">
                        {childConfig.label || childName}
                      </Label>

                      {enumOption === Bool.true && (
                        <Controller
                          name={childName}
                          control={control}
                          render={({
                            field: { ref: childRef, ...childField }
                          }) => (
                            <TextAreaField
                              {...childField}
                              id={childKebabName}
                              data-testid={childKebabName}
                              maxLength={5000}
                              className="height-card"
                            />
                          )}
                        />
                      )}

                      {enumOption === Bool.false && (
                        <Controller
                          name={childName}
                          control={control}
                          render={({
                            field: { ref: childRef, ...childField }
                          }) => {
                            const selectOptions =
                              isTranslationFieldPropertiesWithOptions(
                                childConfig
                              )
                                ? childConfig.options
                                : {};

                            return (
                              <Select
                                {...childField}
                                id={childKebabName}
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
                      )}
                    </FormGroup>
                  )}
                </div>
              );
            })}
          </Fieldset>
        )}
      />
    </FormGroup>
  );
};

export default WaiverSurveyQuestion;
