import React from 'react';
import classnames from 'classnames';

import './index.scss';

type DropdownFieldProps = {
  id: string;
  disabled?: boolean;
  error?: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  children: React.ReactNode;
  value: any;
} & React.ComponentProps<'select'>;

export const DropdownField = ({
  id,
  disabled,
  error,
  name,
  onBlur,
  onChange,
  children,
  value,
  ...props
}: DropdownFieldProps) => {
  const dropdownClassNames = classnames(
    'mint-dropdown',
    'usa-select',
    { 'mint-dropdown--error': error },
    { 'mint-dropdown--disabled': disabled }
  );
  return (
    <select
      className={dropdownClassNames}
      disabled={disabled}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      id={id}
      value={value}
      {...props}
    >
      {children}
    </select>
  );
};

type DropdownItemProps = {
  name: string;
  value: string;
  disabled?: boolean;
};

export const DropdownItem = ({ name, value, disabled }: DropdownItemProps) => (
  <option value={value} disabled={disabled}>
    {name}
  </option>
);
