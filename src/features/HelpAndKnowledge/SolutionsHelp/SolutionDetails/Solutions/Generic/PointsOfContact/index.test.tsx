import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import PointsOfContact from '.';

describe('Generic Points of Contact Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionPoCComponent => {
      const router = createMemoryRouter(
        [
          {
            path: '/help-and-knowledge/operational-solutions',
            element: <PointsOfContact solution={solutionPoCComponent} />
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
