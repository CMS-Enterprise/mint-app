import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import SubtasksTable, { SubtaskStatus } from '.';

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

describe('Subtasks Table Component', () => {
  it('renders subtasks correctly', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-details`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-details">
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
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-details`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-details">
          <SubtasksTable subtasks={[]} />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
