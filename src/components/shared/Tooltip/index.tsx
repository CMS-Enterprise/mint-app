// Custom Tooltip component - alternative to Truss Tooltip component
// More closely aligns with MINT design

import React, { forwardRef } from 'react';
import { Tooltip as TrussTooltip } from '@trussworks/react-uswds';

type TooltipProps = {
  children: React.ReactNode;
  label: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

const Tooltip = ({
  children,
  label,
  position = 'top'
}: TooltipProps): React.ReactElement => {
  const CustomDivForwardRef: React.ForwardRefRenderFunction<HTMLDivElement> = (
    { ...tooltipProps },
    ref
  ) => <div ref={ref} {...tooltipProps} />;
  const CustomDiv = forwardRef<HTMLDivElement>(CustomDivForwardRef);

  return (
    <TrussTooltip label={label} asCustom={CustomDiv} position={position}>
      {children}
    </TrussTooltip>
  );
};

export default Tooltip;
