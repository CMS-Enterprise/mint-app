import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import SixPagerMeeting from './index';

const mocks = [...possibleSolutionsMock];

describe('SixPagerMeeting', () => {
  it('matches the snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <SixPagerMeeting />
            </VerboseMockedProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment, getByTestId } = render(
      <RouterProvider router={router} />
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
