import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import GetModelPlanDiscussions from 'queries/Discussions/GetModelPlanDiscussions';
import GetMostRecentRoleSelection from 'queries/Discussions/GetMostRecentRoleSelection';
import { GetModelPlanDiscussions as GetModelPlanDiscussionsType } from 'queries/Discussions/types/GetModelPlanDiscussions';
import { DiscussionUserRole } from 'types/graphql-global-types';

import AskAQuestion from './index';

const discussionResult = {
  modelPlan: {
    __typename: 'ModelPlan',
    discussions: [
      {
        __typename: 'PlanDiscussion',
        id: '123',
        content: {
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
              rawContent: 'This is an answer.'
            },
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
  },
  {
    request: {
      query: GetMostRecentRoleSelection
    },
    result: {
      data: {
        mostRecentDiscussionRoleSelection: {
          __typename: 'DiscussionRoleSelection',
          userRole: DiscussionUserRole.IT_ARCHITECT,
          userRoleDescription: ''
        }
      }
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
  console.error = vi.fn();

  vi.spyOn(window, 'scroll');

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
          'Need help with something? Start a discussion and you’ll be notified of any replies. If you need help on a specific question or field, please include the name of the question or field and the section it’s located in.'
        )
      ).toBeInTheDocument();

      expect(
        getByText('Type your question or discussion topic')
      ).toBeInTheDocument();
    });
  });
});
