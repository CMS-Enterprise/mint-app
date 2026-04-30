import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { GetCollaborationAreaQuery } from 'gql/generated/graphql';
import { collaborationAreaData } from 'tests/mock/general';
import {
  modelID,
  planTasksAllToDo,
  planTasksWithModelPlanComplete,
  planTasksWithModelPlanInProgress
} from 'tests/mock/mto';
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

    const { findByText, getByText } = setup(<RouterProvider router={router} />);

    await findByText('Start your Model Plan');
    expect(getByText('Previous')).toBeInTheDocument();
    expect(getByText('Next')).toBeInTheDocument();
    expect(getByText('See all (3)')).toBeInTheDocument();
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
      <RouterProvider router={router} />
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

    const { findByText, getByText } = setup(<RouterProvider router={router} />);

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

    const { findByText } = setup(<RouterProvider router={router} />);

    expect(
      await findByText(/Most recent edit on 05\/12\/2022 by/)
    ).toBeInTheDocument();
  });
});
