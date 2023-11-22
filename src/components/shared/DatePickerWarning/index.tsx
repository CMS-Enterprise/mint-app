import React, { forwardRef } from 'react';
import { Icon, Tooltip } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

// Component used for displaying warning icon within DatePicker inputs

type DatePickerWarningProps = {
  className?: string;
  label: string;
};

// Parent element must hav position of relative
export const DatePickerWarning = ({
  label,
  className
}: DatePickerWarningProps): React.ReactElement => {
  const CustomDivForwardRef: React.ForwardRefRenderFunction<HTMLDivElement> = (
    { ...tooltipProps },
    ref
  ) => <div ref={ref} {...tooltipProps} />;
  const CustomDiv = forwardRef<HTMLDivElement>(CustomDivForwardRef);

  const classes = classNames('mint-datepicker-warning', className);

  return (
    <div className={classes}>
      <Tooltip label={label} asCustom={CustomDiv}>
        <Icon.Warning size={3} className="text-warning-dark" />
      </Tooltip>
    </div>
  );
};

export default DatePickerWarning;
