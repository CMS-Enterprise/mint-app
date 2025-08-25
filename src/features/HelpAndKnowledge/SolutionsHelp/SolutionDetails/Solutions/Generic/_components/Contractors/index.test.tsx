import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import Contractors from '.';

const contractors: SolutionContractorType[] = [
  {
    __typename: 'MTOCommonSolutionContractor',
    id: '123',
    contractorName: 'MIT',
    contractTitle: 'Zinnia Purple'
  },
  {
    __typename: 'MTOCommonSolutionContractor',
    id: '456',
    contractorName: 'MINT',
    contractTitle: 'Aliza Kim'
  }
];

const mocks = [...possibleSolutionsMock];

describe('Contractors Component', () => {
  it('should renders no contractors alert info when there are no contractors', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <Contractors contractors={[]} />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      queryByText('No contractor is listed for this solution.')
    ).toBeInTheDocument();
  });

  it('should matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <Contractors contractors={contractors} />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
