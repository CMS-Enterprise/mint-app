import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/data-exchange-approach/about-completing-data-exchange',
          element: <AboutCompletingDataExchange />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/data-exchange-approach/about-completing-data-exchange'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
