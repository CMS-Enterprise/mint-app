// Custom Tooltip component - alternative to Truss Tooltip component
// More closely aligns with MINT design

import React, { forwardRef } from 'react';
import { Tooltip as TrussTooltip } from '@trussworks/react-uswds';

type TooltipProps = {
  children: React.ReactNode;
  label: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
};

const Tooltip = ({
  children,
  label,
  position = 'top',
  className
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
      className={className}
    >
      {children}
    </TrussTooltip>
  );
};

export default Tooltip;
