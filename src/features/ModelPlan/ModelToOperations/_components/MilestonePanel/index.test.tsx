import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { MilestoneCardType } from 'features/MilestoneLibrary/MilestoneCard';
import { MtoCommonSolutionKey, MtoFacilitator } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import { possibleSolutionsMock } from 'tests/mock/mto';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import MilestonePanel from './index';

const mockAuthAssessment = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockAuthNotAssessment = {
  isUserSet: true,
  groups: [],
  euaId: 'EFGH'
};

const mockStore = configureMockStore();
const store1 = mockStore({ auth: mockAuthAssessment });
const store2 = mockStore({ auth: mockAuthNotAssessment });

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
        <Provider store={store2}>
          <RouterProvider router={router} />
        </Provider>
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

  it('renders correctly in different modes', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <MilestonePanel
                milestone={mockMilestone}
                mode="hkcMilestoneLibrary"
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText, getByRole } = render(
      <MockedProvider mocks={[...possibleSolutionsMock]} addTypename={false}>
        <Provider store={store1}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    // Check if the component renders props data
    expect(getByText('Test Milestone')).toBeInTheDocument();
    expect(
      getByText('Category: Test Category (Test SubCategory)')
    ).toBeInTheDocument();
    expect(
      getByText('Facilitated by: Application support contractor')
    ).toBeInTheDocument();
    expect(
      getByRole('button', { name: /Edit Milestone/i })
    ).toBeInTheDocument();
  });
});
