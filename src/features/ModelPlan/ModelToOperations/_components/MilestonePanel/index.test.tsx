import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { MilestoneCardType } from 'features/MilestoneLibrary/MilestoneCard';
import { MtoCommonSolutionKey, MtoFacilitator } from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import MilestonePanel from './index';

describe('MilestonePanel Component', () => {
  const mockMilestone: MilestoneCardType = {
    __typename: 'MTOCommonMilestone',
    id: 'common-milestone-1',
    name: 'Test Milestone',
    description: 'Description 1',
    categoryName: 'Test Category',
    subCategoryName: 'Test SubCategory',
    isArchived: false,
    isAdded: false,
    suggested: {
      __typename: 'MilestoneSuggestionReasons' as const,
      isSuggested: true,
      count: 0,
      reasons: []
    },
    facilitatedByRole: [MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR],
    commonSolutions: [
      {
        __typename: 'MTOCommonSolution',
        key: MtoCommonSolutionKey.ACO_OS
      }
    ]
  };

  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <MilestonePanel
                milestone={mockMilestone}
                mode="mtoMilestoneLibrary"
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment, getByText } = render(
      <MockedProvider mocks={[...possibleSolutionsMock]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Check if the component renders props data
    expect(getByText('Test Milestone')).toBeInTheDocument();
    expect(
      getByText('Category: Test Category (Test SubCategory)')
    ).toBeInTheDocument();
    expect(getByText('Suggested')).toBeInTheDocument();
    expect(
      getByText('Facilitated by: Application support contractor')
    ).toBeInTheDocument();

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
