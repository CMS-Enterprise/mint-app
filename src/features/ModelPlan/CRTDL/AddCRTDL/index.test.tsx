import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { GetCrDocument, GetTdlDocument } from 'gql/generated/graphql';

import { MessageProvider } from 'hooks/useMessage';

import AddCRTDL from '.';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';
const crtdlID = '123';

const mocks = [
  {
    request: {
      query: GetCrDocument,
      variables: { id: crtdlID }
    },
    result: {
      data: {
        planCR: {
          __typename: 'PlanCR',
          id: crtdlID,
          title: 'My CR',
          idNumber: 'CR123',
          dateInitiated: '2022-07-30T05:00:00Z',
          dateImplemented: '2022-07-30T05:00:00Z',
          note: 'note'
        }
      }
    }
  },
  {
    request: {
      query: GetTdlDocument,
      variables: { id: crtdlID }
    },
    result: {
      data: {
        planTDL: {
          __typename: 'PlanTDL',
          id: crtdlID,
          title: 'My TDL',
          idNumber: 'TDL123',
          dateInitiated: '2022-07-30T05:00:00Z',
          note: 'note tdl'
        }
      }
    }
  }
];

describe('Model Plan Add CR and TDL page', () => {
  it('renders existing data', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/cr-and-tdl/add-cr-and-tdl?type=cr&id=${crtdlID}`
        ]}
      >
        <MessageProvider>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Route path="/models/:modelID/collaboration-area/cr-and-tdl/add-cr-and-tdl">
              <AddCRTDL />
            </Route>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('cr-tdl-id-number')).toHaveValue('CR123');
      expect(getByTestId('date-picker-external-input')).toHaveValue(
        '07/30/2022'
      );
      expect(getByTestId('cr-tdl-title')).toHaveValue('My CR');
      expect(getByTestId('cr-tdl-note')).toHaveValue('note');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/cr-and-tdl/add-cr-and-tdl?type=cr&id=${crtdlID}`
        ]}
      >
        <MessageProvider>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Route path="/models/:modelID/collaboration-area/cr-and-tdl/add-cr-and-tdl">
              <AddCRTDL />
            </Route>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('cr-tdl-id-number')).toHaveValue('CR123');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
