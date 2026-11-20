import React from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  useLocation
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import {
  DocumentType,
  GetCollaborationAreaDocument,
  GetCollaborationAreaQuery,
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus,
  TaskStatus,
  UpdateTaskStatusDocument
} from 'gql/generated/graphql';
import { GraphQLError } from 'graphql';
import { collaborationAreaData } from 'tests/mock/general';
import { makePlanTasks, modelID, PlanTaskEntry } from 'tests/mock/mto';
import setup from 'tests/util';

import { getCurrentErrorMeta } from 'contexts/ErrorContext/errorMetaStore';

import TaskCard from './index';

const getTask = (
  key: PlanTaskKey,
  overrides?: Partial<Pick<PlanTaskEntry, 'state' | 'status'>>
) => makePlanTasks({ [key]: overrides ?? {} }).find(t => t.key === key)!;

const renderTaskCard = (
  task: PlanTaskEntry,
  modelPlan: GetCollaborationAreaQuery['modelPlan'] = collaborationAreaData
) => {
  const router = createMemoryRouter(
    [
      {
        path: '/models/:modelID/collaboration-area',
        element: (
          <MockedProvider mocks={[]}>
            <TaskCard modelPlan={modelPlan} task={task} />
          </MockedProvider>
        )
      }
    ],
    { initialEntries: [`/models/${modelID}/collaboration-area`] }
  );

  return setup(<RouterProvider router={router} />);
};

