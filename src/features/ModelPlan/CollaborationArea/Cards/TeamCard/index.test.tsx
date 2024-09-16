import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { collaboratorsMocks } from 'tests/mock/readonly';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';

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
    const { asFragment, getByTestId, getByText, queryByTestId } = render(
      <MemoryRouter
        initialEntries={[
          'models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area'
        ]}
      >
        <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="models/:modelID/collaboration-area">
                <TeamCard modelID="f11eb129-2c80-4080-9440-439cbe1a286f" />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('team-loading'));

    // CollapsableLink is not rendered if less than 9 collaborators
    expect(queryByTestId('collaboration-team-card')).toBeNull();

    // Assert that the mock collaborator has 2 roles, and that the count is displayed
    expect(getByText('+2 roles')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          'models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area'
        ]}
      >
        <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="models/:modelID/collaboration-area">
                <TeamCard modelID="f11eb129-2c80-4080-9440-439cbe1a286f" />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('team-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
