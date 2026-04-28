import React from 'react';
import { RefCallBack } from 'react-hook-form';
import classnames from 'classnames';

import FieldErrorMsg from 'components/FieldErrorMsg';

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
  inputRef?: RefCallBack;
} & React.ComponentProps<'textarea'>;

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
  inputRef,
  ...props
}: TextAreaFieldProps) => {
  const textAreaClasses = classnames(className, 'usa-textarea', {
    'usa-input--error': error
  });
  return (
    <>
      {label && (
        <label className="usa-label" htmlFor={id} id={`label-${id}`}>
          {label}
        </label>
      )}

      {hint && (
        <span className="usa-hint display-block text-normal" id={`hint-${id}`}>
          {hint}
        </span>
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
        aria-labelledby={`label-${id} hint-${id}`}
        ref={inputRef}
        {...props}
      />
    </>
  );
};

export default TextAreaField;
