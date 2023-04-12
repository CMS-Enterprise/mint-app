import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MessageProvider } from 'hooks/useMessage';
import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import { GetOperationalNeed_operationalNeed as GetOperationalNeedType } from 'queries/ITSolutions/types/GetOperationalNeed';
import {
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';

import SelectSolutions from '.';

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
      isOther: false,
      key: OperationalSolutionKey.RMADA,
      mustStartDts: null,
      mustFinishDts: null,
      otherHeader: null,
      status: OpSolutionStatus.AT_RISK,
      needed: null,
      pocName: 'John Doe',
      nameOther: null
    }
  ]
};

const mocks = [
  {
    request: {
      query: GetOperationalNeed,
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
  }
];

describe('IT Solutions NeedQuestionAndAnswer', () => {
  it('renders correctly', async () => {
    const { getByText, getByRole } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`,
            state: { isCustomNeed: false }
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions">
          <MockedProvider mocks={mocks} addTypename={false}>
            <MessageProvider>
              <SelectSolutions />
            </MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      const checkbox = getByRole('checkbox', {
        name: /select a solution/i
      });
      expect(checkbox).not.toBeChecked();
      userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    await waitFor(() => {
      expect(
        getByText(
          'Research, Measurement, Assessment, Design, and Analysis (RMADA)'
        )
      ).toBeInTheDocument();
    });

    getByRole('button', { name: /Continue/i }).click();

    await waitFor(() => {
      expect(
        getByText(
          'Research, Measurement, Assessment, Design, and Analysis (RMADA)'
        )
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`,
            state: { isCustomNeed: false }
          }
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions">
          <MockedProvider mocks={mocks} addTypename={false}>
            <MessageProvider>
              <SelectSolutions />
            </MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByText(
          'Research, Measurement, Assessment, Design, and Analysis (RMADA)'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
