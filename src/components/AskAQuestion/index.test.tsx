import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetModelPlanDiscussions from 'queries/GetModelPlanDiscussions';
import { GetModelPlanDiscussions as GetModelPlanDiscussionsType } from 'queries/types/GetModelPlanDiscussions';

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

describe('Model Plan Documents page', () => {
  it('renders the discussion modal init with question', async () => {
    window.scrollTo = jest.fn();

    const { getByText, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AskAQuestion modelID={modelID} />
      </MockedProvider>
    );

    expect(getByTestId('ask-a-question')).toBeInTheDocument();

    screen.getByTestId('ask-a-question-button').click();

    await waitFor(() => {
      expect(getByTestId('discussion-modal')).toBeInTheDocument();

      expect(
        getByText(
          'Need help with something? Ask a question here and someone will get back to you with an answer. If you need help on a specific question or field, please include the name of the question or field and the section it’s located in.'
        )
      ).toBeInTheDocument();

      expect(getByText('Type your question')).toBeInTheDocument();
    });

    const feedbackField = screen.getByRole('textbox', {
      name: /Type your question/i
    });

    userEvent.type(feedbackField, 'Test feedback');

    expect(feedbackField).toHaveValue('Test feedback');
  });
});
