import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import { helpSolutions } from '../../solutionsMap';

import SolutionHelpCard from '.';

export default {
  title: 'Help and Knowledge SolutionHelpCard',
  component: SolutionHelpCard,
  decorators: [
    Story => (
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              path: '/help-and-knowledge/operational-solutions',
              element: (
                <SolutionHelpCard
                  solution={helpSolutions[MtoCommonSolutionKey.INNOVATION]}
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
} as Meta<typeof SolutionHelpCard>;

export const Default = () => (
  <SolutionHelpCard solution={helpSolutions[MtoCommonSolutionKey.INNOVATION]} />
);
