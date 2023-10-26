import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Meta } from '@storybook/react';

import CategoryCard from '.';

export default {
  title: 'Help and Knowledge Solution CategoryCard',
  component: CategoryCard,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as Meta<typeof CategoryCard>;

export const Default = () => (
  <CategoryCard category="Data reporting" route="data" />
);
