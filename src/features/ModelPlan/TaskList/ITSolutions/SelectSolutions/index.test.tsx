import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  CreateOperationalSolutionDocument,
  GetOperationalNeedDocument,
  GetOperationalNeedQuery,
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'gql/generated/graphql';
import {
  needQuestionAndAnswerMock,
  possibleSolutionsMock
} from 'tests/mock/solutions';
import setup from 'tests/util';

import MessageProvider from 'contexts/MessageContext';

import SelectSolutions, { findChangedSolution } from '.';

type GetOperationalNeedType = GetOperationalNeedQuery['operationalNeed'];

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

const operationalNeed: GetOperationalNeedType = {
  __typename: 'OperationalNeed',
  id: operationalNeedID,
  modelPlanID: modelID,
  name: 'Obtain an application support contractor',
  key: OperationalNeedKey.APP_SUPPORT_CON,
  nameOther: null,
  needed: true,
  solutions: [
    {
      __typename: 'OperationalSolution',
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
      pocEmail: '',
      key: OperationalSolutionKey.RMADA,
      mustStartDts: null,
      mustFinishDts: null,
      status: OpSolutionStatus.AT_RISK,
      isOther: false,
      isCommonSolution: true,
      otherHeader: null,
      needed: null,
      pocName: 'John Doe',
      nameOther: null
    }
  ]
};

const mocks = [
  {
    request: {
      query: GetOperationalNeedDocument,
      variables: {
        id: operationalNeedID,
        includeNotNeeded: true
      }
    },
    result: {
      data: {
        operationalNeed
      }
    }
  },
  {
    request: {
      query: CreateOperationalSolutionDocument,
      variables: {
        operationalNeedID,
        solutionType: 'RMADA',
        changes: { needed: true }
      }
    },
    result: {
      data: {
        createOperationalSolution: {
          id: operationalNeedID,
          nameOther: null,
          needed: true,
          key: OperationalSolutionKey.RMADA
        }
      }
    }
  },
  ...needQuestionAndAnswerMock,
  ...possibleSolutionsMock
];

describe('Operational Solutions NeedQuestionAndAnswer', () => {
  it('renders correctly', async () => {
    const { user, getByText, getByRole } = setup(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/select-solutions`
          }
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/select-solutions">
          <MockedProvider mocks={mocks} addTypename={false}>
            <MessageProvider>
              <SelectSolutions />
            </MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(async () => {
      const checkbox = getByRole('checkbox', {
        name: /Select this solution/i
      });
      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    await waitFor(() => {
      expect(
        getByText('Research, Measurement, Assessment, Design, and Analysis')
      ).toBeInTheDocument();
    });

    getByRole('button', { name: /Continue/i }).click();

    await waitFor(() => {
      expect(
        getByText('Research, Measurement, Assessment, Design, and Analysis')
      ).toBeInTheDocument();
    });
  });

  it('returns changes solution boolean', async () => {
    expect(
      findChangedSolution(
        operationalNeed.solutions,
        operationalNeed.solutions[0]
      )
    ).toEqual(false);

    expect(
      findChangedSolution(operationalNeed.solutions, {
        __typename: 'OperationalSolution',
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Research, Measurement, Assessment, Design, and Analysis',
        pocEmail: '',
        key: OperationalSolutionKey.RMADA,
        mustStartDts: null,
        mustFinishDts: null,
        isOther: false,
        otherHeader: '',
        isCommonSolution: true,
        status: OpSolutionStatus.AT_RISK,
        needed: true,
        pocName: 'John Doe',
        nameOther: null
      })
    ).toEqual(true);
  });

  it('matches snapshot', async () => {
    const { asFragment, getByText, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/select-solutions`
          }
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/select-solutions">
          <MockedProvider mocks={mocks} addTypename={false}>
            <MessageProvider>
              <SelectSolutions />
            </MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      expect(getByText('at.mint@oddball.io')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
