import React from 'react';
import { Controller, UseFormSetValue } from 'react-hook-form';
import { FormGroup, Radio } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { Bool } from 'types/translation';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type BooleanRadioType = {
  field: string;
  control: any;
  value: boolean | null | undefined;
  options: Record<Bool, string>;
  disabled?: boolean;
  children?: React.ReactNode;
  childName?: string;
  setValue?: UseFormSetValue<any>;
  className?: string;
};

const BooleanRadioRHF = ({
  field: fieldName,
  control,
  value,
  options,
  disabled = false,
  children,
  childName,
  setValue,
  className
}: BooleanRadioType) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { ref, ...formField }, fieldState: { error } }) => (
        <FormGroup error={!!error} className={classNames(className)}>
          <Radio
            {...formField}
            id={`${convertCamelCaseToKebabCase(formField.name)}-true`}
            data-testid={`${convertCamelCaseToKebabCase(formField.name)}-true`}
            label={options.true}
            value="TRUE"
            checked={value === true}
            disabled={disabled}
            onChange={() => {
              formField.onChange(true);
              if (childName && setValue) {
                setValue(childName, '', {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }
            }}
          />

          {children}

          <Radio
            {...formField}
            id={`${convertCamelCaseToKebabCase(formField.name)}-false`}
            data-testid={`${convertCamelCaseToKebabCase(formField.name)}-false`}
            label={options.false}
            value="FALSE"
            checked={value === false}
            disabled={disabled}
            onChange={() => {
              formField.onChange(false);
            }}
          />
        </FormGroup>
      )}
    />
  );
};

export default BooleanRadioRHF;
