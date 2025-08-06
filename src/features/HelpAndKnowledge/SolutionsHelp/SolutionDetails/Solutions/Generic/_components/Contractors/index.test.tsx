import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
    const { queryByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Routes>
          <Route
            path="/help-and-knowledge/operational-solutions"
            element={<Contractors contractors={[]}  />}
          />
        </Routes>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      queryByText('No contractor is listed for this solution.')
    ).toBeInTheDocument();
  });

  it('should matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Routes>
          <Route
            path="/help-and-knowledge/operational-solutions"
            element={<Contractors contractors={contractors}  />}
          />
        </Routes>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
