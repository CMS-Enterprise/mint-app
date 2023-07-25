import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import GetModelPlanDiscussions from 'queries/Discussions/GetModelPlanDiscussions';
import { GetModelPlanDiscussions as GetModelPlanDiscussionsType } from 'queries/Discussions/types/GetModelPlanDiscussions';

import AskAQuestion from './index';

const discussionResult = {
  modelPlan: {
    __typename: 'ModelPlan',
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

describe('Ask a Question Component', () => {
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = jest.fn();

  jest.spyOn(window, 'scroll');

  it('renders the discussion modal init with question', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/basics'
        ]}
      >
        <Route path="/models/:modelID/task-list/basics">
          <MockedProvider mocks={mocks} addTypename={false}>
            <Provider store={store}>
              <AskAQuestion modelID={modelID} />
            </Provider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(getByTestId('ask-a-question')).toBeInTheDocument();

    screen.getByTestId('ask-a-question-button').click();

    await waitFor(() => {
      expect(getByTestId('discussion-modal')).toBeInTheDocument();

      expect(
        getByText(
          'Need help with something? Ask a question here and someone will reply. Questions and answers will display in Discussions. If you need help on a specific question or field, please include the name of the question or field and the section it’s located in.'
        )
      ).toBeInTheDocument();

      expect(getByText('Type your question')).toBeInTheDocument();
    });
  });
});
