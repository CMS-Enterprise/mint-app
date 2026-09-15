import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  GetCollaborationAreaQuery,
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';
import { collaborationAreaData } from 'tests/mock/general';
import { makePlanTasks, modelID, PlanTaskEntry } from 'tests/mock/mto';
import setup from 'tests/util';

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
});
