import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { Fieldset, Radio } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { Bool } from 'types/translation';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type BooleanRadioType = {
  field: string;
  value: boolean | null | undefined;
  options: Record<Bool, string>;
  setValue: UseFormSetValue<any>;
  disabled?: boolean;
  children?: React.ReactNode;
  childName?: string;
  className?: string;
};

const BooleanRadioRHF = ({
  field,
  value,
  options,
  setValue,
  disabled = false,
  children,
  childName,
  className
}: BooleanRadioType) => {
  return (
    <Fieldset className={classNames(className)}>
      <Radio
        id={`${convertCamelCaseToKebabCase(field)}-true`}
        data-testid={`${convertCamelCaseToKebabCase(field)}-true`}
        name={field}
        label={options.true}
        value="TRUE"
        checked={value === true}
        disabled={disabled}
        onChange={() => {
          setValue(field, true, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });

          if (childName) {
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
        id={`${convertCamelCaseToKebabCase(field)}-false`}
        data-testid={`${convertCamelCaseToKebabCase(field)}-false`}
        name={field}
        label={options.false}
        value="FALSE"
        checked={value === false}
        disabled={disabled}
        onChange={() => {
          setValue(field, false, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
        }}
      />
    </Fieldset>
  );
};

export default BooleanRadioRHF;
