import React from 'react';
import { render, screen } from '@testing-library/react';
import { MtoRiskIndicator } from 'gql/generated/graphql';
import Sinon from 'sinon';

import MTORiskIndicatorTag from './index';

describe('MTORiskIndicatorTag Component', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('renders correctly and matches snapshot for AT_RISK indicator', () => {
    const { asFragment } = render(
      <MTORiskIndicatorTag riskIndicator={MtoRiskIndicator.AT_RISK} />
    );

    expect(screen.getByRole('img', { hidden: true })).toHaveClass(
      'text-error-dark'
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly and matches snapshot for OFF_TRACK indicator', () => {
    const { asFragment } = render(
      <MTORiskIndicatorTag riskIndicator={MtoRiskIndicator.OFF_TRACK} />
    );

    expect(screen.getByRole('img', { hidden: true })).toHaveClass(
      'text-warning-dark'
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders without tooltip when showTooltip is false', () => {
    render(
      <MTORiskIndicatorTag
        riskIndicator={MtoRiskIndicator.AT_RISK}
        showTooltip={false}
      />
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders with tooltip when showTooltip is true', () => {
    render(
      <MTORiskIndicatorTag
        riskIndicator={MtoRiskIndicator.AT_RISK}
        showTooltip
      />
    );

    expect(screen.getByTestId('tooltipBody')).toBeInTheDocument();
  });
});
