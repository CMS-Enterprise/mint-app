import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateSendFeedback from 'gql/apolloGQL/Feedback/CreateSendFeedback';
import { EaseOfUse, MintUses, SatisfactionLevel } from 'gql/gen/graphql';

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
    // await act(async () => {
    const { findByText, getByRole, getByTestId, getByText } = render(
      <MemoryRouter initialEntries={['send-feedback']}>
        <Route path="send-feedback">
          <MockedProvider mocks={mocks} addTypename={false}>
            <SendFeedback />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    // Fill out form
    await waitFor(() => {
      userEvent.click(getByTestId('send-feedback-allow-anon-submission-false'));
    });

    await waitFor(() => {
      userEvent.click(getByTestId('send-feedback-allow-contact-true'));
    });

    await waitFor(() => {
      userEvent.type(getByTestId('send-feedback-cms-role'), 'Architect');
    });

    await waitFor(() => {
      userEvent.click(getByText('To edit Model Plans'));
    });

    await waitFor(() => {
      userEvent.click(getByTestId('send-feedback-ease-of-use-UNSURE'));
    });

    await waitFor(() => {
      userEvent.type(
        getByTestId('send-feedback-ease-of-use-other'),
        'Effortless'
      );
    });

    await waitFor(() => {
      userEvent.click(getByTestId('send-feedback-how-satisfied-NEUTRAL'));
    });

    await waitFor(() => {
      userEvent.type(getByTestId('send-feedback-how-can-we-improve'), 'Alot');
    });

    const submitButton = getByRole('button', { name: 'Send feedback' });

    await waitFor(() => {
      userEvent.click(submitButton);
    });
    // Submit success
    findByText('Thank you for your feedback');
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
