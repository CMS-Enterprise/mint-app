import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  MtoCommonSolutionCmsComponent,
  MtoCommonSolutionOwnerType
} from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import OwnerCard from '.';

const owner: SolutionSystemOwnerType = {
  __typename: 'MTOCommonSolutionSystemOwner',
  id: 'not a real id',
  cmsComponent: MtoCommonSolutionCmsComponent.OFFICE_OF_COMMUNICATIONS_OC,
  ownerType: MtoCommonSolutionOwnerType.BUSINESS_OWNER
};

const mocks = [...possibleSolutionsMock];

describe('Owners Component', () => {
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
            element={<OwnerCard owner={owner}  />}
          />
        </Routes>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
