import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { needQuestionAndAnswerMock } from 'tests/mock/solutions';
import VerboseMockedProvider from 'tests/MockedProvider';

import NeedQuestionAndAnswer from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

describe('Operational Solutions NeedQuestionAndAnswer', () => {
  it('renders correctly', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/select-solutions`
          }
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/select-solutions">
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

    await waitForElementToBeRemoved(() => getByTestId('needs-spinner'));

    await waitFor(() => {
      expect(getByTestId('toggle-need-answer')).toBeInTheDocument();

      expect(
        getByText('Obtain an application support contractor')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { getByTestId, getByRole, asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/select-solutions`
          }
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/select-solutions">
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

    await waitForElementToBeRemoved(() => getByTestId('needs-spinner'));

    await waitFor(() => {
      expect(
        getByRole('button', {
          name: 'Why is this a part of my operational needs?'
        })
      ).toBeInTheDocument();
      expect(getByTestId('toggle-need-answer')).toBeInTheDocument();

      expect(
        getByText('Obtain an application support contractor')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
