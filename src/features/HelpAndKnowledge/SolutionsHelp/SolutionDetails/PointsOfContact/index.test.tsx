import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import { helpSolutionsArray } from '../../solutionsMap';

import PointsOfContact from '.';

const mocks = [...possibleSolutionsMock];

describe('Operational Solutions Points of Contact Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionPoCComponent => {
      const router = createMemoryRouter(
        [
          {
            path: '/help-and-knowledge/operational-solutions',
            element: (
              <VerboseMockedProvider mocks={mocks} addTypename={false}>
                <PointsOfContact solution={solutionPoCComponent} />
              </VerboseMockedProvider>
            )
          }
        ],
        {
          initialEntries: [
            `/help-and-knowledge/operational-solutions?solution-key=${solutionPoCComponent.key}&section=points-of-contact`
          ]
        }
      );

      const { asFragment } = render(<RouterProvider router={router} />);
      expect(asFragment()).toMatchSnapshot(solutionPoCComponent.name);
    }
  );
});
