import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act, render } from '@testing-library/react';
import {
  ReportAProblemSection,
  ReportAProblemSeverity
} from 'gql/generated/graphql';
import CreateReportAProblem from 'gql/operations/Feedback/CreateReportAProblem';
import VerboseMockedProvider from 'tests/MockedProvider';
import setup from 'tests/util';

import ReportAProblem from '.';

const mocks = [
  {
    request: {
      query: CreateReportAProblem,
      variables: {
        input: {
          isAnonymousSubmission: false,
          allowContact: true,
          section: ReportAProblemSection.OTHER,
          sectionOther: 'Other section',
          whatDoing: 'Nothing much',
          whatWentWrong: 'Everything',
          severity: ReportAProblemSeverity.DELAYED_TASK,
          severityOther: ''
        }
      }
    },
    result: {
      data: {
        reportAProblem: true
      }
    }
  }
];

window.scrollTo = vi.fn;

describe('Report a problem form', () => {
  it('submits the "Report a problem" form successfully', async () => {
    await act(async () => {
      const { findByText, getByRole, getByTestId, user } = setup(
        <MemoryRouter initialEntries={['/report-a-problem']}>
          <Route path="/report-a-problem">
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <ReportAProblem />
            </VerboseMockedProvider>
          </Route>
        </MemoryRouter>
      );

      // Fill out form
      await user.click(
        getByTestId('report-a-problem-allow-anon-submission-false')
      );

      await user.click(getByTestId('report-a-problem-allow-contact-true'));

      await user.click(getByTestId('report-a-problem-section-OTHER'));

      await user.type(
        getByTestId('report-a-problem-section-other'),
        'Other section'
      );

      await user.type(
        getByTestId('report-a-problem-section-what-doing'),
        'Nothing much'
      );

      await user.type(
        getByTestId('report-a-problem-section-what-went-wrong'),
        'Everything'
      );

      await user.click(getByTestId('report-a-problem-severity-DELAYED_TASK'));

      const submitButton = getByRole('button', { name: 'Send report' });

      await user.click(submitButton);

      // Submit success
      findByText('Thank you for your feedback');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/report-a-problem']}>
        <Route path="/report-a-problem">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <ReportAProblem />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    // Snapshot form submission complete state
    expect(asFragment()).toMatchSnapshot();
  });
});
