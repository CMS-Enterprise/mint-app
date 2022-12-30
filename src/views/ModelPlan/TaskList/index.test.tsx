import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import GetModelPlanQuery from 'queries/GetModelPlan';
import { GetModelPlan_modelPlan as GetModelPlanTypes } from 'queries/types/GetModelPlan';
import { ModelStatus } from 'types/graphql-global-types';

import TaskList from './index';

describe('The Model Plan Task List', () => {
  const mockStore = configureMockStore();
  const store = mockStore({ auth: { euaId: 'MINT' } });

  const modelPlan = {
    __typename: 'ModelPlan',
    id: '6e224030-09d5-46f7-ad04-4bb851b36eab',
    status: ModelStatus.PLAN_DRAFT,
    modelName: 'Test',

    modifiedDts: '2022-05-12T15:01:39.190679Z',
    archived: false,
    basics: {
      __typename: 'PlanBasics',
      id: 'adsf',
      modifiedDts: null,
      clearanceStarts: '2022-05-12T15:01:39.190679Z',
      readyForClearanceDts: '2022-05-12T15:01:39.190679Z',
      status: 'READY'
    },
    opsEvalAndLearning: [] as any,
    generalCharacteristics: [] as any,
    participantsAndProviders: [] as any,
    beneficiaries: [] as any,
    itTools: [] as any,
    prepareForClearance: [] as any,
    payments: [] as any,
    crTdls: [] as any,
    operationalNeeds: [] as any,
    documents: [
      {
        __typename: 'PlanDocument',
        id: '6e224030-09d5-46f7-ad04-4bb851b36eab',
        fileName: 'test.pdf'
      }
    ],
    discussions: [
      {
        __typename: 'PlanDiscussion',
        id: '123',
        content: 'This is a question.',
        createdBy: 'John Doe',
        createdDts: '2022-05-12T15:01:39.190679Z',
        status: 'UNANSWERED',
        replies: []
      },
      {
        __typename: 'PlanDiscussion',
        id: '456',
        content: 'This is a second question.',
        createdBy: 'Jane Doe',
        createdDts: '2022-05-12T15:01:39.190679Z',
        status: 'ANSWERED',
        replies: [
          {
            __typename: 'DiscussionReply',
            discussionID: '456',
            resolution: true,
            id: 'abc',
            content: 'This is an answer.',
            createdBy: 'Jack Doe',
            createdDts: '2022-05-12T15:01:39.190679Z'
          }
        ]
      }
    ]
  } as GetModelPlanTypes;

  const modelPlanQuery = (modelPlanDraft: GetModelPlanTypes) => {
    return {
      request: {
        query: GetModelPlanQuery,
        variables: {
          id: modelPlan.id
        }
      },
      result: {
        data: {
          modelPlan: modelPlanDraft
        }
      }
    };
  };

  it('renders without crashing', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/models/${modelPlan.id}/task-list`]}>
          <MockedProvider
            mocks={[modelPlanQuery(modelPlan)]}
            addTypename={false}
          >
            <MessageProvider>
              <Route path="/models/:modelID/task-list" component={TaskList} />
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(
      await screen.findByTestId('model-plan-task-list')
    ).toBeInTheDocument();
  });

  it('displays the model plan task list steps', async () => {
    modelPlan.modelName = '';
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/models/${modelPlan.id}/task-list`]}>
          <MockedProvider
            mocks={[modelPlanQuery(modelPlan)]}
            addTypename={false}
          >
            <MessageProvider>
              <Route path="/models/:modelID/task-list" component={TaskList} />
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByTestId('task-list')).toBeInTheDocument();
  });

  it('displays the model plan name', async () => {
    modelPlan.modelName = "PM Butler's great plan";
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/models/${modelPlan.id}/task-list`]}>
          <MockedProvider
            mocks={[modelPlanQuery(modelPlan)]}
            addTypename={false}
          >
            <MessageProvider>
              <Route path="/models/:modelID/task-list" component={TaskList} />
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-name').textContent).toContain(
        "for PM Butler's great plan"
      );
    });
  });

  describe('Statuses', () => {
    it('renders proper buttons for Model Basics', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/models/${modelPlan.id}/task-list`]}>
            <MockedProvider
              mocks={[modelPlanQuery(modelPlan)]}
              addTypename={false}
            >
              <MessageProvider>
                <Route path="/models/:modelID/task-list" component={TaskList} />
              </MessageProvider>
            </MockedProvider>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        // expect(screen.getByText('Ready to start')).toHaveClass(
        //   'bg-accent-cool'
        // );
        expect(screen.getAllByTestId('tasklist-tag')[0]).toHaveClass(
          'bg-accent-cool'
        );
      });
    });
  });
});
