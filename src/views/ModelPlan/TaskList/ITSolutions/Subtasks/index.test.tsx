import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';

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
          operationalSolutionSubtasks: [
            // {
            //   __typename: 'OperationalSolutionSubtask',
            //   id: '123',
            //   name: '',
            //   status: OperationalSolutionSubtaskStatus.TODO
            // }
          ]
        }
      }
    }
  }
];

describe('IT Solutions Link Documents', () => {
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

  it('matches snapshot', async () => {
    const { asFragment } = render(
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

    expect(asFragment()).toMatchSnapshot();
  });
});
