import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetModelPlanDocument,
  GetModelPlanQuery,
  ModelPhase,
  ModelStatus,
  PrepareForClearanceStatus,
  TaskStatus
} from 'gql/gen/graphql';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';

import TaskList, { getLatestModifiedDate } from './index';

type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

describe('The Model Plan Task List', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const mockStore = configureMockStore();

  const store = mockStore({ auth: { euaId: 'MINT' } });

  const modelPlan = {
    __typename: 'ModelPlan',
    id: '6e224030-09d5-46f7-ad04-4bb851b36eab',
    status: ModelStatus.PLAN_DRAFT,
    modelName: 'Test',
    modifiedDts: '2022-05-12T15:01:39.190679Z',
    archived: false,
    suggestedPhase: {
      __typename: 'PhaseSuggestion',
      phase: ModelPhase.ICIP_COMPLETE,
      suggestedStatuses: [ModelStatus.ICIP_COMPLETE]
    },
    basics: {
      __typename: 'PlanBasics',
      id: '123',
      modifiedDts: null,
      clearanceStarts: '2022-05-12T15:01:39.190679Z',
      readyForClearanceDts: '2022-05-12T15:01:39.190679Z',
      status: 'READY'
    },
    opsEvalAndLearning: {
      __typename: 'PlanOpsEvalAndLearning',
      id: '7865676',
      createdBy: 'John Doe',
      createdDts: '',
      modifiedBy: '',
      modifiedDts: '',
      readyForClearanceDts: '',
      status: TaskStatus.IN_PROGRESS
    },
    generalCharacteristics: {
      __typename: 'PlanGeneralCharacteristics',
      id: '54234',
      createdBy: 'John Doe',
      createdDts: '',
      modifiedBy: '',
      modifiedDts: '',
      readyForClearanceDts: '',
      status: TaskStatus.IN_PROGRESS
    },
    participantsAndProviders: {
      __typename: 'PlanParticipantsAndProviders',
      id: '46246356',
      createdBy: 'John Doe',
      createdDts: '',
      modifiedBy: '',
      modifiedDts: '',
      readyForClearanceDts: '',
      status: TaskStatus.IN_PROGRESS
    },
    beneficiaries: {
      __typename: 'PlanBeneficiaries',
      id: '09865643',
      createdBy: 'John Doe',
      createdDts: '',
      modifiedBy: '',
      modifiedDts: '',
      readyForClearanceDts: '',
      status: TaskStatus.IN_PROGRESS
    },
    prepareForClearance: {
      __typename: 'PrepareForClearance',
      status: PrepareForClearanceStatus.IN_PROGRESS,
      modifiedDts: ''
    },
    payments: {
      __typename: 'PlanPayments',
      id: '8756435235',
      createdBy: 'John Doe',
      createdDts: '',
      modifiedBy: '',
      modifiedDts: '',
      readyForClearanceDts: '',
      status: TaskStatus.IN_PROGRESS
    },
    crs: [],
    tdls: [],
    operationalNeeds: [] as any,
    documents: [
      {
        __typename: 'PlanDocument',
        id: '6e224030-09d5-46f7-ad04-4bb851b36eab',
        fileName: 'test.pdf'
      }
    ],
    collaborators: [],
    discussions: [
      {
        __typename: 'PlanDiscussion',
        id: '123',
        content: {
          __typename: 'TaggedContent',
          rawContent: 'This is a question.'
        },
        createdBy: 'John Doe',
        createdDts: '2022-05-12T15:01:39.190679Z',
        replies: []
      },
      {
        __typename: 'PlanDiscussion',
        id: '456',
        content: {
          __typename: 'TaggedHTML',
          rawContent: 'This is a second question.'
        },
        createdBy: 'Jane Doe',
        createdDts: '2022-05-12T15:01:39.190679Z',
        replies: [
          {
            __typename: 'DiscussionReply',
            discussionID: '456',
            id: 'abc',
            content: {
              __typename: 'TaggedHTML',
              rawContent: 'This is an answer.'
            },
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
        query: GetModelPlanDocument,
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
    const { getByTestId } = render(
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

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(
      await screen.findByTestId('model-plan-task-list')
    ).toBeInTheDocument();
  });

  it('reads from sessionStorage and renders modal', async () => {
    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = vi.fn();

    const { getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/models/${modelPlan.id}/task-list`]}>
          <MockedProvider
            mocks={[modelPlanQuery(modelPlan)]}
            addTypename={false}
          >
            <MessageProvider>
              <Route path="/models/:modelID/task-list">
                <TaskList />
              </Route>
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(getByTestId('update-status-modal')).toBeInTheDocument();

    const goBackButton = getByTestId('go-to-timeline');
    fireEvent.click(goBackButton);

    expect(
      sessionStorage.getItem(`statusChecked-${modelPlan.id}`)?.toString()
    ).toBe('true');
  });

  it('gets the last modified date of operational solutions', async () => {
    const expectedDate: string = '2023-05-21T13:38:11.998962Z';

    const lastUpdated = getLatestModifiedDate([
      {
        __typename: 'OperationalNeed',
        id: '724c19ce-0309-4f04-a4fe-d9ed345dbec',
        modifiedDts: null
      },
      {
        __typename: 'OperationalNeed',
        id: '864c19ce-0309-4f04-a4fe-d9ed844edbec',
        modifiedDts: '2023-04-01T13:38:11.998962Z'
      },
      {
        __typename: 'OperationalNeed',
        id: '134c19ce-0309-4f04-a4fe-d9ed844edbec',
        modifiedDts: '2023-05-21T13:38:11.998962Z'
      }
    ]);

    expect(lastUpdated).toEqual(expectedDate);
  });

  it('displays the model plan task list steps', async () => {
    modelPlan.modelName = '';
    const { getByTestId } = render(
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

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(await screen.findByTestId('task-list')).toBeInTheDocument();
  });

  it('displays the model plan name', async () => {
    modelPlan.modelName = "PM Butler's great plan";
    const { getByTestId } = render(
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

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-name').textContent).toContain(
        "for PM Butler's great plan"
      );
    });
  });

  describe('Statuses', () => {
    it('renders proper buttons for Model Basics', async () => {
      const { getByTestId } = render(
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

      await waitForElementToBeRemoved(() => getByTestId('page-loading'));

      await waitFor(() => {
        expect(screen.getAllByTestId('tasklist-tag')[0]).toHaveClass(
          'bg-accent-cool'
        );
      });
    });
  });
});
