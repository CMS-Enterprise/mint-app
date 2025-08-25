import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';

import ModelSolutionDesign from '.';

const mocks = [...possibleSolutionsMock];

describe('ModelSolutionDesign', () => {
  it('matches the snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/model-and-solution-design',
          element: <ModelSolutionDesign />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/model-and-solution-design']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(asFragment()).toMatchSnapshot();
  });
});
