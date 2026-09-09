import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { PlanTaskKey } from 'gql/generated/graphql';
import { collaborationAreaData } from 'tests/mock/general';
import { modelID, planTasksAllToDo } from 'tests/mock/mto';
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
});
