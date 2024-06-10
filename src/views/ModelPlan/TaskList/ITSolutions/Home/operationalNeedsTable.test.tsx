import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import {
  GetOperationalNeedsDocument,
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'gql/gen/graphql';
import configureMockStore from 'redux-mock-store';

import OperationalNeedsTable, {
  FilterViewSolutionsAlert
} from './operationalNeedsTable';

const modelID: string = 'ec2d1105-b722-4c99-94aa-5b76838d7a54';

const returnNeeds = (needed: boolean | null) => {
  return [
    {
      request: {
        query: GetOperationalNeedsDocument,
        variables: { id: modelID }
      },
      result: {
        data: {
          modelPlan: {
            id: modelID,
            isCollaborator: true,
            modelName: 'My excellent plan that I just initiated',
            operationalNeeds: [
              {
                __typename: 'OperationalNeed',
                id: '123',
                modelPlanID: modelID,
                name: 'Recruit participants',
                key: OperationalNeedKey.RECRUIT_PARTICIPANTS,
                nameOther: null,
                needed,
                modifiedDts: '2022-05-12T15:01:39.190679Z',
                solutions: [
                  {
                    __typename: 'OperationalSolution',
                    id: 3,
                    status: OpSolutionStatus.IN_PROGRESS,
                    name: 'Shared Systems',
                    key: OperationalSolutionKey.SHARED_SYSTEMS,
                    otherHeader: '',
                    mustStartDts: null,
                    mustFinishDts: null,
                    operationalSolutionSubtasks: [],
                    needed: true,
                    nameOther: null,
                    pocEmail: null,
                    pocName: null,
                    createdBy: '',
                    createdDts: ''
                  }
                ]
              }
            ]
          }
        }
      }
    }
  ];
};

const mockStore = configureMockStore();
const store = mockStore({ auth: { euaId: 'MINT' } });

describe('Operational Solutions Home', () => {
  it('renders possible needs without errors', async () => {
    const needed = null;

    const { getByText } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/task-list/it-solutions`]}
      >
        <Provider store={store}>
          <MockedProvider mocks={returnNeeds(needed)} addTypename={false}>
            <Route path="/models/:modelID/task-list/it-solutions">
              <OperationalNeedsTable modelID={modelID} type="possibleNeeds" />
            </Route>
          </MockedProvider>
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Recruit participants')).toBeInTheDocument();
    });
  });

  it('renders needs without errors', async () => {
    const needed = true;

    const { getByText } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/task-list/it-solutions`]}
      >
        <Provider store={store}>
          <MockedProvider mocks={returnNeeds(needed)} addTypename={false}>
            <Route path="/models/:modelID/task-list/it-solutions">
              <OperationalNeedsTable modelID={modelID} type="needs" />
            </Route>
          </MockedProvider>
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Recruit participants')).toBeInTheDocument();
      expect(getByText('Shared Systems')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const needed = null;

    const { asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/task-list/it-solutions`]}
      >
        <Provider store={store}>
          <MockedProvider mocks={returnNeeds(needed)} addTypename={false}>
            <Route path="/models/:modelID/task-list/it-solutions">
              <OperationalNeedsTable modelID={modelID} type="possibleNeeds" />
            </Route>
          </MockedProvider>
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Recruit participants')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders filter view solutions alert', async () => {
    const { asFragment } = render(
      <FilterViewSolutionsAlert
        filterSolutions={[OperationalSolutionKey.CCW]}
        operationalNeeds={
          returnNeeds(true)[0].result.data.modelPlan.operationalNeeds
        }
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
