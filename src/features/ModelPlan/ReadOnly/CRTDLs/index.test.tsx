import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { echimpCRsAndTDLsMock, modelID } from 'tests/mock/general';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import ReadOnlyCRTDLs from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('Read Only CR and TDLs page', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/crs-and-tdl',
          element: (
            <Provider store={store}>
              <ReadOnlyCRTDLs />
            </Provider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/crs-and-tdl`]
      }
    );

    render(
      <MockedProvider mocks={echimpCRsAndTDLsMock} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('FFS CRs and TDLs')).toBeInTheDocument();
      expect(
        screen.getByTestId('echimp-cr-and-tdls-table')
      ).toBeInTheDocument();
      expect(screen.getByTestId('emergency__cr-tag')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/crs-and-tdl',
          element: (
            <Provider store={store}>
              <ReadOnlyCRTDLs />
            </Provider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/crs-and-tdl`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={echimpCRsAndTDLsMock} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('FFS CRs and TDLs')).toBeInTheDocument();
      expect(
        screen.getByTestId('echimp-cr-and-tdls-table')
      ).toBeInTheDocument();
      expect(screen.getByTestId('emergency__cr-tag')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
