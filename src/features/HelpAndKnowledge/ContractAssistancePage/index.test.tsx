import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
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
      <RouterProvider router={router} />
    </Provider>
  );
};

describe('ContractAssistancePage', () => {
  it('renders admin ticket management for assessment team', () => {
    const { getByRole } = renderPage(assessmentStore);

    expect(
      getByRole('heading', { level: 1, name: 'Contract assistance' })
    ).toBeInTheDocument();
    expect(
      getByRole('heading', { level: 2, name: 'Admin ticket management' })
    ).toBeInTheDocument();
    expect(
      getByRole('heading', { level: 2, name: 'My submitted help tickets' })
    ).toBeInTheDocument();
  });

  it('does not render admin ticket management for non-assessment team', () => {
    const { getByRole, queryByRole } = renderPage(nonAssessmentStore);

    expect(
      getByRole('heading', { level: 1, name: 'Contract assistance' })
    ).toBeInTheDocument();
    expect(
      queryByRole('heading', { level: 2, name: 'Admin ticket management' })
    ).not.toBeInTheDocument();
    expect(
      getByRole('heading', { level: 2, name: 'My submitted help tickets' })
    ).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderPage(assessmentStore);

    expect(asFragment()).toMatchSnapshot();
  });
});
