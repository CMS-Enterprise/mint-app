import React from 'react';
import { ComponentMeta } from '@storybook/react';

import ImplementationStatuses from '.';

export default {
  title: 'Operational Need Implemntation Statuses',
  component: ImplementationStatuses
} as ComponentMeta<typeof ImplementationStatuses>;

export const ImplementationStatus = () => <ImplementationStatuses slim />;
