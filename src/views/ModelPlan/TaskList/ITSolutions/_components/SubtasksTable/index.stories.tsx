import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

import Subtasks, { SubtaskStatus } from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

const subtasks = [
  {
    name: 'Review requirements document',
    status: SubtaskStatus.TO_DO
  },
  {
    name: 'Review onboarding materials',
    status: SubtaskStatus.TO_DO
  },
  {
    name: 'Write onboarding request',
    status: SubtaskStatus.IN_PROGRESS
  },
  {
    name: 'Gather recipient data',
    status: SubtaskStatus.DONE
  }
];

export default {
  title: 'Operational Solution Subtasks',
  component: Subtasks,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-details`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-details">
          <Story />
        </Route>
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof Subtasks>;

export const Default = () => <Subtasks subtasks={subtasks} />;
