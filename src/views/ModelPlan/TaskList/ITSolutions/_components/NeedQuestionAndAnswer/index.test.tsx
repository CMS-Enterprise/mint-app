import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import VerboseMockedProvider from 'utils/testing/MockedProvider';

import needQuestionAndAnswerMock from './mocks';
import NeedQuestionAndAnswer from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

describe('IT Solutions NeedQuestionAndAnswer', () => {
  it('renders correctly', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions">
          <VerboseMockedProvider
            mocks={needQuestionAndAnswerMock}
            addTypename={false}
          >
            <NeedQuestionAndAnswer
              modelID={modelID}
              operationalNeedID={operationalNeedID}
            />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    const toggleAnswer = getByTestId('toggle-need-answer');
    userEvent.click(toggleAnswer);

    await waitFor(() => {
      expect(
        getByText('Use an application review and scoring tool')
      ).toBeInTheDocument();
      expect(
        getByText('Get an application support contractor')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { getByTestId, asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions">
          <VerboseMockedProvider
            mocks={needQuestionAndAnswerMock}
            addTypename={false}
          >
            <NeedQuestionAndAnswer
              modelID={modelID}
              operationalNeedID={operationalNeedID}
            />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    const startingTab = getByTestId('toggle-need-answer');
    userEvent.click(startingTab);

    await waitFor(() => {
      expect(
        getByText('Use an application review and scoring tool')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
