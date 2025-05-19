import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { collaboratorsMocks } from 'tests/mock/readonly';

import AboutCompletingDataExchange from '.';

describe('AboutCompletingDataExchange', () => {
  it('renders correctly and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/data-exchange-approach/about-completing-data-exchange'
        ]}
      >
        <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/data-exchange-approach/about-completing-data-exchange">
            <AboutCompletingDataExchange />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
