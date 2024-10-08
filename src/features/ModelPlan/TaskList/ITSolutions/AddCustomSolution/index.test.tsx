import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetOperationalSolutionDocument,
  OpSolutionStatus
} from 'gql/generated/graphql';
import { needQuestionAndAnswerMock } from 'tests/mock/solutions';
import setup from 'tests/util';

import MessageProvider from 'contexts/MessageContext';

import AddCustomSolution from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '786f6717-f718-4657-8df9-58ec9bca5c1c';

const returnMockedData = (results: boolean) => {
  return [
    {
      request: {
        query: GetOperationalSolutionDocument,
        variables: {
          id: operationalSolutionID
        }
      },
      result: {
        data: {
          operationalSolution: {
            __typename: 'OperationalSolution',
            id: operationalSolutionID,
            name: null,
            key: null,
            needed: true,
            pocName: results ? 'John Doe' : '',
            pocEmail: results ? 'j.doe@oddball.io' : '',
            nameOther: results ? 'My custom solution' : '',
            isOther: false,
            isCommonSolution: true,
            otherHeader: null,
            status: OpSolutionStatus.COMPLETED,
            documents: [],
            mustFinishDts: '2022-05-12T15:01:39.190679Z',
            mustStartDts: '2022-05-12T15:01:39.190679Z',
            operationalSolutionSubtasks: []
          }
        }
      }
    },
    ...needQuestionAndAnswerMock
  ];
};

describe('AddCustomSolution', () => {
  it('renders all input text correctly', async () => {
    const { user, getByTestId } = setup(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${operationalSolutionID}`
          }
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData(false)} addTypename={false}>
              <AddCustomSolution />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    const customName = getByTestId('it-solution-custom-name-other');
    await user.type(customName, 'My custom solution');

    const customPOC = getByTestId('it-solution-custom-poc-name');
    await user.type(customPOC, 'John Doe');

    const customEmail = getByTestId('it-solution-custom-poc-email');
    await user.type(customEmail, 'j.doe@oddball.io');

    await waitFor(() => {
      expect(customName).toHaveValue('My custom solution');

      expect(customPOC).toHaveValue('John Doe');

      expect(customEmail).toHaveValue('j.doe@oddball.io');
    });
  });

  it('renders existing custom solution data', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${operationalSolutionID}`
          }
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData(true)} addTypename={false}>
              <AddCustomSolution />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      const customName = getByTestId('it-solution-custom-name-other');
      expect(customName).toHaveValue('My custom solution');

      const customPOC = getByTestId('it-solution-custom-poc-name');
      expect(customPOC).toHaveValue('John Doe');

      const customEmail = getByTestId('it-solution-custom-poc-email');
      expect(customEmail).toHaveValue('j.doe@oddball.io');
    });
  });

  it('renders existing custom solution data with removed poc and email', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${operationalSolutionID}`
          }
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData(false)} addTypename={false}>
              <AddCustomSolution />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      const customName = getByTestId('it-solution-custom-name-other');
      expect(customName).toHaveValue('');

      const customPOC = getByTestId('it-solution-custom-poc-name');
      expect(customPOC).toHaveValue('');

      const customEmail = getByTestId('it-solution-custom-poc-email');
      expect(customEmail).toHaveValue('');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${operationalSolutionID}`
          }
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData(false)} addTypename={false}>
              <AddCustomSolution />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
