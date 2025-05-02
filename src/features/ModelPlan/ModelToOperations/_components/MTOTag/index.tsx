import React, { forwardRef, ReactNode } from 'react';
import { Icon, Tooltip } from '@trussworks/react-uswds';

export const MTOTag = ({
  type,
  label,
  tooltip,
  classname
}: {
  type: 'draft' | 'custom';
  label: string;
  tooltip?: string | ReactNode;
  classname?: string;
}) => {
  const CustomDivForwardRef: React.ForwardRefRenderFunction<HTMLDivElement> = (
    { ...tooltipProps },
    ref
  ) => <div ref={ref} {...tooltipProps} />;
  const CustomDiv = forwardRef<HTMLDivElement>(CustomDivForwardRef);

  let TagIcon = <></>;

  if (type === 'draft')
    TagIcon = (
      <span className="padding-right-1 bg-accent-warm-lighter text-accent-warm-darker padding-y-05 margin-right-2">
        <Icon.Science className="margin-left-1" style={{ top: '2px' }} />{' '}
        {label}
      </span>
    );

  if (type === 'custom')
    TagIcon = (
      <span className="padding-right-1 bg-warning-lighter text-warning-darker padding-y-05">
        <Icon.Construction className="margin-left-1" style={{ top: '2px' }} />{' '}
        {label}
      </span>
    );

  if (!tooltip) return <>{TagIcon}</>;

  return (
    <div className={classname}>
      <Tooltip label={tooltip} position="right" asCustom={CustomDiv}>
        {TagIcon}
      </Tooltip>
    </div>
  );
};

export default MTOTag;
