import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

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
} as ComponentMeta<typeof CategoryCard>;

export const Default = () => (
  <CategoryCard category="Data reporting" route="data" />
);
