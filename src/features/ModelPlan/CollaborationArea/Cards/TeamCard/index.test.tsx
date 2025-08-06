import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { collaboratorsMocks } from 'tests/mock/readonly';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import TeamCard from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('TeamCard component', () => {
  it('displays role count correctly', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: <TeamCard modelID="ce3405a0-3399-4e3a-88d7-3cfc613d2905" />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area'
        ]
      }
    );

    const { asFragment, getByTestId, getByText, queryByTestId } = render(
      <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
        <Provider store={store}>
          <MessageProvider>
            <RouterProvider router={router} />
          </MessageProvider>
        </Provider>
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => getByTestId('team-loading'));

    // CollapsableLink is not rendered if less than 9 collaborators
    expect(queryByTestId('collaboration-team-card')).toBeNull();

    // Assert that the mock collaborator has 2 roles, and that the count is displayed
    expect(getByText('+2 roles')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: <TeamCard modelID="ce3405a0-3399-4e3a-88d7-3cfc613d2905" />
        }
      ],
      {
        initialEntries: [
          'models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area'
        ]
      }
    );

    const { asFragment, getByTestId } = render(
      <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
        <Provider store={store}>
          <MessageProvider>
            <RouterProvider router={router} />
          </MessageProvider>
        </Provider>
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => getByTestId('team-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
