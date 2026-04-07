import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import MessageProvider from 'contexts/MessageContext';

import MilestoneCardGroup, { MilestoneCardType } from '.';

const commonMilestonesMock: MilestoneCardType[] = [
  {
    __typename: 'MTOCommonMilestone',
    id: '123456',
    name: 'Test Milestone 1',
    isArchived: false,
    isAdded: false,
    suggested: {
      __typename: 'MilestoneSuggestionReasons',
      isSuggested: true,
      count: 0,
      reasons: []
    },
    categoryName: 'Category1',
    subCategoryName: 'Test SubCategory',
    facilitatedByRole: [],
    description: 'Description 1',
    commonSolutions: [
      {
        __typename: 'MTOCommonSolution',
        key: MtoCommonSolutionKey.BCDA
      }
    ]
  },
  {
    __typename: 'MTOCommonMilestone',
    id: '123457',
    name: 'Test Milestone 2',
    isArchived: false,
    isAdded: true,
    suggested: {
      __typename: 'MilestoneSuggestionReasons',
      isSuggested: true,
      count: 0,
      reasons: []
    },
    categoryName: 'Category2',
    subCategoryName: 'Test SubCategory',
    facilitatedByRole: [],
    description: 'Description 2',
    commonSolutions: [
      {
        __typename: 'MTOCommonSolution',
        key: MtoCommonSolutionKey.BCDA
      }
    ]
  }
];

describe('MilestoneCardGroup', () => {
  it('renders correctly when show filter', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneCardGroup
                milestones={commonMilestonesMock}
                showFilters
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );

    const { getByText, queryByText } = render(
      <RouterProvider router={router} />
    );

    expect(getByText('Test Milestone 1')).toBeInTheDocument();
    expect(getByText('Test Milestone 2')).toBeInTheDocument();
    expect(getByText('Filter')).toBeInTheDocument();
    expect(queryByText('Add to matrix')).not.toBeInTheDocument();
  });

  it('renders correctly when not show filter', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneCardGroup
                milestones={commonMilestonesMock}
                showFilters={false}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library?page=1&view=all'
        ]
      }
    );

    const { getByText, getAllByText, queryByText } = render(
      <RouterProvider router={router} />
    );

    expect(getByText('Test Milestone 1')).toBeInTheDocument();
    expect(getByText('Test Milestone 2')).toBeInTheDocument();
    expect(getAllByText('Add to matrix')).toHaveLength(1);
    expect(getAllByText('Added')).toHaveLength(1);
    expect(queryByText('Filter')).not.toBeInTheDocument();
  });

  it('should toggle "Hide added milestones" logic correctly', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneCardGroup
                milestones={commonMilestonesMock}
                showFilters={false}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library?page=1&view=all&hide-added-milestones=true'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <RouterProvider router={router} />
    );

    expect(queryByText('Test Milestone 2')).not.toBeInTheDocument();
    expect(getByText('Test Milestone 1')).toBeInTheDocument();
  });

  it('should filters milestones based on search query', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneCardGroup
                milestones={commonMilestonesMock}
                showFilters={false}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library?page=1&view=all'
        ]
      }
    );

    const { getByRole, getByText, queryByText } = render(
      <RouterProvider router={router} />
    );

    const searchInput = getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'Milestone 1' } });

    expect(queryByText('Test Milestone 2')).not.toBeInTheDocument();
    expect(getByText('Test Milestone 1')).toBeInTheDocument();
  });

  it('should filters milestones based on filter group', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneCardGroup
                milestones={commonMilestonesMock}
                showFilters
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/milestone-library?category=Category1'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <RouterProvider router={router} />
    );

    expect(getByText('Test Milestone 1')).toBeInTheDocument();
    expect(queryByText('Test Milestone 2')).not.toBeInTheDocument();
  });
});
