import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { MtoCommonSolutionKey, TableName } from 'gql/generated/graphql';
import { modelID } from 'tests/mock/readonly';
import MockedProvider from 'tests/MockedProvider';
import { vi } from 'vitest';

import { MilestoneCardType } from '../../MilestoneLibrary';

import SuggestedMilestoneToggle from '.';

// Mocking the utility function to control data flow
// vi.mock('../../_utils/suggestedMilestone', () => ({
//   formatMilestoneAnswers: vi.fn()
// }));

const mockSuggestedMilestone: MilestoneCardType = {
  __typename: 'MTOCommonMilestone',
  id: '123456',
  name: 'Test Milestone',
  isArchived: false,
  isAdded: false,
  suggested: {
    __typename: 'MilestoneSuggestionReasons',
    isSuggested: true,
    count: 0,
    reasons: [
      {
        __typename: 'MilestoneSuggestionReason',
        field: 'testQuestion',
        table: TableName.PLAN_OPS_EVAL_AND_LEARNING,
        question: 'what is the name?',
        answer: 'MINT'
      }
    ]
  },
  categoryName: 'Test Category',
  subCategoryName: 'Test SubCategory',
  facilitatedByRole: [],
  description: 'Description 1',
  commonSolutions: [
    {
      __typename: 'MTOCommonSolution',
      key: MtoCommonSolutionKey.BCDA
    }
  ]
};

describe('SuggestedMilestoneToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the toggle button initially closed', () => {
    const router = createMemoryRouter(
      [
        {
          path: `/models/:modelID/collaboration-area/model-to-operations/milestone-library`,
          element: (
            <SuggestedMilestoneToggle milestone={mockSuggestedMilestone} />
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/milestone-library`
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(getByText('Why is this suggested?')).toBeInTheDocument();
    expect(queryByText(/youAnswered/i)).not.toBeInTheDocument();
  });

  it('toggles open to show content', () => {
    const router = createMemoryRouter(
      [
        {
          path: `/models/:modelID/collaboration-area/model-to-operations/milestone-library`,
          element: (
            <SuggestedMilestoneToggle milestone={mockSuggestedMilestone} />
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/milestone-library`
        ]
      }
    );

    const { getByTestId, getByText, getByRole } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const toggleBtn = getByTestId('toggle-milestone-answer');
    fireEvent.click(toggleBtn);

    expect(getByText('In the Model Plan, you answered:')).toBeInTheDocument();
    expect(getByText(/Q: What is the name\?/i)).toBeInTheDocument();
    expect(getByText('MINT')).toBeInTheDocument();
    expect(getByRole('link', { name: 'Go to the question' })).toHaveAttribute(
      'href',
      `/models/${modelID}/collaboration-area/model-plan/ops-eval-and-learning`
    );
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: `/models/:modelID/collaboration-area/model-to-operations/milestone-library`,
          element: (
            <SuggestedMilestoneToggle milestone={mockSuggestedMilestone} />
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/milestone-library`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
