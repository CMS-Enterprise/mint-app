import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Meta } from '@storybook/react';

import CategoryFooter from '.';

export default {
  title: 'Help and Knowledge Solution CategoryFooter',
  component: CategoryFooter,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as Meta<typeof CategoryFooter>;

export const Default = () => <CategoryFooter />;
