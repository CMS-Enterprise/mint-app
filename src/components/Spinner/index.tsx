import React from 'react';
import classnames from 'classnames';

import './index.scss';

type SpinnerProps = {
  className?: string;
  size?: 'small' | 'large' | 'xl';
  center?: boolean;
  testId?: string;
} & React.ComponentProps<'span'>;

const Spinner = ({
  className,
  size,
  center,
  testId,
  ...props
}: SpinnerProps) => {
  const classes = classnames(
    'mint-spinner',
    {
      'mint-spinner--small': size === 'small',
      'mint-spinner--large': size === 'large',
      'mint-spinner--xl': size === 'xl',
      center
    },
    className
  );
  return (
    <span
      className={classes}
      aria-valuetext="Loading"
      role="progressbar"
      data-testid={testId || 'spinner'}
      {...props}
    />
  );
};

export default Spinner;
