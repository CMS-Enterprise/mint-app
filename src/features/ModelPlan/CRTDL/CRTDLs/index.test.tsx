import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { echimpCRsAndTDLsMock, modelID } from 'tests/mock/general';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import CRTDLs from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('CR and TDLs page', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/cr-and-tdl',
          element: (
            <MessageProvider>
              <Provider store={store}>
                <CRTDLs />
              </Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/collaboration-area/cr-and-tdl`]
      }
    );

    render(
      <MockedProvider mocks={echimpCRsAndTDLsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/cr-and-tdl',
          element: (
            <MessageProvider>
              <Provider store={store}>
                <CRTDLs />
              </Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/collaboration-area/cr-and-tdl`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={echimpCRsAndTDLsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
