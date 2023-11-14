import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateReportAProblem from 'gql/apolloGQL/Feedback/CreateReportAProblem';
import { ReportAProblemSection, ReportAProblemSeverity } from 'gql/gen/graphql';

import VerboseMockedProvider from 'utils/testing/MockedProvider';

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
    const { findByText, getByRole, getByTestId, getByText } = render(
      <MemoryRouter initialEntries={['/report-a-problem']}>
        <Route path="/report-a-problem">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <ReportAProblem />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    // Fill out form
    userEvent.click(
      getByTestId('report-a-problem-allow-anon-submission-false')
    );
    userEvent.click(getByTestId('report-a-problem-allow-contact-true'));
    userEvent.click(getByTestId('report-a-problem-section-OTHER'));
    userEvent.type(
      getByTestId('report-a-problem-section-other'),
      'Other section'
    );
    userEvent.type(
      getByTestId('report-a-problem-section-what-doing'),
      'Nothing much'
    );
    userEvent.type(
      getByTestId('report-a-problem-section-what-went-wrong'),
      'Everything'
    );
    userEvent.click(getByTestId('report-a-problem-severity-DELAYED_TASK'));

    const submitButton = getByRole('button', { name: 'Send report' });

    userEvent.click(submitButton);

    // Submit success
    findByText('Thank you for your feedback');
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
