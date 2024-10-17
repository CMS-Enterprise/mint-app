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

describe('TestComponent', () => {
  it('renders correctly and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/data-exchange-approach/about-completing-data-exchange'
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
