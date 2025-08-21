import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { EaseOfUse, MintUses, SatisfactionLevel } from 'gql/generated/graphql';
import CreateSendFeedback from 'gql/operations/Feedback/CreateSendFeedback';
import setup from 'tests/util';

import FeedbackReceived from '../FeedbackReceived';

import SendFeedback from '.';

const mocks = [
  {
    request: {
      query: CreateSendFeedback,
      variables: {
        input: {
          isAnonymousSubmission: false,
          allowContact: true,
          cmsRole: 'Architect',
          mintUsedFor: [MintUses.EDIT_MODEL],
          mintUsedForOther: '',
          systemEasyToUse: EaseOfUse.UNSURE,
          systemEasyToUseOther: 'Effortless',
          howSatisfied: SatisfactionLevel.NEUTRAL,
          howCanWeImprove: 'Alot'
        }
      }
    },
    result: {
      data: {
        reportAProblem: true,
        sendFeedbackEmail: true
      }
    }
  }
];

describe('Send feedback form', () => {
  it('submits the "Send feedback" form successfully', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/send-feedback',
          element: (
            <MockedProvider mocks={mocks} addTypename={false}>
              <SendFeedback />
            </MockedProvider>
          )
        },
        {
          path: '/feedback-received',
          element: <FeedbackReceived />
        }
      ],
      {
        initialEntries: ['/send-feedback']
      }
    );

    const { findByText, getByRole, getByTestId, getByText, user } = setup(
      <RouterProvider router={router} />
    );

    // Fill out form

    await user.click(getByTestId('send-feedback-allow-anon-submission-false'));

    await user.click(getByTestId('send-feedback-allow-contact-true'));

    await user.type(getByTestId('send-feedback-cms-role'), 'Architect');

    await user.click(getByText('To edit Model Plans'));

    await user.click(getByTestId('send-feedback-ease-of-use-UNSURE'));

    await user.type(
      getByTestId('send-feedback-ease-of-use-other'),
      'Effortless'
    );

    await user.click(getByTestId('send-feedback-how-satisfied-NEUTRAL'));

    await user.type(getByTestId('send-feedback-how-can-we-improve'), 'Alot');

    const submitButton = getByRole('button', { name: 'Send feedback' });

    await user.click(submitButton);

    // Submit success
    findByText('Thank you for your feedback');
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/send-feedback',
          element: (
            <MockedProvider mocks={mocks} addTypename={false}>
              <SendFeedback />
            </MockedProvider>
          )
        },
        {
          path: '/feedback-received',
          element: <FeedbackReceived />
        }
      ],
      {
        initialEntries: ['/send-feedback']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    // Snapshot form submission complete state
    expect(asFragment()).toMatchSnapshot();
  });
});
