import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';
import { collaborationAreaData } from 'tests/mock/general';
import { makePlanTasks, modelID, planTasksAllToDo } from 'tests/mock/mto';
import setup from 'tests/util';

import TaskCard from './index';

describe('TaskCard', () => {
  it('renders card with task details and navigation actions', async () => {
    const task = planTasksAllToDo.find(t => t.key === PlanTaskKey.MODEL_PLAN)!;

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <MockedProvider mocks={[]}>
              <TaskCard modelPlan={collaborationAreaData} task={task} />
            </MockedProvider>
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByText, getByRole, asFragment } = setup(
      <RouterProvider router={router} />
    );

    await findByText('Start your Model Plan');

    expect(getByRole('button', { name: 'Start' })).toBeInTheDocument();

    expect(
      getByRole('link', { name: 'View sample Model Plan' })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the mark-complete checkbox for OA_PRESENTATION when TO_DO', async () => {
    const tasks = makePlanTasks({
      [PlanTaskKey.OA_PRESENTATION]: {
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO
      }
    });
    const task = tasks.find(t => t.key === PlanTaskKey.OA_PRESENTATION)!;

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <MockedProvider mocks={[]}>
              <TaskCard modelPlan={collaborationAreaData} task={task} />
            </MockedProvider>
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByText, getByLabelText, getByRole } = setup(
      <RouterProvider router={router} />
    );

    await findByText(
      'Prepare for your presentation to the Office of the Administrator (OA)'
    );

    expect(getByLabelText('Mark this task complete')).toBeInTheDocument();
    expect(
      getByRole('button', { name: 'Upload OA presentation' })
    ).toBeInTheDocument();
  });

  it('renders the revert-to-todo link for OA_PRESENTATION when COMPLETE', async () => {
    const tasks = makePlanTasks({
      [PlanTaskKey.OA_PRESENTATION]: {
        state: PlanTaskState.COMPLETE,
        status: PlanTaskStatus.COMPLETE
      }
    });
    const task = tasks.find(t => t.key === PlanTaskKey.OA_PRESENTATION)!;

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <MockedProvider mocks={[]}>
              <TaskCard modelPlan={collaborationAreaData} task={task} />
            </MockedProvider>
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByRole } = setup(<RouterProvider router={router} />);

    expect(
      await findByRole('button', { name: 'Mark this task to do' })
    ).toBeInTheDocument();
  });

  it('renders view-only for UPCOMING tasks with no footer actions', async () => {
    const tasks = makePlanTasks({
      [PlanTaskKey.OA_PRESENTATION]: {
        state: PlanTaskState.UPCOMING,
        status: PlanTaskStatus.UPCOMING
      }
    });
    const task = tasks.find(t => t.key === PlanTaskKey.OA_PRESENTATION)!;

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <MockedProvider mocks={[]}>
              <TaskCard modelPlan={collaborationAreaData} task={task} />
            </MockedProvider>
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByText, queryByRole, queryByLabelText } = setup(
      <RouterProvider router={router} />
    );

    await findByText(
      'Prepare for your presentation to the Office of the Administrator (OA)'
    );

    expect(
      queryByRole('button', { name: 'Upload OA presentation' })
    ).not.toBeInTheDocument();
    expect(queryByLabelText('Mark this task complete')).not.toBeInTheDocument();
  });
});
