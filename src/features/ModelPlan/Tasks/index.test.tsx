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

const getCardHeadings = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.usa-card .usa-card__heading')).map(
    heading => heading.textContent ?? ''
  );

const completeAllTasks = () =>
  makePlanTasks({
    [PlanTaskKey.MODEL_PLAN]: {
      state: PlanTaskState.COMPLETE,
      status: PlanTaskStatus.COMPLETE
    },
    [PlanTaskKey.TWO_PAGER]: {
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
    },
    [PlanTaskKey.WAIVER_ASSESSMENT_SURVEY]: {
      state: PlanTaskState.COMPLETE,
      status: PlanTaskStatus.COMPLETE
    },
    [PlanTaskKey.SIX_PAGER]: {
      state: PlanTaskState.COMPLETE,
      status: PlanTaskStatus.COMPLETE
    },
    [PlanTaskKey.DRAFT_ICIP]: {
      state: PlanTaskState.COMPLETE,
      status: PlanTaskStatus.COMPLETE
    },
    [PlanTaskKey.OA_PRESENTATION]: {
      state: PlanTaskState.COMPLETE,
      status: PlanTaskStatus.COMPLETE
    },
    [PlanTaskKey.PREPARE_FOR_CLEARANCE]: {
      state: PlanTaskState.COMPLETE,
      status: PlanTaskStatus.COMPLETE
    },
    [PlanTaskKey.APPROVED_ICIP]: {
      state: PlanTaskState.COMPLETE,
      status: PlanTaskStatus.COMPLETE
    }
  });

