import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GetMtoAllMilestonesQuery,
  GetMtoSolutionQuery,
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  MtoSolutionStatus
} from 'gql/generated/graphql';

import LinkMilestoneForm from './index'; // Adjust the import path as necessary

describe('LinkMilestoneForm Component', () => {
  const mockSolution: GetMtoSolutionQuery['mtoSolution'] = {
    __typename: 'MTOSolution',
    id: 'solution-1',
    key: MtoCommonSolutionKey.CDX,
    name: 'Test Solution',
    status: MtoSolutionStatus.COMPLETED,
    addedFromSolutionLibrary: false,
    milestones: []
  };

  const mockAllMilestones: GetMtoAllMilestonesQuery['modelPlan']['mtoMatrix'] =
    {
      __typename: 'ModelsToOperationMatrix',
      info: {
        __typename: 'MTOInfo',
        id: 'matrix-1'
      },
      commonMilestones: [
        {
          __typename: 'MTOCommonMilestone',
          key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
          name: 'Common Milestone 1',
          commonSolutions: [
            { __typename: 'MTOCommonSolution', key: MtoCommonSolutionKey.BCDA }
          ]
        },
        {
          __typename: 'MTOCommonMilestone',
          key: MtoCommonMilestoneKey.ACQUIRE_A_LEARN_CONT,
          name: 'Common Milestone 2',
          commonSolutions: [
            {
              __typename: 'MTOCommonSolution',
              key: MtoCommonSolutionKey.CDX
            }
          ]
        }
      ],
      milestones: [
        {
          __typename: 'MTOMilestone',
          id: 'milestone-1',
          key: MtoCommonMilestoneKey.ADJUST_FFS_CLAIMS,
          name: 'Milestone 1',
          status: MtoMilestoneStatus.COMPLETED,
          riskIndicator: MtoRiskIndicator.AT_RISK,
          solutions: []
        },
        {
          __typename: 'MTOMilestone',
          id: 'milestone-2',
          key: MtoCommonMilestoneKey.APP_SUPPORT_CON,
          name: 'Milestone 2',
          status: MtoMilestoneStatus.COMPLETED,
          riskIndicator: MtoRiskIndicator.AT_RISK,
          solutions: []
        }
      ]
    };

  const mockSetMilestoneIDs = vi.fn();

  const renderComponent = (milestoneIDs: string[] = []) => {
    return render(
      <MemoryRouter>
        <LinkMilestoneForm
          solution={mockSolution}
          milestoneIDs={milestoneIDs}
          setMilestoneIDs={mockSetMilestoneIDs}
          allMilestones={mockAllMilestones}
        />
      </MemoryRouter>
    );
  };

  it('renders populated milestones correctly and displays grouped milestones', async () => {
    renderComponent(['milestone-1']);

    // Check for the heading
    expect(screen.getByText('1 selected milestone')).toBeInTheDocument();

    // Check for prepolutated milestone
    expect(screen.getByText('Milestone 1')).toBeInTheDocument();

    // Check for tag to render
    expect(
      screen.getByTestId('multiselect-tag--Milestone 1')
    ).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderComponent();

    expect(asFragment()).toMatchSnapshot();
  });
});
