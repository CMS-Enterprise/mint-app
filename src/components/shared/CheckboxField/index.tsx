import React from 'react';
import classnames from 'classnames';

type CheckboxFieldProps = {
  checked?: boolean;
  disabled?: boolean;
  id: string;
  testid?: string;
  label: string;
  subLabel?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
  inputProps?: JSX.IntrinsicElements['input'];
};

const CheckboxField = ({
  checked,
  disabled,
  id,
  testid,
  label,
  subLabel,
  name,
  onChange,
  onBlur,
  value,
  inputProps
}: CheckboxFieldProps) => {
  const checkboxClassNames = classnames('mint-checkbox', 'usa-checkbox', {
    'easy-checkbox--disabled': disabled
  });
  return (
    <div className={checkboxClassNames}>
      <input
        checked={checked}
        className="usa-checkbox__input"
        disabled={disabled}
        id={id}
        data-testid={testid}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        type="checkbox"
        value={value}
        {...inputProps}
      />
      <label
        className="usa-checkbox__label"
        htmlFor={id}
        style={{ width: 'fit-content' }}
      >
        {label}
      </label>
      <p
        className={classnames(
          'margin-y-1 margin-left-4 line-height-body-3 font-body-2xs text-pre-line',
          {
            'text-gray-30': disabled
          }
        )}
      >
        {subLabel}
      </p>
    </div>
  );
};

export default CheckboxField;
