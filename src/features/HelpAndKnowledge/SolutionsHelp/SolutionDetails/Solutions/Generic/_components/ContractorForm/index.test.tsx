import React from 'react';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes
} from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ContractorForm from './index';

const mocks = [...possibleSolutionsMock];

const contractor: SolutionContractorType = {
  __typename: 'MTOCommonSolutionContractor',
  id: '123',
  contractorName: 'MIT',
  contractTitle: 'Zinnia Purple'
};

describe('Contractor form', () => {
  it('should render edit the contractor info accordingly', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <ContractorForm
                mode="editContractor"
                closeModal={() => {}}
                contractor={contractor}
              />
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
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByTestId('contract-title')).toHaveValue('Zinnia Purple');
      expect(getByTestId('contractor-name')).toHaveValue('MIT');
    });
  });

  it('should matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <ContractorForm
                mode="addContractor"
                closeModal={() => {}}
                contractor={undefined}
              />
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
