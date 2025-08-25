import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { helpSolutions } from '../../solutionsMap';

import SolutionsHeader from '.';

export default {
  title: 'Help and Knowledge SolutionsHeader',
  component: SolutionsHeader,
  decorators: [
    Story => (
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              path: '/help-and-knowledge/operational-solutions',
              element: (
                <SolutionsHeader
                  resultsNum={9}
                  resultsMax={Object.keys(helpSolutions).length}
                  setQuery={(query: string) => null}
                  query=""
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
} as Meta<typeof SolutionsHeader>;

export const Default = () => (
  <RouterProvider
    router={createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionsHeader
              resultsNum={9}
              resultsMax={Object.keys(helpSolutions).length}
              setQuery={(query: string) => null}
              query=""
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/operational-solutions']
      }
    )}
  />
);
