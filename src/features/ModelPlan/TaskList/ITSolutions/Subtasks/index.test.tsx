import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetOperationalSolutionDocument,
  OperationalSolutionSubtaskStatus,
  OpSolutionStatus
} from 'gql/generated/graphql';
import {
  needQuestionAndAnswerMock,
  possibleSolutionsMock
} from 'tests/mock/solutions';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import Subtasks from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '786f6717-f718-4657-8df9-58ec9bca5c1c';

const mockData = [
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
          pocName: 'John Doe',
          pocEmail: 'j.doe@oddball.io',
          nameOther: 'My custom solution',
          isOther: true,
          isCommonSolution: true,
          otherHeader: null,
          documents: [],
          status: OpSolutionStatus.COMPLETED,
          mustFinishDts: '2022-05-12T15:01:39.190679Z',
          mustStartDts: '2022-05-12T15:01:39.190679Z',
          operationalSolutionSubtasks: [
            {
              __typename: 'OperationalSolutionSubtask',
              id: '123',
              name: 'First Subtask',
              status: OperationalSolutionSubtaskStatus.TODO
            },
            {
              __typename: 'OperationalSolutionSubtask',
              id: '321',
              name: 'Second Subtask',
              status: OperationalSolutionSubtaskStatus.DONE
            }
          ]
        }
      }
    }
  },
  ...needQuestionAndAnswerMock,
  ...possibleSolutionsMock
];

describe('Operational Solutions Add Subtasks', () => {
  it('renders correctly', async () => {
    const { getByTestId, getByRole } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks">
          <MessageProvider>
            <VerboseMockedProvider mocks={mockData} addTypename={false}>
              <Subtasks />
            </VerboseMockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));
    await waitForElementToBeRemoved(() => getByTestId('needs-spinner'));

    expect(getByTestId('add-subtask-form')).toBeInTheDocument();
    expect(getByRole('radio', { name: 'To do' })).toBeChecked();
  });

  it('add a subtask button works', async () => {
    const { getByTestId, getByRole, queryAllByRole } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks">
          <MessageProvider>
            <VerboseMockedProvider mocks={mockData} addTypename={false}>
              <Subtasks />
            </VerboseMockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));

    const button = getByRole('button', { name: 'Add another subtask' });
    userEvent.click(button);

    await waitFor(() => {
      expect(getByTestId('add-subtask-form')).toBeInTheDocument();
      expect(queryAllByRole('radio', { name: 'To do' }).length).toBe(2);
    });
  });

  it('matches snapshot', async () => {
    const { getByTestId, getByRole, asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks">
          <MessageProvider>
            <VerboseMockedProvider mocks={mockData} addTypename={false}>
              <Subtasks />
            </VerboseMockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('add-subtask-form')).toBeInTheDocument();
      expect(getByRole('radio', { name: 'To do' })).toBeChecked();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Operational Solutions Manage Subtasks', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks">
          <MessageProvider>
            <VerboseMockedProvider mocks={mockData} addTypename={false}>
              <Subtasks managingSubtasks />
            </VerboseMockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));

    await waitFor(() => {
      expect(getByTestId('manage-subtask-form')).toBeInTheDocument();
      const form = getByTestId('manage-subtask-form');
      expect(within(form).getAllByText('Subtask name')).toHaveLength(2);
      expect(
        within(getByTestId('manage-subtasks--0')).getByRole('radio', {
          name: 'To do'
        })
      ).toBeChecked();
      expect(
        within(getByTestId('manage-subtasks--1')).getByRole('radio', {
          name: 'In progress'
        })
      ).not.toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { getByTestId, asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks">
          <MessageProvider>
            <VerboseMockedProvider mocks={mockData} addTypename={false}>
              <Subtasks managingSubtasks />
            </VerboseMockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('manage-subtask-form')).toBeInTheDocument();
      const form = getByTestId('manage-subtask-form');
      expect(within(form).getAllByText('Subtask name')).toHaveLength(2);
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
