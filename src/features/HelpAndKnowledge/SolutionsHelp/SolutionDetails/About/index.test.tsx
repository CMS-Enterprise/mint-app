import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutionsArray } from '../../solutionsMap';

import About from '.';

describe('Operational Solutions About Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionAboutComponent => {
      const router = createMemoryRouter(
        [
          {
            path: '/help-and-knowledge/operational-solutions',
            element: <About solution={solutionAboutComponent} />
          }
        ],
        {
          initialEntries: [
            `/help-and-knowledge/operational-solutions?solution-key=${solutionAboutComponent.key}&section=about`
          ]
        }
      );

      const { asFragment } = render(<RouterProvider router={router} />);
      expect(asFragment()).toMatchSnapshot(solutionAboutComponent.name);
    }
  );
});
