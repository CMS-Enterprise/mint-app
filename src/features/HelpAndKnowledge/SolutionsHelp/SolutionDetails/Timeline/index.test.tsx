import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutionsArray } from '../../solutionsMap';

import Timeline from '.';

describe('Operational Solutions Timeline Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionTimelineComponent => {
      const router = createMemoryRouter(
        [
          {
            path: '/help-and-knowledge/operational-solutions',
            element: <Timeline solution={solutionTimelineComponent} />
          }
        ],
        {
          initialEntries: [
            `/help-and-knowledge/operational-solutions?solution-key=${solutionTimelineComponent.key}&section=timeline`
          ]
        }
      );

      const { asFragment } = render(<RouterProvider router={router} />);

      expect(asFragment()).toMatchSnapshot(solutionTimelineComponent.name);
    }
  );
});
