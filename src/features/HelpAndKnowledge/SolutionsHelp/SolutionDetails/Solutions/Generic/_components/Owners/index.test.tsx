import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  MtoCommonSolutionCmsComponent,
  MtoCommonSolutionOwnerType
} from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import Owners from '.';

const owners: SolutionSystemOwnerType[] = [
  {
    __typename: 'MTOCommonSolutionSystemOwner',
    id: 'not a real id',
    cmsComponent: MtoCommonSolutionCmsComponent.OFFICE_OF_COMMUNICATIONS_OC,
    ownerType: MtoCommonSolutionOwnerType.BUSINESS_OWNER
  },
  {
    __typename: 'MTOCommonSolutionSystemOwner',
    id: 'not a real id',
    cmsComponent: MtoCommonSolutionCmsComponent.OFFICE_OF_COMMUNICATIONS_OC,
    ownerType: MtoCommonSolutionOwnerType.SYSTEM_OWNER
  }
];

const mocks = [...possibleSolutionsMock];

describe('Owners Component', () => {
  it('should renders no owners alert info when there are no owners', () => {
    const { queryByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <Owners owners={[]} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      queryByText(
        'No Business Owner or System Owner is listed for this solution.'
      )
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
            <Route path="/help-and-knowledge/operational-solutions">
              <Owners owners={owners} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
