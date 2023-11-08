import React from 'react';
import { Meta } from '@storybook/react';

import ImplementationStatuses from '.';

export default {
  title: 'Operational Need Implemntation Statuses',
  component: ImplementationStatuses
} as Meta<typeof ImplementationStatuses>;

export const ImplementationStatus = () => <ImplementationStatuses slim />;
