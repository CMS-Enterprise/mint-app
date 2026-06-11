import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import {
  GetModelPlansBaseDocument,
  GetUserInfoDocument,
  ModelPlanFilter
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import setup from 'tests/util';

import MessageProvider from 'contexts/MessageContext';

import CtatSidePanel from '.';

const mockAuth = {
  isUserSet: true,
  groups: [],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuth });

const mocks = [
  {
    request: {
      query: GetUserInfoDocument,
      variables: { username: 'ABCD' }
    },
    result: {
      data: {
        userAccount: {
          __typename: 'UserAccount',
          id: 'user-1',
          username: 'ABCD',
          commonName: 'Luke Skywalker',
          email: 'luke.skywalker@cms.hhs.gov',
          givenName: 'Luke',
          familyName: 'Skywalker'
        }
      }
    }
  },
  {
    request: {
      query: GetModelPlansBaseDocument,
      variables: { filter: ModelPlanFilter.INCLUDE_ALL }
    },
    result: {
      data: {
        modelPlanCollection: [
          {
            __typename: 'ModelPlan',
            id: 'model-1',
            modelName: 'Test Model'
          }
        ]
      }
    }
  }
];

const renderPanel = (isOpen = true) => {
  const router = createMemoryRouter(
    [
      {
        path: '/help-and-knowledge/contract-assistance',
        element: (
          <MessageProvider>
            <CtatSidePanel isOpen={isOpen} closeModal={() => {}} />
          </MessageProvider>
        )
      }
    ],
    {
      initialEntries: ['/help-and-knowledge/contract-assistance']
    }
  );

  return setup(
    <Provider store={store}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    </Provider>
  );
};

describe('CtatSidePanel', () => {
  it('renders the new ticket form when open', async () => {
    renderPanel(true);

    await waitFor(() => {
      expect(screen.getByText('New ticket')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Fields marked with an asterisk/)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Requester/)).toBeInTheDocument();
    expect(screen.getByLabelText(/CMMI group/)).toBeInTheDocument();
    expect(screen.getByLabelText(/CMMI division/)).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Submit ticket' })
      ).toBeDisabled();
    });
  });

  it('disables CMMI division until a group is selected', async () => {
    const { user } = renderPanel(true);

    const cmmiDivisionSelect = await screen.findByLabelText(/CMMI division/);

    expect(cmmiDivisionSelect).toBeDisabled();

    await user.selectOptions(screen.getByLabelText(/CMMI group/), 'BSG');

    await waitFor(() => {
      expect(screen.getByLabelText(/CMMI division/)).not.toBeDisabled();
    });
  });

  it('does not render form content when closed', () => {
    renderPanel(false);

    expect(screen.queryByLabelText(/Requester/)).not.toBeInTheDocument();
  });
});
