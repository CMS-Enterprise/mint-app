import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import '@testing-library/jest-dom';

import NDA from '.';

describe('NDA Page', () => {
  const mockStore = configureMockStore();

  it('renders NDA with accepted stated', async () => {
    const store = mockStore({
      auth: {
        acceptedNDA: {
          agreed: true,
          agreedDts: '2022-07-30T00:00:00Z'
        }
      }
    });

    const router = createMemoryRouter(
      [
        {
          path: '/pre-decisional-notice',
          element: (
            <MockedProvider addTypename={false}>
              <Provider store={store}>
                <NDA />
              </Provider>
            </MockedProvider>
          )
        }
      ],
      {
        initialEntries: ['/pre-decisional-notice']
      }
    );

    const { getByTestId } = render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(getByTestId('accepted-nda')).toBeInTheDocument();
    });
  });

  it('renders NDA with not accepted stated', async () => {
    const store = mockStore({
      auth: {
        acceptedNDA: {
          agreed: false,
          agreedDts: null
        }
      }
    });

    const router = createMemoryRouter(
      [
        {
          path: '/pre-decisional-notice',
          element: (
            <MockedProvider addTypename={false}>
              <Provider store={store}>
                <NDA />
              </Provider>
            </MockedProvider>
          )
        }
      ],
      {
        initialEntries: ['/pre-decisional-notice']
      }
    );

    const { getByTestId } = render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(() => getByTestId('accepted-nda')).toThrow();
    });
  });

  it('matches snapshot', async () => {
    Date.now = vi.fn();

    const store = mockStore({
      auth: {
        acceptedNDA: {
          agreed: true,
          agreedDts: '2022-07-30T12:00:00Z'
        }
      }
    });

    const router = createMemoryRouter(
      [
        {
          path: '/pre-decisional-notice',
          element: (
            <MockedProvider addTypename={false}>
              <Provider store={store}>
                <NDA />
              </Provider>
            </MockedProvider>
          )
        }
      ],
      {
        initialEntries: ['/pre-decisional-notice']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
