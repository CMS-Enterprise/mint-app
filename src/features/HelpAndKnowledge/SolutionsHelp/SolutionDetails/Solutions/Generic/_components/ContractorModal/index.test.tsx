import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
    const { getByText, queryByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contractor'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <ContractorModal
                isModalOpen
                closeModal={() => {}}
                mode="addContractor"
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(getByText('Add a contractor')).toBeInTheDocument();
    expect(queryByText('Edit contractor')).not.toBeInTheDocument();
  });

  it('should render edit contractor context when render', () => {
    const { getByText, queryByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <ContractorModal
                isModalOpen
                closeModal={() => {}}
                contractor={contractors[0]}
                mode="editContractor"
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(getByText('Edit contractor')).toBeInTheDocument();
    expect(queryByText('Add a contractor')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <ContractorModal
                isModalOpen
                closeModal={() => {}}
                contractor={contractors[0]}
                mode="addContractor"
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
