import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { helpSolutionsArray } from '../../solutionsMap';

import SolutionHelpCardGroup from '.';

export default {
  title: 'Help and Knowledge SolutionHelpCardGroup',
  component: SolutionHelpCardGroup,
  decorators: [
    Story => (
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              path: '/help-and-knowledge/operational-solutions',
              element: (
                <SolutionHelpCardGroup
                  solutions={helpSolutionsArray}
                  setResultsNum={() => null}
                />
              )
            }
          ],
          {
            initialEntries: ['/help-and-knowledge/operational-solutions']
          }
        )}
      />
    )
  ]
} as Meta<typeof SolutionHelpCardGroup>;

export const Default = () => (
  <SolutionHelpCardGroup
    solutions={helpSolutionsArray}
    setResultsNum={() => null}
  />
);
