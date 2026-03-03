import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import {
  PlanTask,
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';
import { collaborationAreaData } from 'tests/mock/general';
import setup from 'tests/util';

import TasksWrapper from './index';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const emptyTasksByKey = {};

const basePlanTask: Pick<
  PlanTask,
  'id' | 'createdBy' | 'createdByUserAccount' | 'createdDts'
> = {
  id: '00000000-0000-0000-0000-000000000001',
  createdBy: '00000000-0000-0000-0000-000000000002',
  createdByUserAccount: {
    __typename: 'UserAccount' as const,
    id: '00000000-0000-0000-0000-000000000002',
    commonName: 'Test User',
    email: 'test@example.com',
    familyName: 'User',
    givenName: 'Test',
    locale: 'en',
    username: 'testuser',
    zoneInfo: 'America/New_York'
  },
  createdDts: '2024-01-01T00:00:00Z'
};

const tasksByKeyWithModelPlanComplete: Partial<Record<PlanTaskKey, PlanTask>> =
  {
    [PlanTaskKey.MODEL_PLAN]: {
      ...basePlanTask,
      __typename: 'PlanTask' as const,
      key: PlanTaskKey.MODEL_PLAN,
      state: PlanTaskState.COMPLETE,
      status: PlanTaskStatus.COMPLETE
    } as PlanTask
  };

const tasksByKeyWithModelPlanInProgress: Partial<
  Record<PlanTaskKey, PlanTask>
> = {
  [PlanTaskKey.MODEL_PLAN]: {
    ...basePlanTask,
    __typename: 'PlanTask' as const,
    key: PlanTaskKey.MODEL_PLAN,
    state: PlanTaskState.TO_DO,
    status: PlanTaskStatus.IN_PROGRESS
  } as PlanTask
};

describe('TasksWrapper', () => {
  it('renders three task cards for MODEL_PLAN, DATA_EXCHANGE, and MTO', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <TasksWrapper
              modelPlan={collaborationAreaData}
              tasksByKey={emptyTasksByKey}
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
    expect(getByText('Start your data exchange approach')).toBeInTheDocument();
    expect(
      getByText('Start your model-to-operations matrix (MTO)')
    ).toBeInTheDocument();
  });

  it('uses StateTag reflecting task state when tasksByKey has COMPLETE state', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <TasksWrapper
              modelPlan={collaborationAreaData}
              tasksByKey={tasksByKeyWithModelPlanComplete}
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
              tasksByKey={tasksByKeyWithModelPlanInProgress}
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

  it('shows section details (sections started) only for MODEL_PLAN card when state is not TO_DO', async () => {
    const modelPlanWithModified = {
      ...collaborationAreaData,
      basics: {
        ...collaborationAreaData.basics,
        modifiedDts: '2022-05-12T15:01:39.190679Z',
        modifiedByUserAccount: {
          __typename: 'UserAccount' as const,
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
              tasksByKey={tasksByKeyWithModelPlanComplete}
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
