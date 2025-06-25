import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  DiscussionUserRole,
  GetModelPlanDiscussionsDocument,
  GetModelPlanDiscussionsQuery,
  GetMostRecentRoleSelectionDocument
} from 'gql/generated/graphql';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';

import AskAQuestion, { RenderQuestionTextType } from './index';

type GetModelPlanDiscussionsType = GetModelPlanDiscussionsQuery['modelPlan'];

const discussionResult: GetModelPlanDiscussionsType = {
  __typename: 'ModelPlan',
  id: '6532412',
  isCollaborator: true,
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
      userRole: DiscussionUserRole.SOLUTION_ARCHITECT,
      userRoleDescription: '',
      isAssessment: false,
      createdByUserAccount: {
        __typename: 'UserAccount',
        commonName: 'Joe'
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
      createdBy: 'Jane Doe',
      createdDts: '2022-05-12T15:01:39.190679Z',
      userRole: DiscussionUserRole.SOLUTION_ARCHITECT,
      userRoleDescription: '',
      isAssessment: false,
      createdByUserAccount: {
        __typename: 'UserAccount',
        commonName: 'Joe'
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
          createdBy: 'Jack Doe',
          createdDts: '2022-05-12T15:01:39.190679Z',
          userRole: DiscussionUserRole.SOLUTION_ARCHITECT,
          userRoleDescription: '',
          isAssessment: false,
          createdByUserAccount: {
            __typename: 'UserAccount',
            commonName: 'Joe'
          }
        }
      ]
    }
  ]
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
      data: {
        mostRecentDiscussionRoleSelection: {
          __typename: 'DiscussionRoleSelection',
          userRole: DiscussionUserRole.SOLUTION_ARCHITECT,
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/basics'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/basics">
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

  it('renders the correct text for each renderTextFor value', () => {
    const cases: Array<[RenderQuestionTextType, string]> = [
      ['need', 'opSolutionsMisc:notSureWhatToDoNext'],
      ['solution', 'opSolutionsMisc:helpChoosing'],
      ['status', 'opSolutionsMisc:helpTiming'],
      ['dataExchangeApproach', 'dataExchangeApproachMisc:needHelpDiscussion'],
      ['modelToOperations', 'modelToOperationsMisc:needHelpDiscussion'],
      ['timeline', 'timelineMisc:needHelpDiscussion']
    ];

    cases.forEach(([value, expected]) => {
      render(<AskAQuestion modelID="123" renderTextFor={value} />);
      expect(screen.getByText(i18next.t(expected))).toBeInTheDocument();
    });
  });
});
