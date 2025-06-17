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
  AuditFieldChangeType,
  DatabaseOperation,
  DataExchangeApproachStatus,
  GetChangeHistoryDocument,
  GetModelPlanDocument,
  GetModelPlanQuery,
  ModelPhase,
  ModelStatus,
  MtoStatus,
  PrepareForClearanceStatus,
  TaskStatus,
  TranslationDataType
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import MessageProvider from 'contexts/MessageContext';

import TaskList from './index';

const modelPlanId = '6e224030-09d5-46f7-ad04-4bb851b36eab';

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
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  beforeEach(() => {
    sessionStorage.clear();
  });

  const mockStore = configureMockStore();

  const store = mockStore({ auth: { euaId: 'MINT' } });

  const modelPlan = {
    __typename: 'ModelPlan',
    isFavorite: true,
    id: modelPlanId,
    status: ModelStatus.PLAN_DRAFT,
    taskListStatus: TaskStatus.IN_PROGRESS,
    modelName: 'Test',
    modifiedDts: '2022-05-12T15:01:39.190679Z',
    createdDts: '2022-05-12T15:01:39.190679Z',
    opSolutionLastModifiedDts: '2022-05-12T15:01:39.190679Z',
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
    echimpCRsAndTDLs: [],
    operationalNeeds: [] as any,
    documents: [
      {
        __typename: 'PlanDocument',
        id: '6e224030-09d5-46f7-ad04-4bb851b36eab',
        fileName: 'test.pdf',
        fileType: 'application/pdf'
      }
    ],
    collaborators: [],
    dataExchangeApproach: {
      __typename: 'PlanDataExchangeApproach',
      id: '4321',
      status: DataExchangeApproachStatus.IN_PROGRESS,
      modifiedDts: null,
      modifiedByUserAccount: null
    },
    mtoMatrix: {
      __typename: 'ModelsToOperationMatrix',
      status: MtoStatus.IN_PROGRESS,
      recentEdit: null,
      milestones: [],
      info: {
        __typename: 'MTOInfo',
        id: '123'
      }
    },
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
          id: modelPlanId
        }
      },
      result: {
        data: {
          modelPlan: modelPlanDraft
        }
      }
    };
  };

  const changeHistoryMock = [
    {
      request: {
        query: GetChangeHistoryDocument,
        variables: {
          modelPlanID: modelPlanId
        }
      },
      result: {
        data: {
          translatedAuditCollection: [
            {
              id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
              tableName: 'plan_basics',
              date: '2024-04-22T13:55:13.725192Z',
              action: DatabaseOperation.INSERT,
              metaData: {
                version: 1,
                tableName: 'plan_basics'
              },
              translatedFields: [
                {
                  id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
                  changeType: AuditFieldChangeType.ANSWERED,
                  dataType: TranslationDataType.BOOLEAN,
                  fieldName: 'model_type',
                  fieldNameTranslated: 'Model type',
                  referenceLabel: null,
                  questionType: null,
                  notApplicableQuestions: null,
                  old: null,
                  oldTranslated: null,
                  new: 'READY',
                  newTranslated: 'Ready',
                  __typename: 'TranslatedAuditField'
                }
              ],
              actorName: 'MINT Doe',
              __typename: 'TranslatedAudit'
            }
          ]
        }
      }
    }
  ];

  it('renders without crashing', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            `/models/${modelPlan.id}/collaboration-area/task-list`
          ]}
        >
          <MockedProvider
            mocks={[modelPlanQuery(modelPlan), ...changeHistoryMock]}
            addTypename={false}
          >
            <MessageProvider>
              <Route
                path="/models/:modelID/collaboration-area/task-list"
                component={TaskList}
              />
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
    const { getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            `/models/${modelPlan.id}/collaboration-area/task-list`
          ]}
        >
          <MockedProvider
            mocks={[modelPlanQuery(modelPlan), ...changeHistoryMock]}
            addTypename={false}
          >
            <MessageProvider>
              <Route path="/models/:modelID/collaboration-area/task-list">
                <TaskList />
              </Route>
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(
      await screen.findByTestId('update-status-modal')
    ).toBeInTheDocument();

    const goBackButton = getByTestId('go-to-timeline');
    fireEvent.click(goBackButton);

    expect(
      sessionStorage.getItem(`statusChecked-${modelPlan.id}`)?.toString()
    ).toBe('true');
  });

  it('displays the model plan task list steps', async () => {
    modelPlan.modelName = '';
    const { getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            `/models/${modelPlan.id}/collaboration-area/task-list`
          ]}
        >
          <MockedProvider
            mocks={[modelPlanQuery(modelPlan), ...changeHistoryMock]}
            addTypename={false}
          >
            <MessageProvider>
              <Route
                path="/models/:modelID/collaboration-area/task-list"
                component={TaskList}
              />
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
        <MemoryRouter
          initialEntries={[
            `/models/${modelPlan.id}/collaboration-area/task-list`
          ]}
        >
          <MockedProvider
            mocks={[modelPlanQuery(modelPlan), ...changeHistoryMock]}
            addTypename={false}
          >
            <MessageProvider>
              <Route
                path="/models/:modelID/collaboration-area/task-list"
                component={TaskList}
              />
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
          <MemoryRouter
            initialEntries={[
              `/models/${modelPlan.id}/collaboration-area/task-list`
            ]}
          >
            <MockedProvider
              mocks={[modelPlanQuery(modelPlan), ...changeHistoryMock]}
              addTypename={false}
            >
              <MessageProvider>
                <Route
                  path="/models/:modelID/collaboration-area/task-list"
                  component={TaskList}
                />
              </MessageProvider>
            </MockedProvider>
          </MemoryRouter>
        </Provider>
      );

      await waitForElementToBeRemoved(() => getByTestId('page-loading'));

      await waitFor(() => {
        expect(screen.getAllByTestId('tasklist-tag')[0]).toHaveClass(
          'bg-info-light'
        );
      });
    });
  });
});
