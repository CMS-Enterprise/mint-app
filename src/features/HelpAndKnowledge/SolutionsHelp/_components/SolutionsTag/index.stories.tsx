import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import { operationalSolutionCategoryMap } from '../../solutionsMap';

import SolutionsTag from '.';

export default {
  title: 'Help and Knowledge SolutionsTag',
  component: SolutionsTag,
  decorators: [
    Story => (
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              path: '/help-and-knowledge/operational-solutions',
              element: (
                <SolutionsTag
                  route={operationalSolutionCategoryMap.data}
                  category={MtoCommonSolutionSubject.DATA}
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
} as Meta<typeof SolutionsTag>;

export const Default = () => (
  <RouterProvider
    router={createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionsTag
              route={operationalSolutionCategoryMap.data}
              category={MtoCommonSolutionSubject.DATA}
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