describe('TaskCard', () => {
  it('renders Model Plan to-do details, primary start action, and sample-plan link', async () => {
    const { findByText, getByRole, asFragment } = renderTaskCard(
      getTask(PlanTaskKey.MODEL_PLAN)
    );

    await findByText('Start your Model Plan');

    expect(getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(
      getByRole('link', { name: 'View sample Model Plan' })
    ).toBeInTheDocument();
    expect(getByRole('img', { name: 'To do' })).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('shows Model Plan progress metadata when the task is in progress', async () => {
    const modelPlan = {
      ...collaborationAreaData,
      beneficiaries: {
        ...collaborationAreaData.beneficiaries,
        modifiedDts: '2022-05-12T15:01:39.190679Z',
        modifiedByUserAccount: {
          __typename: 'UserAccount' as const,
          commonName: 'Jane Doe'
        }
      }
    };

    const { findByText, getByRole, getByText } = renderTaskCard(
      getTask(PlanTaskKey.MODEL_PLAN, {
        state: PlanTaskState.IN_PROGRESS,
        status: PlanTaskStatus.TO_DO
      }),
      modelPlan
    );

    await findByText('Iterate on your Model Plan');

    expect(getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(getByText(/sections started/)).toBeInTheDocument();
    expect(getByText(/Most recent edit/)).toBeInTheDocument();
    expect(getByText('Jane Doe')).toBeInTheDocument();
  });

  it.each([
    {
      key: PlanTaskKey.TWO_PAGER,
      heading:
        'Prepare for your 2-page review meeting with CMMI Front Office (FO)',
      primaryAction: 'Upload 2-pager'
    },
    {
      key: PlanTaskKey.SIX_PAGER,
      heading:
        'Prepare for your 6-page review meeting with CMMI Front Office (FO)',
      primaryAction: 'Upload 6-pager'
    },
    {
      key: PlanTaskKey.DATA_EXCHANGE,
      heading: 'Start your data exchange approach',
      primaryAction: 'Start'
    },
    {
      key: PlanTaskKey.MTO,
      heading: 'Start your model-to-operations matrix (MTO)',
      primaryAction: 'Start'
    }
  ])(
    'renders $key heading, primary action, and help-article link',
    async ({ key, heading, primaryAction }) => {
      const { findByText, getByRole } = renderTaskCard(getTask(key));

      await findByText(heading);

      expect(getByRole('button', { name: primaryAction })).toBeInTheDocument();
      expect(
        getByRole('link', { name: 'View help article' })
      ).toBeInTheDocument();
    }
  );

  it('renders the 2-pager copy with a mailto link and no last-edit row while to-do', async () => {
    const { findByRole, queryByText } = renderTaskCard(
      getTask(PlanTaskKey.TWO_PAGER, {
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO
      })
    );

    const email = await findByRole('link', {
      name: 'CMMINewModelDesign@cms.hhs.gov'
    });
    expect(email).toHaveAttribute(
      'href',
      'mailto:CMMINewModelDesign@cms.hhs.gov'
    );
    expect(queryByText(/sections started/)).not.toBeInTheDocument();
    expect(queryByText(/Most recent edit/)).not.toBeInTheDocument();
  });

  it('renders OA presentation without a secondary help link', async () => {
    const { findByText, getByRole, queryByRole } = renderTaskCard(
      getTask(PlanTaskKey.OA_PRESENTATION, {
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO
      })
    );

    await findByText(
      'Prepare for your presentation to the Office of the Administrator (OA)'
    );

    expect(
      getByRole('button', { name: 'Upload OA presentation' })
    ).toBeInTheDocument();
    expect(
      queryByRole('link', { name: 'View help article' })
    ).not.toBeInTheDocument();
    expect(
      getByRole('checkbox', { name: 'Mark this task complete' })
    ).toBeInTheDocument();
  });

  it('renders Add approved ICIP with both actions and an external-link secondary button', async () => {
    const { findByText, getByRole, getByText } = renderTaskCard(
      getTask(PlanTaskKey.APPROVED_ICIP, {
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO
      })
    );

    await findByText('Add approved ICIP');
    expect(
      getByText(/After clearing your model, please add your approved ICIP\./)
    ).toBeInTheDocument();
    expect(getByRole('button', { name: 'Add ICIP' })).toBeInTheDocument();
    expect(
      getByRole('button', { name: /Upload to ICIP repository on SharePoint/i })
    ).toBeInTheDocument();
    expect(
      getByRole('checkbox', { name: 'Mark this task complete' })
    ).toBeInTheDocument();
  });

  it('navigates to Add document with Final ICIP preselected from the approved ICIP task', async () => {
    const DestinationState = () => {
      const location = useLocation();
      return (
        <div data-testid="document-type-state">
          {(location.state as { documentType?: string } | null)?.documentType}
        </div>
      );
    };

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <MockedProvider mocks={[]}>
              <TaskCard
                modelPlan={collaborationAreaData}
                task={getTask(PlanTaskKey.APPROVED_ICIP, {
                  state: PlanTaskState.TO_DO,
                  status: PlanTaskStatus.TO_DO
                })}
              />
            </MockedProvider>
          )
        },
        {
          path: '/models/:modelID/collaboration-area/documents/add-document',
          element: <DestinationState />
        }
      ],
      { initialEntries: [`/models/${modelID}/collaboration-area`] }
    );

    const { findByRole, findByTestId, user } = setup(
      <RouterProvider router={router} />
    );

    await user.click(await findByRole('button', { name: 'Add ICIP' }));

    expect((await findByTestId('document-type-state')).textContent).toBe(
      DocumentType.FINAL_ICIP
    );
  });

  it('renders Prepare for clearance upcoming state with alert and SharePoint link only', async () => {
    const { findByText, getByRole, getByText, queryByRole } = renderTaskCard(
      getTask(PlanTaskKey.PREPARE_FOR_CLEARANCE, {
        state: PlanTaskState.UPCOMING,
        status: PlanTaskStatus.TO_DO
      })
    );

    await findByText('Prepare for clearance');
    expect(
      getByRole('button', { name: /View clearance info on SharePoint/i })
    ).toBeInTheDocument();
    expect(queryByRole('button', { name: 'Start' })).not.toBeInTheDocument();
    expect(
      getByText(
        'This step will become available 20 days prior to beginning internal clearance.'
      )
    ).toBeInTheDocument();
  });

  it('renders Prepare for clearance to-do with Start and section progress', async () => {
    const { findByText, getByRole, getByText, queryByText } = renderTaskCard(
      getTask(PlanTaskKey.PREPARE_FOR_CLEARANCE, {
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO
      })
    );

    await findByText('Prepare for clearance');
    expect(getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(getByText('0/7 sections ready for clearance')).toBeInTheDocument();
    expect(queryByText(/Most recent edit/)).not.toBeInTheDocument();
  });

  it('renders Prepare for clearance in progress with Continue and last edit', async () => {
    const modelPlan = {
      ...collaborationAreaData,
      basics: {
        ...collaborationAreaData.basics,
        status: TaskStatus.READY_FOR_CLEARANCE,
        readyForClearanceDts: '2024-08-22T15:01:39.190679Z',
        readyForClearanceByUserAccount: {
          __typename: 'UserAccount' as const,
          commonName: 'Jane McModelteam'
        }
      }
    };

    const { findByText, getByRole, getByText } = renderTaskCard(
      getTask(PlanTaskKey.PREPARE_FOR_CLEARANCE, {
        state: PlanTaskState.IN_PROGRESS,
        status: PlanTaskStatus.TO_DO
      }),
      modelPlan
    );

    await findByText('Prepare for clearance');
    expect(getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(getByText('1/7 sections ready for clearance')).toBeInTheDocument();
    expect(
      getByText(/Most recent edit on 08\/22\/2024 by/)
    ).toBeInTheDocument();
  });

  it('shows the revert-to-todo control and Complete tag when a task is complete', async () => {
    const { findByRole, getByRole, queryByRole } = renderTaskCard(
      getTask(PlanTaskKey.OA_PRESENTATION, {
        state: PlanTaskState.COMPLETE,
        status: PlanTaskStatus.COMPLETE
      })
    );

    expect(
      await findByRole('button', { name: 'Mark this task to do' })
    ).toBeInTheDocument();
    expect(getByRole('img', { name: 'Complete' })).toBeInTheDocument();
    expect(
      getByRole('button', { name: 'Upload OA presentation' })
    ).toBeInTheDocument();
    expect(
      queryByRole('checkbox', { name: 'Mark this task complete' })
    ).not.toBeInTheDocument();
  });

  describe('mark complete / mark to-do messaging', () => {
    const MARK_COMPLETE_ERROR =
      /We encountered an error moving your task to complete/;
    const MARK_TODO_ERROR = /We encountered an error marking your task to-do/;

    const updateMock = (
      task: PlanTaskEntry,
      isComplete: boolean,
      fail = false
    ): MockedResponse => ({
      request: {
        query: UpdateTaskStatusDocument,
        variables: { modelPlanID: modelID, key: task.key, isComplete }
      },
      result: fail
        ? { errors: [new GraphQLError('mutation failed')] }
        : {
            data: {
              markPlanTaskComplete: {
                __typename: 'PlanTask',
                id: task.id,
                key: task.key,
                status: isComplete
                  ? PlanTaskStatus.COMPLETE
                  : PlanTaskStatus.TO_DO,
                state: isComplete
                  ? PlanTaskState.COMPLETE
                  : PlanTaskState.TO_DO,
                completedBy: null,
                completedByUserAccount: null,
                completedDts: null
              }
            }
          }
    });

    const renderWithMutation = (task: PlanTaskEntry, fail = false) => {
      const refetch = vi.fn(() => ({
        data: { modelPlan: collaborationAreaData }
      }));
      const mocks: MockedResponse[] = [
        updateMock(task, task.status !== PlanTaskStatus.COMPLETE, fail),
        {
          request: {
            query: GetCollaborationAreaDocument,
            variables: { id: modelID }
          },
          result: refetch
        }
      ];

      const router = createMemoryRouter(
        [
          {
            path: '/models/:modelID/collaboration-area',
            element: (
              <>
                <ToastContainer />
                {/* errorPolicy 'all' resolves failed mutations with `errors`, as the app's error link does */}
                <MockedProvider
                  mocks={mocks}
                  defaultOptions={{ mutate: { errorPolicy: 'all' } }}
                >
                  <TaskCard modelPlan={collaborationAreaData} task={task} />
                </MockedProvider>
              </>
            )
          }
        ],
        { initialEntries: [`/models/${modelID}/collaboration-area`] }
      );

      const r = setup(<RouterProvider router={router} />);
      return { ...r, refetch };
    };

    const errorText = () => {
      const { container } = render(
        <>{getCurrentErrorMeta().overrideMessage}</>
      );
      return container.textContent;
    };

    // Approved ICIP and OA presentation define no success/error copy, so they use the shared defaults.
    it.each([
      {
        key: PlanTaskKey.APPROVED_ICIP,
        heading: 'Add approved ICIP'
      },
      {
        key: PlanTaskKey.OA_PRESENTATION,
        heading:
          'Prepare for your presentation to the Office of the Administrator (OA)'
      }
    ])(
      'uses the shared default messages for $key in both directions',
      async ({ key, heading }) => {
        // Mark complete: success toast built from the heading, then refetch
        const complete = renderWithMutation(
          getTask(key, {
            state: PlanTaskState.TO_DO,
            status: PlanTaskStatus.TO_DO
          })
        );
        await complete.user.click(
          await complete.findByRole('checkbox', {
            name: 'Mark this task complete'
          })
        );
        expect(await complete.findByTestId('toast-success')).toHaveTextContent(
          `${heading} is now complete.`
        );
        await waitFor(() => expect(complete.refetch).toHaveBeenCalled());
        complete.unmount();

        // Mark to-do: success toast built from the heading, then refetch
        const todo = renderWithMutation(
          getTask(key, {
            state: PlanTaskState.COMPLETE,
            status: PlanTaskStatus.COMPLETE
          })
        );
        await todo.user.click(
          await todo.findByRole('button', { name: 'Mark this task to do' })
        );
        expect(await todo.findByTestId('toast-success')).toHaveTextContent(
          `${heading} is now to-do.`
        );
        await waitFor(() => expect(todo.refetch).toHaveBeenCalled());
      }
    );

    it.each([
      {
        key: PlanTaskKey.APPROVED_ICIP,
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO,
        control: { role: 'checkbox', name: 'Mark this task complete' },
        error: MARK_COMPLETE_ERROR
      },
      {
        key: PlanTaskKey.APPROVED_ICIP,
        state: PlanTaskState.COMPLETE,
        status: PlanTaskStatus.COMPLETE,
        control: { role: 'button', name: 'Mark this task to do' },
        error: MARK_TODO_ERROR
      },
      {
        key: PlanTaskKey.OA_PRESENTATION,
        state: PlanTaskState.TO_DO,
        status: PlanTaskStatus.TO_DO,
        control: { role: 'checkbox', name: 'Mark this task complete' },
        error: MARK_COMPLETE_ERROR
      },
      {
        key: PlanTaskKey.OA_PRESENTATION,
        state: PlanTaskState.COMPLETE,
        status: PlanTaskStatus.COMPLETE,
        control: { role: 'button', name: 'Mark this task to do' },
        error: MARK_TODO_ERROR
      }
    ])(
      'sets the default failure message and no success toast for $key ($state)',
      async ({ key, state, status, control, error }) => {
        const { findByRole, user, queryByTestId } = renderWithMutation(
          getTask(key, { state, status }),
          true
        );

        await user.click(
          await findByRole(control.role as 'checkbox' | 'button', {
            name: control.name
          })
        );

        await waitFor(() => expect(errorText()).toMatch(error));
        expect(queryByTestId('toast-success')).not.toBeInTheDocument();
      }
    );

    it.each([
      {
        key: PlanTaskKey.TWO_PAGER,
        label: '2-page',
        state: PlanTaskState.TO_DO
      },
      {
        key: PlanTaskKey.SIX_PAGER,
        label: '6-page',
        state: PlanTaskState.TO_DO
      }
    ])(
      'prefers the task-specific $label success text over the shared default',
      async ({ key, label, state }) => {
        const complete = renderWithMutation(
          getTask(key, { state, status: PlanTaskStatus.TO_DO })
        );
        await complete.user.click(
          await complete.findByRole('checkbox', {
            name: 'Mark this task complete'
          })
        );
        const completeToast = await complete.findByTestId('toast-success');
        expect(completeToast).toHaveTextContent(
          `Prepare for your ${label} review meeting with CMMI Front Office is now complete.`
        );
        // The shared default would have appended "(FO)" via the heading
        expect(completeToast).not.toHaveTextContent('(FO)');
        complete.unmount();

        const todo = renderWithMutation(
          getTask(key, {
            state: PlanTaskState.COMPLETE,
            status: PlanTaskStatus.COMPLETE
          })
        );
        await todo.user.click(
          await todo.findByRole('button', { name: 'Mark this task to do' })
        );
        const todoToast = await todo.findByTestId('toast-success');
        expect(todoToast).toHaveTextContent(
          `Prepare for your ${label} review meeting with CMMI Front Office is now to-do.`
        );
        expect(todoToast).not.toHaveTextContent('(FO)');
      }
    );
  });
});
