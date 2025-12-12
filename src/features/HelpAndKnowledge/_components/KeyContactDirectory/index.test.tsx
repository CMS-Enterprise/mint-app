import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { keyContactsMock } from 'tests/mock/general';
import setup from 'tests/util';

import { ASSESSMENT } from 'constants/jobCodes';

import KeyContactDirectory from './index';

const mockAuthAssessment = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockAuthNotAssessment = {
  isUserSet: true,
  groups: [],
  euaId: 'EFGH'
};

const mockStore = configureMockStore();
const store1 = mockStore({ auth: mockAuthAssessment });
const store2 = mockStore({ auth: mockAuthNotAssessment });

describe('KeyContactDirectory', () => {
  it('renders certain content for assessment team', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: <KeyContactDirectory />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { getByText } = setup(
      <MockedProvider mocks={keyContactsMock}>
        <Provider store={store1}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Add a subject category')).toBeInTheDocument();
      expect(getByText('Add SME')).toBeInTheDocument();
      expect(
        getByText(
          'Find subject matter experts (SMEs) for a variety of key model design and development subject areas.'
        )
      ).toBeInTheDocument();
    });
  });

  it('renders certain content for none assessment team', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: <KeyContactDirectory />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { queryByText } = setup(
      <MockedProvider mocks={keyContactsMock}>
        <Provider store={store2}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(queryByText('Add a subject category')).not.toBeInTheDocument();
      expect(queryByText('Add SME')).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: <KeyContactDirectory />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { getByText, asFragment } = setup(
      <MockedProvider mocks={keyContactsMock}>
        <Provider store={store1}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Contact directory')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
