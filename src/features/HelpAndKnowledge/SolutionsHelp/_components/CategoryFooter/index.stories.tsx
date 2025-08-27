import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Meta } from '@storybook/react';

import CategoryFooter from '.';

export default {
  title: 'Help and Knowledge Solution CategoryFooter',
  component: CategoryFooter,
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
} as Meta<typeof CategoryFooter>;

export const Default = () => <CategoryFooter />;
