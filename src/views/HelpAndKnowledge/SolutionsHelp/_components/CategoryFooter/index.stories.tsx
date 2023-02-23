import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

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
} as ComponentMeta<typeof CategoryFooter>;

export const Default = () => <CategoryFooter />;
