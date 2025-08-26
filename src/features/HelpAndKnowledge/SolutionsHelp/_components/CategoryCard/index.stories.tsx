import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import CategoryCard from '.';

export default {
  title: 'Help and Knowledge Solution CategoryCard',
  component: CategoryCard,
  decorators: [
    Story => (
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              path: '/',
              element: <Story />
            }
          ],
          {
            initialEntries: ['/']
          }
        )}
      />
    )
  ]
} as Meta<typeof CategoryCard>;

export const Default = () => (
  <CategoryCard categoryKey={MtoCommonSolutionSubject.DATA} />
);
