import React from 'react';
import { Fieldset, Radio } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field } from 'formik';

import { Bool } from 'types/translation';

type AddNoteType = {
  field: string;
  value: boolean | null | undefined;
  id: string;
  options: Record<Bool, string>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  childName?: string;
  className?: string;
};

const BooleanRadio = ({
  field: fieldName,
  value,
  id,
  options,
  setFieldValue,
  disabled = false,
  children,
  childName,
  className
}: AddNoteType) => {
  return (
    <Fieldset className={classNames(className)}>
      <Field
        as={Radio}
        id={`${id}-true`}
        data-testid={`${id}-true`}
        name={fieldName}
        label={options.true}
        value="TRUE"
        checked={value === true}
        disabled={disabled}
        onChange={() => {
          setFieldValue(fieldName, true);
          if (childName) {
            setFieldValue(childName, '');
          }
        }}
      />

      {children}

      <Field
        as={Radio}
        id={`${id}-false`}
        data-testid={`${id}-false`}
        name={fieldName}
        label={options.false}
        value="FALSE"
        checked={value === false}
        disabled={disabled}
        onChange={() => {
          setFieldValue(fieldName, false);
        }}
      />
    </Fieldset>
  );
};

export default BooleanRadio;
