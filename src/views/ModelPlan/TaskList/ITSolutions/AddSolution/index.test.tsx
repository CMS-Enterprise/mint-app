import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import GetPossibleOperationalSolutions from 'queries/ITSolutions/GetPossibleOperationalSolutions';
import { OpSolutionStatus } from 'types/graphql-global-types';

import AddSolution from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '786f6717-f718-4657-8df9-58ec9bca5c1c';

const possibleSolutions = [
  {
    __typename: 'PossibleOperationalSolution',
    id: 1,
    name: 'Medicare Advantage Prescription Drug System (MARx)',
    key: 'MARX'
  },
  {
    __typename: 'PossibleOperationalSolution',
    id: 2,
    name: 'Health Plan Management System (HPMS)',
    key: 'HPMS'
  },
  {
    __typename: 'PossibleOperationalSolution',
    id: 3,
    name: 'Salesforce',
    key: 'SALESFORCE'
  },
  {
    __typename: 'PossibleOperationalSolution',
    id: 4,
    name: 'Other',
    key: 'OTHER_NEW_PROCESS'
  }
];

const operationalSolution = {
  __typename: 'OperationalSolution',
  id: operationalSolutionID,
  name: null,
  key: null,
  mustStartDts: null,
  mustFinishDts: null,
  status: OpSolutionStatus.AT_RISK,
  needed: true,
  pocName: 'John Doe',
  pocEmail: 'j.doe@oddball.io',
  nameOther: 'My custom solution'
};

const mocks = [
  {
    request: {
      query: GetPossibleOperationalSolutions
    },
    result: {
      data: {
        possibleOperationalSolutions: possibleSolutions
      }
    }
  },
  {
    request: {
      query: GetOperationalSolution,
      variables: {
        id: operationalSolutionID
      }
    },
    result: {
      data: {
        operationalSolution
      }
    }
  }
];

describe('IT Solutions AddSolution', () => {
  it('renders correctly', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution`
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-solution">
          <MockedProvider mocks={mocks} addTypename={false}>
            <AddSolution />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      const dropdown = getByTestId('dropdown');
      userEvent.selectOptions(dropdown, 'HPMS');
      expect(
        (getByText('Health Plan Management System (HPMS)') as HTMLOptionElement)
          .selected
      ).toBeTruthy();
      expect(
        (getByText('Salesforce') as HTMLOptionElement).selected
      ).toBeFalsy();
    });
  });

  it('renders other button when OTHER_NEW_PROCESS selected', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution`
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-solution">
          <MockedProvider mocks={mocks} addTypename={false}>
            <AddSolution />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      const dropdown = getByTestId('dropdown');
      userEvent.selectOptions(dropdown, 'OTHER_NEW_PROCESS');
      expect((getByText('Other') as HTMLOptionElement).selected).toBeTruthy();

      expect(getByTestId('add-solution-details-button')).toBeInTheDocument();
    });
  });

  it('renders created custom solution', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution/${operationalSolutionID}`
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-solution/:operationalSolutionID">
          <MockedProvider mocks={mocks} addTypename={false}>
            <AddSolution />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('custom-added-solution')).toBeInTheDocument();
      expect(getByText('My custom solution')).toBeInTheDocument();
      expect(getByText('j.doe@oddball.io')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution`
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-solution">
          <MockedProvider mocks={mocks} addTypename={false}>
            <AddSolution />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
