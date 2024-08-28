import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { OperationalSolutionSubtaskStatus } from 'gql/gen/graphql';

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

describe('Subtasks Table Component', () => {
  it('renders subtasks correctly', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-details`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-details">
          <SubtasksTable subtasks={subtasks} />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('todo')).toHaveTextContent(
        'Review requirements document'
      );
      expect(getByTestId('inProgress')).toHaveTextContent(
        'Write onboarding request'
      );
      expect(getByTestId('done')).toHaveTextContent('Gather recipient data');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-details`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-details">
          <SubtasksTable subtasks={[]} />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
