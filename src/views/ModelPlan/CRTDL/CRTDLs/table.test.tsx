import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { GetCrtdLsDocument } from 'gql/gen/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';

import PlanCRTDLsTable from './table';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetCrtdLsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          __typename: 'ModelPlan',
          modelName: 'My Plan',
          isCollaborator: true,
          crs: [
            {
              __typename: 'PlanCR',
              id: '123',
              modelPlanID: modelID,
              title: 'My CR',
              idNumber: 'CR123',
              dateInitiated: '2022-07-30T05:00:00Z',
              dateImplemented: '2022-07-30T05:00:00Z',
              note: 'note'
            }
          ],
          tdls: []
        }
      }
    }
  }
];

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('Model Plan CR and TDL table', () => {
  it('renders query data in table', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/cr-and-tdl'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/collaboration-area/cr-and-tdl">
              <Provider store={store}>
                <PlanCRTDLsTable
                  modelID={modelID}
                  setCRTDLMessage={() => null}
                  setCRTDLStatus={() => null}
                />
              </Provider>
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getByTestId('cr-tdl-table-cr')).toHaveTextContent('My CR');
      expect(getByTestId('cr-tdl-table-cr')).toHaveTextContent('CR123');
      expect(getByTestId('cr-tdl-table-cr')).toHaveTextContent('7/30/2022');
      expect(getByTestId('cr-tdl-table-cr')).toHaveTextContent('note');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/cr-and-tdl'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/collaboration-area/cr-and-tdl">
              <Provider store={store}>
                <PlanCRTDLsTable
                  modelID={modelID}
                  setCRTDLMessage={() => null}
                  setCRTDLStatus={() => null}
                />
              </Provider>
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('cr-tdl-table-cr')).toHaveTextContent('My CR');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
