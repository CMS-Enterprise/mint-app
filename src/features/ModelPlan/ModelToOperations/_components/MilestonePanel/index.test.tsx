import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import {
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoFacilitator
} from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import { MilestoneCardType } from '../../MilestoneLibrary';

import MilestonePanel from './index';

describe('MilestonePanel Component', () => {
  const mockMilestone: MilestoneCardType = {
    __typename: 'MTOCommonMilestone',
    key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
    name: 'Test Milestone',
    description: 'Description 1',
    categoryName: 'Test Category',
    subCategoryName: 'Test SubCategory',
    isAdded: false,
    isSuggested: true,
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
              <MilestonePanel milestone={mockMilestone} />
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
