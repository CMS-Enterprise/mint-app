import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import {
  GetCollaborationAreaDocument,
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';
import { collaborationAreaData } from 'tests/mock/general';
import {
  makePlanTasks,
  modelID,
  PlanTaskEntry,
  planTasksAllToDo,
  planTasksWithModelPlanComplete
} from 'tests/mock/mto';
import setup from 'tests/util';
import { describe, expect, it } from 'vitest';

import Tasks from '.';

const renderWithMock = (tasks: PlanTaskEntry[], initialTab?: string) => {
  const modelPlan = {
    ...collaborationAreaData,
    tasks
  };

  const mocks = [
    {
      request: {
        query: GetCollaborationAreaDocument,
        variables: { id: modelID }
      },
      result: {
        data: {
          __typename: 'Query',
          modelPlan
        }
      }
    }
  ];

  const router = createMemoryRouter(
    [
      {
        path: '/models/:modelID/collaboration-area/tasks',
        element: <Tasks />
      }
    ],
    {
      initialEntries: [
        `/models/${modelID}/collaboration-area/tasks${
          initialTab ? `?tab=${initialTab}` : ''
        }`
      ]
    }
  );

  return setup(
    <MockedProvider mocks={mocks}>
      <RouterProvider router={router} />
    </MockedProvider>
  );
};

describe('Tasks page', () => {
  it('renders current tasks by default and filters out completed tasks', async () => {
    renderWithMock(planTasksWithModelPlanComplete);

    await waitFor(() => {
      expect(screen.getByText('Current tasks (2)')).toBeInTheDocument();
      expect(screen.getByText('Completed tasks (1)')).toBeInTheDocument();
    });

    expect(screen.queryByText('Start your Model Plan')).not.toBeInTheDocument();
    expect(
      screen.getByText('Start your model-to-operations matrix (MTO)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Start your data exchange approach')
    ).toBeInTheDocument();
  });

  it('orders completed tasks newest-to-oldest by completedDts', async () => {
    const allComplete = makePlanTasks({
      [PlanTaskKey.MODEL_PLAN]: {
        state: PlanTaskState.COMPLETE,
        status: PlanTaskStatus.COMPLETE
      },
      [PlanTaskKey.MTO]: {
        state: PlanTaskState.COMPLETE,
        status: PlanTaskStatus.COMPLETE
      },
      [PlanTaskKey.DATA_EXCHANGE]: {
        state: PlanTaskState.COMPLETE,
        status: PlanTaskStatus.COMPLETE
      }
    });

    const { container } = renderWithMock(allComplete, 'completed');

    await waitFor(() => {
      expect(screen.getByText('Completed tasks (3)')).toBeInTheDocument();
    });

    const cardHeadings = container.querySelectorAll(
      '.usa-card .usa-card__heading'
    );

    const orderedHeadings = Array.from(cardHeadings).map(
      heading => heading.textContent ?? ''
    );

    expect(orderedHeadings).toEqual([
      'Finalize your data exchange approach',
      'Keep your model-to-operations matrix (MTO) up-to-date',
      'Iterate on your Model Plan'
    ]);
  });

  it('shows completed empty state copy when there are no completed tasks', async () => {
    const { container } = renderWithMock(planTasksAllToDo, 'completed');

    await waitFor(() => {
      expect(
        screen.getByText('There are no completed tasks yet.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Once you complete a task, it will appear here.')
      ).toBeInTheDocument();
    });

    expect(container.querySelectorAll('.usa-card').length).toBe(0);
  });
});
