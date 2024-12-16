import React from 'react';
import { render } from '@testing-library/react';
import { MtoMilestoneStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import MilestoneStatusTag from './index';

describe('MilestoneStatusTag Component', () => {
  it('renders correctly for NOT_STARTED status', () => {
    const { getByText } = render(
      <MilestoneStatusTag status={MtoMilestoneStatus.NOT_STARTED} />
    );

    // Check if the component renders the correct status text
    expect(
      getByText(i18next.t('mtoMilestone:status.options.NOT_STARTED'))
    ).toBeInTheDocument();
  });

  it('renders correctly for IN_PROGRESS status', () => {
    const { getByText } = render(
      <MilestoneStatusTag status={MtoMilestoneStatus.IN_PROGRESS} />
    );

    // Check if the component renders the correct status text
    expect(
      getByText(i18next.t('mtoMilestone:status.options.IN_PROGRESS'))
    ).toBeInTheDocument();
  });

  it('renders correctly and matches snapshot for COMPLETED status', () => {
    const { asFragment, getByText } = render(
      <MilestoneStatusTag status={MtoMilestoneStatus.COMPLETED} />
    );

    // Check if the component renders the correct status text
    expect(
      getByText(i18next.t('mtoMilestone:status.options.COMPLETED'))
    ).toBeInTheDocument();

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
