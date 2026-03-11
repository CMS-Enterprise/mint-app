import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
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

    const { getByText } = setup(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(getByText('Current tasks')).toBeInTheDocument();
    });

    expect(getByText('Start your Model Plan')).toBeInTheDocument();
    expect(getByText('Previous')).toBeInTheDocument();
    expect(getByText('Next')).toBeInTheDocument();
    expect(getByText('See all (3)')).toBeInTheDocument();
  });

  it('uses StateTag reflecting task state when tasks have COMPLETE state', async () => {
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

    const { getByText } = setup(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(getByText('Current tasks')).toBeInTheDocument();
    });

    expect(getByText('Complete')).toBeInTheDocument();
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

    const { getByText } = setup(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(getByText('Current tasks')).toBeInTheDocument();
    });

    expect(getByText('Iterate on your Model Plan')).toBeInTheDocument();
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
              tasks={planTasksWithModelPlanComplete}
            />
          )
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { getByText } = setup(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(getByText('Current tasks')).toBeInTheDocument();
    });

    expect(
      getByText(/Most recent edit on 05\/12\/2022 by/)
    ).toBeInTheDocument();
  });
});
