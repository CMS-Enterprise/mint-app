import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import TwoPagerMeeting from './index';

const mocks = [...possibleSolutionsMock];

describe('TwoPagerMeeting', () => {
  it('matches the snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/about-2-page-concept-papers-and-review-meetings',
          element: (
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <TwoPagerMeeting />
            </VerboseMockedProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/about-2-page-concept-papers-and-review-meetings'
        ]
      }
    );

    const { asFragment, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
