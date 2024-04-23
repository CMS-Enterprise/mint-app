import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  act,
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetOperationalSolutionDocument,
  GetPossibleOperationalSolutionsDocument
} from 'gql/gen/graphql';

import { needQuestionAndAnswerMock } from 'data/mock/solutions';
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
      query: GetPossibleOperationalSolutionsDocument
    },
    result: {
      data: {
        possibleOperationalSolutions: possibleSolutions
      }
    }
  },
  {
    request: {
      query: GetOperationalSolutionDocument,
      variables: {
        id: operationalSolutionID
      }
    },
    result: {
      data: {
        operationalSolution
      }
    }
  },
  ...needQuestionAndAnswerMock
];

describe('Operational Solutions AddSolution', async () => {
  await act(async () => {
    it('renders correctly', async () => {
      const { getByTestId } = render(
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

      await waitForElementToBeRemoved(() => getByTestId('page-loading'));

      await waitFor(() => {
        const combobox = getByTestId('combo-box-select');
        userEvent.selectOptions(combobox, ['HPMS']);
        expect(combobox).toHaveValue('HPMS');
      });
    });
  });

  it('renders other button when OTHER_NEW_PROCESS selected', async () => {
    await act(async () => {
      const { getByTestId } = render(
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

      await waitForElementToBeRemoved(() => getByTestId('page-loading'));

      await waitFor(() => {
        const combobox = getByTestId('combo-box-select');
        userEvent.selectOptions(combobox, ['OTHER_NEW_PROCESS']);
        expect(combobox).toHaveValue('OTHER_NEW_PROCESS');

        expect(getByTestId('add-solution-details-button')).toBeInTheDocument();
      });
    });
  });

  it('matches snapshot', async () => {
    await act(async () => {
      const { asFragment, getByTestId } = render(
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

      await waitForElementToBeRemoved(() => getByTestId('page-loading'));

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
