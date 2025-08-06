import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ContractorCard from '.';

const mocks = [...possibleSolutionsMock];

const contractor: SolutionContractorType = {
  __typename: 'MTOCommonSolutionContractor',
  id: '123',
  contractTitle: 'MIT',
  contractorName: 'Aliza Kim'
};

describe('ContractorCard Component', () => {
  it('should matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: <ContractorCard contractor={contractor} />
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
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
