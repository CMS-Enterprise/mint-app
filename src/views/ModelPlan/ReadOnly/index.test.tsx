import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';
import Sinon from 'sinon';

import { ASSESSMENT } from 'constants/jobCodes';
import {
  collaboratorsMocks,
  modelBasicsMocks,
  modelID,
  summaryMock
} from 'data/mock/readonly';
import { ModelStatus } from 'types/graphql-global-types';

import ReadOnly from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

const mocks: any = [...summaryMock, ...collaboratorsMocks, ...modelBasicsMocks];

describe('Read Only Model Plan Summary', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <ReadOnly />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-read-only')).toBeInTheDocument();
    });

    await waitFor(() => {
      const { getByText } = within(screen.getByTestId('task-list-status'));
      expect(
        getByText(
          i18next.t<string>(
            `modelPlan:status.options.${ModelStatus.PLAN_DRAFT}`
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('read-only-side-nav__wrapper')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <ReadOnly />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      const { getByText } = within(screen.getByTestId('task-list-status'));
      expect(
        getByText(
          i18next.t<string>(
            `modelPlan:status.options.${ModelStatus.PLAN_DRAFT}`
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('read-only-side-nav__wrapper')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Status Tag updates', () => {
  it('renders "ICIP complete" tag and alert', async () => {
    mocks[0].result.data.modelPlan.status = ModelStatus.ICIP_COMPLETE;
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <ReadOnly />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      expect(screen.getAllByTestId('tag')[1].textContent).toContain(
        'ICIP complete'
      );
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    });
  });

  it('renders "Cleared" tag and does not render alert', async () => {
    mocks[0].result.data.modelPlan.status = ModelStatus.CLEARED;
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <ReadOnly />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      expect(screen.getAllByTestId('tag')[1].textContent).toContain('Cleared');
      expect(screen.queryByTestId('alert')).toBeNull();
    });
  });
});
