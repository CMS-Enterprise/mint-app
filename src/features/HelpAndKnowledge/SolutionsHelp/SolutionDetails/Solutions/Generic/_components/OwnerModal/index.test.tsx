import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  MtoCommonSolutionCmsComponent,
  MtoCommonSolutionOwnerType
} from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import OwnerModal from '.';

const owner: SolutionSystemOwnerType = {
  __typename: 'MTOCommonSolutionSystemOwner',
  id: 'not a real id',
  cmsComponent: MtoCommonSolutionCmsComponent.OFFICE_OF_COMMUNICATIONS_OC,
  ownerType: MtoCommonSolutionOwnerType.BUSINESS_OWNER
};

const mocks = [...possibleSolutionsMock];

describe('Owner Modal Component', () => {
  it('should render add owner modal', async () => {
    const { getByText, queryByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <OwnerModal
                isModalOpen
                mode="addSystemOwner"
                closeModal={() => {}}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Add owner information')).toBeInTheDocument();
      expect(
        getByText(
          'Select the CMS component that is the Business Owner or System Owner for the system, contract, team, or solution.'
        )
      ).toBeInTheDocument();
      expect(getByText('Add owner')).toBeInTheDocument();
      expect(queryByText('Edit owner information')).not.toBeInTheDocument();
    });
  });

  it('should render edit owner modal', async () => {
    const { getByText, queryByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <OwnerModal
                isModalOpen
                owner={owner}
                mode="editSystemOwner"
                closeModal={() => {}}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Edit owner information')).toBeInTheDocument();
      expect(getByText('Save Changes')).toBeInTheDocument();
      expect(queryByText('Add owner information')).not.toBeInTheDocument();
    });
  });
});