describe('Tasks page', () => {
  it('renders page chrome and default current-task order, keeping 6-pager and OA upcoming', async () => {
    const { container } = renderWithMock(planTasksAllToDo);

    await waitFor(() => {
      expect(screen.getByText('Current tasks (5)')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
    expect(screen.getByTestId('model-plan-name')).toHaveTextContent('for Test');
    expect(screen.getByText('Upcoming tasks (4)')).toBeInTheDocument();
    expect(screen.getByText('Completed tasks (0)')).toBeInTheDocument();

    expect(getCardHeadings(container)).toEqual([
      'Start your Model Plan',
      'Prepare for your 2-page review meeting with CMMI Front Office (FO)',
      'Start your data exchange approach',
      'Complete your waiver assessment survey',
      'Start your model-to-operations matrix (MTO)'
    ]);

    expect(
      screen.queryByText(
        'Prepare for your 6-page review meeting with CMMI Front Office (FO)'
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Prepare for your presentation to the Office of the Administrator (OA)'
      )
    ).not.toBeInTheDocument();
  });

  it('lists approved ICIP under Upcoming until clearance starts, then under Current', async () => {
    const { unmount } = renderWithMock(planTasksAllToDo);

    await waitFor(() => {
      expect(screen.getByText('Current tasks (5)')).toBeInTheDocument();
    });
    expect(screen.getByText('Upcoming tasks (4)')).toBeInTheDocument();
    unmount();

    const activated = renderWithMock(
      makePlanTasks({ APPROVED_ICIP: { state: PlanTaskState.TO_DO } })
    );

    await waitFor(() => {
      expect(screen.getByText('Current tasks (6)')).toBeInTheDocument();
    });
    expect(getCardHeadings(activated.container).at(-1)).toEqual(
      'Add approved ICIP'
    );
  });

  it('hides completed tasks from Current and still lists remaining to-do cards', async () => {
    renderWithMock(planTasksWithModelPlanComplete);

    await waitFor(() => {
      expect(screen.getByText('Current tasks (4)')).toBeInTheDocument();
      expect(screen.getByText('Completed tasks (1)')).toBeInTheDocument();
    });

    expect(screen.queryByText('Start your Model Plan')).not.toBeInTheDocument();
    expect(screen.getByText('Upload 2-pager')).toBeInTheDocument();
    expect(
      screen.getByText('Start your model-to-operations matrix (MTO)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Start your data exchange approach')
    ).toBeInTheDocument();
  });

  it('lists default upcoming tasks on the Upcoming tab', async () => {
    const { container } = renderWithMock(planTasksAllToDo, 'upcoming');

    await waitFor(() => {
      expect(screen.getByText('Upcoming tasks (4)')).toBeInTheDocument();
    });

    expect(getCardHeadings(container)).toEqual([
      'Prepare for your 6-page review meeting with CMMI Front Office (FO)',
      'Start your ICIP',
      'Prepare for clearance',
      'Add approved ICIP',
      'Prepare for your presentation to the Office of the Administrator (OA)'
    ]);
    expect(screen.getByText('Upload 6-pager')).toBeInTheDocument();
    expect(screen.getByText('Upload OA presentation')).toBeInTheDocument();
  });

  it('lists Approved ICIP right before OA on the Upcoming tab regardless of API order', async () => {
    const icipTask: PlanTaskEntry = {
      __typename: 'PlanTask',
      id: 'approved_icip-task-id',
      key: PlanTaskKey.APPROVED_ICIP,
      state: PlanTaskState.UPCOMING,
      status: PlanTaskStatus.TO_DO,
      documents: [],
      completedDts: null
    };

    const { container } = renderWithMock(
      [icipTask, ...planTasksAllToDo],
      'upcoming'
    );

    await waitFor(() => {
      expect(screen.getByText('Upcoming tasks (4)')).toBeInTheDocument();
    });

    const headings = getCardHeadings(container);
    expect(headings).toHaveLength(4);
    expect(headings[0]).toBe(
      'Prepare for your 6-page review meeting with CMMI Front Office (FO)'
    );
    expect(headings[1]).toBe('Prepare for clearance');
    expect(headings[3]).toBe(
      'Prepare for your presentation to the Office of the Administrator (OA)'
    );
  });

  it('moves activated 6-pager and OA presentation cards onto Current', async () => {
    const activatedLaterTasks = makePlanTasks({
      [PlanTaskKey.SIX_PAGER]: {
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO
      },
      [PlanTaskKey.OA_PRESENTATION]: {
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO
      }
    });

    const { container } = renderWithMock(activatedLaterTasks);

    await waitFor(() => {
      expect(screen.getByText('Completed tasks (0)')).toBeInTheDocument();
      expect(screen.getByText('Current tasks (7)')).toBeInTheDocument();
      expect(screen.getByText('Upcoming tasks (2)')).toBeInTheDocument();
    });

    expect(getCardHeadings(container)).toEqual([
      'Start your Model Plan',
      'Prepare for your 2-page review meeting with CMMI Front Office (FO)',
      'Prepare for your 6-page review meeting with CMMI Front Office (FO)',
      'Start your data exchange approach',
      'Complete your waiver assessment survey',
      'Start your model-to-operations matrix (MTO)',
      'Prepare for your presentation to the Office of the Administrator (OA)'
    ]);
  });

  it('orders completed tasks by the fixed task order', async () => {
    const { container } = renderWithMock(completeAllTasks(), 'completed');

    await waitFor(() => {
      expect(screen.getByText('Completed tasks (9)')).toBeInTheDocument();
    });

    expect(getCardHeadings(container)).toEqual([
      'Iterate on your Model Plan',
      'Prepare for your 2-page review meeting with CMMI Front Office (FO)',
      'Prepare for your 6-page review meeting with CMMI Front Office (FO)',
      'Finalize your data exchange approach',
      'Complete your waiver assessment survey',
      'Start your ICIP',
      'Keep your model-to-operations matrix (MTO) up-to-date',
      'Prepare for clearance',
      'Add approved ICIP',
      'Prepare for your presentation to the Office of the Administrator (OA)'
    ]);
  });

  it('switches tabs from the nav and shows the matching empty states', async () => {
    const { user } = renderWithMock(completeAllTasks());

    await waitFor(() => {
      expect(screen.getByText('Current tasks (0)')).toBeInTheDocument();
    });

    expect(screen.getByText('Nothing to do here!')).toBeInTheDocument();
    expect(
      screen.getByText("You've completed all of the current tasks.")
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('upcoming-tab'));

    expect(
      await screen.findByText('You’ve completed all of the upcoming tasks.')
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('completed-tab'));

    expect(
      await screen.findByText(
        'Keep your model-to-operations matrix (MTO) up-to-date'
      )
    ).toBeInTheDocument();
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

  it('treats an unknown tab query as Current', async () => {
    renderWithMock(planTasksAllToDo, 'not-a-tab');

    await waitFor(() => {
      expect(screen.getByText('Start your Model Plan')).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        'Prepare for your 6-page review meeting with CMMI Front Office (FO)'
      )
    ).not.toBeInTheDocument();
  });
});
