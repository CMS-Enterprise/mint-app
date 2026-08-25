import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DiscussionTopicType,
  DiscussionUserRole,
  GetModelPlanDiscussionsDocument,
  GetModelPlanDiscussionsQuery,
  GetMostRecentRoleSelectionDocument,
  GetMostRecentRoleSelectionQuery
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';

import Discussions from './index';

type GetModelPlanDiscussionsType = GetModelPlanDiscussionsQuery;

const discussionResult: GetModelPlanDiscussionsType['modelPlan'] = {
  __typename: 'ModelPlan',
  id: '00000000-0000-0000-0000-000000000000',
  isCollaborator: true,
  discussions: [
    {
      __typename: 'PlanDiscussion',
      id: '123',
      topic: DiscussionTopicType.OTHER,
      content: {
        __typename: 'TaggedContent',
        rawContent: 'This is a question.'
      },
      createdBy: 'TIDA',
      createdDts: '2022-05-12T15:01:39.190679Z',
      userRole: DiscussionUserRole.CMS_SYSTEM_SERVICE_TEAM,
      userRoleDescription: '',
      isAssessment: false,
      createdByUserAccount: {
        __typename: 'UserAccount',
        commonName: 'John Doe'
      },
      replies: []
    },
    {
      __typename: 'PlanDiscussion',
      id: '456',
      topic: DiscussionTopicType.MODEL_PLAN_ALL,
      content: {
        __typename: 'TaggedContent',
        rawContent: 'This is a second question.'
      },
      createdBy: 'JFCS',
      createdDts: '2022-05-12T15:01:39.190679Z',
      userRole: DiscussionUserRole.NONE_OF_THE_ABOVE,
      userRoleDescription: 'Designer',
      isAssessment: false,
      createdByUserAccount: {
        __typename: 'UserAccount',
        commonName: 'Jane Doe'
      },
      replies: [
        {
          __typename: 'DiscussionReply',
          discussionID: '456',
          id: 'abc',
          content: {
            __typename: 'TaggedContent',
            rawContent: 'This is an answer.'
          },
          userRole: DiscussionUserRole.LEADERSHIP,
          userRoleDescription: '',
          isAssessment: false,
          createdBy: 'UISX',
          createdByUserAccount: {
            __typename: 'UserAccount',
            commonName: 'Jack Doe'
          },
          createdDts: '2022-05-12T15:01:39.190679Z'
        }
      ]
    }
  ]
};

const mostRecentRoleResult: GetMostRecentRoleSelectionQuery['mostRecentDiscussionRoleSelection'] =
  {
    __typename: 'DiscussionRoleSelection',
    userRole: DiscussionUserRole.LEADERSHIP,
    userRoleDescription: ''
  };

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const mocks = [
  {
    request: {
      query: GetModelPlanDiscussionsDocument,
      variables: { id: modelID }
    },
    result: {
      data: { modelPlan: discussionResult }
    }
  },
  {
    request: {
      query: GetMostRecentRoleSelectionDocument
    },
    result: {
      data: { mostRecentDiscussionRoleSelection: mostRecentRoleResult }
    }
  }
];

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('Discussion Component', () => {
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  vi.spyOn(window, 'scroll');

  it('renders discussions and replies without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list',
          element: <Discussions modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]
      }
    );

    const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText(/This is a question./i)).toBeInTheDocument();
      expect(getByText(/new discussion topic/i)).toBeInTheDocument();
      expect(getByText(/John Doe/i)).toBeInTheDocument();
      expect(getByText(/1 discussion/i)).toBeInTheDocument();
      expect(getByText(/Jane Doe/i)).toBeInTheDocument();
      expect(getByText(/This is a second question./i)).toBeInTheDocument();
      expect(getByText(/Designer/i)).toBeInTheDocument();
    });
  });

  it('renders a question', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list',
          element: <Discussions modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]
      }
    );

    const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(async () => {
      userEvent.click(screen.getAllByRole('button', { name: /Reply/ })[0]);
    });

    await waitFor(async () => {
      expect(
        getByText(
          /This will display with your name to help others identify you./i
        )
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole('combobox', { name: /topic/i })
    ).not.toBeInTheDocument();

    expect(getByText('Topic: Other')).toBeInTheDocument();

    const roleSelect = screen.getByRole('combobox', {
      name: /Your role/i
    });

    userEvent.selectOptions(roleSelect, [DiscussionUserRole.MINT_TEAM]);

    await waitFor(async () => {
      expect(roleSelect).toHaveValue(DiscussionUserRole.MINT_TEAM);
    });
  });

  it('requires a topic when starting a new discussion', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list',
          element: <Discussions modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]
      }
    );

    render(
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Start a discussion/i })
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /Start a discussion/i }));

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /topic/i })).toBeInTheDocument();
    });

    const topicSelect = screen.getByRole('combobox', { name: /topic/i });

    userEvent.selectOptions(topicSelect, [DiscussionTopicType.MODEL_PLAN_ALL]);

    await waitFor(() => {
      expect(topicSelect).toHaveValue(DiscussionTopicType.MODEL_PLAN_ALL);
    });

    expect(
      screen.queryByText('Waiver assessment survey')
    ).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Save discussion/i })).toBeDisabled();
  });

  it('prefills topic when starting a discussion from a model plan section', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-plan/characteristics',
          element: <Discussions modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-plan/characteristics'
        ]
      }
    );

    render(
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Start a discussion/i })
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /Start a discussion/i }));

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /topic/i })).toHaveValue(
        DiscussionTopicType.MODEL_PLAN_GENERAL_CHARACTERISTICS
      );
    });
  });

  it('renders the reply form from email generated url param', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list',
          element: <Discussions modelID={modelID} discussionID="123" />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list?discussionID=123'
        ]
      }
    );

    const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(async () => {
      expect(getByText(/This is a question./i)).toBeInTheDocument();
    });
  });
});
