import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MessageProvider } from 'hooks/useMessage';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import { OpSolutionStatus } from 'types/graphql-global-types';

import Subtasks from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '786f6717-f718-4657-8df9-58ec9bca5c1c';

const returnMockedData = [
  {
    request: {
      query: GetOperationalSolution,
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
          documents: [],
          status: OpSolutionStatus.COMPLETED,
          mustFinishDts: '2022-05-12T15:01:39.190679Z',
          mustStartDts: '2022-05-12T15:01:39.190679Z',
          operationalSolutionSubtasks: []
        }
      }
    }
  }
];

describe('IT Solutions Add Subtasks', () => {
  it('renders correctly', async () => {
    const { getByTestId, getByRole } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData} addTypename={false}>
              <Subtasks />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('add-subtask-form')).toBeInTheDocument();
      expect(getByRole('radio', { name: 'To do' })).toBeChecked();
    });
  });

  it('add a subtask button works', async () => {
    const { getByTestId, getByRole, queryAllByRole } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData} addTypename={false}>
              <Subtasks />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

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
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/add-subtasks`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/add-subtasks">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData} addTypename={false}>
              <Subtasks />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('add-subtask-form')).toBeInTheDocument();
      expect(getByRole('radio', { name: 'To do' })).toBeChecked();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
