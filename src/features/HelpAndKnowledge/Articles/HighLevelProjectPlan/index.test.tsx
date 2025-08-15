import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import HighLevelProjectPlan from '.';

const mocks = [...possibleSolutionsMock];

describe('High Level Project Plan Article', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/high-level-project-plan',
          element: (
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <HighLevelProjectPlan />
            </VerboseMockedProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/high-level-project-plan']
      }
    );

    const { asFragment, getByTestId } = render(
      <RouterProvider router={router} />
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
