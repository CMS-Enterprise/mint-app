import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Tooltip } from '@trussworks/react-uswds';
import { MtoRiskIndicator } from 'gql/generated/graphql';

export const MTORiskIndicatorTag = ({
  riskIndicator,
  showTooltip = true,
  classname
}: {
  riskIndicator: MtoRiskIndicator;
  showTooltip?: boolean;
  classname?: string;
}) => {
  const { t } = useTranslation('mtoMilestone');

  const CustomDivForwardRef: React.ForwardRefRenderFunction<HTMLDivElement> = (
    { ...tooltipProps },
    ref
  ) => <div ref={ref} {...tooltipProps} />;
  const CustomDiv = forwardRef<HTMLDivElement>(CustomDivForwardRef);

  let RiskIcon = <></>;

  if (riskIndicator === MtoRiskIndicator.AT_RISK)
    RiskIcon = <Icon.Error className="text-error-dark top-05" size={3} />;

  if (riskIndicator === MtoRiskIndicator.OFF_TRACK)
    RiskIcon = <Icon.Warning className="text-warning-dark top-05" size={3} />;

  if (!showTooltip) return <>{RiskIcon}</>;

  return (
    <div className={classname}>
      <Tooltip
        label={t(`riskIndicator.options.${riskIndicator}`)}
        position="right"
        asCustom={CustomDiv}
      >
        {RiskIcon}
      </Tooltip>
    </div>
  );
};

export default MTORiskIndicatorTag;
