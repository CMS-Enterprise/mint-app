import React from 'react';
import { Meta } from '@storybook/react';

import ExternalLink from './index';

export default {
  title: 'External Link',
  component: ExternalLink
} as Meta<typeof ExternalLink>;

export const Default = () => (
  <ExternalLink href="https://google.com">Google Link with modal</ExternalLink>
);
