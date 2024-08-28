import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DiscussionUserRole,
  GetModelPlanDiscussionsDocument,
  GetModelPlanDiscussionsQuery,
  GetMostRecentRoleSelectionDocument,
  GetMostRecentRoleSelectionQuery
} from 'gql/gen/graphql';
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

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

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
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list">
          <MockedProvider mocks={mocks} addTypename={false}>
            <Provider store={store}>
              <Discussions modelID={modelID} />
            </Provider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
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
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list">
          <MockedProvider mocks={mocks} addTypename={false}>
            <Provider store={store}>
              <Discussions modelID={modelID} />
            </Provider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
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

    const roleSelect = screen.getByRole('combobox', {
      name: /Your role/i
    });

    userEvent.selectOptions(roleSelect, [DiscussionUserRole.MINT_TEAM]);

    await waitFor(async () => {
      expect(roleSelect).toHaveValue(DiscussionUserRole.MINT_TEAM);
    });
  });

  it('renders the reply form from email generated url param', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list?discussionID=123'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list">
          <MockedProvider mocks={mocks} addTypename={false}>
            <Provider store={store}>
              <Discussions modelID={modelID} discussionID="123" />
            </Provider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(async () => {
      expect(getByText(/This is a question./i)).toBeInTheDocument();
    });
  });
});
