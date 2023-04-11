import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import GetModelPlanDiscussions from 'queries/Discussions/GetModelPlanDiscussions';
import { GetModelPlanDiscussions as GetModelPlanDiscussionsType } from 'queries/Discussions/types/GetModelPlanDiscussions';

import Discussions from './index';

const discussionResult = {
  modelPlan: {
    __typename: 'ModelPlan',
    id: '00000000-0000-0000-0000-000000000000',
    isCollaborator: true,
    discussions: [
      {
        __typename: 'PlanDiscussion',
        id: '123',
        content: 'This is a question.',
        createdBy: 'TIDA',
        createdDts: '2022-05-12T15:01:39.190679Z',
        status: 'UNANSWERED',
        createdByUserAccount: {
          commonName: 'John Doe'
        },
        replies: []
      },
      {
        __typename: 'PlanDiscussion',
        id: '456',
        content: 'This is a second question.',
        createdBy: 'JFCS',
        createdDts: '2022-05-12T15:01:39.190679Z',
        status: 'ANSWERED',
        createdByUserAccount: {
          commonName: 'Jane Doe'
        },
        replies: [
          {
            __typename: 'DiscussionReply',
            discussionID: '456',
            resolution: true,
            id: 'abc',
            content: 'This is an answer.',
            createdBy: 'UISX',
            createdByUserAccount: {
              commonName: 'Jack Doe'
            },
            createdDts: '2022-05-12T15:01:39.190679Z'
          }
        ]
      }
    ]
  }
} as GetModelPlanDiscussionsType;

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetModelPlanDiscussions,
      variables: { id: modelID }
    },
    result: {
      data: discussionResult
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
  console.error = jest.fn();

  jest.spyOn(window, 'scroll');

  it('renders discussions and replies without errors', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list'
        ]}
      >
        <Route path="/models/:modelID/task-list">
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
      expect(getByText(/1 unanswered question/i)).toBeInTheDocument();
      expect(getByText(/John Doe/i)).toBeInTheDocument();
      expect(getByText(/1 answered question/i)).toBeInTheDocument();
      expect(getByText(/Jane Doe/i)).toBeInTheDocument();
      expect(getByText(/This is a second question./i)).toBeInTheDocument();
    });
  });

  it('renders a question', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list'
        ]}
      >
        <Route path="/models/:modelID/task-list">
          <MockedProvider mocks={mocks} addTypename={false}>
            <Provider store={store}>
              <Discussions modelID={modelID} />
            </Provider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(async () => {
      screen.getByRole('button', { name: /Answer/ }).click();

      expect(
        getByText(
          /Make sure you know the answer to this question before replying. Once a question has been answered, it cannot be replied to again./i
        )
      ).toBeInTheDocument();

      expect(getByText(/This is a question./i)).toBeInTheDocument();
    });

    const feedbackField = screen.getByRole('textbox', {
      name: /Type your answer/i
    });

    userEvent.type(feedbackField, 'Test feedback');

    expect(feedbackField).toHaveValue('Test feedback');
  });

  it('renders the reply form from email generated url param', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list?discussionID=123'
        ]}
      >
        <Route path="/models/:modelID/task-list">
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
