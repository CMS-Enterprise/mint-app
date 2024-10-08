import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetEchimpCrandTdlDocument } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import EChimpCardsTable, {
  EchimpCrAndTdlsType,
  handleSort,
  searchSolutions
} from './EChimpCardsTable';

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

describe('EChimpCardsTable', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/collaboration-area/cr-and-tdl`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/collaboration-area/cr-and-tdl">
              <Provider store={store}>
                <EChimpCardsTable />
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
                <EChimpCardsTable />
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

  it('testing handleSort function', async () => {
    const echimpItems: EchimpCrAndTdlsType[] = [
      {
        __typename: 'EChimpCR',
        id: 'z123',
        title: 'ZeeChimp CR',
        emergencyCrFlag: true,
        sensitiveFlag: false,
        crStatus: 'Open',
        implementationDate: '2022-07-30T05:00:00Z'
      },
      {
        __typename: 'EChimpTDL',
        id: 'a456',
        title: 'A-Chimp TDL',
        issuedDate: '2022-07-30T05:00:00Z'
      }
    ];

    expect(handleSort([...echimpItems], 'title')).toStrictEqual([
      echimpItems[1],
      echimpItems[0]
    ]);
    expect(handleSort([...echimpItems], 'id')).toStrictEqual([
      echimpItems[1],
      echimpItems[0]
    ]);
  });

  it('testing searchSolutions function', async () => {
    const echimpItems: EchimpCrAndTdlsType[] = [
      {
        __typename: 'EChimpCR',
        id: 'z123',
        title: 'ZeeChimp CR',
        emergencyCrFlag: true,
        sensitiveFlag: true,
        crStatus: 'Open',
        implementationDate: '2022-07-30T05:00:00Z'
      },
      {
        __typename: 'EChimpTDL',
        id: 'a456',
        title: 'A-Chimp TDL',
        issuedDate: '2022-07-30T05:00:00Z'
      }
    ];

    expect(searchSolutions('ZeeChimp', echimpItems)).toStrictEqual([
      echimpItems[0]
    ]);
    expect(searchSolutions('a456', echimpItems)).toStrictEqual([
      echimpItems[1]
    ]);
    expect(searchSolutions('2022', echimpItems)).toStrictEqual([
      echimpItems[0],
      echimpItems[1]
    ]);
    expect(searchSolutions('contro', echimpItems)).toStrictEqual([
      echimpItems[0]
    ]);
  });
});
