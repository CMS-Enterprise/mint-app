import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import {
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoFacilitator
} from 'gql/generated/graphql';
import { suggestedMilestonesMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import { MilestoneCardType } from '../../MilestoneLibrary';

import MilestoneCard from './index';

describe('MilestoneCard Component', () => {
  const mockMilestone: MilestoneCardType = {
    __typename: 'MTOCommonMilestone',
    name: 'Test Milestone',
    categoryName: 'Test Category',
    subCategoryName: 'Test SubCategory',
    isSuggested: true,
    isAdded: false,
    key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
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
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneCard
                milestone={mockMilestone}
                setIsSidepanelOpen={() => null}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library'
        ]
      }
    );

    const { asFragment, getByText } = render(
      <MockedProvider mocks={suggestedMilestonesMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Check if the component renders the milestone name
    expect(getByText('Test Milestone')).toBeInTheDocument();
    // Check if the component renders the category and subcategory
    expect(
      getByText('Category: Test Category (Test SubCategory)')
    ).toBeInTheDocument();
    // Check if the component renders the suggested tag
    expect(getByText('Suggested')).toBeInTheDocument();

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
