import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  MtoCommonSolutionCmsComponent,
  MtoCommonSolutionOwnerType
} from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import OwnerForm from '.';

const owner: SolutionSystemOwnerType = {
  __typename: 'MTOCommonSolutionSystemOwner',
  id: 'not a real id',
  cmsComponent: MtoCommonSolutionCmsComponent.OFFICE_OF_COMMUNICATIONS_OC,
  ownerType: MtoCommonSolutionOwnerType.BUSINESS_OWNER
};

const mocks = [...possibleSolutionsMock];

describe('Owner Form Component', () => {
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
              <OwnerForm
                mode="addSystemOwner"
                closeModal={() => {}}
                setSubmitForm={() => {}}
                setDisableButton={() => {}}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render passed in owner info', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <OwnerForm
                mode="editSystemOwner"
                closeModal={() => {}}
                owner={owner}
                setSubmitForm={() => {}}
                setDisableButton={() => {}}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('combo-box-select')).toHaveValue(
        MtoCommonSolutionCmsComponent.OFFICE_OF_COMMUNICATIONS_OC
      );
      expect(
        getByTestId(MtoCommonSolutionOwnerType.BUSINESS_OWNER)
      ).toBeChecked();
    });
  });
});
