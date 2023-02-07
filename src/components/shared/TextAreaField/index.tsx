import React from 'react';
import classnames from 'classnames';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';

type TextAreaFieldProps = {
  className?: string;
  error?: boolean;
  hint?: string;
  id: string;
  label?: string;
  maxLength?: number;
  name: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
} & JSX.IntrinsicElements['textarea'];

const TextAreaField = ({
  className,
  error,
  hint,
  id,
  label,
  maxLength,
  name,
  onBlur,
  onChange,
  value,
  ...props
}: TextAreaFieldProps) => {
  const textAreaClasses = classnames(className, 'usa-textarea', {
    'usa-input--error': error
  });
  return (
    <>
      {label && (
        <label className="usa-label" htmlFor={id}>
          {label}
        </label>
      )}

      {hint && (
        <span className="usa-hint display-block text-normal">{hint}</span>
      )}

      {error && <FieldErrorMsg>{error}</FieldErrorMsg>}

      <textarea
        className={textAreaClasses}
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        maxLength={maxLength}
        {...props}
      />
    </>
  );
};

export default TextAreaField;
