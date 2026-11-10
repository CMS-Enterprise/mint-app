import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import {
  GetCollaborationAreaQuery,
  PlanTaskState
} from 'gql/generated/graphql';
import { collaborationAreaData } from 'tests/mock/general';
import {
  makePlanTasks,
  modelID,
  planTasksAllToDo,
  planTasksWithModelPlanComplete,
  planTasksWithModelPlanInProgress
} from 'tests/mock/mto';
import MockedProvider from 'tests/MockedProvider';
import setup from 'tests/util';

import TasksWrapper from './index';

describe('TasksWrapper', () => {
  it('renders current tasks stack with first task (Model Plan) and navigation', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <TasksWrapper
              modelPlan={collaborationAreaData}
              tasks={planTasksAllToDo}
            />
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByText, getByText } = setup(
      <MockedProvider mocks={[]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await findByText('Start your Model Plan');
    expect(getByText('Previous')).toBeInTheDocument();
    expect(getByText('Next')).toBeInTheDocument();
    expect(getByText('See all (5)')).toBeInTheDocument();
  });

  it('does not count NOT_NEEDED approved ICIP, but counts it once it is to-do', async () => {
    const renderWrapper = (tasks: typeof planTasksAllToDo) => {
      const router = createMemoryRouter(
        [
          {
            path: '/models/:modelID/collaboration-area',
            element: (
              <TasksWrapper modelPlan={collaborationAreaData} tasks={tasks} />
            )
          }
        ],
        { initialEntries: [`/models/${modelID}/collaboration-area`] }
      );

      return setup(
        <MockedProvider mocks={[]}>
          <RouterProvider router={router} />
        </MockedProvider>
      );
    };

    const notNeeded = renderWrapper(planTasksAllToDo);
    await notNeeded.findByText('See all (5)');
    notNeeded.unmount();

    const activated = renderWrapper(
      makePlanTasks({ APPROVED_ICIP: { state: PlanTaskState.TO_DO } })
    );
    await activated.findByText('See all (6)');
  });

  it('hides tasks with COMPLETE state and renders next state', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <TasksWrapper
              modelPlan={collaborationAreaData}
              tasks={planTasksWithModelPlanComplete}
            />
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByText, getByText, queryByText } = setup(
      <MockedProvider mocks={[]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await findByText('To do');

    expect(queryByText('Complete')).not.toBeInTheDocument();
    expect(getByText('To do')).toBeInTheDocument();
  });

  it('renders MODEL_PLAN card with IN_PROGRESS status copy (heading and primary action)', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <TasksWrapper
              modelPlan={collaborationAreaData}
              tasks={planTasksWithModelPlanInProgress}
            />
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByText, getByText } = setup(
      <MockedProvider mocks={[]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await findByText('Iterate on your Model Plan');
    expect(getByText('Continue')).toBeInTheDocument();
  });

  it('shows section details (sections started) only for MODEL_PLAN card when status is not TO_DO', async () => {
    const modelPlanWithModified: GetCollaborationAreaQuery['modelPlan'] = {
      ...collaborationAreaData,
      basics: {
        ...collaborationAreaData.basics,
        modifiedDts: '2022-05-12T15:01:39.190679Z',
        modifiedByUserAccount: {
          __typename: 'UserAccount',
          commonName: 'John Doe'
        }
      }
    };

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <TasksWrapper
              modelPlan={modelPlanWithModified}
              tasks={planTasksWithModelPlanInProgress}
            />
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByText } = setup(
      <MockedProvider mocks={[]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      await findByText(/Most recent edit on 05\/12\/2022 by/)
    ).toBeInTheDocument();
  });
});
