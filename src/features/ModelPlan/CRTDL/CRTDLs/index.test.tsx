import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetEchimpCrandTdlDocument } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import CRTDLs from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetEchimpCrandTdlDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          echimpCRsAndTDLs: [
            {
              __typename: 'EChimpCR',
              id: '123',
              title: 'Echimp CR',
              emergencyCrFlag: true,
              sensitiveFlag: false,
              crStatus: 'Open',
              implementationDate: '2022-07-30T05:00:00Z'
            },
            {
              __typename: 'EChimpTDL',
              id: '456',
              title: 'Echimp TDL',
              issuedDate: '2022-07-30T05:00:00Z'
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

describe('CR and TDLs page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/collaboration-area/cr-and-tdl`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/collaboration-area/cr-and-tdl">
              <Provider store={store}>
                <CRTDLs />
              </Provider>
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('echimp-cr-and-tdls-table')
      ).toBeInTheDocument();
      expect(screen.getByText('Echimp CR')).toBeInTheDocument();
      expect(screen.getByText('Echimp TDL')).toBeInTheDocument();
      expect(screen.getByTestId('emergency__cr-tag')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/collaboration-area/cr-and-tdl`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/collaboration-area/cr-and-tdl">
              <Provider store={store}>
                <CRTDLs />
              </Provider>
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('echimp-cr-and-tdls-table')
      ).toBeInTheDocument();
      expect(screen.getByText('Echimp CR')).toBeInTheDocument();
      expect(screen.getByText('Echimp TDL')).toBeInTheDocument();
      expect(screen.getByTestId('emergency__cr-tag')).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
