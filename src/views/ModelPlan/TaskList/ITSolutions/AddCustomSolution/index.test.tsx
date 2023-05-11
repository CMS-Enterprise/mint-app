import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MessageProvider } from 'hooks/useMessage';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import { OpSolutionStatus } from 'types/graphql-global-types';

import AddCustomSolution from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '786f6717-f718-4657-8df9-58ec9bca5c1c';

const returnMockedData = (results: boolean) => {
  return [
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
            pocName: results ? 'John Doe' : '',
            pocEmail: results ? 'j.doe@oddball.io' : '',
            nameOther: 'My custom solution',
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
    }
  ];
};

describe('AddCustomSolution', () => {
  it('renders all input text correctly', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${operationalSolutionID}`,
            state: { selectedSolution: null }
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-custom-solution">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData(false)} addTypename={false}>
              <AddCustomSolution />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    const customName = getByTestId('it-solution-custom-name-other');
    userEvent.type(customName, 'My custom solution');

    const customPOC = getByTestId('it-solution-custom-poc-name');
    userEvent.type(customPOC, 'John Doe');

    const customEmail = getByTestId('it-solution-custom-poc-email');
    userEvent.type(customEmail, 'j.doe@oddball.io');

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
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${operationalSolutionID}`,
            state: { selectedSolution: null }
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData(true)} addTypename={false}>
              <AddCustomSolution />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

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
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${operationalSolutionID}`,
            state: { selectedSolution: null }
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData(false)} addTypename={false}>
              <AddCustomSolution />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      const customName = getByTestId('it-solution-custom-name-other');
      expect(customName).toHaveValue('My custom solution');

      const customPOC = getByTestId('it-solution-custom-poc-name');
      expect(customPOC).toHaveValue('');

      const customEmail = getByTestId('it-solution-custom-poc-email');
      expect(customEmail).toHaveValue('');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${operationalSolutionID}`,
            state: { selectedSolution: null }
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-custom-solution">
          <MessageProvider>
            <MockedProvider mocks={returnMockedData(false)} addTypename={false}>
              <AddCustomSolution />
            </MockedProvider>
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
