import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetCrtdLsDocument } from 'gql/gen/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
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
              note: 'string'
            }
          ],
          tdls: [
            {
              __typename: 'PlanTDL',
              idNumber: 'TDL 456'
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
      expect(screen.getByText('CR and TDLs')).toBeInTheDocument();
      expect(screen.getByTestId('cr-tdl-table')).toBeInTheDocument();
      expect(screen.getByText('Edit').closest('a')).toHaveAttribute(
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
      expect(screen.getByText('CR and TDLs')).toBeInTheDocument();
      expect(screen.getByTestId('cr-tdl-table')).toBeInTheDocument();
      expect(screen.getByText('Edit').closest('a')).toHaveAttribute(
        'href',
        expect.stringMatching(/models.*#read-only$/)
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
