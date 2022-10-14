import React from 'react';
import { Provider } from 'react-redux';
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
    collaborators: [
      {
        __typename: 'PlanCollaborator',
        id: '123',
        euaUserID: 'TIDA',
        fullName: 'John Doe'
      },
      {
        __typename: 'PlanCollaborator',
        id: '123',
        euaUserID: 'JFCS',
        fullName: 'Jane Doe'
      },
      {
        __typename: 'PlanCollaborator',
        id: '123',
        euaUserID: 'UISX',
        fullName: 'Jack Doe'
      }
    ],
    discussions: [
      {
        __typename: 'PlanDiscussion',
        id: '123',
        content: 'This is a question.',
        createdBy: 'TIDA',
        createdDts: '2022-05-12T15:01:39.190679Z',
        status: 'UNANSWERED',
        replies: []
      },
      {
        __typename: 'PlanDiscussion',
        id: '456',
        content: 'This is a second question.',
        createdBy: 'JFCS',
        createdDts: '2022-05-12T15:01:39.190679Z',
        status: 'ANSWERED',
        replies: [
          {
            __typename: 'DiscussionReply',
            discussionID: '456',
            resolution: true,
            id: 'abc',
            content: 'This is an answer.',
            createdBy: 'UISX',
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
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <Discussions modelID={modelID} closeModal={() => null} />
        </Provider>
      </MockedProvider>
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
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <Discussions modelID={modelID} closeModal={() => null} />
        </Provider>
      </MockedProvider>
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
});
