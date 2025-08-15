import React, { ReactNode } from 'react';
import classnames from 'classnames';

type FieldGroupProps = {
  children: ReactNode;
  className?: string;
  error?: boolean;
  scrollElement?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const FieldGroup = ({
  children,
  className,
  error,
  scrollElement,
  ...props
}: FieldGroupProps) => {
  const fieldGroupClasses = classnames(
    'usa-form-group',
    { 'usa-form-group--error': error },
    className
  );

  return (
    <div className={fieldGroupClasses} data-scroll={scrollElement} {...props}>
      {children}
    </div>
  );
};

export default FieldGroup;
