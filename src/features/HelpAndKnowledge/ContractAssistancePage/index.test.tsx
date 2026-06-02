import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import {
  GetCtatRequestsAdminDocument,
  GetCtatRequestsRequesterDocument
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import setup from 'tests/util';

import { ASSESSMENT } from 'constants/jobCodes';

import ContractAssistancePage from './index';

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

const ctatRequestsMocks = [
  {
    request: {
      query: GetCtatRequestsRequesterDocument
    },
    result: {
      data: {
        ctatRequestsRequester: {
          __typename: 'CTATRequestsTableDataRequester',
          ctatRequests: []
        }
      }
    }
  },
  {
    request: {
      query: GetCtatRequestsAdminDocument
    },
    result: {
      data: {
        ctatRequestsAdmin: {
          __typename: 'CTATRequestsTableDataAdmin',
          count: 0,
          ctatRequests: []
        }
      }
    }
  }
];

const mockStore = configureMockStore();
const assessmentStore = mockStore({ auth: mockAuthAssessment });
const nonAssessmentStore = mockStore({ auth: mockAuthNotAssessment });

const renderPage = (store: ReturnType<typeof mockStore>) => {
  const router = createMemoryRouter(
    [
      {
        path: '/help-and-knowledge/contract-assistance',
        element: <ContractAssistancePage />
      }
    ],
    {
      initialEntries: ['/help-and-knowledge/contract-assistance']
    }
  );

  return setup(
    <Provider store={store}>
      <MockedProvider mocks={ctatRequestsMocks}>
        <RouterProvider router={router} />
      </MockedProvider>
    </Provider>
  );
};

describe('ContractAssistancePage', () => {
  it('renders admin ticket management for assessment team', async () => {
    renderPage(assessmentStore);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Contract assistance' })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', { level: 2, name: 'Admin ticket management' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'My submitted help tickets'
      })
    ).toBeInTheDocument();
  });

  it('does not render admin ticket management for non-assessment team', async () => {
    renderPage(nonAssessmentStore);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Contract assistance' })
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: 'Admin ticket management'
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'My submitted help tickets'
      })
    ).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderPage(assessmentStore);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Contract assistance' })
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
