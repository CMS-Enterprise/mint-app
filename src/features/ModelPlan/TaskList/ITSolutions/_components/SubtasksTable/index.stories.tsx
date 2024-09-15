import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { OperationalSolutionSubtaskStatus } from 'gql/generated/graphql';

import SubtasksTable from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

const subtasks = [
  {
    name: 'Review requirements document',
    status: OperationalSolutionSubtaskStatus.TODO
  },
  {
    name: 'Review onboarding materials',
    status: OperationalSolutionSubtaskStatus.TODO
  },
  {
    name: 'Write onboarding request',
    status: OperationalSolutionSubtaskStatus.IN_PROGRESS
  },
  {
    name: 'Gather recipient data',
    status: OperationalSolutionSubtaskStatus.DONE
  }
];

export default {
  title: 'Operational Solution Subtasks',
  component: SubtasksTable,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-details`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-details">
          <Story />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof SubtasksTable>;

export const Default = () => <SubtasksTable subtasks={subtasks} />;
