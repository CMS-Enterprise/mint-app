import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';
import GetCRDTLs from 'queries/CRTDL/GetCRDTLs';

import PlanCRTDLsTable from './table';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetCRDTLs,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          modelName: 'My Plan',
          crTdls: [
            {
              __typename: 'PlanCrTdl',
              id: '123',
              modelPlanID: modelID,
              title: 'My CR',
              idNumber: 'CR123',
              dateInitiated: '2022-07-30T05:00:00Z',
              note: 'note'
            }
          ]
        }
      }
    }
  }
];

describe('Model Plan CR and TDL table', () => {
  it('renders query data in table', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/cr-and-tdl'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/cr-and-tdl">
              <PlanCRTDLsTable
                modelID={modelID}
                setCRTDLMessage={() => null}
                setCRTDLStatus={() => null}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getByTestId('cr-tdl-table')).toHaveTextContent('My CR');
      expect(getByTestId('cr-tdl-table')).toHaveTextContent('CR123');
      expect(getByTestId('cr-tdl-table')).toHaveTextContent('7/30/2022');
      expect(getByTestId('cr-tdl-table')).toHaveTextContent('note');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/cr-and-tdl'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/cr-and-tdl">
              <PlanCRTDLsTable
                modelID={modelID}
                setCRTDLMessage={() => null}
                setCRTDLStatus={() => null}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('cr-tdl-table')).toHaveTextContent('My CR');
    });
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
