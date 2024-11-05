// Custom Tooltip component - alternative to Truss Tooltip component
// More closely aligns with MINT design

import React, { forwardRef } from 'react';
import { Tooltip as TrussTooltip } from '@trussworks/react-uswds';
import classNames from 'classnames';

type TooltipProps = {
  children: React.ReactNode;
  className?: string;
  label: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  wrapperclasses?: string;
};

const Tooltip = ({
  children,
  className,
  wrapperclasses,
  label,
  position = 'top'
}: TooltipProps): React.ReactElement => {
  const CustomDivForwardRef: React.ForwardRefRenderFunction<HTMLDivElement> = (
    { ...tooltipProps },
    ref
  ) => <div ref={ref} {...tooltipProps} />;
  const CustomDiv = forwardRef<HTMLDivElement>(CustomDivForwardRef);

  return (
    <TrussTooltip
      label={label}
      asCustom={CustomDiv}
      position={position}
      wrapperclasses={wrapperclasses}
      className={classNames('mint-no-print', className)}
    >
      {children}
    </TrussTooltip>
  );
};

export default Tooltip;
