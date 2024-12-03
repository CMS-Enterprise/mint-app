import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { MtoCommonMilestoneKey } from 'gql/generated/graphql';
import { suggestedMilestonesMock } from 'tests/mock/mto';

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
    key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT
  };

  it('renders correctly and matches snapshot', () => {
    const { asFragment, getByText } = render(
      <MockedProvider mocks={suggestedMilestonesMock} addTypename={false}>
        <MemoryRouter
          initialEntries={[
            '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/milestone-library">
            <MilestoneCard milestone={mockMilestone} />
          </Route>
        </MemoryRouter>
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
