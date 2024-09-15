import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import { EaseOfUse, MintUses, SatisfactionLevel } from 'gql/gen/graphql';
import CreateSendFeedback from 'gql/operations/Feedback/CreateSendFeedback';

import setup from 'utils/testing/setup';

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
    await act(async () => {
      const { findByText, getByRole, getByTestId, getByText, user } = setup(
        <MemoryRouter initialEntries={['send-feedback']}>
          <Route path="send-feedback">
            <MockedProvider mocks={mocks} addTypename={false}>
              <SendFeedback />
            </MockedProvider>
          </Route>
        </MemoryRouter>
      );

      // Fill out form

      await user.click(
        getByTestId('send-feedback-allow-anon-submission-false')
      );

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
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['send-feedback']}>
        <Route path="send-feedback">
          <MockedProvider mocks={mocks} addTypename={false}>
            <SendFeedback />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    // Snapshot form submission complete state
    expect(asFragment()).toMatchSnapshot();
  });
});
