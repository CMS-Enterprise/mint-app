import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
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

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/pre-decisional-notice']}>
        <MockedProvider addTypename={false}>
          <Provider store={store}>
            <NDA />
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

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

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/pre-decisional-notice']}>
        <MockedProvider addTypename={false}>
          <Provider store={store}>
            <NDA />
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

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

    const { asFragment } = render(
      <MemoryRouter initialEntries={['/pre-decisional-notice']}>
        <MockedProvider addTypename={false}>
          <Provider store={store}>
            <NDA />
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
