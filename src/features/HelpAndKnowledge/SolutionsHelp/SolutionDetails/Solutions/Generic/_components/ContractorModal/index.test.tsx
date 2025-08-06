import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ContractorModal from '.';

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

describe('ContractorModal Component', () => {
  it('should render add contractor context when render', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <ContractorModal
              isModalOpen
              closeModal={() => {}}
              mode="addContractor"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contractor'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );
    expect(getByText('Add a contractor')).toBeInTheDocument();
    expect(queryByText('Edit contractor')).not.toBeInTheDocument();
  });

  it('should render edit contractor context when render', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <ContractorModal
              isModalOpen
              closeModal={() => {}}
              contractor={contractors[0]}
              mode="editContractor"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-points-of-contact'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );
    expect(getByText('Edit contractor')).toBeInTheDocument();
    expect(queryByText('Add a contractor')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <ContractorModal
              isModalOpen
              closeModal={() => {}}
              contractor={contractors[0]}
              mode="addContractor"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-points-of-contact'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
