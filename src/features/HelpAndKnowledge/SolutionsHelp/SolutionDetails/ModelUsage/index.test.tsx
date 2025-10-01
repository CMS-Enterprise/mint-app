import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutionsArray } from '../../solutionsMap';

import ModelUsage from '.';

describe('Operational Solutions Model Usage Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionModelUsageComponent => {
      const router = createMemoryRouter(
        [
          {
            path: '/help-and-knowledge/operational-solutions',
            element: <ModelUsage solution={solutionModelUsageComponent} />
          }
        ],
        {
          initialEntries: [
            `/help-and-knowledge/operational-solutions?solution-key=${solutionModelUsageComponent.key}&section=model-usage`
          ]
        }
      );

      const { asFragment } = render(<RouterProvider router={router} />);

      expect(asFragment()).toMatchSnapshot(solutionModelUsageComponent.name);
    }
  );
});
