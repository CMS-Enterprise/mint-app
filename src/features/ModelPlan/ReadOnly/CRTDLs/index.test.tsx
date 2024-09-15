import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetCrtdLsDocument } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'data/constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';

import ReadOnlyCRTDLs from './index';

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
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'modelName',
          isCollaborator: true,
          crs: [
            {
              __typename: 'PlanCrTdl',
              id: '123',
              modelPlanID: modelID,
              title: 'This is a CR and TDL plan',
              idNumber: '321',
              dateInitiated: '2022-05-12T15:01:39.190679Z',
              dateImplemented: '2022-07-30T05:00:00Z',
              note: 'string'
            }
          ],
          tdls: [
            {
              __typename: 'PlanTDL',
              idNumber: 'TDL 456',
              id: '456',
              modelPlanID: modelID,
              title: 'My TDL',
              dateInitiated: '2022-07-30T05:00:00Z',
              dateImplemented: '2022-07-30T05:00:00Z',
              note: 'note'
            }
          ]
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

describe('Read Only CR and TDLs page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/crs-and-tdl`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/read-only/crs-and-tdl">
              <Provider store={store}>
                <ReadOnlyCRTDLs modelID={modelID} />
              </Provider>
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('FFS CRs and TDLs')).toBeInTheDocument();
      expect(screen.getByTestId('cr-tdl-table-cr')).toBeInTheDocument();
      expect(screen.queryAllByText('Edit')[0].closest('a')).toHaveAttribute(
        'href',
        expect.stringMatching(/models.*#read-only$/)
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/crs-and-tdl`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/read-only/crs-and-tdl">
              <Provider store={store}>
                <ReadOnlyCRTDLs modelID={modelID} />
              </Provider>
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('FFS CRs and TDLs')).toBeInTheDocument();
      expect(screen.getByTestId('cr-tdl-table-cr')).toBeInTheDocument();
      expect(screen.queryAllByText('Edit')[0].closest('a')).toHaveAttribute(
        'href',
        expect.stringMatching(/models.*#read-only$/)
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
