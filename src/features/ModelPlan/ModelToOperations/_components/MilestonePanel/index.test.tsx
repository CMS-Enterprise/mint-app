import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoFacilitator
} from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/solutions';

import MessageProvider from 'contexts/MessageContext';

import { MilestoneCardType } from '../../MilestoneLibrary';

import MilestonePanel, { SolutionCard } from './index';

describe('MilestonePanel Component', () => {
  const mockMilestone: MilestoneCardType = {
    __typename: 'MTOCommonMilestone',
    key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
    name: 'Test Milestone',
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
    const { asFragment, getByText } = render(
      <MockedProvider mocks={[...possibleSolutionsMock]} addTypename={false}>
        <MemoryRouter>
          <MessageProvider>
            <MilestonePanel milestone={mockMilestone} />
          </MessageProvider>
        </MemoryRouter>
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

describe('MTO SolutionCard Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment, getByText } = render(
      <MockedProvider mocks={[...possibleSolutionsMock]} addTypename={false}>
        <MemoryRouter>
          <MessageProvider>
            <SolutionCard solution={helpSolutions[0]} />
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    // Check if the component renders prop data
    expect(getByText('IT System')).toBeInTheDocument();
    expect(getByText('4innovation')).toBeInTheDocument();
    expect(getByText('4i')).toBeInTheDocument();

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});