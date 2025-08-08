import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import { SolutionCard } from '.';

describe('MTO SolutionCard Component', () => {
  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <SolutionCard
                solution={helpSolutions[MtoCommonSolutionKey.INNOVATION]}
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

    // Check if the component renders prop data
    expect(getByText('IT system')).toBeInTheDocument();
    expect(getByText('4innovation')).toBeInTheDocument();
    expect(getByText('4i')).toBeInTheDocument();

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
